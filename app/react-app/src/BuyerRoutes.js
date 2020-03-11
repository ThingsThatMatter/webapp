import React, {useState} from 'react';
import 'antd/dist/antd.css';import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux'

import {useCookies} from 'react-cookie'

import Home from './screens/Buyer/Home'
import AdDesc from './screens/Buyer/AdDesc'
import Visits from './screens/Buyer/Visits'
import Offers from './screens/Buyer/Offers'
import OfferForm1 from './screens/Buyer/OfferForm1'
import OfferForm2 from './screens/Buyer/OfferForm2'
import OfferForm3 from './screens/Buyer/OfferForm3'

import setToken from './actions/token.actions'

function BuyerRoutes(props) {

    // const [cookies, setCookie, removeCookie] = useCookies(['name']); // initilizing state cookies

    // const checkToken = async () => {
    //     const getToken = await fetch('/pro/user-access', {
    //         method: 'GET',
    //         headers: {'token': cookies.token}
    //         })
    //     const body = await getToken.json()
    //     if (body.message === 'OK') {
    //         props.setToken(body.data.token)
    //     } else {
    //         //removeCookie('token')
    //         //props.setToken('')
    //         //setMsgErrorSignin(body.details) Afficher un message d'erreur à l'utilisateur
    //     }
    // }

    // if (cookies.token) { // si il y a un cookie, on vérifie qu'il existe bien en base
    //     checkToken()
    // }

    // const PrivateRoute = ({ component: Component, ...rest }) => (
    //     <Route {...rest} render={(state) => (
    //         props.token !== '' 
    //         ? <Component {...state} />
    //         : <Redirect to='/pro/signin' />
    //     )} />
    // )
    
    return (

        <Router>
            <Switch>
                {/* <PrivateRoute component={Home} path="/pro" exact />
                <PrivateRoute component={Offres} path="/pro/offres" exact/>
                <PrivateRoute component={RendezVous} path="/pro/rendezvous" exact/>
                <PrivateRoute component={Questions} path="/pro/questions" exact/>
                <PrivateRoute component={AdDesc} path="/pro/addesc/:id" exact/>
                <PrivateRoute component={CreateFormOne} path="/pro/createform/step1" exact/>
                <PrivateRoute component={CreateFormTwo} path="/pro/createform/step2" exact/>
                <PrivateRoute component={CreateFormThree} path="/pro/createform/step3" exact/>
                <PrivateRoute component={CreateFormFour} path="/pro/createform/step4" exact/>
                <PrivateRoute component={CreateFormFive} path="/pro/createform/step5" exact/>
                <PrivateRoute component={CreateFormSix} path="/pro/createform/step6" exact/> */}

                <Route component={Home} path="/" exact/>
                <Route component={AdDesc} path="/ad/:id" />
                <Route component={Visits} path="/visits" />
                <Route component={Offers} path="/offers" />
                <Route component={OfferForm1} path="/newoffer/step1" />
                <Route component={OfferForm2} path="/newoffer/step2" />
                <Route component={OfferForm3} parth="/newoffer/step3" />
            </Switch>
        </Router>
          
    );
}

// function mapStateToProps(state) {
//     return { 
//         token : state.token
//     }
// }

// function mapDispatchToProps(dispatch){
//     return {
//         setToken: function(token){
//             dispatch(setToken(token))
//         }
//     }
// }

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(AgentRoutes)

export default BuyerRoutes