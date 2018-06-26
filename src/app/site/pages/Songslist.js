import React, { Component } from 'react';
import { ToastContainer } from "react-toastify";
import {
  Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Label,
  Input,
  Container, Row, Col
} from 'reactstrap';
import Select from "../../../components/Select";

import store from "../../../redux/store";
import { connect } from 'react-redux';

import * as songsActions from "../../../redux/actions/musics";
import * as artistsActions from "../../../redux/actions/artists";
import * as globalActions from "../../../redux/actions/global";
import * as songsListActions from "../../../redux/actions/frontSongsList";

@connect((store) => {
  return {
    songs: store.musics,
    artistsList: store.artists.list
  };
})

class Songslist extends Component {
  constructor() {
    super();
    this.state = {
      enableSave: false,
      selectedOrder: 0,
      searchInputValue: "",
      searchedSongs: {},
      orderedSearchedSongs: {},
      songToAddInSetlist: undefined,
      modalOpen: false,
      modalSingerNameValue: "",
    };
  }
  componentWillMount() {
    globalActions.setCurrentAdminView("songslist");
    songsActions.getMusics();
    artistsActions.getArtists();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      searchedSongs: nextProps.songs.list,
      orderedSearchedSongs: nextProps.songs.list,
    });
  }

  toggleModal(song) {

    this.setState({
      ...this.state,
      modalOpen: !this.state.modalOpen,
      enableSave: false,
      songToAddInSetlist: song,
      modalSingerNameValue: "",
    });
  }

  handleSelectChange(selectedOption) {
    this.setState({
      ...this.state,
      modalSelectedArtist: selectedOption,
    },
      this.validateSong);
  }

  handleSelectOrder(selectedOption) {

    switch (selectedOption) {
      case 0: {
        this.setState({
          ...this.state,
          orderedSearchedSongs: this.state.searchedSongs,
          selectedOrder: selectedOption
        });
        break;
      }
      case 1: {
        let orderedSearchedSongs = {};
        const list = this.state.searchedSongs;

        for (const artistId in this.props.artistsList) {

          Object.keys(list).filter((songId) => list[songId].artist == artistId)
            .forEach(songId => {
              orderedSearchedSongs[songId] = list[songId];
            });
        }

        this.setState({
          ...this.state,
          orderedSearchedSongs,
          selectedOrder: selectedOption
        });
      }
    }
  }

  searchSong(e) {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue == "") {
      this.setState({
        ...this.state,
        searchInputValue: searchValue,
        searchedSongs: this.props.songs.list
      },
        this.handleSelectOrder.bind(this, this.state.selectedOrder)
      );

      return;
    }

    let newList = {};

    for (const id in this.props.songs.list) {

      const song = this.props.songs.list[id].name.toLowerCase();
      const artist = this.props.artistsList[this.props.songs.list[id].artist].name.toLowerCase();

      if (song.indexOf(searchValue) !== -1 || artist.indexOf(searchValue) !== -1) newList[id] = this.props.songs.list[id];
    }

    this.setState({
      ...this.state,
      searchInputValue: searchValue,
      searchedSongs: newList
    },
      this.handleSelectOrder.bind(this, this.state.selectedOrder)
    );
  }

  validateSingerName(){
    const name = this.modalSingerName.value;
    let enable = true;

    if(name == undefined || name == "") enable = false;
    
    this.setState({
      ...this.state, 
      enableSave: enable,
      modalSingerNameValue : name,
    });
  }

  addSongToPendingSetlist(){
    const {
      songToAddInSetlist,
      modalSingerNameValue,
      enableSave
    } = this.state;

    if(!enableSave) return;

    songsListActions.addArtist({...songToAddInSetlist, singer: modalSingerNameValue});
    store.dispatch({
        type: "USER_ADDED_SONG"
    });
    this.toggleModal();
  }

  render() {
    const {
      artistsList
    } = this.props;

    const list = this.state.orderedSearchedSongs;

    const {
      enableSave,
      searchInputValue,
      modalOpen,
      modalSingerNameValue,
      songToAddInSetlist
    } = this.state;

    const mappedList = Object.keys(list).map((id, i) => {
      return (
        <div className="row" key={"row_" + i}>
          <div className="col-md-10">
            <h6 style={{ cursor: "pointer" }}>
              {list[id].name} - {artistsList[list[id].artist].name}
            </h6>
          </div>
          <Col md='2' className='pull-right'>
            <i id={'add_song_' + i} className="btn icon-plus font-success pull-right" onClick={this.toggleModal.bind(this, list[id])} />
          </Col>
        </div>
      );
    });
    
    const modalSelectedSong = (songToAddInSetlist) ? songToAddInSetlist.name + " - " + artistsList[songToAddInSetlist.artist].name : "";

    return (
      <Container>
        <br />
        <div className="animated fadeIn">
          <div className="card">
            <div className="card-header">
              <Row>
                <Col sm="3">
                  <i className="icon-music-tone-alt" />
                  &nbsp;&nbsp;Songs List&nbsp;&nbsp;
                        </Col>
                <Col sm={{ size: 4, offset: 5 }}>
                  <div className="pull-right">
                    <span>Order by:&nbsp;</span>
                    <Select
                      options={[{ value: 0, label: "Song" }, { value: 1, label: "Artist" }]}
                      handler={this.handleSelectOrder.bind(this)}
                      width="200px"
                      selected={this.state.selectedOrder}
                      size="sm"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <br />
                <Col sm="12">
                  <Input
                    key="searchInput"
                    type="text"
                    placeholder="Search here"
                    onChange={this.searchSong.bind(this)}
                    value={searchInputValue}
                  />
                </Col>
              </Row>
            </div>
            <div className="card-body">
              {mappedList}
            </div>
          </div>
          <Modal isOpen={modalOpen} toggle={this.toggleModal.bind(this)}>
            <ModalHeader toggle={this.toggleModal.bind(this)}>Add Song to Setlist</ModalHeader>
            <ModalBody>
              <h6>{modalSelectedSong}</h6>
              <div className="col-md-12">
                <label>Singer(s):</label>
                <input
                  key="singerModal"
                  ref={(_this) => this.modalSingerName = _this}
                  type="text"
                  className="form-control"
                  placeholder="Enter singer(s) name(s)"
                  onChange={this.validateSingerName.bind(this)}
                  value={modalSingerNameValue}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="success" className={(enableSave ? "" : "disabled") + " pull-right"} onClick={this.addSongToPendingSetlist.bind(this)}>Add</Button>
            </ModalFooter>
          </Modal>
        </div>
        <ToastContainer/>
      </Container>
    )
  }
}

export default Songslist;
