import React, {useState} from 'react';
import 'antd/dist/antd.css';import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux'

import {useCookies} from 'react-cookie'

import Home from './screens/Agent/Home';
import Offres from './screens/Agent/Offres';
import RendezVous from './screens/Agent/RendezVous';
import Questions from './screens/Agent/Questions';
import AdDesc from './screens/Agent/AdDesc';
import CreateFormOne from './screens/Agent/CreateForm1';
import CreateFormTwo from './screens/Agent/CreateForm2';
import CreateFormThree from './screens/Agent/CreateForm3';
import CreateFormFour from './screens/Agent/CreateForm4';
import CreateFormFive from './screens/Agent/CreateForm5';
import CreateFormSix from './screens/Agent/CreateForm6';
import agentSignIn from './screens/Agent/SignIn'
import agentSignUp from './screens/Agent/SignUp'

function AgentRoutes(props) {

    const [cookies, setCookie, removeCookie] = useCookies(['name']); // initilizing state cookies

    const checkToken = async () => {
        const getToken = await fetch('/pro/user-access', {
            method: 'GET',
            headers: {'token': cookies.token}
            })
        const body = await getToken.json()
        if (body.message === 'OK') {
            props.setToken(body.data.token)
        } else {
            //removeCookie('token')
            //props.setToken('')
            //setMsgErrorSignin(body.details) Afficher un message d'erreur à l'utilisateur
        }
    }

    if (cookies.token) { // si il y a un cookie, on vérifie qu'il existe bien en base
        checkToken()

    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(state) => (
            props.token !== '' 
            ? <Component {...state} />
            : <Redirect to='/pro/signin' />
        )} />
      )
    
    return (

        <Router>
            <Switch>
                <PrivateRoute component={Home} path="/" exact />
                <PrivateRoute component={Offres} path="/offres"  />
                <PrivateRoute component={RendezVous} path="/rendezvous"  />
                <PrivateRoute component={Questions} path="/questions"  />
                <PrivateRoute component={AdDesc} path="/addesc"  />
                <PrivateRoute component={CreateFormOne} path="/createform/step1"  />
                <PrivateRoute component={CreateFormTwo} path="/createform/step2"  />
                <PrivateRoute component={CreateFormThree} path="/createform/step3"  />
                <PrivateRoute component={CreateFormFour} path="/createform/step4"  />
                <PrivateRoute component={CreateFormFive} path="/createform/step5"  />
                <PrivateRoute component={CreateFormSix} path="/createform/step6"  />

                <Route component={agentSignIn} path="/pro/signin" />
                <Route component={agentSignUp} path="/pro/signup" />
            </Switch>
        </Router>
          
    );
}

function mapStateToProps(state) {
    return { 
        token : state.token
    }
}

function mapDispatchToProps(dispatch){
    return {
        setToken: function(token){
            dispatch({type: 'setToken', token})
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AgentRoutes)