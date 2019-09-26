import sys
sys.path.insert(0, "/home/nutanix/ncc/bin")
import env
import util.ncc.ncc_utils.globals

import env
import util.ncc.plugins.consts as consts
import util.ncc.config_module.config  as config

from util.ncc.config_module.config import *
from util.ncc.ncc_utils.globals import HealthServerGlobals
from util.ncc.data_access.data_interface import *
from serviceability.plugin_schema_pb2 import *
from google.protobuf import text_format

hglobals = HealthServerGlobals()
db = hglobals.get_insights_da() 
import os
import csv
import collections
import random


from serviceability.interface.plugin_schema_pb2 import *
from google.protobuf.json_format import MessageToJson, Parse
from google.protobuf.text_format import Merge

dir = "/home/nutanix/neuron/plugin_config/plugin_schema/analytics/insights_plugins"
# file = dir+"/vm_insights_plugins.json"
print "Updating regular plugin files"
for input_file in os.listdir(dir):
	file = os.path.join(dir, input_file)
	print "Working on file= ",file
	plugin_schema_list = PluginSchemaList()
	Merge(open(file).read(), plugin_schema_list)
	for plugin_schema in plugin_schema_list.plugin_schema_list:
		check_schema_list = plugin_schema.check_schema_list
		for check_schema in check_schema_list:
			check_schema.scheduler_params.enabled = False
	output_file = file
	f = open(output_file, 'w')
	f.write(text_format.MessageToString(plugin_schema_list))
	f.close()
	print "Modified file= "+file+" into output file= "+output_file

print "Updating template plugin files"
dir = "/home/nutanix/neuron/plugin_config/plugin_templates"
for input_file in os.listdir(dir):
	file = os.path.join(dir, input_file)
	if not file.endswith(".json"):
		continue
	print "Working on file= ",file
	plugin_schema_template_list = PluginSchemaTemplateList()
	Merge(open(file).read(), plugin_schema_template_list)
	for plugin_template in plugin_schema_template_list.plugin_schema_template_list:
		check_schema_list = plugin_template.plugin_schema.check_schema_list
		for check_schema in check_schema_list:
			check_schema.scheduler_params.enabled = False
	output_file = file
	f = open(output_file, 'w')
	f.write(text_format.MessageToString(plugin_schema_template_list))
	f.close()
	print "Modified file= "+file+" into output file= "+output_file