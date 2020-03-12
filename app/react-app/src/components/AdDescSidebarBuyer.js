import React, {useState, useEffect} from 'react';
import { Col, Button } from 'antd';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux'



function AdDescSidebarBuyer(props) {

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
    console.log(props.userToken)

    useEffect( () => {
        const dbFetch = async () => {
            const checkVisit = await fetch(`/user/ad/${props.idAd}/private`, {
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', token: props.userToken}
            })
            const body = await checkVisit.json()

            console.log(body)

            let visitFromTheChoosenAd = body.data.ad.timeSlots[0];

            var visitEndDate = dateCreate(visitFromTheChoosenAd.end)
            var visitStartDate = dateCreate(visitFromTheChoosenAd.start)
            if (visitEndDate > new Date() ) {
                setVisitDetails(
                    <p>
                        Visite prévue le {visitStartDate.toLocaleDateString('fr-FR')} à {visitStartDate.toLocaleTimeString('fr-FR')}
                    </p>
                )
            } else {
                setVisitDetails(
                    <div>
                        <p>
                            Visite effectuée le {visitStartDate.toLocaleDateString('fr-FR')} à {visitStartDate.toLocaleTimeString('fr-FR')}
                        </p>
                        <Button type="primary" onClick={() => pushOffer()}>Faire une offre</Button>
                    </div>
                )
            }

            

            let offerFromTheChoosenAd = body.data.ad.offers[0];

            /* Offer status translation */
            const statusInFrench = {
                'pending' : 'En attente',
                'declined' : 'Refusée',
                'accepted' : 'Acceptée'
            }
            const statusTranslate = (state) => statusInFrench[state]

            if ( offerFromTheChoosenAd.length > 0) {
                const offerDate = dateCreate(offerFromTheChoosenAd.creationDate)
                const offerStatus = statusTranslate(offerFromTheChoosenAd.status)
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




    if(!visitDetails) {

        if(offerDetails) {

            return ( 
                <div className="sidebar-visit">
                    {visitDetails}
                </div>
            )

        } else {

            return ( 
                <div className="sidebar-offer">
                    {visitDetails}
                    {offerDetails}
                </div>
            )

        }

    } else {

        return (  
            
            <div className="sidebar-timeslot">
                <span>Composant d'Augustin</span>
            </div>

        )

    }



}

function mapStateToProps(state) {
    return { 
        userToken : state.userToken
    }
}

export default connect(
    mapStateToProps,
    null
)(AdDescSidebarBuyer)