//Anti bankruptcy Messures:)
const RateLimiterMemory = require('rate-limiter-flexible').RateLimiterMemory;

const rateLimiter = new RateLimiterMemory({
	points: 50, // Number of points
	duration: 120, // Per 120 seconds (2 min)
});

const rateLimiterMiddleware = function(req){
	return new Promise((resolve, reject)=>{
		rateLimiter.consume(req.socket.remoteAddress, 1).then((rateLimiterRes)=>{
			resolve(rateLimiterRes);
		}).catch((rateLimiterRes)=>{
			reject(rateLimiterRes);
		});
	});
}


//Origin
const whitelist = global.configuration.DOMAIN_WHITELIST.split(',').map((s)=> s.trim());

function isValidCarrier(req){
	//return true;
	if(req.headers.referer){
		let url = new URL(req.headers.referer);
		if(whitelist.includes(url.host)){
			return true
		} else {
			return false;
		}
	}
	if(req.headers.origin){
		let url = new URL(req.headers.origin + "/");
		if(whitelist.includes(url.host)){
			return true;
		} else{
			return false;
		}
	}
	return false;
}

module.exports = { rateLimiter, rateLimiterMiddleware, isValidCarrier };