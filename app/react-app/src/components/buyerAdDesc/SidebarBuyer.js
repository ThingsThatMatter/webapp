import React, {useState, useEffect} from 'react';
import { Col, Button } from 'antd';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux'

import TimeSlotPicker from './TimeslotPicker'

function SidebarBuyer(props) {

    const [toRedirect, setToRedirect] = useState(false);
    const [component, setComponent] = useState('');
    const [refreshDb, setRefreshDb] = useState(false);

/* ------------------------------------------------FORMATTING FUNCTIONS----------------------------------------------------------- */

    const dateCreate = (date) => {
        var year = date.slice(0,4)
        var month = Number(date.slice(5,7))-1
        var day = date.slice(8,10)
        var hour = date.slice(11,13)
        var min = date.slice(14,16)
        return new Date(year, month, day, hour, min)
    }

    /* Offer status translation */
    const statusInFrench = {
        'pending' : 'En attente',
        'declined' : 'Refusée',
        'accepted' : 'Acceptée'
    }
    const statusTranslate = (state) => statusInFrench[state]


 /* ----------------------------------------------------LOADING COMPONENTS----------------------------------------------------------- */
   
    const goToVisitInfo = () => {
        setRefreshDb(true)
    }

    useEffect( () => {
        const dbFetch = async () => {
            const checkVisit = await fetch(`/user/ad/${props.adId}/private`, {
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', token: props.userToken}
            })
            const body = await checkVisit.json()

            console.log(body)
            const ad = body.data.ad

            if (ad.timeSlots.length === 0) {
                setComponent(<TimeSlotPicker adId={props.adId} token={props.userToken} goToVisitParent={goToVisitInfo}/>)
            }
            else {
                var visitEndDate = dateCreate(ad.timeSlots[0].end)
                var visitStartDate = dateCreate(ad.timeSlots[0].start)
                if (visitEndDate > new Date() ) {
                    setComponent(
                        <div className="sidebar-visit">
                            <p>
                                Visite prévue le<br/> <strong>{visitStartDate.toLocaleDateString('fr-FR')} à {visitStartDate.toLocaleTimeString('fr-FR')}</strong>
                            </p>
                        </div>
                    )
                } else {

                    let documents = []
                    if (ad.files.length > 0) {
                        documents = ad.files.map((e, i) => {
                            return (
                            <div key={i} className="sidebar-offer-documents">
                                <a href={e} target="_blank">
                                {e.slice(82, 999)}
                                </a>
                            </div>
                            );
                        });
                    }

                    if (ad.offers.length === 0) {

                        setComponent(
                            <div className="sidebar-offer">
                                <p>
                                    Visite effectuée le<br/> <strong>{visitStartDate.toLocaleDateString('fr-FR')} à {visitStartDate.toLocaleTimeString('fr-FR')}</strong>
                                </p>
                                <div>
                                    <p style={{marginTop: '1em'}}>Documents</p>
                                    {documents}
                                </div>
                                <Button type="primary" onClick={ () => {setToRedirect(true); props.setOfferAdId(props.adId)}}>Déposer une offre</Button>
                            </div>
                        )
                    } else {
                        const offerDate = dateCreate(ad.offers[0].creationDate)
                        const offerStatus = statusTranslate(ad.offers[0].status)
                        setComponent(
                            <div className="sidebar-recap">
                                <p>Offre déposée le<br/> <strong>{offerDate.toLocaleDateString('fr-FR')} à {offerDate.toLocaleTimeString('fr-FR')}</strong></p>
                                <br/>
                                <p>Statut de l'offre<br/> <strong>{offerStatus}</strong></p>
                                <div>
                                    <p style={{marginTop: '1em'}}>Documents</p>
                                    {documents}
                                </div>
                            </div>
                        )
                    }
                }
            }
        }
        dbFetch()
    }, [refreshDb])

    if (toRedirect) { // if login OK (from form) redirect to home
        return <Redirect to='/newoffer/step1' /> 
    }

    return (
        <div className="sidebar-buyer">
            {component}
        </div>
    )

}

// function mapStateToProps(state) {
//     return { 
//         userToken : state.userToken
//     }
// }

function mapDispatchToProps(dispatch) {
    return {
        setOfferAdId : function(id) { 
            dispatch( {type: 'setOfferAdId', adId: id} ) 
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(SidebarBuyer)