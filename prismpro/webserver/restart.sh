#!/bin/bash

PC_IP="$1"
PC_USER="$2"
PC_PASS="$3"

echo "Restarting Node JS Server with $PC_IP $PC_USER $PC_PASS"

echo "var env={app:{proxyHost:\"$PC_IP\",userName:\"$PC_USER\",userPass:\"$PC_PASS\"}};module.exports=env;" >> my_local_config.js; pm2 restart prismpro-webserver

echo "Node JS Server RE-Initialized...."

