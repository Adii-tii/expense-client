function Dashboard({user}){
    return(
        <>
            <h1>welcome {user.username}, this is the dashboard!</h1>
            {console.log(user)}
        </>
    )
};

export default Dashboard;