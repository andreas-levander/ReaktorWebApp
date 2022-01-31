import NameButton from "./NameButton";

const Profile = ({profile, onNameClick}) => {
    if (Object.keys(profile).length < 1) return null;
  
    if(profile.name === 'NOT FOUND') return <p>Profile not found</p>
  
    return (
      <div id ="profile">
        <h3>Profile: {profile.name}</h3>
        <StatLine stat={"Games played: "} data={profile.matches_played}/>
        <StatLine stat={"Winrate: "} data={profile.winrate} extra={"%"}/>
        <StatLine stat={"Most played hand: "} data={profile.mostplayed.hand} extra={`played ${profile.mostplayed.times} times`}/>
        <GamesList games={profile.match_history} onNameClick={onNameClick}/>
  
      </div>
    )
  }
  
  const StatLine = ({stat, data, extra}) => (<p><b>{stat}</b>{data} {extra}</p>);
  
  const GamesList = ({games, onNameClick}) => {
    return (
      <ul id="game_history">
      {games.map(game => 
        <li key={game.gameid}>{game.gameid} 
        <NameButton onNameClick={onNameClick} name={game.ponename}/>  
        {game.playera_played} vs {game.playerb_played} 
        <NameButton onNameClick={onNameClick} name={game.ptwoname}/> 
        </li>
      )}</ul>)
  }

  export default Profile;