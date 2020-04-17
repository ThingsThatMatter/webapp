import React, {useState, useEffect} from 'react'
import { Button } from 'antd'
import {Redirect} from 'react-router-dom'

import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

import TimeSlotPicker from './TimeslotPicker'

function SidebarBuyer(props) {

    const [redirectNewOffer, setRedirectNewOffer] = useState(false);
    const [component, setComponent] = useState('');
    const [refreshDb, setRefreshDb] = useState(false);
    const [cookies, setCookie] = useCookies(['name']); // initializing state cookies

    /* Renew Access Token */
    const renewAccessToken = (token) => {
        if (token !== cookies.uT) {
            setCookie('uT', token, {path:'/'})
        }
    }

/* ------------------------------------------------FORMATING FUNCTIONS----------------------------------------------------------- */

    /* Offer status translation */
    const statusInFrench = {
        'pending' : 'En attente',
        'declined' : 'Refusée',
        'accepted' : 'Acceptée'
    }
    const statusTranslate = (state) => statusInFrench[state]

 /* ----------------------------------------------------LOADING COMPONENTS----------------------------------------------------------- */
   
    const goToVisitInfo = () => {
        setRefreshDb(!refreshDb)
    }

    useEffect( () => {
        const dbFetch = async () => {
            const userAds = await fetch(`/user/ad/${props.adId}/private`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${cookies.uT}`
                }
            })

            if (userAds.status === 500) {
                setComponent(
                    <div className="sidebar-visit">
                        <p> Nous rencontrons des difficultés pour afficher vos informations, veuillez réessayer. </p>
                    </div>
                )
            
            } else { // no need to handle 401 because user had to be logged-in to see this part
                const body = await userAds.json()
                renewAccessToken(body.accessToken)
                const ad = body.data.ad
            
                if (ad.timeSlots.length === 0) {
                    setComponent(<TimeSlotPicker adId={props.adId} buyerToken={props.buyerToken} goToVisitParent={goToVisitInfo}/>)
                }
                else {
                    var visitEndDate = new Date(ad.timeSlots[0].end)
                    var visitStartDate = new Date(ad.timeSlots[0].start)
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
                            documents = ad.files.map( e => 
                                <div key={e.id} className="sidebar-offer-documents">
                                    <a href={e} target="_blank">
                                    {e.name}
                                    </a>
                                </div>
                            )
                        }

                        if (ad.offers.length === 0) {
                            props.setOfferAd(ad)
                            setComponent(
                                <div className="sidebar-offer">
                                    <p>
                                        Visite effectuée le<br/> <strong>{visitStartDate.toLocaleDateString('fr-FR')} à {visitStartDate.toLocaleTimeString('fr-FR')}</strong>
                                    </p>
                                    <div>
                                        <p style={{marginTop: '1em'}}>Documents</p>
                                        {documents
                                            ? documents
                                            : "L'agence n'a pas encore transmis les documents de ce bien"
                                        }
                                    </div>
                                    <Button type="primary" onClick={ () => {setRedirectNewOffer(true)}}>Déposer une offre</Button>
                                </div>
                            )
                        } else {
                            const offerDate = new Date(ad.offers[0].creationDate)
                            const offerStatus = statusTranslate(ad.offers[0].status)
                            setComponent(
                                <div className="sidebar-recap">
                                    <p>Offre déposée le<br/> <strong>{offerDate.toLocaleDateString('fr-FR')} à {offerDate.toLocaleTimeString('fr-FR')}</strong></p>
                                    <br/>
                                    <p>Statut de l'offre<br/> <strong>{offerStatus}</strong></p>
                                    <div>
                                        <p style={{marginTop: '1em'}}>Documents</p>
                                        {documents.length > 0
                                            ? documents
                                            : <p className = 'sidebar-offer-nodoc'>L'agence n'a pas encore transmis les documents de ce bien</p>
                                        }
                                    </div>
                                </div>
                            )
                        }
                    }
                }
            }
        }
        dbFetch()
    }, [refreshDb])

    if (redirectNewOffer) {
        return <Redirect push to='/offer/new/step1' /> 
    }

    return (
        <div className="sidebar-buyer">
            {component}
        </div>
    )

}

function mapDispatchToProps(dispatch) {
    return {
        setOfferAd : function(ad) { 
            dispatch( {type: 'user_setOfferAd', ad} ) 
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(SidebarBuyer)