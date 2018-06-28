import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import PrivateRoute from "./components/PrivateRoute"
// Styles
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss'

// Containers
import Admin from './app/admin/Admin'
import Login from './app/admin/views/Login'
import Site from './app/site/Site'
import Page404 from './app/site/pages/Page404'

import store from './redux/store'

ReactDOM.render((
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <PrivateRoute path="/admin" component={Admin}/>
        <Route path="/login" component={Login}/>
        <Route path="/" name="Site" component={Site}/>
        <Route component={Page404}/>
      </Switch>
    </HashRouter>
  </Provider>
), document.getElementById('root'));
