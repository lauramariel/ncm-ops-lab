import sys
sys.path.insert(0, "/home/nutanix/ncc/bin")

import env
import util.ncc.plugins.consts as consts
import util.ncc.config_module.config  as config

from util.ncc.data_access.data_interface import *

from util.ncc.config_module.config import *
from util.ncc.ncc_utils.globals import HealthServerGlobals
from serviceability.plugin_schema_pb2 import *
from google.protobuf import text_format
import datetime
import time

hglobals = HealthServerGlobals()
idf = hglobals.get_insights_da() 
options = {"create_entity" : True}

cpu_metric = "hypervisor_cpu_usage_ppm"
memory_metric = "memory_usage_ppm"

current_time = int(round(time.time()))
#start time is 10 mins ago
start_time = (current_time - (10 * 60))
#end time is 10 mins later
end_time = current_time + (10 * 60)
num_samples = (end_time - start_time)/300
sampling_interval = 150

print "Creating some anomalies"
log.INFO("Creating some anomalies")

for vm_num in range(1,2):
  fd = FieldData()

  vm_id = "bootcamp_good_" + str(vm_num)
	
  fd.start_time_usec = start_time * 1000000
  fd.end_time_usec = end_time * 1000000
  fd.sampling_interval_sec = sampling_interval
  fd.field_name = cpu_metric
  # Insert 99% usage
  fd.values = num_samples * [100]
  # Update end time just in case
  fd.update_end_time_usec()
  ed = EntityData()
  ed.append_field_data(vm_id, fd)
  idf.write(ed, "vm", vm_id, [cpu_metric], start_time, end_time, sampling_interval)

  fd.field_name = memory_metric
  # Insert 2% usage
  fd.values = num_samples * [100]
  # Update end time just in case
  fd.update_end_time_usec()
  ed = EntityData()
  ed.append_field_data(vm_id, fd)
  idf.write(ed, "vm", vm_id, [memory_metric], start_time, end_time, sampling_interval)


  print "Added anomalous data to the vm with name : ", vm_id
  log.INFO("Added anomalous data to the vm with name : %s" %(vm_id))


  vm_id = "bootcamp_overprovisioned_" + str(vm_num)

  fd.start_time_usec = start_time * 1000000
  fd.end_time_usec = end_time * 1000000
  fd.sampling_interval_sec = sampling_interval
  fd.field_name = cpu_metric
  # Insert 99% usage
  fd.values = num_samples * [999999]
  # Update end time just in case
  fd.update_end_time_usec()
  ed = EntityData()
  ed.append_field_data(vm_id, fd)
  idf.write(ed, "vm", vm_id, [cpu_metric], start_time, end_time,
            sampling_interval)

  fd.field_name = memory_metric
  # Insert 99.99% usage
  fd.values = num_samples * [999999]
  # Update end time just in case
  fd.update_end_time_usec()
  ed = EntityData()
  ed.append_field_data(vm_id, fd)
  idf.write(ed, "vm", vm_id, [memory_metric], start_time, end_time,
            sampling_interval)

  print "Added anomalous data to the vm with name : ", vm_id
  log.INFO("Added anomalous data to the vm with name : %s" %(vm_id))
print "Created some anomalies"
log.INFO("Created some anomalies")

