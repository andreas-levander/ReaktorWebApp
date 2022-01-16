import { Application } from "./deps.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import renderMiddleware from "./middlewares/renderMiddleware.js";
import { serveStaticMiddleware } from "./middlewares/serveStaticMiddleware.js";
import { router } from "./routes/routes.js";
import { websocketMiddleware } from "./middlewares/websocketMiddleware.js";
import { openSocket } from "./controllers/websocketController.js";
import { finalurl } from "./services/apiService.js";
import { fetchReaktorData } from "./services/apiService.js";
import * as dbService from "./services/dbService.js";

const app = new Application();


app.use(errorMiddleware);
app.use(websocketMiddleware);
app.use(serveStaticMiddleware);
app.use(renderMiddleware);
app.use(router.routes());

openSocket();

//fetch history data

//await fetchReaktorData("/rps/history");

// if you want to abort and continue later
/*
const lasturl = await dbService.getfinalurl(1);
console.log(`continuing getting data from lasturl: ${lasturl.url}`);
await fetchReaktorData(lasturl.url);
*/

//await dbService.setfinalurl(finalurl);



export { app };