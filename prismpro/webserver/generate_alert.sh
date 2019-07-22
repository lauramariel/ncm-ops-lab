#!/bin/bash

PC_IP="$1"
PC_SSH_USER="$2"
PC_SSH_PASS="$3"
PC_UI_USER="$4"
PC_UI_PASS="$5"

echo "Generate Alert for PC $PC_IP"

sshpass -p $PC_SSH_PASS ssh -o "StrictHostKeyChecking=no" $PC_SSH_USER@$PC_IP "python lab/paintrigger.py -u $PC_UI_USER -p $PC_UI_PASS"
# system alert generation code below no longer needed
#; bash -lc 'python /home/nutanix/ncc/bin/gen_alert_wrapper.py /home/nutanix/ncc/bin/alert_wrapper_input.json A120089'"

# Remove the Known Hosts file after every time we ssh
rm  ~/.ssh/known_hosts

exit 0
