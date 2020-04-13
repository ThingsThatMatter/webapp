import React from 'react'
import {Switch, Route, Redirect, useLocation} from 'react-router-dom'
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

import { Layout} from 'antd'
const {Content} = Layout


function AgentApp(props) {

    const [cookies] = useCookies(['name']); // initializing state cookies
    const location = useLocation()

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


    const PrivateRoute = ({ component: Component, ...rest }) => {
        if (props.agentLoginStatus.login_success) {
            return (
                <Route {...rest} render={ state => (
                    <Component {...state} />
                )}/>
            )
        } else {
            props.pageToRedirect(location) // store page to redirect after login
            return (
                <Route {...rest} render={ () => <Redirect to='/pro/auth/signin' /> }/>
            )
        }
    }
    
    return (

        <Switch>
            <Route component={agentSignIn} path='/pro/auth/signin' exact/>
            <Route component={agentSignUp} path='/pro/auth/signup' exact/>
        
            <Layout>
                <Sidebar/>
                <Layout className='main-content'>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <Switch>
                            <PrivateRoute component={Home} path='/pro' exact />
                            <PrivateRoute component={Offers} path='/pro/offers' exact/>
                            <PrivateRoute component={Visits} path='/pro/visits' exact/>
                            <PrivateRoute component={Questions} path='/pro/questions' exact/>
                            <PrivateRoute component={AdDesc} path='/pro/ad/:id' exact/>
                            <PrivateRoute component={CreateFormOne} path='/pro/ad/new/step1' exact/>
                            <PrivateRoute component={CreateFormTwo} path='/pro/ad/new/step2' exact/>
                            <PrivateRoute component={CreateFormThree} path='/pro/ad/new/step3' exact/>
                            <PrivateRoute component={CreateFormFour} path='/pro/ad/new/step4' exact/>
                            <PrivateRoute component={CreateFormFive} path='/pro/ad/new/step5' exact/>
                            <PrivateRoute component={CreateFormSix} path='/pro/ad/new/step6' exact/>                
                            <PrivateRoute component = {NotFound404} path='/pro' />
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </Switch>
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
        },
        pageToRedirect: function(page) {
            dispatch({
                type: 'agentRedirectIfLoggedIn',
                path: page
            })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AgentApp)