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

import setToken from './actions/token.actions'

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
                <PrivateRoute component={Home} path="/pro" exact />
                <PrivateRoute component={Offres} path="/pro/offres" exact/>
                <PrivateRoute component={RendezVous} path="/pro/rendezvous" exact/>
                <PrivateRoute component={Questions} path="/pro/questions" exact/>
                <PrivateRoute component={AdDesc} path="/pro/addesc/:id" exact/>
                <PrivateRoute component={CreateFormOne} path="/pro/createform/step1" exact/>
                <PrivateRoute component={CreateFormTwo} path="/pro/createform/step2" exact/>
                <PrivateRoute component={CreateFormThree} path="/pro/createform/step3" exact/>
                <PrivateRoute component={CreateFormFour} path="/pro/createform/step4" exact/>
                <PrivateRoute component={CreateFormFive} path="/pro/createform/step5" exact/>
                <PrivateRoute component={CreateFormSix} path="/pro/createform/step6" exact/>

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
            dispatch(setToken(token))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AgentRoutes)