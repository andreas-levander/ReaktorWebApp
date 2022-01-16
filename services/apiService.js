import { addToDB } from "../controllers/apiController.js";
import { setfinalurl } from "./dbService.js";

let finalurl = "";

const fetchReaktorData = async (url) => {
    
    //fetch historydata
    const response = await fetch("https://bad-api-assignment.reaktor.com" + url);
    const body = await response.json();
    const next = body.cursor;

    await setfinalurl(url);
    
    console.log(`Going over ${body.data.length} entries`);
    
    for (let i = 0;i<body.data.length;i++) {
        await addToDB(body.data[i]);
        //console.log("added to db: "+ body.data[i]);
    }
    


    console.log(`done with ${url}`);
    finalurl = url;
    
    if(next) {
        console.log(`going to ${next}`);
        await fetchReaktorData(next);
    }
}

    



export {fetchReaktorData, finalurl}