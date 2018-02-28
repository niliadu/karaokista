import React, { Component } from 'react';
import {
  Popover, PopoverHeader, PopoverBody
} from 'reactstrap';

import PromptModal from "./PromptModal";

export default class ItemMenuList extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
      promptOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }
  
  togglePrompt(){
    this.setState({
      promptOpen: !this.state.promptOpen
    });
  }

  _edit(){
    this.toggle();
    if(this.props.edit == null || this.props.edit == undefined) return;
    this.props.edit();
  }

  _delete(){
    this.toggle();
    if(this.props.delete == null || this.props.delete == undefined) return;
    this.togglePrompt();
  }

  render() {
    return (
      <div className={this.props.className}>
        <i className="icon-options btn btn-lg" id={this.props.id} onClick={this.toggle}/>
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target={this.props.id} toggle={this.toggle}>
          <PopoverBody>
            <span className="col-sm-12 btn btn-sm" onClick={this._edit.bind(this)}>Edit</span>
            <span className="col-sm-12 btn btn-sm" onClick={this._delete.bind(this)}>Delete</span>
          </PopoverBody>
        </Popover>
        <PromptModal 
          isOpen={this.state.promptOpen} 
          toggle={this.togglePrompt.bind(this)}
          isConfirm={true}
          confirmAction={this.props.delete}       
          title="Are you sure that you want to delete this item?"
        />
      </div>
    )
  }
}