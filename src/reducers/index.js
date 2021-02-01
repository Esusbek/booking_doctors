import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import fetch from 'react'
import { actionAuthLogin } from '../actions'


const originalFetch = fetch;
fetch = (url, params={headers:{}}) => { 
    params.headers.Authorization = "Bearer " + localStorage.authToken
    return originalFetch(url, params)
}

const reducers = {
    promise(state={}, action){
        if (['LOGOUT', 'LOGIN'].includes(action.type)) return {}
        if (action.type === 'PROMISE'){
            const { name="default", status, payload, error} = action
            if (status){
                return {
                    ...state, [name]: {status, payload: (status === 'PENDING' && state[name] && state[name].payload) || payload, error}
                }
            }
        }
        return state;
    },
    auth(state, action){ //....
        if (state === undefined){
            //добавить в action token из localStorage, и проимитировать LOGIN (action.type = 'LOGIN')
            return {}
        }
        if (action.type === 'LOGIN'){
            console.log('ЛОГИН')
            //+localStorage
            //jwt_decode
//            return {token: action.jwt, payload: jwt_decode(action.jwt)}
        }
        if (action.type === 'LOGOUT'){
            console.log('ЛОГАУТ')
            //-localStorage
            //вернуть пустой объект
            return {}
        }
        return state
    }
}
//{
//    promise: {}
//}

let store = createStore(combineReducers(reducers), applyMiddleware(thunk))

store.subscribe(() => console.log(store.getState()))
//store.subscribe(() => {
    //const state = store.getState()
    //if (state.promise && state.promise.login && state.promise.login.payload){
        //store.dispatch(actionAuthLogin(state.promise.login.payload.login))
    //}
//})

const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms))


export default store

