import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";


import Index from "./pages/Index"; 
import Songslist from "./pages/Songslist";
import Setlist from "./pages/Setlist";
import Page404 from "./pages/Page404"

class App extends Component {
  render() {
    return (
          <div>
            <Switch>
              <Route exact path='/' component={Index}/>
              <Route path='/songslist' component={Songslist}/>
              <Route path='/setlist' component={Setlist}/>
              <Route component={Page404}/>
            </Switch>
          </div>
    );
  }
}

export default App;
