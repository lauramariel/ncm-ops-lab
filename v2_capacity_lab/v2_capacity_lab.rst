.. title:: Nutanix .Next Prism Pro HOL


.. toctree::
  :maxdepth: 2
  :caption: Appendix
  :name: _appendix
  :hidden:

  tools_vms/linux_tools_vm

.. _xplay:

------------------------
Prism Pro
------------------------

*The estimated time to complete this lab is ?? minutes.*

Overview
++++++++

Prism Pro is a product designed to make our customer IT operations smart and automated. Today, there is no solution that is specifically designed for data center IT operations built around HCI. The infrastructure in this type of data center is dynamic, scalable, and highly performed. Traditional performance monitoring and IT OPS tools are built for static infrastructure. When IT admins use the traditional tools to manage HCI environments, they are overwhelmed by the complexity and noisy signals the tool brings. This decreases the productivity of the operations and reduces the ROI from adopting HCI.

Prism Pro takes a unique approach that maximizes the operation efficiency of an HCI based data center. First, Prism Pro uses purpose-built machine learning (X-FIT) to extract the insights from the mass amount of operations data the HCI produces. The first three use cases Prism Pro shipped are capacity forecast and planning, VM right sizing, and anomaly detection. These use cases help our customers detect problems and waste with the actionable signal. Second, Prism Pro delivers an automation mechanism (X-Play) that enables customers to automate their operations tasks confidently to respond to the signal X-FIT detects.

X-Play is designed to address the number 1 pain point when customers deal with automation - the fear of amplified impact because of the complexity of the automation. Not like the solution, such as Calm, for the application lifecycle automation, X-Play’s goal is to automate the simple tasks that admins face daily. To eliminate the fear and give the control back to the admin, X-Play takes the codeless approach which has been proven in the companies such as IFTTT and Zapier that it is easy to adopt and extremely versatile.

There are no other tools in the market taking this approach and has the power to combine intelligence and codeless automation. The power of X-FIT and X-Play allows the customer to truly leverage the machine data the HCI infrastructure produces and operate it efficiently, confidently, and intelligently.

Capacity Planning Runway
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

Automate Report Generation with X-Play
++++++++++++++++++++++++++++++++++++++++++++++++++++++++

TODO...

Takeaways
.........

- Prism Pro is our solution to make IT OPS smarter and automated. It covers the IT OPS process ranging from intelligent detection to automated remediation.
- X-FIT is our machine learning engine to support smart IT OPS, including forecast, anomaly detection, and inefficiency detection.
- X-Play, the IFTTT for the enterprise, is our engine to enable the automation of daily operations tasks.
- X-Play enables admins to confidently automate their daily tasks within minutes.
- X-Play is extensive that can use customer’s existing APIs and scripts as part of its playbooks.
