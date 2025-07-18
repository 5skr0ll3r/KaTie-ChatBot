const removeElements = function(stri){ return stri.replace(/(\<)(.+?)(\>)/g, "<>")}

function randomCase(str) {
	return str.split('').map(c => Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase()).join('');
}

module.exports = { removeElements };
