import { toast } from "react-toastify";
import store from "../store";

export default function venuesReducer(state={
    firstLoad: true,
    list: {},
}, action){
    switch(action.type){
        case "VENUES_RECEVIED":{
            state = {
                ...state,
                firstLoad: false,
                list: action.value ? action.value : {},
            };
            break;
        }
        case "ADDED_VENUE":{
            if(store.getState().global.currentView != "venues") break;

            toast.success('Venue "' + action.value.name + '" was added!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            break;
        }
        case "UPDATED_VENUE":{
            if(store.getState().global.currentView != "venues") break;

            toast.warn('Venue "' + action.value.name + '" was updated!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            break;
        }
        case "REMOVED_VENUE":{
            if(store.getState().global.currentView != "venues") break;

            toast.warn('Venue "' + action.value.name + '" was removed!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: {
                    color: "black"
                },
            });
            break;
        }
    }
    return state;
}