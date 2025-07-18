# Code Dictionary
---
## File Structure
```
.
├── CODE.md
├── LICENSE.md
├── README.md
└── src
     ├── app.js
     ├── websocket.js
     ├── service.js
     ├── assets
     |     ├── send.png
     │     └── wydh.html
     ├── utils
     │      ├── abm.js
     │      └── utils.js
     ├── embeddings
     │         ├── chatbot.html
     │         └── iframe.html
     ├── managers
     │       ├── configurationManager.js
     │       └── GPTManager.js
     ├── package.json
     ├── package-lock.json
     ├── .env
     └── .deployment
```

# Files:

## Base:
---
### app.js:

**Description**: Creates the http server template that handles the chatbots html delivery.

**Dependencies**: 
- fs
- http
- ./utils/abm.js { isValidCarrier }

**EndPoints**:
- '/api/v1/get/embedding'

### websocket.js:
**Description**: Creates the websocket server that handles the messaging between the client and chatGPT.

**Dependencies**: 
- ws { WebSocketServer }
- ./utils/abm.js { isValidCarrier }
- ./utils/utils.js { a }
- ./managers/GPTManager.js { AI }

**Endpoints**:
- '/'

### server.js:
**Description**: Initializes all the services and starts them.

**Dependencies**:
- ./managers/configurationManager.js
- ./websocket.js
- ./app.js

## SubDirectories:
---
## assets/

### send.png:
**Description**: Send button of chatbot

### wydh.html:
**Description**:
```
In case someone tries to fuzz the chatbots endpoint
this page will be shown to him giving him a false 200 status code as a response 
in case he is using a script so all attempts will be false positive (for script kiddies)
and after some seconds will be redirected to a letmegooglethat.com 
```

## embeddings/

### chatbot.html
**Description**: Contains the code that will be shown to the client (html,css,js one file).

### iframe.html:
**Description**: Contains the code to embed the chatbot to the website using an iframe element. 

## managers/

### configurationManager.js
**Description**: Imports the configuration either from a .env, json file or from the environment variables if none is specified

**Dependencies**: 
- dotenv
- fs 

**Class**:
- ConfigurationManager

**Methods**:
- constructor(filePath)
- setConfiguration(filePath=null) -> JSON.Object
- getConfiguration() -> JSON.Object


### GPTManager.js:
**Description**: Handles the interactions with chatGPT.

**Dependencies**:
- openai { OpenAI }
- @pinecone-database/pinecone { Pinecone }

**Class**:
- AI

**Methods**:
- constructor()
- init()
- async sendMessage(userQuery) -> String
- async searchPinecone(embeddingQuery) -> String
- async makeSearch(userQuery) -> String
- structPrompt(results, userQuestion) -> String
- async getEmbeding(userInput) -> Array[float]

**Prompt Structure**:
```
# Starts about the role and what static information we need it to know:
You are Katie, a customer support assistant for InterMediaKT, an NGO ...

#Then we have the Rules it has to follow (do's and dont's):

# How to reply and in what format (more like do's):
Formatting:

# How to behave (more like dont's):
Behavior Rules:

# Search results and user input:

${results}
```

## utils/

### abm.js:
**Description**: Contains security messures so other people cant embed to their site have direct access to the bot and rate-limit requests from single ip.

**Objects**:
- rateLimiter
     - .consume(remoteAddress, points)

**Functions**:
- isValidCarrier(req) -> bool
- rateLimiterMiddleware -> Promise(rateLimiterRes)

### utils.js:
**Description**: Contains function to replace html tags from user input.

**Functions**: 
- removeElements(stri) -> String
