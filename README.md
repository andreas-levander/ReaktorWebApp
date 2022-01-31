# Reaktor Wepp app

## Two versions of app
- First with react front end (in folder react-frontend)
- Another with regular Javascript/HTML (views/layouts/layout.eta)

## What it does:
- Gets data from two reaktor endpoints and adds it to a database
- Automatically updates database from the live websocket api
- Uses another websocket to send data to the clients
- Shows data for clients

## How it works:
- When app starts we establish connection to the reaktor websocket(controllers/websocketController.js)/and fetch history data(services/apiService.js) if it is uncommented(app.js)
- When a client opens the page we upgrade the connection to a websocket(middlewares/websocketMiddleware.js)
- When we get data from reaktor websocket we add it to the database(controllers/websocketController.js, historyApiController.js) and send it to all clients via websocket
- The data is then show to the client
- When a client wants profile data they send a message via websocket and we return the data(controllers/profileController.js) which is then show to the client
- All database operations is done in (services/dbService.js)

## Other:
- Barebones frontend not really done anything other than show data.


## To run locally you need:
1. Install Deno
2. Put in your database settings in database/database.js and add the tables below
3. Populate as much history data you want by using/uncommenting fetchReaktorData() in app.js
4. run app using deno run --allow-all run-locally.js
5. use react version by npm install and npm start in react-frontend
6. use js/html version go to http://localhost:7777

## Tables:

CREATE TABLE users ( id SERIAL PRIMARY KEY, name VARCHAR(255) );

CREATE TABLE matches ( id VARCHAR(255) PRIMARY KEY, playerA INTEGER REFERENCES users(id), playerB INTEGER REFERENCES users(id), playerA_played VARCHAR(20), playerB_played VARCHAR(20) );

CREATE TABLE stats (user_id INTEGER PRIMARY KEY REFERENCES users(id), wins INTEGER DEFAULT 0, losses INTEGER DEFAULT 0,rock_played INTEGER DEFAULT 0,scissors_played INTEGER DEFAULT 0,paper_played INTEGER DEFAULT 0, matches_played INTEGER DEFAULT 0 );

CREATE TABLE finalurl (id INTEGER PRIMARY KEY, url VARCHAR(50));




