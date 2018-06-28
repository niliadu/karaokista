import { combineReducers } from 'redux';

import global from "./global";
import venues from "./venues";
import artists from "./artists";
import musics from "./musics";
import setlist from "./setlist";
import frontSongsList from "./frontSongsList";
import login from "./login";

export default combineReducers({
    global, 
    venues, 
    artists,
    musics, 
    setlist,
    frontSongsList,
    login
});