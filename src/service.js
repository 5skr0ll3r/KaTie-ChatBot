#!/usr/bin/node
const ConfigurationManager = require('./managers/configurationManager.js');
const configurationManager = new ConfigurationManager('.env');
global.configuration = configurationManager.getConfiguration();

const initializeWebSocket = require('./websocket.js');

const app = require('./app.js');
const ws = initializeWebSocket(app);

app.listen( configuration.SERVICE_PORT, (err)=>{//, configuration.SERVICE_INTERFACE
	if(err) throw new Error(err);
	console.log(`Listening on ${configuration.SERVICE_INTERFACE}:${configuration.SERVICE_PORT}`);
});
