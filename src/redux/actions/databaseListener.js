import fire from "../../fireInit";
import store from "../store";
import * as venues from "./venues";
import * as artists from "./artists";
import * as musics from "./musics";
import * as setlist from "./setList";

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

fire.database().ref('/venues/').on('child_changed', async(snap) => {
    if(store.getState().venues.firstLoad) return
    
    await venues.getVenues();
    
    store.dispatch({
        type: "UPDATED_VENUE",
        value: snap.val()
    });            
});

fire.database().ref('/artists/').on('child_added', async(snap) => {
    if(store.getState().artists.firstLoad) return
    
    await artists.getArtists();
    
    store.dispatch({
        type: "ADDED_ARTIST",
        value: snap.val()
    });            
});

fire.database().ref('/artists/').on('child_removed', async(snap) => {
    if(store.getState().artists.firstLoad) return

    await artists.getArtists();

    store.dispatch({
        type: "REMOVED_ARTIST",
        value: snap.val()
    });            
});

fire.database().ref('/artists/').on('child_changed', async(snap) => {
    if(store.getState().artists.firstLoad) return

    await artists.getArtists();

    store.dispatch({
        type: "UPDATED_ARTIST",
        value: snap.val()
    });            
});

fire.database().ref('/musics/').on('child_added', async(snap) => {
    if(store.getState().musics.firstLoad) return
    
    await musics.getMusics();
    
    store.dispatch({
        type: "ADDED_MUSIC",
        value: snap.val()
    });            
});

fire.database().ref('/musics/').on('child_removed', async(snap) => {
    if(store.getState().musics.firstLoad) return

    await musics.getMusics();

    store.dispatch({
        type: "REMOVED_MUSIC",
        value: snap.val()
    });            
});

fire.database().ref('/musics/').on('child_changed', async(snap) => {
    if(store.getState().artists.firstLoad) return

    await musics.getMusics();

    store.dispatch({
        type: "UPDATED_MUSIC",
        value: snap.val()
    });            
});

fire.database().ref('/setlist/current').on('child_added', async(snap) => {
    if(store.getState().setlist.firstLoad) return
    
    await setlist.getCurrentSongs();
    
    store.dispatch({
        type: "ADDED_CURRENT_SONGS",
    });            
});

fire.database().ref('/setlist/current').on('child_changed', async(snap) => {
    if(store.getState().setlist.firstLoad) return
    
    await setlist.getCurrentSongs();
    
    store.dispatch({
        type: "UPDATED_CURRENT_SONG",
        value: snap.val()
    });            
});

fire.database().ref('/setlist/current').on('child_removed', async(snap) => {
    if(store.getState().musics.firstLoad) return

    await setlist.getCurrentSongs();

    store.dispatch({
        type: "REMOVED_CURRENT_SONG",
        value: snap.val()
    });            
});