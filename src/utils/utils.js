const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const elements = [
	["<html>", "</html>"],
	["<body>", "</body>"],
	["<div>", "</div>"],
	["<meta>", "</meta>"],
	["<omg>", "<omg>"]
];


const removeElements = function(stri){ return stri.replace(/(\<)(.+?)(\>)/g, "<>")}

function randomCase(str) {
	return str.split('').map(c => Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase()).join('');
}

function addFakeElements(text) {
	const sliceCount = Math.floor(Math.random() * 5) + 1;
	for (let i = 0; i < sliceCount; i++) {
		const sliceStart = Math.floor(Math.random() * (text.length - 10));
		const sliceEnd = sliceStart + Math.floor(Math.random() * 50) + 10;
		const slice = text.slice(sliceStart, sliceEnd);
		
		const [startTag, endTag] = elements[Math.floor(Math.random() * elements.length)];
		const wrapped = `${startTag}${slice}${endTag}`;

		const insertPos = Math.floor(Math.random() * text.length);
		text = text.slice(0, insertPos) + wrapped + text.slice(insertPos);
	}
	return text;
}

const randomStringGenerator = function(min, max, bigchance = 0.05, jackpot = 0.01){
	let length;
	let chance = Math.random();
	if(chance < jackpot){
		return { randomString: '', jackpot: true };
	}else if(chance < bigchance){
		length = Math.floor(Math.random() * (500_000 - 100_000 + 1)) + 100_000;
	}else{
		length = Math.floor(Math.random() * (max - min + 1)) + min;
	}

	let result = '';
	for(let i = 0; i <= length; i++){
		result += charSet.charAt(Math.floor(Math.random() * charSet.length));
	}
	if(Math.random() < 0.3){
		result = addFakeElements(result);
	}
	return { randomString: result, jackpot: false };
}

module.exports = { removeElements, randomCase, randomStringGenerator };