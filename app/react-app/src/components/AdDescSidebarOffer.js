import React, {useState, useEffect} from 'react';
import { Col, Button } from 'antd';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux'



function AdDescSidebarOffer(props) {

    const [toRedirect, setToRedirect] = useState(false);

    const [visitDetails, setVisitDetails] = useState();

    let idadtest = '5e667918c8cd1041d8dabb4d';
    let visit = new Date('2020-03-11T11:24:54.247Z');

    useEffect( () => {
        // const dbFetch = async () => {
        //     const checkVisit = await fetch('/user/ad/:id_ad/visit', {
        //         method: 'GET',
        //         headers: {'Content-Type': 'application/x-www-form-urlencoded', token: props.userToken}
        //     })
        //     const body = await checkVisit.json()

        //     setVisitDetails(visit)
        //     props.setIdAd(idadtest)


        // console.log(visitDetails)
        // console.log('userToken : ' + props.userToken)
        // };
        // dbFetch();

        setVisitDetails(visit)
        props.setIdAd(idadtest)
        
    }, [])

    const pushOffer = () => {
        setToRedirect(true)
    } 

    if (toRedirect) { // if login OK (from form) redirect to home
        return <Redirect to='/' /> 
    }

    return (  
        
        <div className="sidebar-logout">
            <p>Vous avez visité ce bien le {visitDetails}</p>
            <Button
            onClick={() => pushOffer()}
            >
            Connexion
            </Button>
        </div>

    )
}

function mapStateToProps(state, ownProps) {
    return { 
        userToken : state.userToken,
        idAd: state.idAd
    }
}

function mapDispatchToProps(dispatch){
    return {
        setUserToken: function(token){
            dispatch({type: 'setUserToken', token})
        },
        setIdAd: function(id){
            dispatch({type: 'setIdAd', id})
        }
    }
  }
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdDescSidebarOffer)
