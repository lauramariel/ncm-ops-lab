#!/bin/bash

PC_IP="$1"
PC_SSH_USER="$2"
PC_SSH_PASS="$3"
PC_UI_USER="$4"
PC_UI_PASS="$5"
ALERT_UID="$6"
VM_ID="$7"
VM_NAME="$8"

echo "Generate Alert for PC $PC_IP and alert ID $ALERT_UID"

sshpass -p $PC_SSH_PASS ssh -o "StrictHostKeyChecking=no" $PC_SSH_USER@$PC_IP "bash -lc 'python lab/gen_alert_wrapper.py --config_file_dir=/home/nutanix/neuron/plugin_config lab/alert_wrapper_input.json $ALERT_UID $VM_ID $VM_NAME'"

# Remove the Known Hosts file after every time we ssh
rm  ~/.ssh/known_hosts

exit 0
