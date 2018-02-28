import { toast } from "react-toastify";
import store from "../store";

export default function venuesReducer(state={
    firstLoad: true,
    list: {},
}, action){
    switch(action.type){
        case "ARTISTS_RECEVIED":{
            state = {
                ...state,
                firstLoad: false,
                list: action.value ? action.value : {},
            };
            break;
        }
        case "ADDED_ARTIST":{
            if(store.getState().global.currentView != "artists") break;

            toast.success('Artist "' + action.value.name + '" was added!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            break;
        }
        case "UPDATED_ARTIST":{
            if(store.getState().global.currentView != "artists") break;

            toast.warn('Artist "' + action.value.name + '" was updated!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            break;
        }
        case "REMOVED_ARTIST":{
            if(store.getState().global.currentView != "artists") break;

            toast.warn('Artist "' + action.value.name + '" was removed!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: {
                    color: "black"
                },
            });
            break;
        }
z    }
    return state;
}