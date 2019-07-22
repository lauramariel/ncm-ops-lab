#!/bin/bash

PC_IP="$1"

# Register the PE
python create_zeus_entity.py $PC_IP 00057d50-00df-b390-0000-00000000eafd Prism-Pro-Cluster
# Try again for good luck
python create_zeus_entity.py $PC_IP 00057d50-00df-b390-0000-00000000eafd Prism-Pro-Cluster
# Try again for good luck
python create_zeus_entity.py $PC_IP 00057d50-00df-b390-0000-00000000eafd Prism-Pro-Cluster
# Try again for good luck [4th time is the charm! ;)]
python create_zeus_entity.py $PC_IP 00057d50-00df-b390-0000-00000000eafd Prism-Pro-Cluster

echo 'Inserting and raising anomalies'
# Insert anomalous data
python bootcamp_anomalies.py

# Create the anomalies
sh bootcamp_anomalies.sh

./seed_capacity_data.sh $PC_IP </dev/null >/dev/null 2>/dev/null &
