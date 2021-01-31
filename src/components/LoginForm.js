import React, {useState} from 'react';
import {connect} from 'react-redux'
import {actionLogin} from '../actions'

export const LoginForm = ({onLogin}) => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    return (
            <div>
                <input type='text' value={login} onChange={e => setLogin(e.target.value)} />
                <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
                <button onClick={() => onLogin(login, password)}>Login</button>
                <button>Register</button>
            </div>
        )
}


export const ConnectedLoginForm = connect(null, {onLogin: actionLogin})(LoginForm)