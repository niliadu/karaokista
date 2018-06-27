import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";


import Index from "./pages/Index"; 
import Songslist from "./pages/Songslist";
import Setlist from "./pages/Setlist";

class App extends Component {
  render() {
    return (
          <div>
            <Switch>
              <Route exact path='/' component={Index}/>
              <Route path='/songslist' component={Songslist}/>
              <Route path='/setlist' component={Setlist}/>

            </Switch>
          </div>
    );
  }
}

export default App;
