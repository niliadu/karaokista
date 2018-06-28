import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom'

import store from "../redux/store";
import { connect } from 'react-redux';

@connect((store) => {
  return {
    loggedIn: store.login.loggedIn
  };
})

export default class PrivateRoute extends Component {

  render() {
    return (
      <Route {...this.rest} render={(props) => {

        if (this.props.loggedIn) return <this.props.component {...this.props} />;
        else return <Redirect to="/login" />;
      }} />
    );
  }
}