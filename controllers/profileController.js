import * as dbService from "../services/dbService.js";
import { sendMessage } from "./websocketController.js";

const requestProfile = async (msg, socket) => {
    const stats = await dbService.getStats(msg);

    if (!stats) {
        return;
    }

    //winrate logic
    let winrate = 0;
    if (stats.matches_played > 0 && stats.wins > 0) {
        winrate = parseInt(stats.wins/stats.matches_played * 100);
    }

    let mostplayed = {
        hand: "",
        times: "",
    };
    const rocks = stats.rock_played;
    const papers = stats.paper_played;
    const scissors = stats.scissors_played;
    
    //most played hand logic
    if(rocks >= papers && rocks >= scissors) {
        mostplayed.hand = "ROCK";
        mostplayed.times = rocks;
    } else if (papers >= rocks && papers >= scissors) {
        mostplayed.hand = "PAPER";
        mostplayed.times = papers;
    } else if (scissors >= rocks && scissors >= papers) {
        mostplayed.hand = "SCISSORS";
        mostplayed.times = scissors;
    }

    const matches = await dbService.getmatchhistory(msg);

    const data = {
        type: "PROFILE",
        name: stats.name,
        matches_played: stats.matches_played,
        winrate: winrate,
        mostplayed: mostplayed,
        match_history : matches,
    }
    

    const jsonstring = JSON.stringify(data);
    
    await sendMessage(socket,jsonstring);

}



export {requestProfile}