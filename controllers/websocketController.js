import { sockets } from "../middlewares/websocketMiddleware.js";
import { addToDB } from "./historyApiController.js";
import { StandardWebSocketClient } from "../deps.js";

const livegames = [];

const openSocket = async () => {

  const endpoint = "ws://bad-api-assignment.reaktor.com/rps/live/";
  const ws = new StandardWebSocketClient(endpoint);

  ws.on("open", function() {
    console.log("reaktor ws connected!");
    
  });
  ws.on("message", async function (message) {
    //console.log(message.data);
    const json = JSON.parse(message.data);
    //console.log(json);
    

    const json2 = JSON.parse(json);
    //if we get new results add em to db
    if(json2.type === "GAME_RESULT") {
      await addToDB(json2);

      //remove from live games
      for (let i = 0;i<livegames.length;i++) {
        if(livegames[i].gameId === json2.gameId) {
          livegames.splice(i,1);
        }
      }
    } else if (json2.type === "GAME_BEGIN") {
        //add to live games
        livegames.push(json2);
    }
    //send new data to all sockets
    sendToAll(json);
    
  });

};

const sendLiveData = async (socket) => {
  const data = {
    type: "LIVE_DATA",
    games: livegames,
  }
  const livedata = JSON.stringify(data);
  sendMessage(socket,livedata);
}

const sendToAll = async (message) => {
  sockets.forEach((socket) => {
      sendMessage(socket, message);
  });
}



const waitForOpenConnection = (socket) => {
  return new Promise((resolve, reject) => {
      const maxNumberOfAttempts = 10
      const intervalTime = 200 //ms

      let currentAttempt = 0
      const interval = setInterval(() => {
          if (currentAttempt > maxNumberOfAttempts - 1) {
              clearInterval(interval)
              reject(new Error('Maximum number of attempts exceeded'))
          } else if (socket.readyState === socket.OPEN) {
              clearInterval(interval)
              resolve()
          }
          currentAttempt++
      }, intervalTime)
  })
}

const sendMessage = async (socket, msg) => {
  if (socket.readyState !== socket.OPEN) {
      try {
          await waitForOpenConnection(socket)
          socket.send(msg)
      } catch (err) { console.error(err) }
  } else {
      socket.send(msg)
  }
}

export {openSocket,sendMessage,livegames,sendLiveData}