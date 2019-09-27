# lab
Step 1: Copy this directory to the Prism Central
```scp -r lab nutanix@<PC-IP>:~/lab```

Step 2: SSH into the PC and cd to lab.

Step 3: Run `./initialize_lab.sh <PC_IP>`
Where PC_IP is the IP address of the Prism Central this script is being run on. This step will seed
the fake VMBL data in IDF.

Additional Notes:
------------

* VMBL data seeded by this script loads 22 days of past data and 2 days of future data. After two
days, these data for the seeded VMs will stop being populated. It is not recommended to try and reseed
the VMBL data. Instead to simulate this data again, destroy and recreate the PC, then you can setup the environment again.
```
cluster stop
cluster destroy
cluster --cluster_function_list="multicluster" --skip_discovery -s <PC_IP> create
```

Troubleshooting:
------------

* There is a small chance where either the VM Efficiency widget in the dashboard will not include the fake bootcamp VMs in its count, or the Capacity page for the Prism-Pro-Cluster may fail to show the charts. In that case, ssh into the pc and run `cd lab; ./repair.sh <PC_IP>`. This should hopefully resolve any issues.
