import * as dbService from "../services/dbService.js";

const addToDB = async (json) => {
    //check if match is in db
    const match = await dbService.checkMatch(json.gameId);
    // if match not in db we add it and all the stats
    
    if (match.length !== 0) {
        return;
    }
    //checks if players in database and add them if not
    const player1 = await checkifexist(json.playerA.name);
    const player2 = await checkifexist(json.playerB.name);

    //add match to db
    await dbService.addMatch(json.gameId,player1,player2,json.playerA.played,json.playerB.played);
    console.log("add match to db: " + json.gameId);

    //tracks rock paper and scissors
    json.playerB.rps = {
        rock: 0,
        paper: 0,
        scissors: 0,
    };
    json.playerA.rps = {
        rock: 0,
        paper: 0,
        scissors: 0,
    };
    

    //checks winner
    const winner = await checkwinner(json.playerA, json.playerB);
    //adds stats to database
    if (winner === -1) {
        await dbService.updateStats(player1,0,0,1,json.playerA.rps.rock,json.playerA.rps.paper,json.playerA.rps.scissors);
        await dbService.updateStats(player2,0,0,1,json.playerB.rps.rock,json.playerB.rps.paper,json.playerB.rps.scissors);

    } else if (winner === 1) {
        await dbService.updateStats(player1,1,0,1,json.playerA.rps.rock,json.playerA.rps.paper,json.playerA.rps.scissors);
        await dbService.updateStats(player2,0,1,1,json.playerB.rps.rock,json.playerB.rps.paper,json.playerB.rps.scissors);

    } else {
        await dbService.updateStats(player1,0,1,1,json.playerA.rps.rock,json.playerA.rps.paper,json.playerA.rps.scissors);
        await dbService.updateStats(player2,1,0,1,json.playerB.rps.rock,json.playerB.rps.paper,json.playerB.rps.scissors);

    }

}

//checks who is the winner of the game
const checkwinner = async (p1,p2) => {
    const playerA = p1.played;
    const playerB = p2.played;

    if(playerA === playerB) {
        if(playerA === "ROCK") {
            p1.rps.rock = 1;
            p2.rps.rock = 1;
        } else if(playerA === "SCISSORS") {
            p1.rps.scissors = 1;
            p2.rps.scissors = 1;
        } else if (playerA === "PAPER") {
            p1.rps.paper = 1;
            p2.rps.paper = 1;
        }
        return -1;
    } else if (playerA === "ROCK"){
        p1.rps.rock = 1;
        if(playerB === "SCISSORS") {
            p2.rps.scissors = 1;
            return 1;
        }
        else {
            p2.rps.paper = 1;
            return 2;
        }
    } else if (playerA === "SCISSORS") {
        p1.rps.scissors = 1;
        if(playerB === "PAPER") {
            p2.rps.paper = 1;
            return 1;
        }
        else {
            p2.rps.rock = 1;
            return 2;
        }
    } else if (playerA === "PAPER") {
        p1.rps.paper = 1;
        if (playerB === "ROCK") {
            p2.rps.rock = 1;
            return 1;
        }
        else {
            p2.rps.scissors = 1;
            return 2;
        }
    }
}

//checking if user exists, adds them if not and returns their id number
const checkifexist = async (name) => {
    let user = await dbService.getUserId(name);
    
    if(!user || user.length === 0) {
        console.log("adding user with name "+name)
        await dbService.addUser(name);
        user = await dbService.getUserId(name);
        await dbService.addStats(user[0].id);
        console.log("adding stats for: " + user[0].id);
    }

    return user[0].id;
};

export {addToDB}