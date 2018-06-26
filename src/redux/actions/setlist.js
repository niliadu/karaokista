import fire from "../../fireInit"
import store from '../store'

export function getCurrentSongs(){
    fire.database().ref('/setlist/current').once('value', snap => {
        store.dispatch({
            type: "CURRENT_SONGS_RECEVIED",
            value: snap.val()
        });
    });
}

export function addToCurrent(songs){
    let newSongs = {};//necessary to add multiple songs at once
    songs.forEach(song => {
        newSongs[fire.database().ref().push().key] = song;
    });
    
    fire.database().ref('/setlist/current').update(newSongs);
}

export function moveCurrent(songs){
    fire.database().ref('/setlist/current').set(songs).then(async()=>{
        await getCurrentSongs();
    });
}

export function updateCurrent(id, song){
    fire.database().ref('/setlist/current').child(id).update(song);
}

export function removeCurrent(id){
    fire.database().ref('/setlist/current').child(id).remove();
}

export function getPendingSongs(){
    fire.database().ref('/setlist/pending').once('value', snap => {
        store.dispatch({
            type: "PENDING_SONGS_RECEVIED",
            value: snap.val()
        });
    });
}