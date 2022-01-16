import { StandardWebSocketClient } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import { sockets } from "../middlewares/websocketMiddleware.js";
import { addToDB } from "./apiController.js";

const openSocket = async () => {

  const endpoint = "ws://bad-api-assignment.reaktor.com/rps/live/";
  const ws = new StandardWebSocketClient(endpoint);

  ws.on("open", function() {
    console.log("reaktor ws connected!");
    //ws.send("something");
  });
  ws.on("message", async function (message) {
    //console.log(message.data);
    const json = JSON.parse(message.data);
    //console.log(json);
    //send new data to all sockets
    sendToAll(json);

    const json2 = JSON.parse(json);
    //if we get new results add em to db
    if(json2.type === "GAME_RESULT") {
      await addToDB(json2);
    }
    
  });

};

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

export {openSocket,sendMessage}