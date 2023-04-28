# ncmops 

- blueprints - this contains a blueprint to deploy the webserver into your environment without having to manually build and configure it
- client - this contains all the React code for the ticketsystem and alerts UI 
- lab - this contains the seed data and scripts to be run on Prism Central
- webserver - this contains the Node.js code for proxying through to PC, to be able to display the custom UIs for the lab and for viewing the seeded data properly

## Notes
- The contents of `client` and `webserver` is the source code that makes up the webserver for accessing PC via proxy and custom endpoints for generating alerts, etc (`/alerts`, `/ticketsystem`, etc.) The webserver needs to be deployed as a VM that has connectivity to PC.
- The contents of `lab` are the files that make up seedPC.zip for seeding PC with fake data (by running `initialize_lab.sh` on PC)

## Deployment

To deploy and run see
https://docs.google.com/document/d/1I94_GUZcDS2fBa5h3IggbewjyR841X3khLDrZ26eJQg/edit#heading=h.z9e115rnv2ss

Questions, issues or suggestions? Reach out to Harkirat Randhawa or Laura Jordana.
