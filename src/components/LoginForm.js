import React, {useState} from 'react';
import {connect} from 'react-redux'
import {actionLogin} from './actions'

const LoginForm = ({onLogin}) => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [isDoctor, setDoctor] = useState(false)
    return (
            <div>
                <input type='text' value={login} onChange={e => setLogin(e.target.value)} />
                <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
                <input type='checkbox' checked={isDoctor} onChange={() => setDoctor(!isDoctor)} />
                <button onClick={() => onLogin(login, password, isDoctor)}>Login</button>
            </div>
        )
}
export default LoginForm

export const ConnectedLoginForm = connect(null, {onLogin: actionLogin})(LoginForm)