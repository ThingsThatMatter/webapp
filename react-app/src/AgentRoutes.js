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
            headers: {'token': cookies.aT}
            })
        const body = await getToken.json()
        if (body.message === 'OK') {
            props.login(body.data.token)
        }
    }

    if (cookies.aT && !props.agentLoginInfo.login_success && !props.agentLoginInfo.login_request) { // si il y a un cookie, on vérifie qu'il existe bien en base. Les deux autres conditions sont présentes pour empêcher les infinite render (car les fonctions appelées viennent changer les valeurs de agentLoginInfo)
        props.login_request()
        checkToken()
    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(state) => (
            props.agentLoginInfo.login_success 
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
                <PrivateRoute component={AdDesc} path="/pro/ad/:id" exact/>
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
        agentLoginInfo : state.agentLoginInfo
    }
}

function mapDispatchToProps(dispatch){
    return {
        login: function(token){
            dispatch({
                type: 'agent_login',
                token
            })
        },
        login_request: function() {
            dispatch({
                type: 'agent_login_request'
            })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AgentRoutes)