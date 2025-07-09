import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

class AI{
	constructor(){
		this.gptClient;
		this.pineConeClient;
		this.pineConeIndex;
	}

	init(){
		this.gptClient = new OpenAI({ apiKey: global.configuration.OPENAI_API_KEY });
		this.pineConeClient = new Pinecone({ apiKey: global.configuration.PINECONE_API_KEY });
		this.pineConeIndex = this.pineConeClient.index(global.configuration.PINECONE_INDEX_NAME);
	}

	async sendMessage(userQuery){
		let searchResults = await this.makeSearch(userQuery);
		let prompt = this.structPrompt(searchResults);

		let messages = [];
		messages.push({
			role: "system",
			content: prompt
		});

		messages.push({
			role: "user",
			content: userQuery
		});

		const gptResponse = await this.gptClient.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: messages,
			temperature: 0.5
		});

		return gptResponse.choices[0].message.content;
	}

	async searchPinecone(embeddingQuery){
		const result = await this.pineConeIndex.query({
			vector: embeddingQuery,
			topK: 7,
			includeMetadata: true
		});

		return JSON.stringify(result.matches);
	}

	async makeSearch(userQuery){
		const embedding = await this.getEmbeding(userQuery);
		const searchResults = await this.searchPinecone(embedding);

		return searchResults;
	};

	structPrompt(results){
		const today = new Date();
		const prompt = `
System Prompt Here:
			
${results}
		`;
		return prompt;
	} 

	//Creates embeding of the user input for faster database search
	async getEmbeding(userInput){
		const response = await this.gptClient.embeddings.create({
			model: 'text-embedding-3-small',
			input: userInput,
			encoding_format: 'float'
		});
		return response.data[0].embedding;
	}
}

export { AI };