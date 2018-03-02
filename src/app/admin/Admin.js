import React, {Component} from 'react';
import {Link, Switch, Route, Redirect } from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import { ToastContainer } from "react-toastify";

import Dashboard  from './views/Dashboard';
import Venues from './views/Venues';
import Artists from './views/Artists';
import Musics from "./views/Musics";

class Admin extends Component {
  render() {
    return (
      
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route exact path="/admin" name="Dashboard" component={Dashboard}/>
                <Route path="/admin/venues" name="Venues" component={Venues}/>
                <Route path="/admin/artists" name="Artists" component={Artists}/>
                <Route path="/admin/musics" name="Musics" component={Musics}/>
              </Switch>
            </Container>
          </main>
          <Aside />
        </div>
        <ToastContainer/>
        <Footer />
      </div>
    );
  }
}

export default Admin;
