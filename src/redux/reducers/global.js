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
        case "GLOBALS_RECEVIED":{
            global = action.value;
            state = {
                ...global,
                currentView: state.currentView
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