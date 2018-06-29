export default function globalReducer(state={
    liveIsON: false,
    currentView: ""
}, action){
    switch(action.type){
        case "LIVE_IS_ON_CHANGED":{
            state = {
                ... state,
                    liveIsON: action.value
                };
            break;
        }
        case "LIVE_ON_RECEVIED":{
            state = {
                ...state,
                liveIsON: action.value
                };
            break;
        }
        case "CURRENT_VIEW_SET":{
            state = {
                ...state,
                currentView: action.value
                };
            break;
        }
    }
    return state;
}