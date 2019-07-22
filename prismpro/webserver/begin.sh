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

echo "Initialize Capacity Data and Anomalies"

sshpass -p $PC_SSH_PASS ssh -o "StrictHostKeyChecking=no" $PC_SSH_USER@$PC_IP "cd lab; source /etc/profile; ./initialize_capacity.sh $PC_IP"

echo "Creating UDA for PC:$PC_IP ID:$UVM_ENTITY_ID VMIP:$UVM_IP"

python create_uda.py --username="$PC_USER" --password="$PC_PASS" --ip_address="$PC_IP" --title="${10} - VM Memory Constrained" --vm_uuid="$UVM_ENTITY_ID" --memory_metric=true
python create_uda.py --username="$PC_USER" --password="$PC_PASS" --ip_address="$PC_IP" --title="${10} - VM Bully Detected" --vm_uuid="$UVM_ENTITY_ID" --memory_metric=false

echo "Begin Stressing $UVM_IP"

sshpass -p $UVM_PASS ssh -o "StrictHostKeyChecking=no" $UVM_USER@$UVM_IP "yum install -y stress"
sshpass -p $UVM_PASS ssh -o "StrictHostKeyChecking=no" $UVM_USER@$UVM_IP "stress -m 4 --vm-bytes 500M </dev/null >/dev/null 2>/dev/null &"

echo "VM Stress Initiated..."

# Remove the Known Hosts file after every time we ssh
rm  ~/.ssh/known_hosts

exit 0
