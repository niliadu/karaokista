import React, { Component } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button
} from 'reactstrap';

export default class PromptModal extends Component {
  constructor(props) {
    super(props);
  }

  _cancel(){
    this.props.toggle();    
    if(this.props.cancelAction == null || this.props.cancelAction == undefined) return;
    this.props.cancelAction();
  }

  _confirm(){
    this.props.toggle();
    if(this.props.confirmAction == null || this.props.confirmAction == undefined) return;
    this.props.confirmAction();
  }
  render() {
    let cancelButton = "";
    let body = "";

    if(this.props.isConfirm){
      cancelButton = (<Button color="danger" className="pull-right" onClick={this._cancel.bind(this)}>Cancel</Button>);
    }
    
    if(this.props.body && this.props.body != ""){
      body = (<ModalBody><h6>{this.props.body}</h6></ModalBody>);
    }
    
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
          <ModalHeader>{this.props.title}</ModalHeader>
          {body}
          <ModalFooter>
            {cancelButton}                        
            <Button color="success" className={"pull-right"} onClick={this._confirm.bind(this)}>Ok</Button>
          </ModalFooter>
      </Modal>
    )
  }
}