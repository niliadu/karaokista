import React, { Component } from 'react';
import {
  Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Input,
  Container, Row, Col
} from 'reactstrap';
import ItemMenuList from "../../../components/ItemMenuList";
import PromptModal from "../../../components/PromptModal";

import store from "../../../redux/store";
import { connect } from 'react-redux';

import * as dashboardActions from "../../../redux/actions/dashboard";
import * as globalActions from "../../../redux/actions/global";
import * as musicsActions from "../../../redux/actions/musics";
import * as artistsActions from "../../../redux/actions/artists";
import * as setlistActions from "../../../redux/actions/setlist";

@connect((store) => {
  return {
    liveIsON: store.global.liveIsON,
    songsList: store.musics.list,
    artistsList: store.artists.list,
    currentSongsList: store.setlist.current,
    pendingSongsList: store.setlist.pending
  }
})

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      searchedSongs: {},
      searchInputValue: "",
      enableSave: false,
      selectedSongs: [],
      selectedSongsSinger: {},
      promptOpen: false,
      promptLiveOpen: false,
      editCurrentId: "",
      modalEditCurrentOpen: false,
      modalEditCurrentName: "",
      modalEditCurrentArtist: "",
      modalEditCurrentSinger: ""
    };
  }

  componentWillMount() {
    globalActions.setCurrentAdminView("dashboard");
    dashboardActions.getGlobals();
    musicsActions.getMusics();
    artistsActions.getArtists();
    setlistActions.getCurrentSongs();
    setlistActions.getPendingSongs();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      searchedSongs: nextProps.songsList
    });
  }

  toggleModal(type, id) {
    switch (type) {
      case "editCurrent": {
        const open = this.state.modalEditCurrentOpen;
        if (!open) {
          const song = this.props.currentSongsList[id];
          this.setState({
            ...this.state,
            modalEditCurrentOpen: !open,
            editCurrentId: id,
            modalEditCurrentName: song.name,
            modalEditCurrentArtist: song.artistName,
            modalEditCurrentSinger: song.singer
          });
        } else {
          this.setState({
            ...this.state,
            modalEditCurrentOpen: !open,
          });
        }
        break;
      }
      case "prompt": {
        this.setState({
          ...this.state,
          promptOpen: !this.state.promptOpen
        });
        break;
      }
      case "promptLive": {
        this.setState({
          ...this.state,
          promptLiveOpen: !this.state.promptLiveOpen
        });
        break;
      }
      default: {
        this.setState({
          ...this.state,
          modalOpen: !this.state.modalOpen,
          selectedSongs: []
        });
      }
    }
  }

  toggleLive() {
    if(this.props.liveIsON){
      this.toggleModal('promptLive');
    }else{
      dashboardActions.toggleLive();
    }
  }

  searchSong(e) {
    const searchValue = e.target.value.toLowerCase();
    let newList = {};

    if (searchValue == "") {
      newList = this.props.songsList;
    } else {
      for (const id in this.props.songsList) {

        const song = this.props.songsList[id].name.toLowerCase();
        const artist = this.props.artistsList[this.props.songsList[id].artist].name.toLowerCase();

        if (song.indexOf(searchValue) !== -1 || artist.indexOf(searchValue) !== -1) newList[id] = this.props.songsList[id];
      }
    }

    this.setState({
      ...this.state,
      searchInputValue: searchValue,
      searchedSongs: newList,
    },
      this.checkEnableSave);
  }

  toggleSelecteSong(id) {
    let { selectedSongs, selectedSongsSinger } = this.state;
    const index = selectedSongs.indexOf(id);
    if (index == -1) {
      selectedSongs.push(id);
      selectedSongsSinger[id] = "";
    } else {
      selectedSongs.splice(index, 1);
      delete selectedSongsSinger[id];
    }

    this.setState({
      ...this.state,
      selectedSongs,
      selectedSongsSinger
    },
      this.checkEnableSave);
  }

  checkEnableSave() {
    const { searchInputValue, selectedSongs } = this.state;
    const enableSave = (searchInputValue != "" || selectedSongs.length > 0);

    this.setState({
      ...this.state,
      enableSave
    });
  }


  selectedSongsSingerChange(id, e) {
    let selectedSongsSinger = this.state.selectedSongsSinger;
    selectedSongsSinger[id] = e.target.value

    this.setState({
      ...this.state,
      selectedSongsSinger
    });
  }

  async addToCurrentSongs(promptAnswer) {
    const { artistsList, songsList, currentSongsList } = this.props;
    const { enableSave, selectedSongs, selectedSongsSinger } = this.state;
    
    let mappedselectedSongs = [];
    if (!enableSave) return;

    if (promptAnswer == true) {// needs to be this way

      // this part get the response of the prompt modal that asks if the user wants to add the
      // search text as a current song
      mappedselectedSongs.push({
        title: this.state.searchInputValue,
        order: Object.keys(currentSongsList).length,
        singer: ""
      });
    } else if (selectedSongs.length == 0) {
      //calls the prompt that asks if the user wants to add the
      // search text as a current song
      this.toggleModal("prompt");

      return;//exits this function instance to prevent saving
    } else {
      mappedselectedSongs = selectedSongs.map((id, i) => {
        const song = songsList[id];
        return {
          name: song.name,
          artistName: artistsList[song.artist].name,
          singer: selectedSongsSinger[id],
          order: Object.keys(currentSongsList).length + i
        };
      });
    }

    await this.toggleModal();// was givin a error when treated async
    setlistActions.addToCurrent(mappedselectedSongs);

  }

  validateEdit(e) {
    const name = e.target.name;
    const value = e.target.value;

    let enable = (name == "modalEditCurrentArtist") ? this.state.enableSave : true;

    if (name != "modalEditCurrentArtist" && (value == undefined || value == "")) enable = false;

    this.setState({
      ...this.state,
      enableSave: enable,
      [name]: value
    });
  }

  async saveEditCurrentSong() {
    const id = this.state.editCurrentId;
    let song = this.props.currentSongsList[id];

    song.name = this.state.modalEditCurrentName;
    song.artistName = this.state.modalEditCurrentArtist;
    song.singer = this.state.modalEditCurrentSinger;

    await setlistActions.updateCurrent(id, song);
    this.toggleModal("editCurrent");
  }

  async removeCurrentSong(id) {
    await setlistActions.removeCurrent(id);
  }

  moveCurrentSong(id, up) {
    let songs = this.props.currentSongsList;
    let oldPos = songs[id].order;
    let newPos = oldPos;

    if (up && (oldPos - 1) >= 0) newPos = oldPos - 1;
    else if (!up && (oldPos + 1) < Object.keys(this.props.currentSongsList).length) newPos = oldPos + 1;

    for (let i in songs) {
      if (songs[i].order == oldPos) songs[i].order = newPos;
      else if (songs[i].order == newPos) songs[i].order = oldPos;
    }
    setlistActions.moveCurrent(songs);
    
  }

  fromPendingToCurrent(id){
    const song = [{
      ...this.props.pendingSongsList[id],
      order: Object.keys(this.props.currentSongsList).length + 1
    }];

    setlistActions.fromPendingToCurrent(id,song);
  }

  removePendingSong(id) {
    setlistActions.removePending(id);
  }

  render() {
    const {
      liveIsON,
      artistsList,
      songsList,
      currentSongsList,
      pendingSongsList
    } = this.props;

    const {
      modalOpen,
      modalEditCurrentOpen,
      searchInputValue,
      selectedSongsSinger,
      searchedSongs,
      enableSave,
      selectedSongs,
      modalEditCurrentName,
      modalEditCurrentArtist,
      modalEditCurrentSinger
    } = this.state;

    const liveButtonColor = liveIsON ? 'success' : '';
    const onOff = liveIsON ? "ON" : "OFF";

    const mappedSelectedSongsListAdd = Object.keys(songsList).filter(id => selectedSongs.indexOf(id) > -1).map((id, i) => {
      return (
        <div key={"add_modal_row_selected_" + i} style={{ marginBottom: '0.5em' }}>
          <Row>
            <Col size="12" onClick={this.toggleSelecteSong.bind(this, id)}>
              <h6>
                <i className="icon-check" style={{ visibility: "visible" }} />
                &nbsp;&nbsp;
                {songsList[id].name} - {artistsList[songsList[id].artist].name}

              </h6>
            </Col>
          </Row>
          <Row >
            <Col size="12">
              <Input
                key={"singer_name_" + i}
                type="text"
                placeholder="Singer name"
                onChange={this.selectedSongsSingerChange.bind(this, id)}
                value={selectedSongsSinger[id]}
              />
            </Col>
          </Row>
        </div>
      );
    });

    const mappedSongListAdd = Object.keys(searchedSongs).filter(id => selectedSongs.indexOf(id) === -1).map((id, i) => {
      return (
        <Row key={"add_modal_row_" + i}>
          <Col size="12" onClick={this.toggleSelecteSong.bind(this, id)}>
            <h5>
              <i className="icon-check" style={{ visibility: "hidden" }} />
              &nbsp;&nbsp;
              {searchedSongs[id].name} - {artistsList[searchedSongs[id].artist].name}
            </h5>
          </Col>
        </Row>
      );
    });

    //arrange the current songs by its order
    let orderMapCurrentSongs = [];
    Object.keys(currentSongsList).forEach(id => orderMapCurrentSongs[currentSongsList[id].order] = id);

    const mappedCurrentSongsList = orderMapCurrentSongs.map((id, i) => {
      return (
        <Row key={"current_row_" + i}>
          <Col size="12">
            <h6>
              {currentSongsList[id].singer + " - \"" + currentSongsList[id].name + "\" by "} <em>{currentSongsList[id].artistName}</em>
              <ItemMenuList
                className="pull-right"
                id={id}
                edit={this.toggleModal.bind(this, "editCurrent", id)}
                delete={this.removeCurrentSong.bind(this, id)}
                move={this.moveCurrentSong.bind(this, id)}
              />
            </h6>
          </Col>
        </Row>
      );
    });

    const mappedPendingSongsList = Object.keys(pendingSongsList).map((id, i) => {
      return (
        <Row key={"current_row_" + i}>
          <Col size="12">
            <h6>
              {pendingSongsList[id].singer + " - \"" + pendingSongsList[id].name + "\" by "} <em>{pendingSongsList[id].artistName}</em>
              <ItemMenuList
                className="pull-right"
                id={id}
                accept={this.fromPendingToCurrent.bind(this,id)}
                delete={this.removePendingSong.bind(this, id)}
              />
            </h6>
          </Col>
        </Row>
      );
    });

    return (
      <div className="animated fadeIn">
        <Button color={liveButtonColor} onClick={this.toggleLive.bind(this)}>Live Stream {onOff}</Button>
        <br />
        <br />
        <div className="card">
          <div className="card-header">
            <i className="icon-playlist" />
            Current Songs&nbsp;&nbsp;
            {liveIsON && <i id="addSongModalButton" className="btn icon-plus font-success" onClick={this.toggleModal.bind(this, "add")}></i>}
          </div>
          <div className="card-body">
            {mappedCurrentSongsList}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <i className="icon-playlist" />
            Pending&nbsp;&nbsp;
          </div>
          <div className="card-body">
            {mappedPendingSongsList}
          </div>
        </div>
        <Modal
          isOpen={modalOpen}
          toggle={this.toggleModal.bind(this)}
          style={{ maxHeight: "100vh" }}
        >
          <ModalHeader toggle={this.toggleModal.bind(this)}>Add Song to playlist</ModalHeader>
          <ModalBody style={{ maxHeight: "80vh" }}>
            <Row>
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
            <br />
            <Row>
              <Col sm="12" style={{ cursor: 'pointer' }}>
                {mappedSelectedSongsListAdd}
              </Col>
            </Row>
            {mappedSelectedSongsListAdd.length > 0 &&
              <Row>
                <Col sm="12">
                  <hr />
                </Col>
              </Row>
            }
            <Row>
              <Col sm="12" style={
                {
                  height: 'auto',
                  maxHeight: "60vh",
                  overflowY: 'scroll',
                  cursor: 'pointer'
                }
              }
              >
                {mappedSongListAdd}
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" className={(enableSave ? "" : "disabled") + " pull-right"} onClick={this.addToCurrentSongs.bind(this)}>Save</Button>
          </ModalFooter>
        </Modal>
        <PromptModal
          isOpen={this.state.promptOpen}
          toggle={this.toggleModal.bind(this, "prompt")}
          isConfirm={true}
          confirmAction={this.addToCurrentSongs.bind(this, true)}
          title={"Are you sure that you want to add '" + this.state.searchInputValue + "' as a song?"}
        />
        <PromptModal
          isOpen={this.state.promptLiveOpen}
          toggle={this.toggleModal.bind(this, "promptLive")}
          isConfirm={true}
          confirmAction={dashboardActions.toggleLive.bind(this, true)}
          title={"This will delete all songs! Do you wish to turn it off?"}
        />

        <Modal
          isOpen={modalEditCurrentOpen}
          toggle={this.toggleModal.bind(this, "editCurrent")}
          style={{ maxHeight: "100vh" }}
        >
          <ModalHeader toggle={this.toggleModal.bind(this, "editCurrent")}>Edit Current Song</ModalHeader>
          <ModalBody style={{ maxHeight: "80vh" }}>
            <Row>
              <div className="col-md-12">
              </div>
              <Col sm="12">
                <label>Song: </label>
                <Input
                  name="modalEditCurrentName"
                  type="text"
                  placeholder="Song"
                  onChange={this.validateEdit.bind(this)}
                  value={modalEditCurrentName}
                />
              </Col>
              <Col sm="12">
                <label>Artist: </label>
                <Input
                  name="modalEditCurrentArtist"
                  type="text"
                  placeholder="Artist"
                  onChange={this.validateEdit.bind(this)}
                  value={modalEditCurrentArtist}
                />
              </Col>
              <Col sm="12">
                <label>Singer: </label>
                <Input
                  name="modalEditCurrentSinger"
                  type="text"
                  placeholder="Singer Name"
                  onChange={this.validateEdit.bind(this)}
                  value={modalEditCurrentSinger}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" className={(enableSave ? "" : "disabled") + " pull-right"} onClick={this.saveEditCurrentSong.bind(this)}>Save</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default Dashboard;
