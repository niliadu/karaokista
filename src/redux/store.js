import { applyMiddleware, createStore } from 'redux';
import promise from 'redux-promise-middleware';

import reducers from './reducers/index';

import "./actions/databaseListener";

const middlewares = applyMiddleware(promise());

export default createStore(
  reducers, 
  middlewares,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

/*to use the store use:
import { connect } from 'react-redux';
@connect((store) => {
  return {
    data : store.data
  };
});*/