const { existsSync, readFileSync } = require("fs"),
	{ config } = require("dotenv");

class ConfigurationManager{
	constructor(filePath) {
		this.configuration = this.setConfiguration(filePath);
	}

	setConfiguration(filePath=null){
		if(!filePath){
			//Also covers, if as a conifuration file, package.json is used since ES6
			return process.env;
		}

		if(!existsSync(filePath)){
			throw new Error(`File ${filePath} doesnt exist`);
		}

		const fileName = filePath.split("/").reverse()[0];
		const type = fileName.split(".").reverse()[0];
		if(type == "env"){
			try{
				return config({ path: filePath }).parsed;
			}
			catch(invalidDataError){
				throw invalidDataError;
			}
		}
		if(type == "json"){
			try{
				return JSON.parse(filePath);
			}
			catch(invalidDataError){
				throw invalidDataError;
			}
		//TODO: support more types
		}
		throw new Error(`Type ${type} does not corespond to any supported types`);
	}

	getConfiguration(){
		return this.configuration;
	}
}

module.exports = ConfigurationManager;