#!/bin/bash
set -x

PC_IP="$1"

echo "Creating cron job for capacity"

( crontab -l ; echo '@hourly /usr/bin/timeout 1h bash -lc "cd /home/nutanix/lab/capacity_data/;python capacity_prismpro_write.py" > /tmp/debug.log' ) | crontab -

crontab -l

cd capacity_data

echo 'Writing VMBL Data'
# Write VBML data to IDF
python xfit_prismpro_write.py
