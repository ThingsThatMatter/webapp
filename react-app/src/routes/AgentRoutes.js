import React from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import {useCookies} from 'react-cookie'

import Home from '../screens/Agent/Home'
import Offers from '../screens/Agent/Offers'
import Visits from '../screens/Agent/Visits'
import Questions from '../screens/Agent/Questions'
import AdDesc from '../screens/Agent/AdDesc'
import CreateFormOne from '../screens/Agent/CreateForm1'
import CreateFormTwo from '../screens/Agent/CreateForm2'
import CreateFormThree from '../screens/Agent/CreateForm3'
import CreateFormFour from '../screens/Agent/CreateForm4'
import CreateFormFive from '../screens/Agent/CreateForm5'
import CreateFormSix from '../screens/Agent/CreateForm6'
import agentSignIn from '../screens/Agent/SignIn'
import agentSignUp from '../screens/Agent/SignUp'
import NotFound404 from '../screens/Agent/NotFound404'
import Sidebar from '../components/Agent/Sidebar'


function AgentRoutes(props) {

    const [cookies] = useCookies(['name']); // initializing state cookies

    const checkToken = async () => {
        const authenticateAgent = await fetch('/pro/user-access', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.aT}`
            }
        })

        if (authenticateAgent.status === 401) {
            props.authenticationFailed()

        } else if (authenticateAgent.status === 200) {
            const body = await authenticateAgent.json()
            const {lastname, firstname, email, id} = body.data.agentInfo
            props.loggedIn()
            props.saveAgentInfo({lastname, firstname, email, id})            
        }
    }

    if (cookies.aT && !props.agentLoginStatus.login_success && !props.agentLoginStatus.login_request && !props.agentLoginStatus.login_failed && props.agentLoginStatus.logout) { // si il y a un cookie, on vérifie qu'il existe bien en base. Les deux autres conditions sont présentes pour empêcher les infinite render (car les fonctions appelées viennent changer les valeurs de agentLoginInfo)
        props.login_request()
        checkToken()
    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(state) => (
            props.agentLoginStatus.login_success 
            ? <Component {...state} />
            : <Redirect to='/pro/signin' />
        )} />
    )
    
    return (
        <div>
            <h1>TOTO</h1>

        <Router>
            <Switch>
                <PrivateRoute component={Home} path='/pro' exact />
                <PrivateRoute component={Offers} path='/pro/offers' exact/>
                <PrivateRoute component={Visits} path='/pro/visits' exact/>
                <PrivateRoute component={Questions} path='/pro/questions' exact/>
                <PrivateRoute component={AdDesc} path='/pro/ad/:id' exact/>
                <PrivateRoute component={CreateFormOne} path='/pro/createform/step1' exact/>
                <PrivateRoute component={CreateFormTwo} path='/pro/createform/step2' exact/>
                <PrivateRoute component={CreateFormThree} path='/pro/createform/step3' exact/>
                <PrivateRoute component={CreateFormFour} path='/pro/createform/step4' exact/>
                <PrivateRoute component={CreateFormFive} path='/pro/createform/step5' exact/>
                <PrivateRoute component={CreateFormSix} path='/pro/createform/step6' exact/>

                <Route component={agentSignIn} path='/pro/signin' exact/>
                <Route component={agentSignUp} path='/pro/signup' exact/>
                <Route component = {NotFound404} path='/pro' />
            </Switch>
        </Router>

        </div>
          
    )
}

function mapStateToProps(state) {
    return { 
        agentLoginStatus : state.agentLoginStatus
    }
}

function mapDispatchToProps(dispatch){
    return {
        loggedIn: function(){
            dispatch( {type: 'agent_loggedIn'} )
        },
        login_request: function() {
            dispatch( {type: 'agent_login_request'} )
        },
        authenticationFailed: function() {
            dispatch({ type: 'agent_authenticationFailed' })
        },
        saveAgentInfo: function(agentInfo) {
            dispatch({
                type: 'agent_saveInfo',
                agentInfo
            })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AgentRoutes)