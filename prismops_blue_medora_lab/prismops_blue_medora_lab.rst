.. title:: Nutanix .Next Prism Pro HOL


.. toctree::
  :maxdepth: 2
  :caption: Appendix
  :name: _appendix
  :hidden:

  tools_vms/linux_tools_vm

.. _xplay:

------------------------
Prism Pro MS SQL monitoring with Blue Medora
------------------------

.. figure:: images/operationstriangle.png

The above graphic is what we like to refer to as the Operations Triangle, which shows the typical operations flow in any environment, a continuous cycle of monitoring, analyzing and then taking action where necessary. With Prism Pro, IT Admins are able to leverage insights from machine data to automate this typical flow.

In this lab you will learn how Prism Pro can help IT Admins monitor, analyze and automatically act on database application data from our partner Blue Medora.

Lab Setup
+++++++++

Please be sure to complete the `Deploying MS SQL` lab as you will need to use the MS SQL server to complete this lab.

#. Open your Prism Central and navigate to the VMs page. Note down the IP Address of the `GTSPrismOpsLabUtilityServer`.

   .. figure:: images/init1.png

#. Open a new tab in the browser, and navigate to http://`<GTSPrismOpsLabUtilityServer_IP_ADDRESS>`/databases [example http://10.42.113.52/databases]. It is possible you may need to log into the VM if you are the first one to use it. Just fill out the **Prism Central IP**, **Username** and **Password** and click **Login**.

   .. figure:: images/init2.png

#. Now fill in the details, including your initials, email and select the VM you created in the `Deploying MS SQL` and click begin to begin the MS SQL server monitoring lab.

   .. figure:: images/initbm.png

#. Now navigate to `http://<GTSPrismOpsLabUtilityServer_IP_ADDRESS>/` to complete the lab from. Use the UI at this URL to complete the lab.

   .. figure:: images/init3.png

Monitoring MS SQL with Prism Pro
+++++++++++++++++++++++++++++++

Once the Blue Medora collectors are deployed and configured to monitor your MS SQL server, the application performance data will be visible in the Prism UI. Let's take a deeper look at how to get visibility into the application layer from the Prism Central console, and monitor the end-to-end stack with a single pane-of-glass.

#. Navigate to the **Alerts** page by clicking the bell icon in the top of the navigation bar. Notice you have an alert claiming **SQL server query average latency high**. Click on the alert to take a closer look.

   .. figure:: images/bm1.png

#. From the alert details we can see that the query latency shot up recently and is now much higher than it had been previously. Click on the **View Details** link so we can investigate a bit further.

   .. figure:: images/bm2.png

#. In this view you can see the metrics that are being collected by the Blue Medora collector. When a metric value deviates from it's expected range, Prism Pro will raise an anomaly. We can see that while number of queries and connections have remained constant, the CPU usage and query latency have been flagged as anomalous. To investigate further click the **Queries** menu item in the left side of the view.

   .. figure:: images/bm3.png

#. From this view, we can see that a new query type has been flagged and it appears that this query is taking much longer to execute (208 seconds). Now that we have identified the cause of the issue, lets use X-Play to remediate the situation. The MS SQL server needs it's memory increased to handle the memory consumption of the new query. We will run a Manual playbook to increase the MS SQL instance memory.

   .. figure:: images/bm4.png

#. From the **More** menu at the top of the screen, open the dropdown and select the **Run Playbook** option.

   .. figure:: images/bm5.png

#. Select the Playbook with your initials in it and click **Run**. This will execute a powershell script to increase the MS SQL instance memory, and it will also send you an email notifying you of the update.

   .. figure:: images/bm6.png

#. Navigate to the **Playbooks** view using the search bar.

   .. figure:: images/bm7.png

#. Open the playbook with your initials in it.

   .. figure:: images/bm9.png

#. From this popup, click the **Plays** tab. You can see that the playbook did run successfully. If you want, you can click on the Play to take a deeper look into the details. Now lets see how we can automate this workflow. In the upper right corner of the popup, click the Update button.

   .. figure:: images/bm10.png

#. Click the **Change Trigger** link, so we can go ahead and swap out the Manual trigger with an alert trigger.

   .. figure:: images/bm11.png

#. Select the **Alert** trigger tile.

   .. figure:: images/bm12.png

#. Search for the **SQL Server Avg Query Latency high** alert policy. We will use this alert policy as the triggering criteria for the alert trigger.
   .. figure:: images/bm13.png

#. Go ahead and save the update. Now if an alert is ever generated for **SQL Server Avg Query Latency high**, this playbook will automatically execute.

   .. figure:: images/bm14.png


Takeaways
.........

- IT operations are complex, error-prone, and siloed. With Prism Pro, IT admins can get visibility into and automate the entire stack, end-to-end.

- The Blue Medora integration extends Prism Pro's capabilities into the application layer. The feature is currently avaiable for a limited early access, and will be released later this year (as part of the 5.18 release). The first release will support database applications like MS SQL server and Oracle DB.

- X-FIT is our machine learning engine to support smart IT OPS, including forecast, anomaly detection, and inefficiency detection.

- X-Play, the IFTTT for the enterprise, is our engine to enable the automation of daily operations tasks.

- X-Play enables admins to confidently automate their daily tasks within minutes.

- X-Play is extensive that can use customer’s existing APIs and scripts as part of its playbooks.

Getting Connected
+++++++++++++++++

Have a question about **Prism Pro**? Please reach out to the resources below:

+---------------------------------------------------------------------------------+
|  Prism Pro Product Contacts                                                     |
+================================+================================================+
|  Slack Channel                 |  #prism-pro                                    |
+--------------------------------+------------------------------------------------+
|  Product Manager               |  Harry Yang, harry.yang@nutanix.com            |
+--------------------------------+------------------------------------------------+
