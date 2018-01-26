import fire from "../../fireInit"
import store from '../store'

export function getGlobals(){
    fire.database().ref('/global/').once('value', snap => {
        store.dispatch({
            type: "GLOBALS_RECEVIED",
            value: snap.val()
        });
    });
}

export function toggleLive(){
    fire.database().ref('/global/').update({liveIsON: !store.getState().global.liveIsON});
}