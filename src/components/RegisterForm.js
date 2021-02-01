import React, {useState} from 'react';
import {connect} from 'react-redux'
import {actionRegister} from '../actions'

export const RegisterForm = ({onRegister}) => {
    const [username, setUsername] = useState("")
    const [full_name, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [adress, setAdress] = useState("")
    const [gender, setGender] = useState("")
    const [age, setAge] = useState("")
    const [password, setPassword] = useState("")
    return (
            <div>
                <label>Username <input type='text' value={username} onChange={e => setUsername(e.target.value)} />
                </label> <br></br>
                <label>Full name <input type='text' value={full_name} onChange={e => setFullName(e.target.value)} />
                </label><br></br>
                <label>Phone number <input type='number' value={phone} onChange={e => setPhone(e.target.value)} />
                </label><br></br>
                <label>Email <input type='email' value={email} onChange={e => setEmail(e.target.value)} />
                </label><br></br>
                <label>Adress <input type='text' value={adress} onChange={e => setAdress(e.target.value)} />
                </label><br></br>
                <label>Gender <input type='text' value={gender} onChange={e => setGender(e.target.value)} />
                </label><br></br>
                <label>Age <input type='number' value={age} onChange={e => setAge(e.target.value)} />
                </label><br></br>
                <label>Password <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
                </label><br></br>
                <button onClick={() => onRegister(username, password)}>Register</button>
            </div>
        )
}


export const ConnectedRegisterForm = connect(null, {onRegister: actionRegister})(RegisterForm)