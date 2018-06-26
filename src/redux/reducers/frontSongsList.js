import { toast } from "react-toastify";
import store from "../store";

export default function frontSongsListReducer(state={}, action){
    switch(action.type){
        case "USER_ADDED_SONG":{
            if(store.getState().global.currentView != "songslist") break;
            
            toast.success('Your song was received. Just await for the confirmation in the setlist', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            break;
        }
    }
    return state;
}