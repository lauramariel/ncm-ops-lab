.. title:: Nutanix .Next Prism Pro HOL


.. toctree::
  :maxdepth: 2
  :caption: Appendix
  :name: _appendix
  :hidden:

  tools_vms/linux_tools_vm

.. _xplay:

------------------------
Prism Pro Capacity Runway
------------------------

Lab Setup
+++++++++

#. Open your Prism Central and navigate to the VMs page. Note down the IP Address of the `GTSPrismOpsLabUtilityServer`.

   .. figure:: images/init1.png

#. Open a new tab in the browser, and navigate to `http://<GTSPrismOpsLabUtilityServer_IP_ADDRESS>/alerts` [ex. http://1.1.1.1/alerts]. It is possible you may need to log into the VM if you are the first one to use it. Just fill out the PC IP, username and password and click login. Leave this tab open, it will be used in a later portion of this lab.

   .. figure:: images/init2.png

#. In a separate tab, navigate to `http://<GTSPrismOpsLabUtilityServer_IP_ADDRESS>/` to complete the lab from. Use the UI at this URL to complete the lab.

   .. figure:: images/init3.png

Overview
++++++++

.. figure:: images/operationstriangle.png

The above graphic is what we like to refer to as the Operations Triangle, which shows the typical operations flow in any environment, a continuous cycle of monitoring, analyzing and then taking action where necessary. With Prism Pro the customer is able to leverage insights from machine data to automate this typical flow.

Capacity Planning Runway Monitoring
++++++++++++++++++++++++++++++++++++++

Capacity runway is a measure of the remaining capacity left within a given cluster or node. There is an overall cluster runway as well as individual runway measurements for CPU, Memory and storage capacity. Lets view the Capacity Runway of your lab cluster.

#. In **Prism Central > Planning > Capacity Runway**.

- Note the runway summaries showing the days left for each cluster.
- How long does the current cluster has before it runs out of memory, CPU, and storage?

#. Click on the **Prism-Pro-Cluster** cluster.

. You can now take a look at the Runway for Storage, CPU, and Memory.

   .. figure:: images/ppro_12.png

#. When selecting the Memory tab, you can see a Red Exclamation mark, indicating where this cluster will run out of Memory. You can hover the chart at this point to see on which day this will occur.

   .. figure:: images/ppro_13.png

Capacity Planning Runway Analysis
++++++++++++++++++++++++++++++++++++++

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

Automate Capacity Forecast Report Generation with X-Play
++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Now let's look at how we can take automated action to generate this report when the Capacity Runway is low.

#. Use the search bar to navigate to the Playbooks page.

   .. figure:: images/cap1.png

#. Click **Create Playbook** at the top of the table view.

   .. figure:: images/cap2.png

#. Select the Alert as the trigger.

   .. figure:: images/cap3.png

#. Search and select **Cluster running out of Memory Capacity (low runway)** as the alert policy, since this is the issue we are looking to take automated steps to generate a report for.

   .. figure:: images/cap4.png

#. First, we would like to Generate a Forecast report for this alert. Click **Add Action** on the left side and select the **Generate Forecast Report** action.

   .. figure:: images/cap5.png

#. The Alert Source Entity in this case will be the Cluster that the alert is generated on. You can also change the Runway Period if you would like.

   .. figure:: images/cap6.png

#. Next we would like to notify someone that the ticket was created by X-Play. Click **Add Action** and select the Email action.

   .. figure:: images/cap7.png

#. Fill in the field in the email action. Here are the examples

**Recipient:** Fill in your email address.

**Subject :**
``Playbook {{playbook.playbook_name}} was executed.``

**Message:**
``As a result of the alert, {{trigger[0].alert_entity_info.name}}, the playbook, {{playbook.playbook_name}}, was executed. The generated report is attached to this email.``

   .. figure:: images/cap8.png

#. Click **Save & Close** button and save it with a name “*Initials* - Automatically Generate Forecast Report”. **Be sure to enable the ‘Enabled’ toggle.**

   .. figure:: images/cap9.png

#. Now let's trigger the workflow. Navigate to the tab you opened in the setup with the /alerts URL. Select the Radio for `Memory Runway is Short` and click **Simulate Alert**. This will simulate a memory constrained alert for the Prism-Pro-Cluster.

   .. figure:: images/cap10.png

#. Switch back to the Prism Central console. From the table view click to open the Playbook details.

   .. figure:: images/cap11.png

#. Switch to the Plays tab, and click on the title of the first Play in the table to take a closer look.

   .. figure:: images/cap12.png

#. The sections in this view can be expanded to show more details for each item. If there were any errors, they would also be surfaced in this view.

   .. figure:: images/cap13.png

#. You should also get an email with the report attached for you to take a look.

   .. figure:: images/cap14.png

#. It is suggested that you either delete, or disable your playbook from the Prism Central before moving on to another lab. Since there are multiple users sharing this Prism Central, the alerts they generate could cause you to continue to recieve emails as long as this playbook is enabled.

   .. figure:: images/cap15.png

Takeaways
.........
TODO
- Prism Pro is our solution to make IT OPS smarter and automated. It covers the IT OPS process ranging from intelligent detection to automated remediation.
- X-FIT is our machine learning engine to support smart IT OPS, including forecast, anomaly detection, and inefficiency detection.
- X-Play, the IFTTT for the enterprise, is our engine to enable the automation of daily operations tasks.
- X-Play enables admins to confidently automate their daily tasks within minutes.
- X-Play is extensive that can use customer’s existing APIs and scripts as part of its playbooks.
