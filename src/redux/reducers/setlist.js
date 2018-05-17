import { toast } from "react-toastify";
import store from "../store";

export default function setlistReducer(state={
    firstLoad: true,
    current: {},
}, action){
    switch(action.type){
        case "CURRENT_SONGS_RECEVIED":{
            state = {
                ...state,
                firstLoad: false,
                current: action.value ? action.value : {},
            };
            break;
        }
        case "ADDED_CURRENT_SONGS":{
            if(store.getState().global.currentView != "dashboard") break;

            toast.success('Songs were added to the current setlist!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            break;
        }
        // case "UPDATED_MUSIC":{
        //     if(store.getState().global.currentView != "musics") break;

        //     toast.warn('Music "' + action.value.name + '" was updated!', {
        //         position: toast.POSITION.BOTTOM_RIGHT
        //     });
        //     break;
        // }
        // case "REMOVED_MUSIC":{
        //     if(store.getState().global.currentView != "musics") break;

        //     toast.warn('Music "' + action.value.name + '" was removed!', {
        //         position: toast.POSITION.BOTTOM_RIGHT,
        //         className: {
        //             color: "black"
        //         },
        //     });
        //     break;
        // }
    }
    return state;
}