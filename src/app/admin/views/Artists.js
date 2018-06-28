import React, { Component } from 'react';
import {
  Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Label,
  Input,
  Row, Col
} from 'reactstrap';
import ItemMenuList from "../../../components/ItemMenuList";

import store from "../../../redux/store";
import { connect } from 'react-redux';

import * as artistsActions from "../../../redux/actions/artists";
import * as globalActions from "../../../redux/actions/global";

@connect((store) => {
  return { ...store.artists };
})

class Artists extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      editingId: null,
      enableSave: false,
      modalTitle: "",
      modalNameValue: "",
      searchInputValue:"",
      searchedArtists: {}
    };
  }
  componentWillMount() {
    globalActions.setCurrentAdminView("artists");
    artistsActions.getArtists();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      searchedArtists: nextProps.list,
    });
  }

  toggleModal(type, id) {
    let {
      modalOpen,
      modalTitle,
      editingId,
      enableSave,
      modalNameValue,
    } = this.state;

    enableSave = false;
    modalNameValue = "";

    switch (type) {
      case "add": {
        modalTitle = "New Artist";
        editingId = null;
        break;
      }
      case "edit": {
        modalTitle = "Edit Artist";
        editingId = id;
        enableSave = true;

        modalNameValue = this.props.list[id].name;
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


  validateArtist() {
    const artists = this.props.list;
    const editingId = this.state.editingId;

    const name = this.modalName.value;

    let enable = true;

    if (name == undefined || name == "") enable = false;

    for (let id in artists) {
      if (artists[id].name.toLowerCase() == name.toLowerCase() && editingId != id) enable = false;
    }

    this.setState({
      ...this.state,
      enableSave: enable,
      modalNameValue: name,
    });
  }

  saveArtist() {
    if (!this.state.enableSave) return;

    const artist = {
      name: this.modalName.value,
    };
    this.state.editingId ? artistsActions.updateArtist(this.state.editingId, artist) : artistsActions.addArtist(artist);
    this.toggleModal();
  }

  removeArtist(id) {
    artistsActions.removeArtist(id);
  }

  searchArtist(e) {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue == "") {
      this.setState({
        ...this.state,
        searchInputValue: searchValue,
        searchedArtists: this.props.list
      });

      return;
    }

    let newList = {};

    for (const id in this.props.list) {

      const artist = this.props.list[id].name.toLowerCase();

      if (artist.indexOf(searchValue) !== -1) newList[id] = this.props.list[id];
    }

    this.setState({
      ...this.state,
      searchInputValue: searchValue,
      searchedArtists: newList
    });
  }

  render() {
    const {
      list
    } = this.props;

    const {
      enableSave,
      modalOpen,
      modalTitle,
      modalNameValue,
      searchInputValue,
      searchedArtists
    } = this.state;

    const mappedList = Object.keys(searchedArtists).filter((id, i) => i < 100).map((id, i) => {
      return (
        <div className="row" key={"row_" + i}>
          <div className="col-md-12">
            <h5>
              {searchedArtists[id].name}
              <ItemMenuList
                className="pull-right"
                id={id}
                edit={this.toggleModal.bind(this, "edit", id)}
                delete={this.removeArtist.bind(this, id)}
              />
            </h5>
          </div>
        </div>
      );
    });

    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">
            <i className="icon-people" />
            Artists List&nbsp;&nbsp;
            <i id="addModalButton" className="btn icon-plus font-success" onClick={this.toggleModal.bind(this, "add")}></i>
            <Row>
              <Col sm="12">
                <Input
                  key="searchInput"
                  type="text"
                  placeholder="Search here"
                  onChange={this.searchArtist.bind(this)}
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
                placeholder="Enter the artist name"
                onChange={this.validateArtist.bind(this)}
                value={modalNameValue}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="success" className={(enableSave ? "" : "disabled") + " pull-right"} onClick={this.saveArtist.bind(this)}>Save</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default Artists;
