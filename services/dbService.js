import { executeQuery } from "../database/database.js";


const getUserId = async (name) => {
    const res = await executeQuery("SELECT * FROM users WHERE name = $1",name);

    return res.rows;
};
const addUser = async (name) => {
    await executeQuery("INSERT INTO users (name) VALUES ($1)",name);

};

const addStats = async (player_id) => {
    await executeQuery("INSERT INTO stats (user_id) VALUES ($1)",player_id);
};

const updateStats = async (player_id,wins,losses,matches,rock_used,paper_used,scrissors_used) => {
    await executeQuery("UPDATE stats SET wins = wins + $2, losses = losses + $3, matches_played = matches_played + $4, rock_played = rock_played + $5, scissors_played = scissors_played + $6, paper_played = paper_played + $7 WHERE user_id = $1",
    player_id,wins,losses,matches,rock_used,scrissors_used,paper_used);
};

const addResulttoDB = async (user_id, title, text) => {
    await executeQuery("INSERT INTO questions (user_id, title, question_text) VALUES ($1, $2, $3)", user_id, title, text);
};

const getStats = async (name) => {
    const res = await executeQuery("SELECT * FROM stats INNER JOIN users ON stats.user_id=users.id WHERE users.name = $1", name);

    return res.rows[0];
};

const checkMatch = async (id) => {
    const res = await executeQuery("SELECT * FROM matches WHERE id = $1", id);

    return res.rows;
};

const addMatch = async (id,playerA,playerB,p1_played,p2_played) => {
    await executeQuery("INSERT INTO matches (id,playerA,playerB,playerA_played,playerB_played) VALUES ($1,$2,$3,$4,$5)", 
                        id, playerA,playerB,p1_played,p2_played);
};

const getmatchhistory = async (id) => {
    const res = await executeQuery(`
    SELECT users.name as ptwoname,gameid,ponename,playera_played,playerb_played 
    FROM users INNER JOIN (
        SELECT matches.id as gameid,playera,playerb,users.name as ponename,playera_played,playerb_played 
        FROM matches
        INNER JOIN users ON users.id = matches.playera) as res
    ON users.id = res.playerb
    WHERE ponename = $1 OR users.name = $1
    `, id);

    return res.rows;
};

const setfinalurl = async (url) => {
    await executeQuery("UPDATE finalurl SET url = $1 WHERE id = 1", url);
};

const getfinalurl = async (id) => {
    const res = await executeQuery("SELECT * FROM finalurl WHERE id = $1", id);

    return res.rows[0];
};

export {
    addResulttoDB,
    getUserId,
    addUser,
    addStats,
    updateStats,
    getStats,
    checkMatch,
    addMatch,
    setfinalurl,
    getfinalurl,
    getmatchhistory
}