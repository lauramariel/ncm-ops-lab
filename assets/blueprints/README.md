## Blueprint Versions
These blueprints were created and tested in Calm 3.4.1 / pc.2022.4.0.1

NCMOps.json - deploys proxy webserver only (aka PrismProLabUtilityServer)
NCMOps-VX.json - deploys proxy webserver, and also seeds the data on PC (for use in VX runbooks for HPOC).

## Requirements
The PC where this blueprint runs should have connectivity to the HPOC environment to download the image.

## Usage
- [ ] Download the blueprint and import into your Calm environment.
- [ ] Update the credentials to match your environment. Webserver password will be the standard.
- [ ] Launch the blueprint
- [ ] Once the blueprint is running you can right-click the links to open the proxy, alerting, or ticketsystem UI:
  
    ![](images/links.png)
