import { applyMiddleware, createStore } from 'redux';
import promise from 'redux-promise-middleware';

import reducers from './reducers/index';

import "./actions/databaseListener";

const middlewares = applyMiddleware(promise());

export default createStore(reducers, middlewares);

/*to use the store use:
import { connect } from 'react-redux';
@connect((store) => {
  return {
    data : store.data
  };
});*/