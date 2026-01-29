
const UserCard=  (props) =>{
  return(
    <>
      <h1>{props.name}</h1>
      {props.isPremium && 
        (
          <p>VIP Member </p>
        )
      }

      {!props.isPremium && (
        <p>Standard Member</p>
      )}
    </>
  )
}

export default UserCard;