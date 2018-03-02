import { toast } from "react-toastify";
import store from "../store";

export default function musicsReducer(state={
    firstLoad: true,
    list: {},
}, action){
    switch(action.type){
        case "MUSICS_RECEVIED":{
            state = {
                ...state,
                firstLoad: false,
                list: action.value ? action.value : {},
            };
            break;
        }
        case "ADDED_MUSIC":{
            if(store.getState().global.currentView != "musics") break;

            toast.success('Music "' + action.value.name + '" was added!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            break;
        }
        case "UPDATED_MUSIC":{
            if(store.getState().global.currentView != "musics") break;

            toast.warn('Music "' + action.value.name + '" was updated!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            break;
        }
        case "REMOVED_MUSIC":{
            if(store.getState().global.currentView != "musics") break;

            toast.warn('Music "' + action.value.name + '" was removed!', {
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