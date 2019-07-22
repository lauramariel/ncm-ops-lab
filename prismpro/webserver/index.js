const express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var exec = require('child_process').exec;
const app = express();
const port = process.env.PORT || 3000;

// Load in the config file - Note that any time this file is changed
// the node server must be restarted.
var config = require('./json/config.json');
// Extract these variables for using in necessary scripts.
var PC_UI_USER = config.pc_ui_username;
var PC_UI_PASS = config.pc_ui_password;
var PC_SSH_USER = config.pc_ssh_username;
var PC_SSH_PASS = config.pc_ssh_password;
var VM_USER = config.uvm_ssh_username;
var VM_PASS = config.uvm_ssh_password;

///////////////////////
// App
///////////////////////

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// Parse Requests as json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/log', function(req, res){
  // Return the log.
  res.sendFile('out.log');
});

app.get('/error', function(req, res){
  // Return the error log.
  res.sendFile('err.log');
});

app.get('/clientlog', function(req, res){
  // Return the log.
  res.sendFile('client/clientOut.log');
});

app.get('/clienterror', function(req, res){
  // Return the error log.
  res.sendFile('client/clientErr.log');
});

// create a GET route
app.post('/vms/', (req, res) => {
  var body = req.body;
  if (!body) {
    res.send({
      error: 'Invalid VMs Request. Please send PC IP.'
    });
  }
  console.log('VM request body', body)
  // Prepare POST body
  var data = "{\"entity_type\":\"vm\",\"query_name\":\"VM search\",\"grouping_attribute\":\" \",\"group_count\":1,\"group_offset\":0,\"group_attributes\":[],\"group_member_count\":100,\"group_member_offset\":0,\"group_member_sort_attribute\":\"vm_name\",\"group_member_sort_order\":\"ASCENDING\",\"group_member_attributes\":[{\"attribute\":\"vm_name\"},{\"attribute\":\"ip_addresses\"}],\"filter_criteria\":\"" + body.filter + "\"}";
  // Prepare options for the request
  var options = {
    host: body.pcIp,
    port: 9440,
    path: '/api/nutanix/v3/groups',
    method: 'POST',
    headers : {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization' : 'Basic ' + Buffer.from(PC_UI_USER + ':' + PC_UI_PASS).toString('base64')
    },
    rejectUnauthorized: false,
    requestCert: true,
    agent: false
  };
  var req2 = https.request(options, function (res2) {
    res2.setEncoding('utf8');

    var body = '';

    res2.on('data', function (chunk) {
      body = body + chunk;
    });

    res2.on('end',function () {
      if (res2.statusCode != 200) {
        console.log("Body :" + body);
        res.send({
          error: 'There was an error making the request.',
          body: body
        });
      } else {
        res.send(body);
      }
    });
  });

  req2.on('error', function (err) {
    console.log(err);
  });

  req2.write(data);
  req2.end();
});


app.post('/begin/', function(req, res) {
  var body = req.body;
  if (!body) {
    res.send({
      error: 'Invalid Setup Request. Please send PC IP, VM IP, VM ID'
    });
  }
  var status = 'SUCCESS';
  var url = './begin.sh ' + body.vmIp + ' ' + body.pcIp + ' ' + body.vmId + ' ' + PC_UI_USER + ' ' + PC_UI_PASS + ' ' + VM_USER + ' ' + VM_PASS + ' ' + PC_SSH_USER + ' ' + PC_SSH_PASS + ' "' + body.vmName + '"';
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

app.post('/generate_alert/', function(req, res) {
  var body = req.body;
  if (!body) {
    res.send({
      error: 'Invalid Request. PC IP is required to generate alerts.'
    });
  }
  var status = 'SUCCESS';
  var query = './generate_alert.sh ' + body.pcIp + ' ' + PC_SSH_USER + ' ' + PC_SSH_PASS + ' ' + PC_UI_USER + ' ' + PC_UI_PASS;
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
