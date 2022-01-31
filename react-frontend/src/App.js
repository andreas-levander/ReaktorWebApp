import React, {useEffect, useState} from "react";
import Livegames from "./components/Livegames";
import Profile from "./components/Profile";
import ProfileForm from "./components/ProfileForm";

function App() {
  const URL = "ws://localhost:7777/ws";

  const [livegames, setLiveGames] = useState([]);
  const [ws, setWebSocket] = useState(new WebSocket(URL));
  const [profile, setProfile] = useState({});
  const [formname, setFormName] = useState("");

  useEffect(() => {

    ws.onopen = ((event) => {
      console.log("websocket opened")
    })
    
    ws.onmessage = ((event) => {
      const message = event.data;
      const json = JSON.parse(message);
      console.log(json);

      if (json.type === "GAME_BEGIN") {
        setLiveGames(livegames.concat(json))
    } else if (json.type === "LIVE_DATA") {
        setLiveGames(json.games);
    } else if (json.type === "GAME_RESULT") {
        setLiveGames(livegames.filter(game => game.gameId !== json.gameId));
    } else if (json.type === "PROFILE") {
        setProfile(json);
    }

    return () => {
      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setWebSocket(new WebSocket(URL));
      }
    }

    })
  }, [ws.onopen, ws.onmessage, ws.onclose, livegames, ws]);


  const onNameClick = (name) => {
    if (profile.name === name) return;
    requestProfileData(name);
  }

  const requestProfileData = (name) => {

    const data = {
        type: "REQUEST_PROFILE",
        name: name,
    }
    const json = JSON.stringify(data);
    ws.send(json);
  }

  const handleProfileForm = (event) => {
    event.preventDefault();

    onNameClick(formname);
  }


  return (
    <div className="App">
     <h1>Reaktor Webapp</h1>
     <Livegames livegames={livegames} onNameClick={onNameClick}/>
     <ProfileForm handleProfileForm={handleProfileForm} setFormName={setFormName} formname={formname}/>
     <Profile profile={profile} onNameClick={onNameClick}/>
    </div>
  );
}


export default App;
