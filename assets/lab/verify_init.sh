#!/bin/bash
set -x

PC_IP="$1"

# Check that NCMCluster exists in clusters/list, if not, run the create_zeus_entity.py command again

echo "Checking that NCMCluster exists"

# First, create a user to make the API call
echo "Creating user to make the API call"
user="svcuser"
password="Nutanix.123"
ncli user create user-name="$user" user-password="$password" first-name="service" last-name="account" email-id="svc.hol@nutanix.com"

# Install jq
echo "Installing jq"
curl -k --show-error --remote-name --location https://s3.amazonaws.com/get-ahv-images/jq-linux64.dms
chmod u+x jq-linux64.dms
ln -s jq-linux64.dms jq
mv jq* ~/bin

echo "Sleeping for 5 minutes"
sleep 300
# Get the API call response
echo "Checking for NCMCluster in https://127.0.0.1:9440/api/nutanix/v3/clusters/list"
resp=`curl -s -k -X POST https://127.0.0.1:9440/api/nutanix/v3/clusters/list -H 'Content-type: application/json' -d '{ "filter":"" }' --user $user:$password | jq -r '.entities[].status | select(.name == "NCMCluster")'`
echo "Result: $resp"

# check again after a delay just to be sure, due to a transient issue where it shows up and then goes away
echo "Sleeping for 30 seconds before checking again"
sleep 30
echo "Checking one more time"
resp=`curl -s -k -X POST https://127.0.0.1:9440/api/nutanix/v3/clusters/list -H 'Content-type: application/json' -d '{ "filter":"" }' --user $user:$password | jq -r '.entities[].status | select(.name == "NCMCluster")'`
echo "Result: $resp"

# If it's empty, run create_zeus_entity.py and check again
i=1
while [[ -z $resp ]];
do
echo "Attempt $i .. NCMCluster doesn't exist in clusters/list, running create_zeus_entity.py again"
python create_zeus_entity.py $PC_IP 00057d50-00df-b390-0000-00000000eafd NCMCluster
sleep 30
resp=`curl -s -k -X POST https://127.0.0.1:9440/api/nutanix/v3/clusters/list -H 'Content-type: application/json' -d '{ "filter":"" }' --user $user:$password | jq -r '.entities[].status | select(.name == "NCMCluster")'`
((i++))
done

# Even if it's not empty, run create_zeus_entity.py anyway
python create_zeus_entity.py $PC_IP 00057d50-00df-b390-0000-00000000eafd NCMCluster

# If we're here, that means NCMCluster exists
echo "NCMCluster exists in clusters/list"
echo "Running patch.py just to make sure UI flag is set"
python patch.py
