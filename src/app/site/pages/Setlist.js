import React, { Component } from 'react';
import {
  Button,
  Container, Row, Col
} from 'reactstrap';
import { Link } from "react-router-dom";

import store from "../../../redux/store";
import { connect } from 'react-redux';

import * as globalActions from "../../../redux/actions/global";
import * as setlistActions from "../../../redux/actions/setlist";

@connect((store) => {
  return {
    liveIsON: store.global.liveIsON,
    currentSongsList: store.setlist.current,
  }
})

class Setlist extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
    globalActions.setCurrentAdminView("setlist");
    setlistActions.getCurrentSongs();
  }

  render() {
    const {
      liveIsON,
      currentSongsList,
    } = this.props;

    const liveButtonColor = liveIsON ? 'success' : '';
    const onOff = liveIsON ? "ON" : "OFF";

    //arrange the current songs by its order
    let orderMapCurrentSongs = [];
    Object.keys(currentSongsList).forEach(id => orderMapCurrentSongs[currentSongsList[id].order] = id);

    const mappedCurrentSongsList = orderMapCurrentSongs.map((id, i) => {
      return (
        <Row key={"current_row_" + i}>
          <Col size="12">
            <h6>
              {currentSongsList[id].singer + " - \"" + currentSongsList[id].name + "\" by "} <em>{currentSongsList[id].artistName}</em>
            </h6>
          </Col>
        </Row>
      );
    });

    return (
      <Container>
        <br />
        <br />
        <div className="animated fadeIn">
          <Link to="/songslist" >GO TO SONGS LIST</Link>
          <Button color={liveButtonColor} className="pull-right">Live Stream {onOff}</Button>
          <br />
          <br />
          <div className="card">
            <div className="card-header">
              <i className="icon-playlist" />
              Current Songs&nbsp;&nbsp;
            </div>
            <div className="card-body">
              {mappedCurrentSongsList}
            </div>
          </div>
        </div>
      </Container>
    )
  }
}

export default Setlist;
