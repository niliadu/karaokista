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
    currentSongsList: store.setlist.current
  }
})

class Dashboard extends Component {
  constructor(){
    super();
    this.state = {
      modalOpen: false,
      modalEditCurrentOpen: false,
      searchedSongs: {},
      searchInputValue: "",
      enableSave: false,
      selectedSongs: [],
      promptOpen : false
    };
  }

  componentWillMount(){
    globalActions.setCurrentAdminView("dashboard");
    dashboardActions.getGlobals();
    musicsActions.getMusics();
    artistsActions.getArtists();
    setlistActions.getCurrentSongs();
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      ...this.state,
      searchedSongs : nextProps.songsList
    });
  }

  toggleModal(type){
    if(type == "editCurrent"){
      this.setState({
        modalEditCurrentOpen: !this.state.modalEditCurrentOpen
      });
    }else if(type == "prompt"){
      this.setState({
        promptOpen: !this.state.promptOpen
      });
    }else{
      this.setState({
        modalOpen: !this.state.modalOpen,
        selectedSongs:[]
      });
    }
  }

  toggleLive(){
    dashboardActions.toggleLive();
  }

  searchSong(e){
    const searchValue = e.target.value.toLowerCase();
    let newList = {};

    if(searchValue == ""){
      newList = this.props.songsList;
    }else{
      for(const id in this.props.songsList){
        
        const song = this.props.songsList[id].name.toLowerCase();
        const artist = this.props.artistsList[this.props.songsList[id].artist].name.toLowerCase();

        if(song.indexOf(searchValue) !== -1 || artist.indexOf(searchValue) !== -1) newList[id] = this.props.songsList[id];
      }
    }

    this.setState({
      ...this.state,
      searchInputValue: searchValue,
      searchedSongs: newList,
    },
    this.checkEnableSave);
  }

  toggleSelecteSong(id){
    let { selectedSongs } = this.state;
    const index = selectedSongs.indexOf(id);
    index == -1 ? selectedSongs.push(id) : selectedSongs.splice(index,1);
    
    this.setState({
      ...this.state,
      selectedSongs,
    },
    this.checkEnableSave);
  }

  checkEnableSave(){
    const { searchInputValue, selectedSongs } = this.state;
    const enableSave = (searchInputValue != "" || selectedSongs.length > 0);
    
    this.setState({
      ...this.state,
      enableSave
    });
  }

  async addToCurrentSongs(promptAnswer){
    const { artistsList, songsList, currentSongsList } = this.props;
    const { enableSave, selectedSongs, se } = this.state;
    let  mappedselectedSongs = [];
    if(!enableSave) return;
    
    if(promptAnswer == true){// needs to be this way

      // this part get the response of the prompt modal that asks if the user wants to add the
      // search text as a current song
      mappedselectedSongs.push({
        title: this.state.searchInputValue,
        order: Object.keys(currentSongsList).length
      });
    }else if(selectedSongs.length == 0){
      //calls the prompt that asks if the user wants to add the
      // search text as a current song
      this.toggleModal("prompt");
      
      return;//exits this function instance to prevent saving
    }else{
        mappedselectedSongs = selectedSongs.map((id, i) => {
        const song = songsList[id];
        return {
          title: song.name + " - " + artistsList[song.artist].name,
          order: Object.keys(currentSongsList).length + i
        };
      });
    }
    
    await this.toggleModal();// was givin a error when treated async
    setlistActions.addToCurrent(mappedselectedSongs);
    
  }

  render() {
    const {
      liveIsON,
      artistsList, 
      songsList,
      currentSongsList
    } = this.props;
    
    const {
      modalOpen, 
      searchInputValue, 
      searchedSongs,
      enableSave,
      selectedSongs
    } =  this.state;

    const liveButtonColor = liveIsON ? 'success': '' ;
    const onOff = liveIsON ? "ON" : "OFF";
    
    const mappedSelectedSongsListAdd = Object.keys(songsList).filter(id => selectedSongs.indexOf(id) > -1).map((id, i) =>{
      return (
        <Row key={"add_modal_row_selected_"+i}>
          <Col size="12" onClick={this.toggleSelecteSong.bind(this,id)}>
            <h5>
              <i className="icon-check" style={{visibility: "visible"}}/>
              &nbsp;&nbsp;
              {songsList[id].name} - {artistsList[songsList[id].artist].name}
              
            </h5>
          </Col>
        </Row>
      );
    });

    const mappedSongListAdd = Object.keys(searchedSongs).filter(id => selectedSongs.indexOf(id) === -1).map((id, i) =>{
      return (
        <Row key={"add_modal_row_"+i}>
          <Col size="12" onClick={this.toggleSelecteSong.bind(this,id)}>
            <h5>
              <i className="icon-check" style={{visibility: "hidden"}}/>
              &nbsp;&nbsp;
              {searchedSongs[id].name} - {artistsList[searchedSongs[id].artist].name}
            </h5>
          </Col>
        </Row>
      );
    });

    const mappedCurrentSongsList = Object.keys(currentSongsList).map((id, i) =>{
      return (
        <Row key={"current_row_"+i}>
          <Col size="12">
            <h5>
              {currentSongsList[id].title}
              <ItemMenuList
                className="pull-right"
                id={id} 
                edit={this.toggleModal.bind(this, "edit", id)}
                //delete={this.removeArtist.bind(this,id)}
              />
            </h5>
          </Col>
        </Row>
      );
    });

    return (
      <div className="animated fadeIn">
        <Button color={liveButtonColor} onClick={this.toggleLive}>Live Stream {onOff}</Button>
        <br/>
        <br/>
        <div className="card">
          <div className="card-header">
            <i className="icon-playlist"/>
            Current Songs&nbsp;&nbsp;
            <i id="addSongModalButton" className="btn icon-plus font-success" onClick={this.toggleModal.bind(this,"add")}></i>
          </div>
          <div className="card-body">
            {mappedCurrentSongsList}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <i className="icon-playlist"/>
            Pending&nbsp;&nbsp;
          </div>
          <div className="card-body">
            ////
          </div>
        </div>
        <Modal
          isOpen={modalOpen}
          toggle={this.toggleModal.bind(this)}
          style={{maxHeight:"100vh"}}
        >
          <ModalHeader toggle={this.toggleModal.bind(this)}>Add Song to playlist</ModalHeader>
          <ModalBody style={{maxHeight:"80vh"}}>
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
            <br/>
            <Row>
              <Col sm="12" style={{cursor: 'pointer'}}>
                {mappedSelectedSongsListAdd}
              </Col>
            </Row>
            { mappedSelectedSongsListAdd.length > 0 &&
              <Row>
                <Col sm="12">
                  <hr/>
                </Col>
              </Row>
            }
            <Row>
              <Col sm="12" style={
                {
                  height: 'auto',
                  maxHeight:"60vh",
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
            <Button color="success" className={(enableSave ? "" : "disabled")+" pull-right"} onClick={this.addToCurrentSongs.bind(this)}>Save</Button>
          </ModalFooter>
        </Modal>
        <PromptModal 
          isOpen={this.state.promptOpen} 
          toggle={this.toggleModal.bind(this, "prompt")}
          isConfirm={true}
          confirmAction={this.addToCurrentSongs.bind(this, true)}       
          title={"Are you sure that you want to add '"+ this.state.searchInputValue +"' as a song?"}
        />
      </div>
    )
  }
}

export default Dashboard;
