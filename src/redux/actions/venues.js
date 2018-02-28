import fire from "../../fireInit"
import store from '../store'

export function getVenues(){
    fire.database().ref('/venues').orderByChild("name").once('value', snap => {
        
        let snapVal = {};
        snap.forEach(child =>{
            snapVal[child.key] = child.val();
        });
        
        store.dispatch({
            type: "VENUES_RECEVIED",
            value: snapVal
        });
    });
}

export function addVenue(venue){
    fire.database().ref('/venues').push(venue);
}

export function updateVenue(id, venue){
    fire.database().ref('/venues').child(id).update(venue);
}

export function removeVenue(id){
    fire.database().ref('/venues').child(id).remove();
}