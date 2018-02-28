import fire from "../../fireInit"
import store from '../store'

export function getArtists(){
    fire.database().ref('/artists').orderByChild("name").once('value', snap => {
        
        let snapVal = {};
        snap.forEach(child =>{
            snapVal[child.key] = child.val();
        });
        
        store.dispatch({
            type: "ARTISTS_RECEVIED",
            value: snapVal
        });
    });
}

export function addArtist(artist){
    fire.database().ref('/artists').push(artist);
}

export function updateArtist(id, artist){
    fire.database().ref('/artists').child(id).update(artist);
}

export function removeArtist(id){
    fire.database().ref('/artists').child(id).remove();
}