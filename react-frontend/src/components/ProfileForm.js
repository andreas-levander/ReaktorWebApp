const ProfileForm = ({handleProfileForm, setFormName, formname}) => {
    return (
      <form id="profileform" onSubmit={handleProfileForm}>
          <input type="text" id="formtext" value={formname} onChange={(event) => setFormName(event.target.value)}/>
          <input type="submit" value="Get Profile"/>
      </form>
    )
  }

  export default ProfileForm;