import fire from "../../fireInit"
import store from '../store'

export function getMusics(){
    fire.database().ref('/songs').orderByChild("name").once('value', snap => {
        
        let snapVal = {};
        snap.forEach(child =>{
            snapVal[child.key] = child.val();
        });
        
        store.dispatch({
            type: "MUSICS_RECEVIED",
            value: snapVal
        });
    });
}

export function addMusic(song){
    fire.database().ref('/songs').push(song);
}

export function updateMusic(id, song){
    fire.database().ref('/songs').child(id).update(song);
}

export function removeMusic(id){
    fire.database().ref('/songs').child(id).remove();
}