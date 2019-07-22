npm install
forever start -al forever.log -o out.log -e err.log index.js
cd client
npm install
forever start -al forever.log -o clientOut.log -e clientErr.log scripts/start.js
