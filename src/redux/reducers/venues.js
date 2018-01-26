import { toast } from "react-toastify";

export default function venuesReducer(state={
    firstLoad: true,
    list: {}
}, action){
    switch(action.type){
        case "VENUES_RECEVIED":{
            state = {
                ...state,
                firstLoad: false,
                list: action.value ? action.value : {}
            };
            break;
        }
        case "ADDED_VENUE":{
            toast.success('Venue "' + action.value.name + '" was added successfully!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            break;
        }
        case "REMOVED_VENUE":{
            toast.warn('Venue "' + action.value.name + '" was removed successfully!', {
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