.. title:: Nutanix .Next Prism Pro HOL


.. toctree::
  :maxdepth: 2
  :caption: Appendix
  :name: _appendix
  :hidden:

  tools_vms/linux_tools_vm

.. _xplay:

------------------------
Prism Pro MSSQL with Blue Medora
------------------------

Lab Setup
+++++++++

Please be sure to complete the `Deploying MS SQL` lab as you will need to use the MSSQL server to complete this lab.

#. Open your Prism Central and navigate to the VMs page. Note down the IP Address of the `GTSPrismOpsLabUtilityServer`.

   .. figure:: images/init1.png

#. Open a new tab in the browser, and navigate to `http://<GTSPrismOpsLabUtilityServer_IP_ADDRESS>/databases` [ex. http://1.1.1.1/databases]. It is possible you may need to log into the VM if you are the first one to use it. Just fill out the PC IP, username and password and click login.

   .. figure:: images/init2.png

#. Now fill in the details, including your initials, email and select the VM you created in the `Deploying MS SQL` and click begin to begin the Blue Medora lab.

   .. figure:: images/initbm.png

#. Now navigate to `http://<GTSPrismOpsLabUtilityServer_IP_ADDRESS>/` to complete the lab from. Use the UI at this URL to complete the lab.

   .. figure:: images/init3.png

Overview
++++++++

.. figure:: images/operationstriangle.png

The above graphic is what we like to refer to as the Operations Triangle, which shows the typical operations flow in any environment, a continuous cycle of monitoring, analyzing and then taking action where necessary. With Prism Pro the customer is able to leverage insights from machine data to automate this typical flow.

Monitoring MSSQL with Blue Medora
+++++++++++++++++++++++++++++++

We have partnered with Blue Medora to collect metrics and data that Blue Medora monitors and surface it in Prism Central.

#. Navigate to the Alerts page by clicking the bell icon in the top of the navigation bar. Notice you have an alert claiming SQL server query average latency high. Click on the alert to take a closer look.

   .. figure:: images/bm1.png

#. From the alert details we can see that the query latency shot up recently and is now much higher than it had been previously. Click on the View Details link so we can investigate a bit further.

   .. figure:: images/bm2.png

#. In this view you can see the metrics that we are collecting from Blue Medora. From this view we can see that while number of queries and connections have remained constant, the CPU usage and query latency have shot up and anomalous data points have been identified. To investigate further click the Queries menu item in the left side of the view.

   .. figure:: images/bm3.png

#. From this view, we can see that a new query type has been flagged and it appears that this query is taking much longer to execute (208 seconds). Now that we have identified the cause of the issue, lets use X-Play to remediate the situation. The MSSQL server needs it's memory increased to handle the memory consumption of the new query. We will run a Manual playbook to increase the MSSQL instance memory.

   .. figure:: images/bm4.png

#. From the More menu at the top of the screen, open the dropdown and select the Run Playbook option.

   .. figure:: images/bm5.png

#. Select the Playbook with your initials in it and click 'Run'. This will execute a powershell script to increase the MSSQL instance memory, and it will also send you an email notifying you of the update.

   .. figure:: images/bm6.png

#. Navigate to the Playbooks view using the search bar.

   .. figure:: images/bm7.png

#. Open the playbook with your initials in it.

   .. figure:: images/bm9.png

#. From this popup, click the Plays tab. You can see that the playbook did run successfully. If you want you can click on the Play to take a deeper look into the details. Now lets see how we can automate this workflow. In the upper right corner of the popup, click the Update button.

   .. figure:: images/bm10.png

#. Click the change trigger link, so we can go ahead and swap out the manual trigger with an alert trigger.

   .. figure:: images/bm11.png

#. Select the alert trigger tile.

   .. figure:: images/bm12.png

#. Search for `SQL Server Avg Query Latency high`. We will use this alert policy as the triggering criteria for the alert trigger.
   .. figure:: images/bm13.png

#. Go ahead and save the update, and be sure to click enable. Now if an alert is ever generated for SQL Server Avg Query Latency high, this playbook will automatically execute.

   .. figure:: images/bm14.png


Takeaways
.........
- Prism Pro is our solution to make IT OPS smarter and automated. It covers the IT OPS process ranging from intelligent detection to automated remediation.
- X-FIT is our machine learning engine to support smart IT OPS, including forecast, anomaly detection, and inefficiency detection.
- X-Play, the IFTTT for the enterprise, is our engine to enable the automation of daily operations tasks.
- X-Play enables admins to confidently automate their daily tasks within minutes.
- X-Play is extensive that can use customer’s existing APIs and scripts as part of its playbooks.
