import React, { Component } from 'react';
import {
  Button
} from 'reactstrap';

import store from "../../../redux/store";
import { connect } from 'react-redux';

import * as dashboardActions from "../../../redux/actions/dashboard";

@connect((store) => {
  return {
    liveIsON: store.global.liveIsON,
  }
})

class Dashboard extends Component {
  
  componentWillMount(){
    dashboardActions.getGlobals();
  }

  toggleLive(){
    dashboardActions.toggleLive();
  }

  render() {
    const { dispatch, liveIsON } = this.props;
    
    const liveButtonColor = liveIsON ? 'success': '' ;
    const onOff = liveIsON ? "ON" : "OFF";
    
    return (
      <div className="animated fadeIn">
        <Button color={liveButtonColor} onClick={this.toggleLive}>Live Stream {onOff}</Button>
      </div>
    )
  }
}

export default Dashboard;
