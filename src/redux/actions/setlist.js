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

// export function updateMusic(id, music){
//     fire.database().ref('/musics').child(id).update(music);
// }

// export function removeMusic(id){
//     fire.database().ref('/musics').child(id).remove();
// }