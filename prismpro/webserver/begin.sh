#!/bin/bash

UVM_IP="$1"
PC_IP="$2"
UVM_ENTITY_ID="$3"
PC_USER="$4"
PC_PASS="$5"
UVM_USER="$6"
UVM_PASS="$7"
PC_SSH_USER="$8"
PC_SSH_PASS="$9"

echo "Run the repair script just to be safe :)"

sshpass -p $PC_SSH_PASS ssh -o "StrictHostKeyChecking=no" $PC_SSH_USER@$PC_IP "cd lab; source /etc/profile; ./repair.sh $PC_IP"

echo "Initialize PrismProServer $UVM_IP"

sshpass -p $UVM_PASS ssh -o "StrictHostKeyChecking=no" $UVM_USER@$UVM_IP "cd /root/main/prism/aphrodite/anteros/projects/ssp/dev_ui_server; ./stop.sh; rm my_local_config.js; echo 'var env={app:{proxyHost:\"$PC_IP\",userName:\"$PC_USER\",userPass:\"$PC_PASS\",simulatePrismPro:true,cacheApiCall:false,release:true,listenerPort:80}};module.exports=env;' >> my_local_config.js; ./start.sh"

echo "Node JS Server Initialized...."

# Remove the Known Hosts file after every time we ssh
rm  ~/.ssh/known_hosts

exit 0
