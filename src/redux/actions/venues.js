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

export function addNewVenue(name){
    fire.database().ref('/venues').push({name});
}

export function removeVenue(id){
    fire.database().ref('/venues').child(id).remove();
}