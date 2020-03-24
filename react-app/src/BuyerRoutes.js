import React, {useState} from 'react';
import 'antd/dist/antd.css';import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux'

import {useCookies} from 'react-cookie'

import Home from './screens/Buyer/Home'
import AdDesc from './screens/Buyer/AdDesc'
import Visits from './screens/Buyer/Visits'
import Offers from './screens/Buyer/Offers'
import buyerSign from './screens/Buyer/Sign'
import EmailConf from './screens/Buyer/EmailConf'
import OfferForm1 from './screens/Buyer/OfferForm1'
import OfferForm2 from './screens/Buyer/OfferForm2'
import OfferForm3 from './screens/Buyer/OfferForm3'

function BuyerRoutes(props) {

    const [cookies, setCookie, removeCookie] = useCookies(['name']); // initilizing state cookies

    const checkToken = async () => {
        const getToken = await fetch('/user/user-access', {
            method: 'GET',
            headers: {'token': cookies.bT}
            })
        const body = await getToken.json()
        if (body.message === 'OK') {
            props.login(body.data.token)
        }
    }

    if (cookies.bT && !props.buyerLoginInfo.login_success && !props.buyerLoginInfo.login_request) { // si il y a un cookie, on vérifie qu'il existe bien en base. Les deux autres conditions sont présentes pour empêcher les infinite render (car les fonctions appelées viennent changer les valeurs de buyerLoginInfo)
        props.login_request()
        checkToken()
    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(state) => (
            props.buyerLoginInfo.login_success
            ? <Component {...state} />
            : <Redirect to='/sign' />
        )} />
    )
    
    return (
        <Router>
            <Switch>
                <PrivateRoute component={Home} path="/" exact/>
                <PrivateRoute component={Visits} path="/visits" />
                <PrivateRoute component={Offers} path="/offers" />
                <PrivateRoute component={OfferForm1} path="/newoffer/step1" exact/>
                <PrivateRoute component={OfferForm2} path="/newoffer/step2" exact/>
                <PrivateRoute component={OfferForm3} path="/newoffer/step3" exact/>
                
                <Route component={buyerSign} path="/sign" />
                <Route component={EmailConf} path="/confirmation/:user_token" />
                <Route component={AdDesc} path="/ad/:ad_id" />
            </Switch>
        </Router>  
    );
}

function mapStateToProps(state) {
    return { 
        buyerLoginInfo : state.buyerLoginInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login: function(token) {
            dispatch({
                type: 'buyer_login',
                token
            })
        },
        login_request: function() {
            dispatch({
                type: 'buyer_login_request'
            })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BuyerRoutes)