import * as dbService from "../services/dbService.js";
import { sendMessage } from "./websocketController.js";

const requestProfile = async (msg, socket) => {
    const stats = await dbService.getStats(msg);

    if (!stats) {
        return;
    }

    let winrate = 0;
    if (stats.matches_played > 0 && stats.wins > 0) {
        winrate = parseInt(stats.wins/stats.matches_played * 100);
    }
    const matches = await dbService.getmatchhistory(msg);

    const data = {
        type: "PROFILE",
        name: stats.name,
        matches_played: stats.matches_played,
        winrate: winrate,
        match_history : matches,
    }
    

    const jsonstring = JSON.stringify(data);
    //console.log(jsonstring);
    await sendMessage(socket,jsonstring);

}



export {requestProfile}