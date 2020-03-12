import React, {useState, useEffect} from 'react';
import { Col, Button } from 'antd';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux'



function AdDescSidebarOffer(props) {

    const [toRedirect, setToRedirect] = useState(false);

    const [visitDetails, setVisitDetails] = useState();
    const [offerDetails, setOfferDetails] = useState();

    const dateCreate = (date) => {
        var year = date.slice(0,4)
        var month = Number(date.slice(5,7))-1
        var day = date.slice(8,10)
        var hour = date.slice(11,13)
        var min = date.slice(14,16)
        return new Date(year, month, day, hour, min)
    }

    useEffect( () => {
        const dbFetch = async () => {
            const checkVisit = await fetch(`/user/ad/${props.idAd}/private`, {
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', token: props.userToken}
            })
            const body = await checkVisit.json()

            let theChoosenAd = body.data.ad;

            var visitStartDate = dateCreate(theChoosenAd.timeSlots[0].start)
            setVisitDetails(
                <p>Visite effectuée le {visitStartDate.toLocaleDateString('fr-FR')} à {visitStartDate.toLocaleTimeString('fr-FR')}</p>
            )

            /* Offer status translation */
            const statusInFrench = {
                'pending' : 'En attente',
                'declined' : 'Refusée',
                'accepted' : 'Acceptée'
            }
            const statusTranslate = (state) => statusInFrench[state]

            if ( theChoosenAd.offers.length > 0) {
                const offerDate = dateCreate(theChoosenAd.offers[0].creationDate)
                const offerStatus = statusTranslate(theChoosenAd.offers[0].status)
                setOfferDetails(
                    <div>
                        <p>Offre déposée le {offerDate.toLocaleDateString('fr-FR')} à {offerDate.toLocaleTimeString('fr-FR')}</p>
                        <p>Statut de l'offre : {offerStatus}</p>
                    </div>
                )
            }



        };
        dbFetch();
    }, [])

    const pushOffer = () => {
        setToRedirect(true)
    } 

    if (toRedirect) { // if login OK (from form) redirect to home
        return <Redirect to='/' /> 
    }

    return (  
        
        <div className="sidebar-visit">
            {visitDetails}
            {offerDetails}
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
