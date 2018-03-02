import React, { Component } from 'react';
import { 
  Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Label,
  Input,
} from 'reactstrap';
import ItemMenuList from "../../../components/ItemMenuList";
import Select from "../../../components/Select";

import store from "../../../redux/store";
import { connect } from 'react-redux';

import * as musicsActions from "../../../redux/actions/musics";
import * as artistsActions from "../../../redux/actions/artists";
import * as globalActions from "../../../redux/actions/global";

@connect((store) => {
  return {
    musics: store.musics,
    artistsList: store.artists.list
  };
})

class Musics extends Component {
  constructor(){
    super();
    this.state = {
      modalOpen: false,
      editingId: null,
      enableSave: false,
      modalTitle: "",
      modalNameValue: "",
      modalSelectedArtist : ""
    };
  }
  componentWillMount(){
    globalActions.setCurrentAdminView("musics");
    musicsActions.getMusics();
    artistsActions.getArtists();
  }
  
  toogleModal(type, id){
    let {
      modalOpen, 
      modalTitle, 
      editingId, 
      enableSave,
      modalNameValue,
    } = this.state;

    enableSave = false;
    modalNameValue = "";
    
    switch(type){
      case "add":{
        modalTitle = "New Music";
        editingId = null;
        break;
      }
      case "edit":{
        modalTitle = "Edit Music";
        editingId = id;
        enableSave = true;
        
        modalNameValue = this.props.musics.list[id].name;
        break;
      }
    }
    this.setState({
      ...this.state, 
      modalOpen: !modalOpen, 
      modalTitle,
      editingId,
      enableSave,
      modalNameValue
    });
  }

  handleSelectChange(selectOption){
    this.setState({
      ...this.state, 
      modalSelectedArtist: selectOption, 
    });
  }

  validateMusic(){
    const musics = this.props.musics.list;
    const editingId = this.state.editingId;

    const name = this.modalName.value;
    
    let enable = true;

    if(name == undefined || name == "") enable = false;
    
    for(let id in musics){
      if(musics[id].name.toLowerCase() == name.toLowerCase() && editingId != id) enable = false;
    }

    this.setState({
      ...this.state, 
      enableSave: enable,
      modalNameValue : name,
    });
  }

  saveMusic(){
    if(!this.state.enableSave) return;

    const music = {
      name: this.modalName.value,
      artist : ""
    };
    this.state.editingId ? musicsActions.updateMusic(this.state.editingId, music) :  musicsActions.addMusic(music);
    this.toogleModal();
  }

  removeMusic(id){
    musicsActions.removeMusic(id);
  }

  selected(value){
    console.log(value);
  }

  render() {
    const {
      dispatch,
      musics,
      artistsList
    } = this.props;

    const list = musics.list;

    const {
      enableSave,
      modalOpen,
      modalTitle,
      modalNameValue,
    } = this.state;
    
    const mappedList = Object.keys(list).map((id, i) =>{
        return (
        <div className="row" key={"row_"+i}>
          <div className="col-md-12">
            <h5>
              {list[id].name}
              <ItemMenuList
                className="pull-right"
                id={id} 
                edit={this.toogleModal.bind(this, "edit", id)}
                delete={this.removeMusic.bind(this,id)}
              />
            </h5>
          </div>
        </div>
      );
    });

    const mappedArtistsList = Object.keys(artistsList).map((id, i) =>{
      return {
        value: id,
        label : artistsList[id].name
      };
    });
    
    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">
            <i className="icon-music-tone-alt"/>
            Musics List&nbsp;&nbsp;
            <i id="addModalButton" className="btn icon-plus font-success" onClick={this.toogleModal.bind(this,"add")}></i>
          </div>
          <div className="card-body">
            {mappedList}
          </div>
        </div>
        <Modal isOpen={modalOpen} toggle={this.toogleModal.bind(this)}>
          <ModalHeader toggle={this.toogleModal.bind(this)}>{modalTitle}</ModalHeader>
          <ModalBody>
            <div className="col-md-12">
              <label>Name:</label>
              <input
                key="nameModal"
                ref={(_this) => this.modalName = _this} 
                type="text" 
                className="form-control" 
                placeholder="Enter the music name"
                onChange={this.validateMusic.bind(this)}
                value={modalNameValue}
              />
            </div>
            <div className="col-md-12">
              <br/>
              <Select
                label="Select an Artist"
                options={mappedArtistsList}
                handler={this.selected.bind(this)}
                width="100%"
                search
                />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="success" className={(enableSave ? "" : "disabled")+" pull-right"} onClick={this.saveMusic.bind(this)}>Save</Button>
          </ModalFooter>
      </Modal>
      </div>
    )
  }
}

export default Musics;
