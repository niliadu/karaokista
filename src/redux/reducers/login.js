import { toast } from "react-toastify";
import store from "../store";

export default function loginReducer(state={
    loggedIn: false,
}, action){
    switch(action.type){
        case "USER_LOGGED_IN":{
            state = {
                ...state,
                loggedIn: true
            };
            break;
        }
        case "USER_LOGGED_OUT":{
            state = {
                ...state,
                loggedIn: false
            };
            break;
        }
        case "ERROR_LOGGING_IN":{
            if(store.getState().global.currentView != "login") break;

            toast.error('Invalid Email or Password!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            break;
        }
    }
    return state;
}