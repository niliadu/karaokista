import fire from "../../fireInit"
import store from '../store'

export function getLiveIsON(){
    fire.database().ref('/global/liveIsON').once('value', snap => {
        
        store.dispatch({
            type: "LIVE_ON_RECEVIED",
            value: snap.val()
        });
    });
}

export function setCurrentAdminView(view){
    store.dispatch({
        type: "CURRENT_VIEW_SET",
        value: view
    });
}