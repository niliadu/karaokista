import fire from "../../fireInit"
import store from '../store'

export function getMusics(){
    fire.database().ref('/musics').orderByChild("name").once('value', snap => {
        
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

export function addMusic(music){
    fire.database().ref('/musics').push(music);
}

export function updateMusic(id, music){
    fire.database().ref('/music').child(id).update(music);
}

export function removeMusic(id){
    fire.database().ref('/musics').child(id).remove();
}