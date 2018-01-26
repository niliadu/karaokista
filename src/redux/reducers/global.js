export default function globalReducer(state={
    liveIsON: false
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
                ...global
                };
            break;
        }
    }
    return state;
}