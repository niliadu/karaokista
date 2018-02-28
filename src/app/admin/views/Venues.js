import React, { Component } from 'react';
import { 
  Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Label,
  Input,
} from 'reactstrap';
import ItemMenuList from "../../../components/ItemMenuList";

import store from "../../../redux/store";
import { connect } from 'react-redux';

import * as venuesdActions from "../../../redux/actions/venues";
import * as globalActions from "../../../redux/actions/global";

@connect((store) => {
  return {...store.venues};
})

class Venues extends Component {
  constructor(){
    super();
    this.state = {
      modalOpen: false,
      editingId: null,
      enableSave: false,
      checkedDays: {
        Sunday: false,
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday : false,
        Friday: false,
        Saturday: false
      },
      modalTitle: "",
      modalNameValue: "",
      modalAddressValue: ""
    };
  }
  componentWillMount(){
    globalActions.setCurrentAdminView("venues");
    venuesdActions.getVenues();
  }
  
  toogleModal(type, id){
    let {
      modalOpen, 
      checkedDays, 
      modalTitle, 
      editingId, 
      enableSave,
      modalNameValue,
      modalAddressValue
    } = this.state;

    checkedDays = {
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday : false,
      Friday: false,
      Saturday: false
    };
    enableSave = false;
    modalNameValue = "";
    modalAddressValue = "";
    
    switch(type){
      case "add":{
        modalTitle = "New Venue";
        editingId = null;
        break;
      }
      case "edit":{
        modalTitle = "Edit Venue";
        editingId = id;
        enableSave = true;

        const venue = this.props.list[id];
        modalNameValue = venue.name;
        modalAddressValue = venue.address;
        checkedDays = venue.days;
        break;
      }
    }
    this.setState({
      ...this.state, 
      modalOpen: !modalOpen, 
      checkedDays,
      modalTitle,
      editingId,
      enableSave,
      modalNameValue,
      modalAddressValue
    });
  }


  validateVenue(){
    const venues = this.props.list;
    const editingId = this.state.editingId;
    const checkedDays = this.state.checkedDays;

    const name = this.modalName.value;
    const address = this.modalAddress.value;
    
    let enable = true;

    if(
      name == undefined || name == "" ||
      address == undefined || address == ""
    ) enable = false;
    
    for(let id in venues){
      if(venues[id].name.toLowerCase() == name.toLowerCase() && editingId != id) enable = false;
    }


    let anyChecked = false;
    for(let day in checkedDays){
      if(checkedDays[day]) anyChecked = true;
    }
    if(!anyChecked) enable = false;;

    this.setState({
      ...this.state, 
      enableSave: enable,
      modalNameValue : name,
      modalAddressValue: address
    });
  }

  saveVenue(){
    if(!this.state.enableSave) return;

    const venue = {
      name: this.modalName.value,
      address: this.modalAddress.value,
      days: this.state.checkedDays
    };
    this.state.editingId ? venuesdActions.updateVenue(this.state.editingId, venue) :  venuesdActions.addVenue(venue);
    this.toogleModal();
  }

  removeVenue(id){
    venuesdActions.removeVenue(id);
  }

  checkDay(day){
    let days = this.state.checkedDays;

    days[day] = !days[day]

    this.setState({...this.state, selectedDays: days});

    this.validateVenue();
  }

  render() {
    const {
      dispatch,
      list
    } = this.props;

    const {
      enableSave,
      modalOpen,
      modalTitle,
      checkedDays,
      modalNameValue,
      modalAddressValue
    } = this.state;
    
    const mappedList = Object.keys(list).map((id, i) =>{
        let days = [];
        for(let day in list[id].days){
          if(list[id].days[day]) days.push(day);
        }
        return (
        <div className="row" key={"row_"+i}>
          <div className="col-md-12">
            <h5>
              {list[id].name} - {days.join(" - ")}
              <ItemMenuList
                className="pull-right"
                id={id} 
                edit={this.toogleModal.bind(this, "edit", id)}
                delete={this.removeVenue.bind(this,id)}
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
            <i className="icon-location-pin"/>
            Venues List&nbsp;&nbsp;
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
                placeholder="Enter the venue name"
                onChange={this.validateVenue.bind(this)}
                value={modalNameValue}
              />
            </div>
            <div className="col-md-12">
              <label>Address:</label>
              <input
                key="addAddressInput"
                ref={(_this) => this.modalAddress = _this} 
                type="text" 
                className="form-control" 
                placeholder="Enter the venue address"
                onChange={this.validateVenue.bind(this)}
                value={modalAddressValue}
              />
            </div>
            <br/>
            <div className="col-md-12">
              <label>Performing on:</label>
              <div className="col-md-12 row">
                <Label className="switch switch-icon switch-success-outline-alt">
                  <Input
                    type="checkbox"
                    className="switch-input"
                    onChange={this.checkDay.bind(this, "Sunday")}
                    checked={checkedDays.Sunday}
                  />
                  <span className="switch-label" data-on={'\uf00c'} data-off={'\uf00d'}></span>
                  <span className="switch-handle"></span>
                </Label>
                <label>&nbsp;&nbsp;Sunday</label>
              </div>
              <div className="col-md-12 row">
                <Label className="switch switch-icon switch-success-outline-alt">
                  <Input 
                    type="checkbox" 
                    className="switch-input" 
                    onChange={this.checkDay.bind(this, "Monday")}
                    checked={checkedDays.Monday}
                  />
                  <span className="switch-label" data-on={'\uf00c'} data-off={'\uf00d'}></span>
                  <span className="switch-handle"></span>
                </Label>
                <label>&nbsp;&nbsp;Monday</label>
              </div>
              <div className="col-md-12 row">
                <Label className="switch switch-icon switch-success-outline-alt">
                  <Input 
                    type="checkbox" 
                    className="switch-input" 
                    onChange={this.checkDay.bind(this, "Tuesday")}
                    checked={checkedDays.Tuesday}
                  />
                  <span className="switch-label" data-on={'\uf00c'} data-off={'\uf00d'}></span>
                  <span className="switch-handle"></span>
                </Label>
                <label>&nbsp;&nbsp;Tuesday</label>
              </div>
              <div className="col-md-12 row">
                <Label className="switch switch-icon switch-success-outline-alt">
                  <Input 
                    type="checkbox" 
                    className="switch-input" 
                    onChange={this.checkDay.bind(this, "Wednesday")}
                    checked={checkedDays.Wednesday}
                  />
                  <span className="switch-label" data-on={'\uf00c'} data-off={'\uf00d'}></span>
                  <span className="switch-handle"></span>
                </Label>
                <label>&nbsp;&nbsp;Wednesday</label>
              </div>
              <div className="col-md-12 row">
                <Label className="switch switch-icon switch-success-outline-alt">
                  <Input 
                    type="checkbox" 
                    className="switch-input"
                    onChange={this.checkDay.bind(this, "Thursday")}
                    checked={checkedDays.Thursday}
                  />
                  <span className="switch-label" data-on={'\uf00c'} data-off={'\uf00d'}></span>
                  <span className="switch-handle"></span>
                </Label>
                <label>&nbsp;&nbsp;Thursday</label>
              </div>
              <div className="col-md-12 row">
                <Label className="switch switch-icon switch-success-outline-alt">
                  <Input 
                    type="checkbox" 
                    className="switch-input" 
                    onChange={this.checkDay.bind(this, "Friday")}
                    checked={checkedDays.Friday}
                  />
                  <span className="switch-label" data-on={'\uf00c'} data-off={'\uf00d'}></span>
                  <span className="switch-handle"></span>
                </Label>
                <label>&nbsp;&nbsp;Friday</label>
              </div>
              <div className="col-md-12 row">
                <Label className="switch switch-icon switch-success-outline-alt">
                  <Input 
                    type="checkbox" 
                    className="switch-input" 
                    onChange={this.checkDay.bind(this, "Saturday")}
                    checked={checkedDays.Saturday}
                  />
                  <span className="switch-label" data-on={'\uf00c'} data-off={'\uf00d'}></span>
                  <span className="switch-handle"></span>
                </Label>
                <label>&nbsp;&nbsp;Saturday</label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="success" className={(enableSave ? "" : "disabled")+" pull-right"} onClick={this.saveVenue.bind(this)}>Save</Button>
          </ModalFooter>
      </Modal>
      </div>
    )
  }
}

export default Venues;
