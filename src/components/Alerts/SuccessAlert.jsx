function SuccessAlert({isOpenAlert, setIsOpenAlert}) {
    if(!isOpenAlert) return;
    return (
        <div className="alert alert-success d-flex align-items-center" role="alert">
            <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill" /></svg>
            <div>
                Group Created Successfully!
            </div>
        </div>
    )
}

export default SuccessAlert;