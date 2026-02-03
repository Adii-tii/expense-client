import { CLEAR_USER, SET_USER } from "./action";

export const useReducer = (state = null, action) => {
    switch(action.type) {
        //helps in login functionality
        case SET_USER:
            return action.payload;
        // helps in logout functionality
        case CLEAR_USER:
            return null;
        default:
            return state;
            // this case helps in handling cases where userREducer is invoked due to change in some other state variable maintained by redux
    }   
}

export default useReducer;