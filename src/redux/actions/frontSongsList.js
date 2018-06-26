import fire from "../../fireInit"

export function addArtist(song){
    console.log(song);
    fire.database().ref('/setlist/pending').push(song);
}