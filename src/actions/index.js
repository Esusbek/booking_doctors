import { GraphQLClient } from 'graphql-request';

//const gql = new GraphQLClient('/graphql', {headers: {Authorization: 'Bearer ' + ... }})
const gql = new GraphQLClient('/graphql')

export const actionSearch = text => ({type: 'SEARCH', text})
export const actionSearchResult = payload => ({type: 'SEARCH_RESULT', payload})

export const actionPromise = (name, promise) => {
    const actionPending = () => ({type: 'PROMISE', name, status: 'PENDING', payload: null, error: null})
    const actionResolved = payload => ({type: 'PROMISE', name, status: 'RESOLVED', payload, error: null})
    const actionRejected = error => ({type: 'PROMISE', name, status: 'REJECTED', payload:null, error})


    return async dispatch => {
        dispatch(actionPending())
        let payload
        try {
            payload = await promise
            dispatch(actionResolved(payload))
        }
        catch (e){
            dispatch(actionRejected(e))
        }
        return payload;
    }
}

export const actionLogin = (login,password) => 
    async dispatch => {
        console.log(login, password)
        let result = await dispatch(actionPromise('login', gql.request(`query login($login: String!, $password: String!){
        login(username: $login, password: $password)
        }`, {login, password})))  
        if (result){
            dispatch(actionAuthLogin(result.login))
        }
    }

export const actionRegister = (username, password, full_name, phone, email, adress, gender, age) =>
    async dispatch => {
        let patRes = await dispatch(actionPromise('addPatient', gql.request(`mutation addPatient($patient: PatientInput!){
            addPatient(patient: $patient)            }
          }`, {patient: {adress, gender, age}})))
        console.log(patRes)
        if(patRes){
        }
    }

export const actionAuthLogin = (jwt) => ({
    type: "LOGIN",
    jwt
})


export const actionAuthLogout = () => {
    //npmhistory.push('/')
    return {
        type: "LOGOUT",
    }
}
