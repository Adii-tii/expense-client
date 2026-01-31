import { useState } from "react";

function CreateGroup(){

    const[groupData, setGroupData] = useState({
        name:'',
        description:'',
        adminEmail:'',
        memberEmail:'',
        thumbnail:'',
    });

    setGroupData

    return(
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="bg-gray-200 justify-content-center px-5 py-5" style={{width:"500px"}}>
                <form className="bg-gray-200 mb-2 ">
                
                <label htmlFor="name">Group Name</label>
                <input
                required
                type="text"
                name="name"
                placeholder="Group name"
                value={groupData.name}
                className="form-control mb-2">
                </input>
                
                <label htmlFor="name">Group Name</label>
                <textarea
                type="text"
                name="description"
                value={groupData.description}
                placeholder="Group description"
                className="form-control mb-2"
                required>
                </textarea>

                <label htmlFor="name">Group Name</label>
                <input
                type="text"
                name="adminEmail"
                value={groupData.description}
                placeholder="user@gmail.com"
                className="form-control mb-2"
                disabled
                required/>
                <input/>

                <label htmlFor="name">Add Members</label>
                

            </form>

            </div>
            
        </div>
    )
}

export default CreateGroup;