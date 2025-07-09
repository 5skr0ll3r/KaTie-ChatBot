const { WebSocketServer } = require('ws');
const { isValidCarrier, rateLimiter } = require('./utils/abm.js');
const { removeElements } = require('./utils/utils.js');
const { AI } = require('./managers/GPTManager.js');

const ai = new AI();

(async ()=>{
	try{
		await ai.init();
	}
	catch(error){
		throw new Error(error);
	}
})();

function initializeWebSocket(app){
	let wss = new WebSocketServer({
		server: app
	});

	wss.on('connection', async (ws, req)=>{
		
		if(!isValidCarrier(req)){
			console.log("Is not Valid Carrier")
			ws.terminate();
			return;
		}

		ws.on('error', (error)=>{console.error(error);});
		ws.on('message', async (message)=>{
			if(message.includes("ping")) return;
			message = removeElements(message.toString());
			result = await ai.sendMessage(message, {});
			ws.send(JSON.stringify({ status: 200, message: result }));
			return;

		});
	});
	return wss;
}

module.exports = initializeWebSocket;