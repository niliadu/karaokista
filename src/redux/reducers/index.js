import { combineReducers } from 'redux';

import global from "./global";
import venues from "./venues";
import artists from "./artists";

export default combineReducers({global, venues, artists});