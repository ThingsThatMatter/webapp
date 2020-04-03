import React from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import {useCookies} from 'react-cookie'

import Home from '../screens/Buyer/Home'
import AdDesc from '../screens/Buyer/AdDesc'
import Visits from '../screens/Buyer/Visits'
import Offers from '../screens/Buyer/Offers'
import buyerSign from '../screens/Buyer/Sign'
import EmailConf from '../screens/Buyer/EmailConf'
import OfferForm1 from '../screens/Buyer/OfferForm1'
import OfferForm2 from '../screens/Buyer/OfferForm2'
import OfferForm3 from '../screens/Buyer/OfferForm3'
import NotFound_404 from '../screens/Buyer/NotFound_404'

function BuyerRoutes(props) {

    const [cookies] = useCookies(['name']); // initilizing state cookies

    const checkToken = async () => {
        const authenticateUser = await fetch('/user/user-access', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.uT}`
            }
        })

        if (authenticateUser.status === 401) {
            props.authenticationFailed()

        } else if (authenticateUser.status === 200) {
            const body = await authenticateUser.json()
            const {lastname, firstname, email, id} = body.data.userInfo
            props.loggedIn()
            props.saveUserInfo({lastname, firstname, email, id})            
        }
    }

    if (cookies.uT && !props.userLoginStatus.login_success && !props.userLoginStatus.login_request && !props.userLoginStatus.login_failed && props.userLoginStatus.logout) { // si il y a un cookie, on vérifie qu'il existe bien en base. Les autres conditions sont présentes pour empêcher les infinite render (car les fonctions appelées viennent changer les valeurs de userLoginStatus)
        props.login_request()
        checkToken()
    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(state) => (
            props.userLoginStatus.login_success
            ? <Component {...state} />
            : <Redirect to='/sign' />
        )} />
    )
    
    return (
        <Router>
            <Switch>
                <PrivateRoute component={Home} path='/' exact/>
                <PrivateRoute component={Visits} path='/visits' exact/>
                <PrivateRoute component={Offers} path='/offers' exact/>
                <PrivateRoute component={OfferForm1} path='/newoffer/step1' exact/>
                <PrivateRoute component={OfferForm2} path='/newoffer/step2' exact/>
                <PrivateRoute component={OfferForm3} path='/newoffer/step3' exact/>
                
                <Route component={buyerSign} path='/sign' exact/>
                <Route component={EmailConf} path='/confirmation/:user_token' exact/>
                <Route component={AdDesc} path='/ad/:ad_id' exact/>
                <Route component={NotFound_404} path={new RegExp("^/(?!pro)")} /> {/* Any routes not starting by pro */}
            </Switch>
        </Router>  
    );
}

function mapStateToProps(state) {
    return { 
        userLoginStatus : state.userLoginStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loggedIn: function() {
            dispatch( {type: 'user_loggedIn'} )
        },
        login_request: function() {
            dispatch({
                type: 'user_login_request'
            })
        },
        loggedOut: function() {
            dispatch({ type: 'user_loggedOut' })
        },
        authenticationFailed: function() {
            dispatch({ type: 'user_authenticationFailed' })
        },
        saveUserInfo: function(userInfo) {
            dispatch({
                type: 'user_saveInfo',
                userInfo
            })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BuyerRoutes)