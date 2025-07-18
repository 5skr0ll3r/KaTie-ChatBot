const http = require('http');
const fs = require('fs');
const { rateLimiter, rateLimiterMiddleware, isValidCarrier } = require('./utils/abm.js');
const { randomCase, randomStringGenerator } = require('./utils/utils.js');

const app = http.createServer(async (req,res)=>{
	if(!isValidCarrier(req)){
		return res.writeHead(401).end();
	}
	rateLimiterMiddleware(req)
		.then(async (rateLimiterRes)=>{
			if(req.url === '/api/v1/get/embedding'){
				const chatbot = await fs.promises.readFile('./embeddings/chatbot.html', 'utf-8');
				res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': chatbot.length, 'Content-Disposition': 'inline; filename=chatbot.html'});
				return res.end(chatbot);
			}

			let _jCase = await rateLimiter.consume(req.socket.remoteAddress, 5);
		}).catch((rateLimiterRes)=>{
			res.writeHead(429);
			return res.end("Too many requests");
		});
});

module.exports = app;
