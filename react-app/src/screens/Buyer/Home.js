import React, {useState} from 'react'
import { Link} from 'react-router-dom'
import {connect} from 'react-redux' 
import {useCookies} from 'react-cookie'

import APIFetch from '../../components/Buyer/APIFetch'

import {Col, Row} from 'antd'


function Home() {

    const [dataLoaded, setDataLoaded] = useState(false)

    const [adsListFromDb, setAdsListFromDb] = useState([])
    const [cookies] = useCookies(['name']) // initilizing state cookies

/* Price formatting */
    const priceFormatter = new Intl.NumberFormat('fr', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        useGrouping: true
    })

/* Ad Cards */

    //sort
    let adsCopy = [...adsListFromDb]
    adsCopy = adsCopy.sort((a,b) => {
        return (new Date(b.creationDate) - new Date(a.creationDate))
    })
    //rend

    let adsOffers = []

        adsOffers = adsCopy.filter( e => e.offers.length > 0)

        adsOffers = adsOffers.map( (e,i) => {

            /* Offer status translation */
            const statusInFrench = {
                'pending' : 'En attente',
                'declined' : 'Refusée',
                'accepted' : 'Acceptée'
            }
            const statusTranslate = (state) => statusInFrench[state]

            let offerMessage
            let offerStatusMess
            const offerDate = new Date(e.offers[0].creationDate)
            const offerStatus = statusTranslate(e.offers[0].status)
            offerMessage = 
                <p className="annonce-messages-buyer">
                    Offre déposée le {offerDate.toLocaleDateString('fr-FR')} à {offerDate.toLocaleTimeString('fr-FR')} 
                </p>
            offerStatusMess = <span className={`annonce-messages-buyer-offer-${e.offers[0].status}`}>{offerStatus}</span>

            return (
                <Col key = {i} xs={{span:24}} md={{span:12}} lg={{span:8}} xl={{span:6}}>
                    <Link className="annonce-element" to={`/ad/${e._id}`}>
                        {offerStatusMess}
                        <img className="annonce-image" src={e.photos[0].url} alt={e.photos[0].name} />
                        <div className="annonce-text-buyer">
                            <div className="annonce-price-container">
                                <span className="annonce-price">{priceFormatter.format(e.price)}</span>
                            </div>
                            <p className="annonce-address-title">{e.address}</p>
                            <p className="annonce-address-sub">{e.postcode} {e.city}</p>
                        </div>
                        <div className="annonce-infos-buyer">
                            <span className="annonce-area"><img src="expand.svg" width="20px"/> {e.area} <span>&nbsp;m2</span></span>
                            <span className="annonce-room"><img src="floor-plan.png" width="20px"/> {e.rooms} <span>&nbsp;{e.rooms > 1 ? 'pièces' : 'pièce'}</span></span>
                            <span className="annonce-bedroom"><img src="bed.svg" width="20px"/> {e.bedrooms} <span>&nbsp;{e.bedrooms > 1 ? 'chambres' : 'chambre'}</span></span>
                        </div>
                        <div className="annonce-status-buyer">
                            {offerMessage}
                        </div>
                    </Link>
                </Col>
            )
        })

    let adsVisits = []

        adsVisits = adsCopy.filter( e => e.timeSlots.length > 0)

        adsVisits = adsVisits.map( (e,i) => {
            
            let visitMessage
            var visitEndDate = new Date(e.timeSlots[0].end)
            var visitStartDate = new Date(e.timeSlots[0].start)
            if (visitEndDate > new Date() ) {
                visitMessage = 
                    <p className="annonce-messages-buyer">
                        Visite prévue le {visitStartDate.toLocaleDateString('fr-FR')} à {visitStartDate.toLocaleTimeString('fr-FR')}
                    </p>
            } else {
                visitMessage = 
                    <p className="annonce-messages-buyer">
                        Visite effectuée le {visitStartDate.toLocaleDateString('fr-FR')} à {visitStartDate.toLocaleTimeString('fr-FR')}
                    </p>
            }

            return (
                <Col key = {i} xs={{span:24}} md={{span:12}} lg={{span:8}} xl={{span:6}}>
                    <Link className="annonce-element" to={`/ad/${e._id}`}>
                        <img className="annonce-image" src={e.photos[0].url} alt={e.photos[0].name} />
                        <div className="annonce-text-buyer">
                            <div className="annonce-price-container">
                                <span className="annonce-price">{priceFormatter.format(e.price)}</span>
                            </div>
                            <p className="annonce-address-title">{e.address}</p>
                            <p className="annonce-address-sub">{e.postcode} {e.city}</p>
                        </div>
                        <div className="annonce-infos-buyer">
                            <span className="annonce-area"><img src="expand.svg" width="20px"/> {e.area} <span>&nbsp;m2</span></span>
                            <span className="annonce-room"><img src="floor-plan.png" width="20px"/> {e.rooms} <span>&nbsp;{e.rooms > 1 ? 'pièces' : 'pièce'}</span></span>
                            <span className="annonce-bedroom"><img src="bed.svg" width="20px"/> {e.bedrooms} <span>&nbsp;{e.bedrooms > 1 ? 'chambres' : 'chambre'}</span></span>
                        </div>
                        <div className="annonce-status-buyer">
                            {visitMessage}
                        </div>
                    </Link>
                </Col>
            )

        })

    let adsAll = adsCopy.map( (e,i) => 

        <Col key = {i} xs={{span:24}} md={{span:12}} lg={{span:8}} xl={{span:6}}>
            <Link className="annonce-element" to={`/ad/${e._id}`}>
                <img className="annonce-image" src={e.photos[0].url} alt={e.photos[0].name} />
                <div className="annonce-text-buyer">
                    <div className="annonce-price-container">
                        <span className="annonce-price">{priceFormatter.format(e.price)}</span>
                    </div>
                    <p className="annonce-address-title">{e.address}</p>
                    <p className="annonce-address-sub">{e.postcode} {e.city}</p>
                </div>
                <div className="annonce-infos-buyer">
                    <span className="annonce-area"><img src="expand.svg" width="20px"/> {e.area} <span>&nbsp;m2</span></span>
                    <span className="annonce-room"><img src="floor-plan.png" width="20px"/> {e.rooms} <span>&nbsp;{e.rooms > 1 ? 'pièces' : 'pièce'}</span></span>
                    <span className="annonce-bedroom"><img src="bed.svg" width="20px"/> {e.bedrooms} <span>&nbsp;{e.bedrooms > 1 ? 'chambres' : 'chambre'}</span></span>
                </div>
            </Link>
        </Col> 
    )

    return (
        
        <APIFetch
            fetchUrl= '/user/ads'
            fetchOptions={{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${cookies.uT}`
                }
            }}
            getApiResponse = { response => {
                if (!dataLoaded) {
                    setAdsListFromDb(response.data.ads)
                }
                setDataLoaded(true)
            }}
        >                        
            {adsOffers.length > 0 &&
                <div>
                    <h1 className='userTitle'>Mes offres</h1>
                    <Row gutter={16} className="offers-row">
                        {adsOffers}
                    </Row>
                </div>
            }

            {adsVisits.length > 0 &&
                <div>       
                    <h1 className='userTitle'>Mes visites</h1>
                    <Row gutter={16} className="visit-row">
                        {adsVisits}
                    </Row>
                </div>
            }

            {adsCopy.length > 0 
            ?
                <div>
                    <h1 className='userTitle'>Mes biens consultés</h1>
                    <Row gutter={16} className="ads-row">
                        {adsAll}
                    </Row>
                </div>
            :
                <h3>Vous n'avez pas encore de biens dans votre liste</h3>
            }
        </APIFetch>
    )
}


function mapStateToProps(state) {
    return { 
        userLoginStatus : state.userLoginStatus
    }
}
  
export default connect(
    mapStateToProps,
    null
)(Home)