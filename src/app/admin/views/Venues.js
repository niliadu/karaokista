import React, { Component } from 'react';
import { 
  Button,
  Popover, PopoverHeader, PopoverBody
 } from 'reactstrap';

import store from "../../../redux/store";
import { connect } from 'react-redux';

import * as venuesdActions from "../../../redux/actions/venues";


@connect((store) => {
  return {...store.venues};
})

class Venues extends Component {
  constructor(){
    super();
    this.state = {
      addPopoverOpen: false,
      disableAddNew: false
    };
  }
  componentWillMount(){
    venuesdActions.getVenues();
  }

  toogleAddPopover(){
    this.setState({...this.state, addPopoverOpen: !this.state.addPopoverOpen});
  }

  addNewVenue(){
    if(this.state.disableAddNew) return

    venuesdActions.addNewVenue(this.newVenue.value);
    this.toogleAddPopover();
  }

  render() {
    const { dispatch, list} = this.props;
    const { addPopoverOpen, disableAddNew } = this.state;

    const mappedList = Object.keys(list).map((id, i) =>{
        return (
        <div className="row" key={"row_"+i}>
          <div className="col-md-12">
            <h5>
              {list[id].name}
              <i className="icon-close btn btn-lg pull-right"/>
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
            <i id="addPopover" className="btn icon-plus font-success" onClick={this.toogleAddPopover.bind(this)}></i>
            <Popover placement="bottom" isOpen={addPopoverOpen} target="addPopover">
              <PopoverHeader>
                Add New Venue
                <button type="button" className="close" aria-label="Close" onClick={this.toogleAddPopover.bind(this)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </PopoverHeader>
              <PopoverBody>
                <div>
                  <div className="col-md-12">
                    <input ref={(_this) => this.newVenue = _this} type="text" className="form-control" aria-describedby="addNewVenue" placeholder="Enter the new venue"/>
                  </div>
                  <br/>
                  <div className="col-md-12 clearfix">
                    <Button color="success" className={(disableAddNew ? "disabled" : "")+" pull-right"} onClick={this.addNewVenue.bind(this)}>Add</Button>
                  </div>
                </div>
              </PopoverBody>
            </Popover>
          </div>
          <div className="card-body">
            {mappedList}
          </div>
        </div>
      </div>
    )
  }
}

export default Venues;
