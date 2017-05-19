// https://github.com/reactjs/react-router-redux/issues/348

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import 'babel-polyfill';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import history from './history';
import App from './app/App';

import Register from './app/Register';
import Main from './app/main';
import Activate from './app/Activate';
import deprecate from './app/deprecate';
import Confirm from './app/confirm';

import './index.scss';
import web3 from './web3';
import LedgerLoginProvider from './ledgerLoginProvider';


import reducers from './reducers';

(async function app() {
  await web3.initWeb3();
  LedgerLoginProvider.start();
  injectTapEventPlugin();

    // Build the middleware for intercepting and dispatching navigation actions
  const middleware = routerMiddleware(history);

    // Configure reducer to store state at state.router
    // You can store it elsewhere by specifying a custom `routerStateSelector`
    // in the store enhancer below
  const reducer = combineReducers({
    ...reducers,
    routing: routerReducer,
  });
  const store = createStore(reducer, applyMiddleware(middleware));

  const syncedHistory = syncHistoryWithStore(history, store);

  ReactDOM.render((
    <Provider store={store}>
      <Router history={syncedHistory}>
        <Route component={App}>
          <Route path="/" component={Main} />
          <Route path="/Register" component={Register} />
          <Route path="/Activate" component={Activate} />
          <Route path="/confirm" component={Confirm} />
          <Route path="/deprecate" component={deprecate} />
        </Route>
      </Router>
    </Provider>
        ),
        document.getElementById('root'),
    );
}());
