import fire from "../../fireInit"
import store from '../store'
import * as setlistActions from "./setlist";

export function toggleLive(deleteAll){
    fire.database().ref('/global/').update({liveIsON: !store.getState().global.liveIsON});
    if(deleteAll){
        fire.database().ref('/setlist/current').remove();
        fire.database().ref('/setlist/pending').remove();
        setlistActions.getCurrentSongs();
        setlistActions.getPendingSongs();
    }
}