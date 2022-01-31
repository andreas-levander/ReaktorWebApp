const NameButton = ({onNameClick, name}) => (
    <button onClick={()=> onNameClick(name)}>{name}</button>
  );

  export default NameButton;