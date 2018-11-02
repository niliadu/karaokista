import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form, Input,
  Row
} from 'reactstrap';
import { Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import store from "../../../redux/store";
import { connect } from 'react-redux';

import * as loginActions from "../../../redux/actions/login"
import * as globalActions from "../../../redux/actions/global";

@connect((store) => {
  return {
    loggedIn: store.login.loggedIn
  };
})

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      emailValue: "",
      passwordValue: ""
    };
  }

  componentWillMount() {
    globalActions.setCurrentAdminView("login");
  }

  updateInputValue(name, e) {
    this.setState({
      ...this.state,
      [name + "Value"]: e.target.value
    });
  }

  login(e) {

    e.preventDefault();

    const email = this.state.emailValue;
    const password = this.state.passwordValue;
    
    if (email == "" || password == "") return;
    
    loginActions.login(email, password);
    this.setState({
      ...this.state,
      emailValue: "",
      passwordValue: ""
    });
  }

  render() {

    if (this.props.loggedIn) {
      return (<Redirect to="/admin" />);
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>,
                    <Form onSubmit={this.login.bind(this)}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <Input
                        type="email"
                        placeholder="Email"
                        onChange={this.updateInputValue.bind(this, 'email')}
                        value={this.state.emailValue}
                      />
                      <br />
                      <Input
                        type="password"
                        placeholder="Password"
                        onChange={this.updateInputValue.bind(this, 'password')}
                        value={this.state.passwordValue}
                      />
                      <br />
                      <Row>
                        <Col xs="6">
                          <Button type="submit" color="primary" className="px-4" >Login</Button>
                        </Col>
                        {/* <Col xs="6" className="text-right">
                        <Button color="link" className="px-0">Forgot password?</Button>
                      </Col> */}
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
          <ToastContainer />
        </Container>
      </div>
    )
  }
}
