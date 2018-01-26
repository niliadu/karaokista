import fire from "../../fireInit"
import store from "../store"
import * as venues from "./venues"

//get changes in the root of 
fire.database().ref('/global/').on('child_changed', snap => {
    switch(snap.key){
        case 'liveIsON':{
            store.dispatch({
                type: "LIVE_IS_ON_CHANGED",
                value: snap.val()
            });            
            break;
        }
    }
});

fire.database().ref('/venues/').on('child_added', async(snap) => {
        if(store.getState().venues.firstLoad) return
        
        await venues.getVenues();
        
        store.dispatch({
            type: "ADDED_VENUE",
            value: snap.val()
        });            
});

fire.database().ref('/venues/').on('child_removed', async(snap) => {
    if(store.getState().venues.firstLoad) return
    
    await venues.getVenues();
    
    store.dispatch({
        type: "REMOVED_VENUE",
        value: snap.val()
    });            
});