# Webserver

This webserver consists of 2 applications, a nodejs server and a Reactjs client for the UI portion. The UI should be accessed from a Google Chrome browser.

To Setup:
------------
Step 1: Start by copying this `webserver` directory to a Centos7 VM. You can use the http://10.42.194.11/workshop_staging/Linux_ToolsVM.qcow2 image if you don't already have an image to use.

Step 2: To configure the VM run the following commands:

```
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --reload
yum install -y sshpass
curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
yum install -y nodejs
npm install -g forever
yum install -y epel-release
yum -y install python-pip
pip install env
pip install python-gflags
pip install six
```

Step 3: Run the web server. To Run:

* Start the servers by running `./start.sh`. This will start both servers.
    * this can be stopped using `./stop.sh`
    * note that reboot will require the start script to be restarted.
* Configurations can be adjusted in `json/config.json`. Example:
    ```
    {
        "pc_ui_username": "admin",
        "pc_ui_password": "Nutanix/4u",
        "pc_ssh_username": "nutanix",
        "pc_ssh_password": "nutanix/4u",
        "uvm_ssh_username": "root",
        "uvm_ssh_password": "nutanix/4u"
    }
    ```
    * Fill in the correct values for the webapp to use.
    * Note: you must restart the servers when making changes to `config.json` for the changes to take effect.
* The UI should now be available at `http://<VM_IP>`

To Debug:
------------
* Logs for the server can be found at `http://<VM_IP>:3000/log` and `http://<VM_IP>:3000/error`
* Logs for the client can be found at `http://<VM_IP>:3000/clientlog` and `http://<VM_IP>:3000/clienterror`
