#!/usr/bin/env python

import env

import gflags
import httplib
import json
import sys
import ssl
import base64

FLAGS = gflags.FLAGS

gflags.DEFINE_string("ip_address", "", "IP address of PC")
gflags.DEFINE_string("title", "", "UDA title")
gflags.DEFINE_bool("memory_metric", False, "Memory or CPU UDA")
gflags.DEFINE_string("vm_uuid", "", "VM UUID")
gflags.DEFINE_string("username", "", "PC UI Username")
gflags.DEFINE_string("password", "", "PC UI Password")

def main(args):
  if not FLAGS.ip_address:
    raise Exception("IP address must be specified")
  if not FLAGS.title:
    raise Exception("Title must be specified")
  if not FLAGS.vm_uuid:
    raise Exception("Vm uuid must be specified")
  if not FLAGS.username:
    raise Exception("PC username must be specified")
  if not FLAGS.password:
    raise Exception("PC password must be specified")

  condition = "vm.hypervisor_cpu_usage_ppm=ge=100000"
  if FLAGS.memory_metric:
    condition = "vm.memory_usage_ppm=ge=100000"

  conn = httplib.HTTPSConnection(FLAGS.ip_address, 9440, context=ssl._create_unverified_context())
  headers = {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + base64.b64encode(FLAGS.username + ":" + FLAGS.password)}
  req = {
    "error_on_conflict": True,
    "impact_types": ["Performance"],
    "title": FLAGS.title,
    "description": "",
    "filter": "entity_type==vm;entity_id==" + FLAGS.vm_uuid,
    "auto_resolve": True,
    "enabled": True,
    "trigger_conditions": [{
      "condition_type": "STATIC_THRESHOLD",
      "condition": condition,
      "severity_level": "CRITICAL"
    }],
    "trigger_wait_period_in_secs": 0
  }
  req_json = json.dumps(req)

  conn.request('POST',  "/PrismGateway/services/rest/v2.0/alerts/policies", req_json, headers)
  resp = conn.getresponse()
  print(resp.status, resp.reason)
  sys.exit(0)

if __name__ == "__main__":
  args= FLAGS(sys.argv)
  main(args)
