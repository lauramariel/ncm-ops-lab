#!/bin/bash
set -x

PC_IP="$1"

# Register the PE
python create_zeus_entity.py $PC_IP 00057d50-00df-b390-0000-00000000eafd NCMCluster
python create_zeus_entity.py $PC_IP 00057d50-00df-b390-0000-00000000eafd NCMCluster
python create_zeus_entity.py $PC_IP 00057d50-00df-b390-0000-00000000eafd NCMCluster

# Patch the capacity UI metric that seems to not get written
python patch.py


sleep 30

# Check that NCMCluster exists in clusters/list, if not, run the create_zeus_entity.py command again

echo "Checking that NCMCluster exists"

/bin/bash verify_init.sh $PC_IP > /home/nutanix/verify_init.log 2>&1
