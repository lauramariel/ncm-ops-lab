------------------------
Prism Pro Capacity Runway
------------------------

Overview
+++++++++

In this lab you will learn how Prism Pro can help IT Admins monitor, analyze and automatically act when cluster runway is low.

Lab Setup
+++++++++

#. Open your **Prism Central** and navigate to the **VMs** page. Note down the IP Address of the **PrismOpsLabUtilityServer**. You will need to access this IP Address throughout this lab.

   .. figure:: images/init1.png

#. Open a new tab in the browser, and navigate to ``http://<PrismOpsLabUtilityServer_IP_ADDRESS>/`` alerts [example http://10.38.17.12/alerts]. 

   .. note::
      It is possible you may need to log into the VM if you are the first one to use it. Just fill out the **Prism Central IP**, **Username** and **Password** and click **Login**.

   .. figure:: images/init2.png

#. Once you have landed on the alerts page, leave the tab open. It will be used in a later portion of this lab.

   .. figure:: images/init2b.png

#. In a separate tab, navigate to ``http://<PrismOpsLabUtilityServer_IP_ADDRESS>/`` to complete the lab from [example http://10.38.17.12/]. Use the UI at this URL to complete this lab.

   .. figure:: images/init3.png


Capacity Planning Runway Monitoring
++++++++++++++++++++++++++++++++++++++

.. note::

   The following instructions are executed in Prism Ops Lab Utility Server console which is accessed via Prism Ops Lab Utility Server at ``http://<PrismOpsLabUtilityServer_IP_ADDRESS>/``

   Prism Ops Lab Utility Server has functions to simulate the environment for doing this lab. Doing the lab on the Prism Central will not show simulated environment and labs will **not** work.

   In case, the ``http://<PrismOpsLabUtilityServer_IP_ADDRESS>/``  does not load for a while. Restart your **PrismProLabUtilityServer** VM from Prism Central/Prism Element.


Capacity runway is a measure of the remaining capacity left within a given cluster or node. There is an overall cluster runway as well as individual runway measurements for CPU, Memory and storage capacity. The Capacity Runway is calculated using X-FIT, Prism Pro's machine intelligence engine. Lets view the Capacity Runway of your lab cluster.

#. In **Prism Central > Main Dashboard > Cluster Runway**.

#. Click on the **NCMCluster** cluster.
 
   .. figure:: images/ppro-dashboard.png

#. You can now take a look at the Runway for Storage, CPU, and Memory.

   .. figure:: images/ppro_12.png

#. When selecting the Memory tab, you can see a Red Exclamation mark, indicating where this cluster will run out of Memory. You can hover the chart at this point to see on which day this will occur.

   .. figure:: images/ppro_13.png

#. Click on the **‘Optimize Resources’** button on left. This is where you can (depending on the workload running in your Nutanix cluster) see the inefficient VMs in the environment with suggestions on how you can optimize these resources to be as efficient as possible.

   .. figure:: images/ppro_14.png

#. Close the optimize resources popup.

Capacity Planning Runway Analysis
++++++++++++++++++++++++++++++++++++++

Prism Pro's X-FIT engine also provides the capability to plan for future workloads and identifies the hardware that can be added to account for the new workloads resource requirements.

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

#. Choose to not save your scenario upon exit as we will be configuring automated report generation using Playbooks

Automate Capacity Forecast Report Generation with X-Play
++++++++++++++++++++++++++++++++++++++++++++++++++++++++

Now let's look at how we can take automated action to generate this report when the Capacity Runway is low. We will use X-Play, Prism Pro's simple automation engine.

#. Use the hamburger menu to navigate to **Operations** > **Playbook** > and **Get Started** (if this option appears) 

   .. figure:: images/cap1.png

#. Click **Create Playbook** at the top of the table view.

   .. figure:: images/cap2.png

#. Select the **Alerts Matching Criteria** as the trigger. Using this trigger allows us to trigger this Playbook for one or more Alert Policies that match the criteria specified.

   .. figure:: images/cap3.png

#. Select the **Specific Alert Policies** radio button and then search 'runway' in the search box. Select the following from the dropdown, since these are the 3 alerts we would want to generate a report for if Storage, Memory or CPU runway are low:
   
   - **Cluster running out of storage Capacity (low runway)**
   - **Cluster running out of Memory Capacity (low runway)** and 
   - **Cluster running out of CPU Capacity (low runway)** 

   .. figure:: images/cap4.png

#. First, we would like to Generate a Forecast report for this alert. Click **Add Action** on the left pane and select the **Generate Forecast Report** action.

   .. figure:: images/cap5.png

#. The **Alert Matching Criteria: Source Entity** in this case will be your Cluster (e.g. PHX-SPOC007-4) that the alert is generated on. You can also change the Runway Period if you would like.

   .. figure:: images/cap6.png

#. Next we would like to notify someone that the ticket was created by X-Play. Click **Add Action** and select the **Email** action. You can also search for **Email** action from the **Search for Action** area.

   .. figure:: images/cap7.png

#. Fill in the field in the email action. Here are the examples

   - **Recipient:** - Fill in your email address.
   - **Subject :** - ``Playbook {{playbook.playbook_name}} was executed.``
   - **Message:** - ``As a result of the alert, {{trigger[0].alert_entity_info.name}}, the playbook, {{playbook.playbook_name}}, was executed. The generated report is attached to this email.``
   - **Attachment:**  - Choose **Gernerate Forecast Report: Report PDF**

   .. note::

      You are welcome to compose your own subject message. The above is just an example. You could use the “parameters” to enrich the message.

   .. figure:: images/cap8.png

#. Click **Save & Close** button and input a name: *Initials* - Automatically Generated Forecast Report.

   .. figure:: images/cap9.png

#. Set the playbook status to *Enabled* 

#. Click on **Save**

#. Now let's trigger the workflow. Switch to the browser tab where you opened **PrismOpsLabUtilityServer** in the :ref:`labsetup` section with the **/alerts** URL [example 10.38.17.12/alerts]. 

#. Select the **Memory Runway is Short** option and click **Simulate Alert**. This will simulate a memory constrained alert for the **NCMCluster**.

   .. figure:: images/cap10.png

#. Switch back to the previous **Prism Central > Operations > Playbooks** browser tab. From the table view click to open the details for the `*Initials* - Automatically Generate Forecast Report” Playbook.`

   .. figure:: images/cap11.png

#. Switch to the **Plays** tab, and click on the title of the first Play in the table to take a closer look.

   .. figure:: images/cap12.png

#. Click on Playbook name to show more details for each item in the play. If there were any errors, they would also be surfaced in this view.

   .. figure:: images/cap13.png

#. Check your email. You should also get an email with the report attached for you to take a look. Note: In 5.11 the email can sometimes take up to 5 minutes to send.

   .. figure:: images/cap14.png

#. **Delete** or **Disable** your Playbook from the **Prism Central** before moving on to another lab. Since there are multiple users sharing the lab environment, the alerts they generate could cause you to continue to recieve emails as long as this Playbook is enabled.

   .. figure:: images/cap15.png

Takeaways
++++++++++

- Prism Pro is our solution to make IT OPS smarter and automated. It covers the IT OPS process ranging from intelligent detection to automated remediation.

- X-FIT is our machine learning engine to support smart IT OPS, including capacity forecasting.

- X-Play, the IFTTT for the enterprise, is our engine to enable the automation of daily operations tasks, making it so easy that automation can be built by every admin.
