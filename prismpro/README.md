# prism-pro-lab
<h2>Hands On Lab for Prism Pro</h2>
<h3>version 1.1.0 - To be used with 5.11 PE/PC</h3>

This repository hosts the latest files for the Prism Pro Hands on lab.

Step 1: Obtain a 5.11.x PC with a 5.11.x or 5.10.x PE registered.

Step 2: The PC must have the SMTP, NTP and Name Server configured. These can be configured from the Prism Central Settings menu.

    * SMTP Server - required to Send emails for X-Play portion
    * NTP Server - required to ensure PE and PC clocks are in sync (If not, the alert generation portion for X-Play may not work). Can use time.google.com.
    * Name Server - required for Rest API action for X-Play lab to work. Using google (8.8.8.8) is ok.

Step 3: The PE must have the following image configured, and a UVM network preconfigured.

    * The Image `http://10.42.194.11/workshop_staging/Linux_ToolsVM.qcow2` uploaded to the PE and named `Linux_ToolsVM.qcow2`
    * A UVM Network created called 'Primary'. This network should support DHCP so that any VMs created will automatically get an IP address.
        * Note: it is ok if the network is not named 'Primary'.
        The lab user will just need to know to select the correct network instead during step 7 of the setup portion of the lab.

Step 4: Follow the instructions in the directory `lab` to setup the Prism Central VM. See `lab/README.md`.

Step 5: Follow the instructions in the directory `webserver` to set up the helper webserver for the lab. See `webserver/README.md`.

    * Note this VM will need to be hosted somewhere that has network access to the Prism Central. It is recommended to host it in the PE registered to the PC for convenience.

Step 6: Follow the steps in `prismpro_xplay/prismpro_xplay.rst` to step through the lab.


__Questions, issues or suggestions? Reach out to Sarah Hernandez (@sarah.hernandez on slack)
