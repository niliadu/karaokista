import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";


import Index from "./pages/Index"; 
import Songslist from "./pages/Songslist";

class App extends Component {
  render() {
    return (
          <div>
            <Switch>
              <Route exact path='/' component={Songslist}/>
              {/* <Route path='/songslist' component={Songslist}/> */}
            </Switch>
          </div>
    );
  }
}

export default App;
