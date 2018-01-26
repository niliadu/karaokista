import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";


import Index from "./pages/Index"; 

class App extends Component {
  render() {
    return (
          <div>
            <Switch>
              <Route exact path='/' component={Index}/>
            </Switch>
          </div>
    );
  }
}

export default App;
