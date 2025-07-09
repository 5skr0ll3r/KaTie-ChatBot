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
			
			const randString = randomStringGenerator(40, 380);
			
			if(randString.jackpot){
				fs.promises.readFile('./assets/wydh.html').then((data)=>{
					const headers = {
						[randomCase('Content-Type')]: 'text/html',
						[randomCase('Content-Length')]: data.length
					};
					res.writeHead(200, headers);
					return res.end(data);
				}).catch((error)=>{
					res.writeHead(500, headers);
					return res.end("Something went wrong please try again");
				});
			}else{
				const headers = {
					[randomCase('Content-Type')]: 'text/html',
					[randomCase('Content-Length')]: randString.randomString.length
				};

				setTimeout(()=>{
					res.writeHead(200, headers);
					return res.end(randString.randomString);
				}, Math.floor(Math.random() * 100));
			}
		}).catch((rateLimiterRes)=>{
			res.writeHead(429);
			return res.end("Too many requests");
		});
});

module.exports = app;
