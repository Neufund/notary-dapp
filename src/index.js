import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';
import history from './history';
import injectTapEventPlugin from 'react-tap-event-plugin';


import App from './app/App.js';
import Login from './app/Login.js';
import Logout from './app/Logout.js';
import Contracts from './app/Contracts.js';

import './index.scss';
import 'flexboxgrid'
import web3 from './web3';
import LedgerLoginProvider from './ledgerLoginProvider';
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {createDevTools} from 'redux-devtools'
import {routerReducer, routerMiddleware, syncHistoryWithStore} from 'react-router-redux'
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
        routing: routerReducer
    });

    const store = createStore(reducer, applyMiddleware(middleware));

    const syncedHistory = syncHistoryWithStore(history, store);

    ReactDOM.render((
            <Provider store={store}>
                <Router history={syncedHistory}>
                    <Route component={App}>
                        <Route path="/" component={Login}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/contracts" component={Contracts}/>
                        <Route path="/logout" component={Logout}/>
                    </Route>
                </Router>
            </Provider>
        ),
        document.getElementById('root')
    );
})();
