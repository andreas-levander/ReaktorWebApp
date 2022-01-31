import NameButton from "./NameButton";

const Livegames = ({livegames, onNameClick}) => {
    return (
      <div id="livegames">
      <h3>Live games</h3>
      <ul>
        {livegames.map(game => (
          <li key={game.gameId}>
          <NameButton onNameClick={onNameClick} name={game.playerA.name}/>
           vs 
          <NameButton onNameClick={onNameClick} name={game.playerB.name}/>
          </li>))}
      </ul>
      </div>
    )
  }


  export default Livegames;
  
  