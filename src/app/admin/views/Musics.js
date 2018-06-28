import React, { Component } from 'react';
import {
  Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Label,
  Input,
  Container, Row, Col
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
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      editingId: null,
      enableSave: false,
      modalTitle: "",
      modalNameValue: "",
      modalSelectedArtist: null,
      selectedOrder: 0,
      searchInputValue: "",
      searchedMusics: {},
      orderedSearchedMusics: {},

    };
  }
  componentWillMount() {
    globalActions.setCurrentAdminView("musics");
    musicsActions.getMusics();
    artistsActions.getArtists();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      searchedMusics: nextProps.musics.list,
      orderedSearchedMusics: nextProps.musics.list,
    });
  }

  toggleModal(type, id) {

    let {
      modalOpen,
      modalTitle,
      editingId,
      enableSave,
      modalNameValue,
      modalSelectedArtist
    } = this.state;

    enableSave = false;
    modalNameValue = "";

    switch (type) {
      case "add": {
        modalTitle = "New Music";
        editingId = null;
        modalSelectedArtist = null;
        break;
      }
      case "edit": {
        modalTitle = "Edit Music";
        editingId = id;
        enableSave = true;

        modalNameValue = this.props.musics.list[id].name;
        modalSelectedArtist = this.props.musics.list[id].artist;
        break;
      }
    }

    this.setState({
      ...this.state,
      modalOpen: modalOpen ? false : true,
      modalTitle,
      editingId,
      enableSave,
      modalNameValue,
      modalSelectedArtist,
    });
  }

  handleSelectChange(selectedOption) {
    this.setState({
      ...this.state,
      modalSelectedArtist: selectedOption,
    },
      this.validateMusic);
  }

  handleSelectOrder(selectedOption) {

    switch (selectedOption) {
      case 0: {
        this.setState({
          ...this.state,
          orderedSearchedMusics: this.state.searchedMusics,
          selectedOrder: selectedOption
        });
        break;
      }
      case 1: {
        let orderedSearchedMusics = {};
        const list = this.state.searchedMusics;

        for (const artistId in this.props.artistsList) {

          Object.keys(list).filter((musicId) => list[musicId].artist == artistId)
            .forEach(musicId => {
              orderedSearchedMusics[musicId] = list[musicId];
            });
        }

        this.setState({
          ...this.state,
          orderedSearchedMusics,
          selectedOrder: selectedOption
        });
      }
    }
  }

  validateMusic() {
    const musics = this.props.musics.list;
    const editingId = this.state.editingId;

    const name = this.modalName.value;
    let enable = true;

    if (name == undefined || name == "") enable = false;

    if (!this.state.modalSelectedArtist) enable = false;

    for (let id in musics) {
      if (
        musics[id].name.toLowerCase() == name.toLowerCase()
        && musics[id].artist == this.state.modalSelectedArtist
        && editingId != id) enable = false;
    }

    this.setState({
      ...this.state,
      enableSave: enable,
      modalNameValue: name,
    });
  }

  saveMusic() {
    if (!this.state.enableSave) return;

    this.setState({
      ...this.state,
      modalOpen: false
    },
      function () {
        const music = {
          name: this.modalName.value,
          artist: this.state.modalSelectedArtist
        };
        this.state.editingId ? musicsActions.updateMusic(this.state.editingId, music) : musicsActions.addMusic(music);
      }.bind(this));//need this approach because it was not closing the modal after saving the new music
  }

  removeMusic(id) {
    musicsActions.removeMusic(id);
  }

  searchMusic(e) {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue == "") {
      this.setState({
        ...this.state,
        searchInputValue: searchValue,
        searchedMusics: this.props.musics.list
      },
        this.handleSelectOrder.bind(this, this.state.selectedOrder)
      );

      return;
    }

    let newList = {};

    for (const id in this.props.musics.list) {

      const music = this.props.musics.list[id].name.toLowerCase();
      const artist = this.props.artistsList[this.props.musics.list[id].artist].name.toLowerCase();

      if (music.indexOf(searchValue) !== -1 || artist.indexOf(searchValue) !== -1) newList[id] = this.props.musics.list[id];
    }

    this.setState({
      ...this.state,
      searchInputValue: searchValue,
      searchedMusics: newList
    },
      this.handleSelectOrder.bind(this, this.state.selectedOrder)
    );
  }

  render() {
    const {
      dispatch,
      artistsList
    } = this.props;

    const list = this.state.orderedSearchedMusics;

    const {
      enableSave,
      modalOpen,
      modalTitle,
      modalNameValue,
      searchInputValue
    } = this.state;

    const mappedList = Object.keys(list).filter((id, i) => i < 100).map((id, i) => {
      return (
        <div className="row" key={"row_" + i}>
          <div className="col-md-12">
            <h5>
              {list[id].name} - {artistsList[list[id].artist].name}
              <ItemMenuList
                className="pull-right"
                id={id}
                edit={this.toggleModal.bind(this, "edit", id)}
                delete={this.removeMusic.bind(this, id)}
              />
            </h5>
          </div>
        </div>
      );
    });

    const mappedArtistsList = Object.keys(artistsList).filter((id, i) => i < 100).map((id, i) => {
      return {
        value: id,
        label: artistsList[id].name
      };
    });

    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">
            <Row>
              <Col sm="3">
                <i className="icon-music-tone-alt" />
                &nbsp;&nbsp;Musics List&nbsp;&nbsp;
                <i id="addModalButton" className="btn icon-plus font-success" onClick={this.toggleModal.bind(this, "add")} />
              </Col>
              <Col sm={{ size: 4, offset: 5 }}>
                <div className="pull-right">
                  <span>Order by:&nbsp;</span>
                  <Select
                    options={[{ value: 0, label: "Music" }, { value: 1, label: "Artist" }]}
                    handler={this.handleSelectOrder.bind(this)}
                    width="200px"
                    selected={this.state.selectedOrder}
                    size="sm"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <Input
                  key="searchInput"
                  type="text"
                  placeholder="Search here"
                  onChange={this.searchMusic.bind(this)}
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
          <ModalHeader toggle={this.toggleModal.bind(this)}>{modalTitle}</ModalHeader>
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
              <br />
              <Select
                label="Select an Artist"
                options={mappedArtistsList}
                handler={this.handleSelectChange.bind(this)}
                search
                selected={this.state.modalSelectedArtist}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="success" className={(enableSave ? "" : "disabled") + " pull-right"} onClick={this.saveMusic.bind(this)}>Save</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default Musics;
