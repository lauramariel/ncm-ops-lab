# NCM Ops Lab

This repo contains the source files required for the NCM Ops Lab to work.

## Folder structure
- lab_content - all the old content (RST files, supplementary scripts) from the original repo in case it's needed
- assets - all the source code and scripts required to set up the webserver, ticket system/alerts UI, and seeded fake data for PC
  - blueprints - this contains a blueprint to deploy the webserver into your environment without having to manually build and configure it
  - client - this contains all the React code for the ticketsystem and alerts UI 
  - lab - this contains the seed data and scripts to be run on Prism Central
  - webserver - this contains the Node.js code for proxying through to PC, to be able to display the custom UIs for the lab and for viewing the seeded data properly