const removeElements = function(stri){ return stri.replace(/(\<)(.+?)(\>)/g, "<>")}

module.exports = { removeElements };
