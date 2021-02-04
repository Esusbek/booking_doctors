import React, {useState }  from 'react';
import logo from './logo.svg';
import './App.css';
import {Provider, connect}   from 'react-redux';
import {actionSearch } from './actions';
import store from './reducers'
import {Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {createBrowserHistory} from "history";
import {ConnectedLoginForm, ConnectedRegisterForm} from './components'

const history = createBrowserHistory();

export default () => {
    return (
        <Provider store={store}>
            <ConnectedLoginForm />
            <ConnectedRegisterForm />
            <Router history={history}>
                <Route path="/" component={PageMain} />

            </Router>
        </Provider>
    )
}
