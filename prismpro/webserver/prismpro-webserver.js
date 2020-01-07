//
// Copyright (c) 2016 Nutanix Inc. All rights reserved.
//
// Dev server for Prism SSP.
//
/* eslint strict: 'off' */
/* eslint-env node */

'use strict';

// Load node.js package libraries.
var request = require('request'),
    express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    exec = require('child_process').exec,
    cors = require('cors'),
    fs = require('fs');

// Load external configuration.
var env = require(path.join(__dirname, 'local-config-ssp')).app;

// Initialize directory variables.
var sampleData = path.join(__dirname, '/sample_data');

// Extract these variables for using in necessary scripts.
var PC_IP = env.proxyHost;
var PC_UI_USER = env.userName;
var PC_UI_PASS = env.userPass;
var PC_SSH_USER = env.sshUserName;
var PC_SSH_PASS = env.sshPass;

// Initialize REST API 3.0
var apiURL = 'api\/nutanix\/v3',
    staticUrl = '/static/v3/';

// Load and configure express.
var app = express();
app.set('port', process.env.PORT || env.listenerPort);
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Customization (Start)
//----------------------
if (env.simulatePrismPro) {
  var VM_TYPES = ['bootcamp_inactive', 'bootcamp_constrained', 'bootcamp_good', 'bootcamp_overprovisioned', 'bootcamp_op_constrained'];
  var getVmType = function(list) {
    var id = list && list[0];
    if (!id) return;
    var selectedType = ''
    VM_TYPES.find(function(type) {
      if (id.indexOf(type) > -1) {
        selectedType = type;
        return true;
      }
    });
    return selectedType;
  }

  var isStatsQuery = function (body) {
    return body.query_name === 'prism:CPStatsModel';
  }

  var getTimeRange = function(body) {
    var difference = body.interval_end_ms - body.interval_start_ms;
    var MILLISECONDS_PER_HOUR = '3600000';
    var MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;
    var range = '';
    if (difference < 25 * MILLISECONDS_PER_HOUR && difference > 23 * MILLISECONDS_PER_HOUR) {
      range = 'last_24';
    } else if (difference < 8 * MILLISECONDS_PER_DAY && difference > 6 * MILLISECONDS_PER_DAY) {
      range = 'last_week';
    } else if (difference < 22 * MILLISECONDS_PER_DAY && difference > 20 * MILLISECONDS_PER_DAY) {
      range = 'last_21';
    }
    return range;
  }

  var METRICS = ['hypervisor_cpu_usage_ppm', 'hypervisor.cpu_ready_time_ppm', 'controller_num_iops', 'memory_usage_ppm'];
  var getGroupMemberMetric = function (list) {
    var attribute = list && list[0] && list[0].attribute;
    if (!attribute) return '';
    var metric = '';
    METRICS.find(function(metricName) {
      if (attribute.indexOf(metricName) > -1) {
        metric = metricName;
        return true;
      }
    });
    return metric;
  };

  app.get('/PrismGateway/services/rest/v2.0/events?', function(req, res, next) {
    if (req.url && req.url.indexOf('event_ids=9db1b9a7-6019-404b-a3e0-6da5f24fb3df') > -1) {
      var data = fs.readFileSync(sampleData + '/prismpro/anomalydetails.json', 'utf8');
      var date = Date.now() - 13300000;
      data = data.replace(/"XXXXXXXX"/gi, date * 1000);
      res.json(JSON.parse(data));
      return;
    }
    next();
    return;
  });

  app.post('/api/nutanix/v3/clusters/list', function(req, res, next) {
    const body = req.body;
    var origHostPortUrl = env.proxyProtocol +'://' + PC_IP +
      (env.proxyPort ? ':' + env.proxyPort : '');
    var payload = JSON.stringify(body);
    var fwdURL = origHostPortUrl + req.url;
    r.post(fwdURL, { 'body' : payload }, function(error, response, body) {
      var result = JSON.parse(body);
      if (result && result.entities && result.entities.length) {
        // TODO - if there isn't an entity that matches prism-pro-cluster
        result.entities.map(function(item) {
          if (item && item.status && item.status.resources) {
            if (item.status.name === 'Prism-Pro-Cluster') {
              item.status.resources.analysis = {
                "vm_efficiency_map": {
                  "dead_vm_num": "1",
                  "bully_vm_num": "0",
                  "constrained_vm_num": "2",
                  "inefficient_vm_num": "0",
                  "overprovisioned_vm_num": "2"
                }
              };
            } else {
              // Delete all others so it doesn't mess with the count.
              delete item.status.resources.analysis;
            }
          }
        });
      }
      res.json(result);
    });
  });

  app.post(new RegExp(apiURL + '/groups'), function(req, res, next) {
    const body = req.body;
    if (!body) {
      next();
      return;
    }

    switch(body.entity_type) {
      case 'event':
        if(body.query_name === 'prism:EntityEventQueryModel' && body.filter_criteria && body.filter_criteria.indexOf('vm=cs=bootcamp_good') >= 0) {
          var date = Date.now() - 13300000;
          var filedata = fs.readFileSync(sampleData +  '/prismpro/chartanomaly.json', 'utf8');
          filedata = filedata && filedata.replace(/XXXXXX/mgi, date * 1000);
          var data = filedata && JSON.parse(filedata);
          res.json(data);
          return;
        }
        next();
        break;
      case 'mh_vm':
        var type = getVmType(body.entity_ids);
        if (isStatsQuery(body) && type) {
          try {
            var filedata = fs.readFileSync(sampleData +  '/prismpro/' + type + '.json');
            var jsonContent = filedata && JSON.parse(filedata);
            var metric = getGroupMemberMetric(body.group_member_attributes);
            var timerange = getTimeRange(body);
            var content = jsonContent && jsonContent[metric] && jsonContent[metric][timerange];
            var info = content && content.data;
            if (info) {
              var end = body.interval_end_ms * 1000;
              var endTime = content.endTime * 1000;
              info.group_results[0].entity_results[0].data.map(function(item) {
                var length = item && item.values && item.values.length;
                if (!length) return;
                item.values.map(function(value) {
                  if (!value) return;
                  var val = value.values && value.values[0];
                  if (val && type === 'bootcamp_good') {
                    value.values = [val * 1.3];
                  }
                  if (val && type === 'bootcamp_constrained' && metric === 'hypervisor_cpu_usage_ppm') {
                    value.values = [val * 1.5];
                  }
                  value.time = value.time - endTime + end;
                });
              });
              res.send(info);
            } else {
              next();
            }
          } catch (e) {
            console.log(e);
            next();
          }
        } else if (body.filter_criteria && body.filter_criteria.indexOf('(capacity%2Evm_efficiency_status==.*[o|O][v|V][e|E][r|R][p|P][r|R][o|O][v|V][i|I][s|S][i|I][o|O][n|N][e|E][d|D].*,capacity%2Evm_efficiency_status==.*[i|I][n|N][a|A][c|C][t|T][i|I][v|V][e|E].*,capacity%2Evm_efficiency_status==.*[b|B][u|U][l|L][l|L][y|Y].*,capacity%2Evm_efficiency_status==.*[c|C][o|O][n|N][s|S][t|T][r|R][a|A][i|I][n|N][e|E][d|D].*)') > -1) {
          var filedata = fs.readFileSync(sampleData +  '/prismpro/efficiency.json');
          var data = filedata && JSON.parse(filedata);
          res.json(data.all);
        } else if (body.filter_criteria && body.filter_criteria.indexOf('capacity%2Evm_efficiency_status==.*[o|O][v|V][e|E][r|R][p|P][r|R][o|O][v|V][i|I][s|S][i|I][o|O][n|N][e|E][d|D].*') > -1) {
          var filedata = fs.readFileSync(sampleData +  '/prismpro/efficiency.json');
          var data = filedata && JSON.parse(filedata);
          res.json(data.overprovisioned);
        } else if (body.filter_criteria && body.filter_criteria.indexOf('capacity%2Evm_efficiency_status==.*[c|C][o|O][n|N][s|S][t|T][r|R][a|A][i|I][n|N][e|E][d|D].*') > -1) {
          var filedata = fs.readFileSync(sampleData +  '/prismpro/efficiency.json');
          var data = filedata && JSON.parse(filedata);
          res.json(data.constrained);
        } else if (body.filter_criteria && body.filter_criteria.indexOf('capacity%2Evm_efficiency_status==.*[i|I][n|N][a|A][c|C][t|T][i|I][v|V][e|E].*') > -1) {
          var filedata = fs.readFileSync(sampleData +  '/prismpro/efficiency.json');
          var data = filedata && JSON.parse(filedata);
          res.json(data.inactive);
        } else {
          next();
        }
        break;
      case 'cluster':
        // Code for the UI ready flag
        if(body.entity_ids && body.entity_ids[0] === '00057d50-00df-b390-0000-00000000eafd' &&
            body.group_member_attributes && body.group_member_attributes.length === 21) {
          var origHostPortUrl = env.proxyProtocol +'://' + PC_IP +
          (env.proxyPort ? ':' + env.proxyPort : '');
          var payload = JSON.stringify(body);
          var fwdURL = origHostPortUrl + req.url;
          r.post(fwdURL, { 'body' : payload }, function(error, response, body) {
            var result = JSON.parse(body);
            if(result && result.group_results && result.group_results.length) {
              result.group_results[0].entity_results[0].data.forEach(function(item) {
                if (item.name === 'capacity.ui_ready_flag_insights') {
                  item.values = [{"values":["1"],"time":1568937600000000}];
                }
              });
            }
            res.json(result);
          });
        } else {
          next();
        }
        break;
      default :
        next();
        break;
    }
  });
}

// Customization (End)
//--------------------


// Authentication Setup
var base64UsernamePass =
  new Buffer.from(PC_UI_USER + ':' + PC_UI_PASS).toString('base64');

// Set up options for the request handler.
var requestOptions = {
  'strictSSL': false,
  'jar': true, // embedded cookies management to maintain authentified session
  'headers': {
    'Content-Type': 'application/json; charset=utf-8'
  }
};

if (env.autoLogin) {
  requestOptions.headers.Authorization = 'Basic ' + base64UsernamePass;
}

// Set up the request library for generating http calls.
var r = request.defaults(requestOptions);

// Define default Prism Gateway response handler.
var origHostPortUrl = env.proxyProtocol +'://' + PC_IP +
  (env.proxyPort ? ':' + env.proxyPort : '');

var proxyFunction = function(req, resp) {
  var payload;

  if (!env.autoLogin && req.headers.authorization) {
    requestOptions.headers.Authorization = req.headers.authorization;
    r = request.defaults(requestOptions);
  }

  // Check if v3 proxy to older gateway (v1, v2, v0.8)
  var reqUrl = req.url;

  var fwdURL = origHostPortUrl + reqUrl;

  try {
    if (req.method === 'GET' || req.method === 'HEAD') {
      r.get(fwdURL).pipe(resp);
    }
    else if (req.method === 'POST'){
      payload = JSON.stringify(req.body);
      r.post(fwdURL, { 'body' : payload }).pipe(resp);
    }
    else if (req.method === 'PUT'){
      payload = JSON.stringify(req.body);
      r.put(fwdURL, {'body' : payload}).pipe(resp);
    }
    else if (req.method === 'DELETE'){
      payload = JSON.stringify(req.body);
      r.del(fwdURL, {'body' : payload}).pipe(resp);
    }
  } catch( e ) {
    console.error("ERROR Proxying Request:", e);
  }
};

// Prism Central Routing
//----------------------
// Redirect to console always.
app.get('/', function(req, resp) {
  if (!PC_IP || !PC_UI_PASS || !PC_UI_USER) {
    // Take the user to enter their credentials.
    resp.sendfile('public/index.html');
  } else {
    // Redirect to console to serve up the static UI files.
    resp.redirect('/console/');
  }
});
var walkmeScript = '<script>!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";analytics.load("SQBKbPgLzflz5eUSkuu0ePSAwKYmiKZ1");analytics.page();}}();</script>'
var localStorageScript = '<script>if (localStorage) { localStorage.setItem("nutanix_show_search_tutorial", false); localStorage.setItem("FirstTimeExpAutoShown", true) }</script>'

// Serve the static UI files from the proxyHost
app.get(/console/, function(req, resp) {
  if (!PC_IP || !PC_UI_PASS || !PC_UI_USER) {
    // Take the user to enter their credentials.
    resp.redirect('/');
    return;
  }
  if (env.enableWalkme) {
    if (req.url.indexOf('console/index.html') > -1) {
      // Intercept the index.html file to include a script for walkme
      r.get(origHostPortUrl + req.url, function(error, response, body) {
        if (body) {
          var position = body.indexOf('</body>');
          body = [body.slice(0, position), walkmeScript + localStorageScript, body.slice(position)].join('');
        }
        resp.send(body);
      });
    } else if (req.url === '/console' || req.url === '/console/') {
      // Intercept the index.html file to include a script for walkme
      r.get(origHostPortUrl + '/console/index.html', function(error, response, body) {
        if (body) {
          var position = body.indexOf('</body>');
          body = [body.slice(0, position), walkmeScript + localStorageScript, body.slice(position)].join('');
        }
        resp.send(body);
      });
    } else {
      proxyFunction(req, resp);
    }
  } else {
    proxyFunction(req, resp);
  }
});
// For calm to work
app.get(/apps\/(.*)/,proxyFunction);
// Proxy API calls
app.all(/PrismGateway\/(.*)|api\/nutanix\/v(.*)\/(.*)|static\/(.*)/, proxyFunction);
// Serve up the swagger.json
app.get(staticUrl + 'swagger.json', function(req, res) {
  // Customize response
  r.get(env.proxyProtocol +'://' + PC_IP + ':' +
  (env.proxyPort ? ':' + env.proxyPort : '') +
  req.url).pipe(res);
});

// Webserver Client
//----------------------
app.get('/alerts', function (req, res){
  res.sendfile('public/index.html');
});

app.get('/ticketsystem', function (req, res) {
  res.sendfile('public/index.html');
});

app.get(/\/public\/(.*)/, function (req, res) {
  res.sendfile('.' + req.path);
});

app.get(/\/build\/(.*)/, function (req, res) {
  res.sendfile('.' + req.path);
});

app.get('/log', function (req, res){
  // Return the log.
  res.sendfile('out.log');
});

app.get('/error', function (req, res){
  // Return the error log.
  res.sendfile('err.log');
});

app.get('/login/', (req, res) => {
  if (!PC_IP || !PC_UI_PASS || !PC_UI_USER) {
    res.status(500).send({
      message: 'AUTHENTICATION_REQUIRED'
    });
  } else {
    r.get(origHostPortUrl + '/api/nutanix/v3/users/me').pipe(res);
  }
});

app.post('/login/', function(req, res) {
  var body = req.body;
  if (!body) {
    res.send({
      error: 'Invalid Request. PC IP, username and password are required.'
    });
  }
  var status = 'SUCCESS';
  var url = './restart.sh ' + body.pc_ip+ ' ' + body.user + ' ' + body.pass;
  console.log(url);
  exec(url, {}, function(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log('exec error:', error);
      status = 'FAILED';
    }
    res.send({
      stdout: stdout,
      stderr: stderr,
      error: error,
      status: status
    });
  });
});

app.post('/repair/', function(req, res) {
  var status = 'SUCCESS';
  var url = './repair.sh ' + PC_IP + ' ' + PC_SSH_USER + ' ' + PC_SSH_PASS;
  console.log(url);
  exec(url, {}, function(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log('exec error:', error);
      status = 'FAILED';
    }
    res.send({
      stdout: stdout,
      stderr: stderr,
      error: error,
      status: status
    });
  });
});

app.post('/generate_alert/:alert_uid', function(req, res) {
  var body = req.body;
  var alert_uid = req.params.alert_uid;
  if (!body) {
    res.send({
      error: 'Invalid Request. PC IP is required to generate alerts.'
    });
  }
  var status = 'SUCCESS';
  var query = './generate_alert.sh ' + PC_IP + ' ' + PC_SSH_USER + ' ' + PC_SSH_PASS + ' ' + alert_uid + ' ' + body.entityId + ' ' + body.entityName;
  exec(query, {}, function(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log('exec error:', error);
      status = 'FAILED';
    }
    res.send({
      stdout: stdout,
      stderr: stderr,
      error: error,
      status: status
    });
  });
});

// TicketSystem
//-------------
app.get('/gettickets', function (req, res) {
  try {
    fs.readFile('./ticket-raised.json', 'utf-8', (err, data) => {
      var arrayOfObjects = JSON.parse(data);
      res.send(arrayOfObjects)
    })
  } catch (err) {

  }
});

app.post('/generate_ticket/', (req, res) => {
  const creation_time = new Date();
  const key = Math.floor(Math.random() * 100000) + 1;
  const task_status = "Open";

   const  request_body = {
      creation_time,
      key,
      task_status,
      alert_name: req.body.alert_name,
      alert_id: req.body.alert_id,
      vm_name: req.body.vm_name,
      vm_id: req.body.vm_id
    }
  try {
    fs.readFile('./ticket-raised.json', 'utf-8', (err, data) => {
      var arrayOfObjects = JSON.parse(data);

      arrayOfObjects.tickets.push(request_body)
      console.log(arrayOfObjects);

      fs.writeFile('./ticket-raised.json', JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
        if (err) throw err
        res.send(request_body)
      })
    })
  } catch (err) {

  }
});

app.put('/updateticket/', (req, res) =>{
  try {
    fs.readFile('./ticket-raised.json', 'utf-8', (err, data) => {
      var arrayOfObjects = JSON.parse(data);
      var temp= null;
      console.log("req.body",req.body)
      for(tick in arrayOfObjects.tickets){
        console.log("tick",tick)
        if(arrayOfObjects.tickets[tick]['vm_id'] === req.body.vm_id){
          arrayOfObjects.tickets[tick]['task_status'] = 'Resolved'
          temp = arrayOfObjects.tickets[tick]
          console.log("temp",temp)
          break
        }
      }
      fs.writeFile('./ticket-raised.json', JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
        if (err) throw err
        res.send(temp)
      })
    })
  } catch (err) {

  }
});

// Webserver Client (End)
//----------------------

// Kick off the server.
var server = http.createServer(app);

// Websocket for VNC
function getSecurityCookie(fail, success) {
  var loginUrl = 'https://' + PC_IP +
  (env.proxyPort ? ':' + env.proxyPort : '') + '/api/nutanix/v3/users/me';

  request.post(loginUrl, {
    strictSSL: false,
    headers : {
      'Authorization': 'Basic ' + Buffer.from(PC_UI_USER + ':' + PC_UI_PASS).toString('base64')
    }
  })
  .on('response', function(res) {
    var securityCookie;
    try {
      // Look for NTNX_IGW_SESSION
      for (var ii=0; ii < res.headers['set-cookie'].length; ii++) {
        var cookie = res.headers['set-cookie'][ii];
        if (cookie && cookie.indexOf('NTNX_IGW_SESSION') > -1) {
          securityCookie = cookie.split(';')[0];
        }
      }
    } catch (e) {
      console.error('Failed to retrieve security cookie:',
        res.headers['set-cookie']);
      return fail(e);
    }
    console.info('Cookie for web socket proxy:', securityCookie);
    success(securityCookie);
  })
  .on('error', fail);
}

// Create websockets proxy
var wsProxy = new require('http-proxy').createProxyServer({
  target: {
    host: PC_IP,
    port: env.proxyPort,
    protocol: 'https'
  },
  secure: false
});

// Set up proxy on websocket protocol upgrade event
server.on('upgrade', function(req, socket, head) {

  getSecurityCookie(
    // Fail callback
    function(err) {
      socket.close();
    },

    // Success callback
    function(securityCookie) {
      // Add security cookie to websocket request
      var newCookie = (req.headers.cookie || '').trim().split(';');
      newCookie.push(securityCookie);
      req.headers.cookie = newCookie.join(';');

      // Do proxying
      wsProxy.ws(req, socket, head);
    });
});

// Safe guard exception thrown by http-proxy module.
// These people believe in 'failing fast' and they force you to believe
// too:
// https://github.com/nodejitsu/node-http-proxy/blob/master/
// lib/http-proxy/index.js#L119
process.on('uncaughtException', function(err) {
  console.error('Uncaught exception: ', err.stack);
});

// Display config and environment info to the console.
console.info("Starting the Server...");

if (env.autoLogin) {
  console.info("Logging in with user: " + PC_UI_USER + " | " + PC_UI_PASS);
}

console.info("Proxy server listening on port: " + env.listenerPort);
console.info("Forwarding requests to " + env.proxyProtocol + "://" +
  PC_IP + (env.proxyPort ? ':' + env.proxyPort : ''));

// Listen for the right port the server
server.listen(app.get('port'));
