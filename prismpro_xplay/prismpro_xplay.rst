.. title:: Nutanix .Next Prism Pro HOL


.. toctree::
  :maxdepth: 2
  :caption: Appendix
  :name: _appendix
  :hidden:

  tools_vms/linux_tools_vm

.. _xplay:

.. http://10.42.247.70 replace:: http://10.45.32.157/
.. |br| raw:: html

------------------------
Prism Pro
------------------------

*The estimated time to complete this lab is 60 minutes.*

Overview
++++++++

Prism Pro is a product designed to make our customer IT operations smart and automated. Today, there is no solution that is specifically designed for data center IT operations built around HCI. The infrastructure in this type of data center is dynamic, scalable, and highly performed. Traditional performance monitoring and IT OPS tools are built for static infrastructure. When IT admins use the traditional tools to manage HCI environments, they are overwhelmed by the complexity and noisy signals the tool brings. This decreases the productivity of the operations and reduces the ROI from adopting HCI.

Prism Pro takes a unique approach that maximizes the operation efficiency of an HCI based data center. First, Prism Pro uses purpose-built machine learning (X-FIT) to extract the insights from the mass amount of operations data the HCI produces. The first three use cases Prism Pro shipped are capacity forecast and planning, VM right sizing, and anomaly detection. These use cases help our customers detect problems and waste with the actionable signal. Second, Prism Pro delivers an automation mechanism (X-Play) that enables customers to automate their operations tasks confidently to respond to the signal X-FIT detects.

X-Play is designed to address the number 1 pain point when customers deal with automation - the fear of amplified impact because of the complexity of the automation. Not like the solution, such as Calm, for the application lifecycle automation, X-Play’s goal is to automate the simple tasks that admins face daily. To eliminate the fear and give the control back to the admin, X-Play takes the codeless approach which has been proven in the companies such as IFTTT and Zapier that it is easy to adopt and extremely versatile.

There are no other tools in the market taking this approach and has the power to combine intelligence and codeless automation. The power of X-FIT and X-Play allows the customer to truly leverage the machine data the HCI infrastructure produces and operate it efficiently, confidently, and intelligently.


Lab Setup
+++++++++

This lab requires a VM to be provisioned and powered on for the X-Play portion.

Applications provisioned as part of the  :ref:`linux_tools_vm` will be used to accomplish this.

#. Please follow the instructions to deploy the :ref:`linux_tools_vm` and power it on before moving on with this lab.


#. Right click the following URL to open a new tab and navigate to the webpage at http://10.42.247.70 and enter the details in the Setup portion of the form. Then click 'Begin Setup' once you have filled in all the fields. This will get your environment ready for this lab. **Keep this tab open during entire Prism Pro lab to return to as directed in later portions.**

   .. figure:: images/ppro_08.png

#. Once step 1 completes, launch the PrismProServer by clicking the provided link. This should load the Prism Central UI. Use this version of the UI to go through the lab. If the link does not work on the first try, it is possible the PrismProServer might still be starting. Wait a few seconds and refresh the page.

   .. figure:: images/ppro_08b.png

VM Efficiency
+++++++++++++++++++++++++++

Prism Pro uses X-Fit machine learning to detect the behaviors of VMs running within the managed clusters. Then applies a classification to VMs that are learned to be inefficient. The following are short descriptions of the different classifications:

* **Overprovisioned:** VMs identified as using minimal amounts of assigned resources.
* **Inactive:** VMs that have been powered off for a period of time or that are running VMs that do not consume any CPU, memory, or I/O resources.
* **Constrained:** VMs that could see improved performance with additional resources.
* **Bully:** VMs identified as using an abundance of resources and affecting other VMs.

#. In **Prism Central**, select :fa:`bars` **> Dashboard** (if not already there).

#. From the Dashboard, take a look at the VM Efficiency widget. This widget gives a summary of inefficient VMs that Prism Pro’s X-FIT machine learning has detected in your environment. Click on the ‘View All Inefficeint VMs’ link at the bottom of the widget to take a closer look.

   .. figure:: images/ppro_58.png

#. You are now viewing the Efficiency focus in the VMs list view with more details about why Prism Pro flagged these VMs. You can hover the text in the Efficiency detail column to view the full description.

   .. figure:: images/ppro_59.png

#. Once an admin has examined the list of VM on the efficiency list they can determine any that they wish to take action against. From VMs that have too many or too little resources they will require the individual VMs to be resized. This can be done in a number of ways with a few examples listed below:

* **Manually:** An admin edits the VM configuration via Prism or vCenter for ESXi VMs and changes the assigned resources.
* **X-Play:** Use X-Plays automated play books to resize VM(s) automatically via a trigger or admins direction. There will be a lab story example of this later in this lab.
* **Automation:** Use some other method of automation such as powershell or REST-API to resize a VM.


Anomaly Detection
+++++++++++++++++++++++++++++++

In this lab story you will take a look at VMs with an anomaly. An anomaly is a deviation from the normal learned behavior of a VM. The X-FIT alogrithms learn the normal behavior of VMs and represent that as a baseline range on the different charts for each VM.

#. Now let's take a take a look at a VM by searching for ‘bootcamp_good’ and selecting ‘bootcamp_good_1’.

   .. figure:: images/ppro_61.png

#. Go to Metrics > CPU Usage. Notice a dark blue line, and a lighter blue area around it. The dark blue line is the CPU Usage. The light blue area is the expected CPU Usage range for this VM. This range is calculated using Prism Pro’s X-FIT machine learning engine. This particular VM is running an application that is upgraded at the same time each day, which explains the usage pattern. Notice that X-FIT detects the seasonality in this usage pattern and has adjusted the expected range accordingly. In this case, an anomaly has been raised for this VM, because the Usage is far above the expected range. You can also reduce the time range “Last 24 hours” to examine the chart more closely.

   .. figure:: images/ppro_60.png

#. Click **“Alert Setting”** to set an alert policy for this kind of situation.

#. In the right hand side, you can change some of the configurations however you would like. In this example I have changed the Behavioral Anomaly threshold to ignore anomalies between 10% and 70%. All other anomalies will generate a Warning alert. I have also adjusted the Static threshold to Alert Critical if the CPU Usage on this VM exceeds 95%.

   .. figure:: images/ppro_25.png

#. Hit **Cancel** to exit the policy creation workflow.


Capacity Planning Runway
++++++++++++++++++++++++++++++++++++++

Capacity runway is a measure of the remaining capacity left within a given cluster or node. There is an overall cluster runway as well as individual runway measurements for CPU, Memory and storage capacity. Lets view the Capacity Runway of your lab cluster.

#. Navigate to ‘Planning’ using the search bar.

   .. figure:: images/ppro_09.png

#. Click on the **‘Capacity Runway’** tab and select the cluster ‘Prism-Pro-Cluster’.

   .. figure:: images/ppro_10.png

   .. figure:: images/ppro_11.png

#. You can now take a look at the Runway for Storage, CPU, and Memory.

   .. figure:: images/ppro_12.png

#. When selecting the Memory tab, you can see a Red Exclamation mark, indicating where this cluster will run out of Memory. You can hover the chart at this point to see on which day this will occur.

   .. figure:: images/ppro_13.png

#. Click on the **‘Optimize Resources’** button on left. This is where you can see the inefficient VMs in the environment with suggestions on how you can optimize these resources to be as efficient as possible.

   .. figure:: images/ppro_14.png

#. Close the optimize resources popup.

#. Under the **‘Adjust Resources’** section in the left side of this page, click the **‘Get Started’** button. We can now use this to start planning for new workloads and see how runway will need to be extended in the future.

#. Click the **add/adjust** button in the left side underneath the ‘Workloads’ item.

   .. figure:: images/ppro_15.png

#. Add one for VDI and select 1000 Users. You can also set a date for when this workload should be added to the system. Save this workload when you are done.

   .. figure:: images/ppro_16.png

   .. figure:: images/ppro_17.png

#. Add another workload of your choice.

#. Now click the **‘Recommend’** button on the right side of the page.

   .. figure:: images/ppro_18.png

#. Once the Recommendation is available, toggle between list and chart view to get a better overview of your Scenario.

   .. figure:: images/ppro_19.png

#. Click the **Generate PDF** button in the upper right hand corner. This will open a new tab with a PDF report for the scenario/workloads you have created.

   .. figure:: images/ppro_19b.png

#. View your report.

   .. figure:: images/ppro_20.png

Increase Constrained VM Memory with X-Play
++++++++++++++++++++++++++++++++++++++++++++++++++++++++

In this lab story we will now use X-Play to create a Playbook to automatically add memory to the lab VM that was created earlier, when a memory constraint is detected.

#. Use the search bar to navigate to the **Playbooks** page.

   .. figure:: images/ppro_26.png

#. We will start by creating a Playbook. Click **Create Playbook** at the top of the table view

   .. figure:: images/ppro_27.png

#. Select Alert as a trigger

   .. figure:: images/ppro_28.png

#. Search and select **VM {vm_name} Memory Constrained** as the alert policy, since this is the issue we are looking to take automated steps to remediate.

   .. figure:: images/ppro_29.png

#. Select the *Specify VMs* radio button and choose the VM you created for the lab. This will make it so only alerts raised on your VM will trigger this Playbook.

   .. figure:: images/ppro_29b.png

#. We will first need to snapshot the VM. Click **Add Action** on the left side and select the **VM Snapshot** action.

   .. figure:: images/ppro_30.png

#. The Target VM is auto filled with the source entity from the Alert trigger. To finish filling the details for this action, enter a value, such as **1**, in the Time to Live field.

   .. figure:: images/ppro_32.png

#. Next we would like to remediate the constrained memory by adding more memory to the VM. Click **Add Action** to add the **VM Add Memory** action

   .. figure:: images/ppro_33.png

#. Set the empty fields according to the screen below.

   .. figure:: images/ppro_34.png


#. Next we would like to notify someone that an automated action was taken. Click **Add Action** to add the email action

   .. figure:: images/ppro_35.png

#. Fill in the field in the email action. Here are the examples

**Recipient:** Fill in your email address.

**Subject :**
``Playbook {{playbook.playbook_name}} addressed alert {{trigger[0].alert_entity_info.name}}``

**Message:**
``Prism Pro X-FIT detected  {{trigger[0].alert_entity_info.name}} in {{trigger[0].source_entity_info.name}}.  Prism Pro X-Play has run the playbook of "{{playbook.playbook_name}}". As a result, Prism Pro increased 1GB memory in {{trigger[0].source_entity_info.name}}.``

You are welcome to compose your own subject message. The above is just an example. You could use the “parameters” to enrich the message.

   .. figure:: images/ppro_36.png

#. Click **Add Action** to add the **Resolve Alert** action.

   .. figure:: images/ppro_37.png

#. Click **Save & Close** button and save it with a name “*Initials* - Auto Increase Constrained VM Memory”. **Be sure to enable the ‘Enabled’ toggle.**

   .. figure:: images/ppro_39.png

#. You should see a new playbook in the “Playbooks” list page.

   .. figure:: images/ppro_40.png

#. Search for your VM and record the current memory capacity. You can scroll down in the properties widget to see the configured memory.

   .. figure:: images/ppro_41.png

#. **Switch tabs back to** the http://10.42.247.70 page and press Continue from the Story 1-3 Step, if you have not already.

   .. figure:: images/ppro_08b.png

#. Now we will simulate an alert for ‘VM Memory Constrained’ which will trigger the Playbook we just created. Select your VM from the dropdown and click the ‘Simulate Alert’ button to create the alert.

   .. figure:: images/ppro_64.png

#. Go back to Prism page and check your VMs page again, you should now see the memory capacity is increased by 1GB. If the memory does not show updated you can refresh the browser page to speedup the process.

#. You should also receive an email. Check the email to see that its subject and email body have filled the real value for the parameters you set up.

#. Go to the **Playbook** page, click the playbook you just created.

   .. figure:: images/ppro_44.png

#. Click the **Plays** tab, you should see that a play has just completed.

   .. figure:: images/ppro_45.png

#. Click the “Play” to examine the details

   .. figure:: images/ppro_46.png


Using X-Play with 3rd Party API
+++++++++++++++++++++++++++++++++++++++++++++

For this story we will be using Habitica to show how we can use 3rd Party APIs with X-Play. Habitica is a free habit and productivity app that treats your real life like a game. We will be creating a task with Habitica.

#. Use the search bar to navigate to the **Action Gallery** page.

   .. figure:: images/ppro_47.png

#. Click the checkbox next to the item for ‘Rest API’ and then from the actions menu select the ‘Clone’ option.

   .. figure:: images/ppro_48.png

#. We are creating an Action that we can later use in our playbook to create a Task in Habitica. Fill in the following values replacing your initials in the *Initials* part.

**Name:** *Initials* - Create Habitica Task

**Method:** POST

**URL:** https://habitica.com/api/v3/tasks/user

**Request Body:** ``{"text":"*Initials* Check {{trigger[0].source_entity_info.name}}","type":"todo","notes":"VM has been detected as a bully VM and has been temporarily powered off.","priority":2}``

**Request Header:**

| x-api-user:fbc6077f-89a7-46e1-adf0-470ddafc43cf
| x-api-key:c5343abe-707a-4f7c-8f48-63b57f52257b
| Content-Type:application/json;charset=utf-8


   .. figure:: images/ppro_49.png

#. Click the **copy** button to save the action.

#. Navigate back to the Playbooks page using the search bar.

   .. figure:: images/ppro_49b.png

#. Click **Create Playbook** at the top of the table view.

   .. figure:: images/ppro_27.png

#. Select the **Alert trigger** and search for and select the alert policy **VM Bully {vm_name}**. This is the alert that we would like to act on to handle when the system detects a Bully VM.

   .. figure:: images/ppro_50.png

#. Select the **Specify VMs** radio button and choose the VM you created for the lab. This will make it so only alerts raised on your VM will trigger this Playbook.

   .. figure:: images/ppro_50b.png

#. The first thing we would like to do is Power off the VM, so we can make sure it is not starving other VMs of resources. Click the **Add Action** button and select **Power Off VM**.

   .. figure:: images/ppro_51.png

#. Next we would like to create a task so that we can look into what is causing this VM to be a Bully. Add another Action. This time select the action you created called, Create Habitica Task - *Initials*.

   .. figure:: images/ppro_53.png

#. Add one more action, select the Resolve Alert action.

   .. figure:: images/ppro_54.png

#. Save & Enable the playbook. You can name it  “*Initials* - Power Off Bully VM for Investigation”. **Be sure to enable the ‘Enabled’ toggle.** Click the Save button.

   .. figure:: images/ppro_55.png

#. **Switch back to the other tab** running http://10.42.247.70 and Simulate the ‘VM Bully Detected’ alert for Story 5.

   .. figure:: images/ppro_65.png

#. Once the alert is successfully simulated, you can check that your Playbook ran, and view the details as before.

   .. figure:: images/ppro_75.png

#. You can verify the Rest API was called for Habitica by logging in from another tab at https://habitica.com using the credentials:

| Username : next19LabUser
| Password: Nutanix.123

And verify your task is created.

   .. figure:: images/ppro_57.png

Takeaways
.........

- Prism Pro is our solution to make IT OPS smarter and automated. It covers the IT OPS process ranging from intelligent detection to automated remediation.
- X-FIT is our machine learning engine to support smart IT OPS, including forecast, anomaly detection, and inefficiency detection.
- X-Play, the IFTTT for the enterprise, is our engine to enable the automation of daily operations tasks.
- X-Play enables admins to confidently automate their daily tasks within minutes.
- X-Play is extensive that can use customer’s existing APIs and scripts as part of its playbooks.
