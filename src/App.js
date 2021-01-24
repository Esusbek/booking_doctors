import React, {useState }  from 'react';
import logo from './logo.svg';
import './App.css';
import {Provider, connect}   from 'react-redux';
import {actionSearch } from './actions';
import store from './reducers'
import {Router, Route, Link, Switch, Redirect} from 'react-router-dom';

import {actionCategories, actionLogin} from './actions'

const LoginForm = ({onLogin}) => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    return (
            <div>
                <input type='text' value={login} onChange={e => setLogin(e.target.value)} />
                <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
                <button onClick={() => onLogin(login, password)}>Login</button>
            </div>
        )
}
const CLoginForm = connect(null, {onLogin: actionLogin})(LoginForm)


store.dispatch(actionCategories())

const CCategoriesMenu = connect(state => ({
    categories: state.promise.categories &&
                state.promise.categories.payload && 
                state.promise.categories.payload.CategoryFind
}))

export default () => {
    return (
        <Provider store={store}>
            <CLoginForm />
            <Router history={history}>
                <Route path="/" component={PageMain} />
            </Router>
        </Provider>
    )
}
