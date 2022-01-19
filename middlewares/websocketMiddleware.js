import { requestProfile } from "../controllers/profileController.js";
import { uuidv4 } from "../deps.js";
import { sendLiveData } from "../controllers/websocketController.js";



const sockets = new Map();

const websocketMiddleware = async (context, next) => {

      if (context.request.url.pathname !== "/ws") {
        return await next();
      }
  
      if (!context.isUpgradable) {
        context.response.status = 200;
        return;
      }
        //upgrade connection to websocket
        const socket = await context.upgrade();
        //assign unique id and add to sockets map
        socket.id = uuidv4();
        sockets.set(socket.id, socket);


        socket.addEventListener('message', function (event) {
            console.log('Message from client ', event.data);
            const jsonmsg = JSON.parse(event.data);
            if(jsonmsg.type === "REQUEST_PROFILE") {
              requestProfile(jsonmsg.name, socket);
            }
        });

        //send live data
        await sendLiveData(socket);
        
        
        //remove from sockets when disconnect
        socket.onclose = _ => sockets.delete(socket.id);
        
    
    
  };


  
  export { websocketMiddleware, sockets };