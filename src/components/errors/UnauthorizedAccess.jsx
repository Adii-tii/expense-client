function UnauthorizedAccess(){
    return(
        <div className="container p-5">
            <h2>Unauthorized Access</h2>
            <p className="text-muted">
                You do not have the permission to view this page.
                Contact your admin for further assistance.
            </p>
        </div>
    )
}

export default UnauthorizedAccess;