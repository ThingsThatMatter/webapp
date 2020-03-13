import React, {useState, useEffect} from 'react';
import UserNavHeader from '../../components/UserNavHeader';
import {Redirect, Link} from 'react-router-dom'
import {connect} from 'react-redux' 


import { Layout, Col, Row} from 'antd';
const {Content} = Layout;


function Home(props) {

    const [adsListFromDb, setAdsListFromDb] = useState([])

/* Price formatting */
    const priceFormatter = new Intl.NumberFormat('fr', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        useGrouping: true
    })

/* Ad Cards */
    // Get from DB
    useEffect( () => {
        const adsFetch = async () => {
        const ads = await fetch('/user/ads', {
            method: 'GET',
            headers: {'token': props.userToken}
        })
        const body = await ads.json();
        console.log(body)
        setAdsListFromDb(body.data.ads)
        console.log('adsListFromDb : ' + adsListFromDb)
        }
        adsFetch()
    }, [])


    const dateCreate = (date) => {
        var year = date.slice(0,4)
        var month = Number(date.slice(5,7))-1
        var day = date.slice(8,10)
        var hour = date.slice(11,13)
        var min = date.slice(14,16)
        return new Date(year, month, day, hour, min)
    }

    //sort
    let adsCopy = [...adsListFromDb]
    adsCopy = adsCopy.sort((a,b) => {
        return (dateCreate(b.creationDate) - dateCreate(a.creationDate))
    })
    console.log('adsCopy : ' + adsCopy)
    //rend

    let adsOffers = [];

        adsOffers = adsCopy.filter( e => e.offers.length > 0)

        adsOffers = adsOffers.map( (e,i) => {

            /* Offer status translation */
            const statusInFrench = {
                'pending' : 'En attente',
                'declined' : 'Refusée',
                'accepted' : 'Acceptée'
            }
            const statusTranslate = (state) => statusInFrench[state]

            let offerMessage;
            let offerStatusMess;
            const offerDate = dateCreate(e.offers[0].creationDate)
            const offerStatus = statusTranslate(e.offers[0].status)
            offerMessage = 
                <p className="annonce-messages-buyer">
                    Offre déposée le {offerDate.toLocaleDateString('fr-FR')} à {offerDate.toLocaleTimeString('fr-FR')} 
                </p>
            offerStatusMess = <span className={`annonce-messages-buyer-offer-${e.offers[0].status}`}>{offerStatus}</span>;

            return (
                <Col key = {i} xs={{span:24}} md={{span:12}} lg={{span:8}} xl={{span:6}}>
                    <Link className="annonce-element" to={`/ad/${e._id}`}>
                        {offerStatusMess}
                        <img className="annonce-image" src={e.photos[0]} />
                        <div className="annonce-text-buyer">
                            <div className="annonce-price-container">
                                <span className="annonce-price">{priceFormatter.format(e.price)}</span>
                            </div>
                            <p className="annonce-address-title">{e.address}</p>
                            <p className="annonce-address-sub">{e.postcode} {e.city}</p>
                        </div>
                        <div className="annonce-infos-buyer">
                            <span className="annonce-area"><img src="expand.svg" width="20px"/> {e.area} <span>&nbsp;m2</span></span>
                            <span className="annonce-room"><img src="floor-plan.png" width="20px"/> {e.rooms} <span>&nbsp;pièces</span></span>
                            <span className="annonce-bedroom"><img src="bed.svg" width="20px"/> {e.bedrooms} <span>&nbsp;chambres</span></span>
                        </div>
                        <div className="annonce-status-buyer">
                            {offerMessage}
                        </div>
                    </Link>
                </Col>
            )
        })


    let adsVisits = [];

        adsVisits = adsCopy.filter( e => e.timeSlots.length > 0)

        adsVisits = adsVisits.map( (e,i) => {
            
            let visitMessage;
                var visitEndDate = dateCreate(e.timeSlots[0].end)
                var visitStartDate = dateCreate(e.timeSlots[0].start)
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
                            <img className="annonce-image" src={e.photos[0]} />
                            <div className="annonce-text-buyer">
                                <div className="annonce-price-container">
                                    <span className="annonce-price">{priceFormatter.format(e.price)}</span>
                                </div>
                                <p className="annonce-address-title">{e.address}</p>
                                <p className="annonce-address-sub">{e.postcode} {e.city}</p>
                            </div>
                            <div className="annonce-infos-buyer">
                                <span className="annonce-area"><img src="expand.svg" width="20px"/> {e.area} <span>&nbsp;m2</span></span>
                                <span className="annonce-room"><img src="floor-plan.png" width="20px"/> {e.rooms} <span>&nbsp;pièces</span></span>
                                <span className="annonce-bedroom"><img src="bed.svg" width="20px"/> {e.bedrooms} <span>&nbsp;chambres</span></span>
                            </div>
                            <div className="annonce-status-buyer">
                                {visitMessage}
                            </div>
                        </Link>
                    </Col>
                )

        })


    let adsAll = adsCopy.map( (e,i) => {

        return (
            <Col key = {i} xs={{span:24}} md={{span:12}} lg={{span:8}} xl={{span:6}}>
                <Link className="annonce-element" to={`/ad/${e._id}`}>
                    <img className="annonce-image" src={e.photos[0]} />
                    <div className="annonce-text-buyer">
                        <div className="annonce-price-container">
                            <span className="annonce-price">{priceFormatter.format(e.price)}</span>
                        </div>
                        <p className="annonce-address-title">{e.address}</p>
                        <p className="annonce-address-sub">{e.postcode} {e.city}</p>
                    </div>
                    <div className="annonce-infos-buyer">
                        <span className="annonce-area"><img src="expand.svg" width="20px"/> {e.area} <span>&nbsp;m2</span></span>
                        <span className="annonce-room"><img src="floor-plan.png" width="20px"/> {e.rooms} <span>&nbsp;pièces</span></span>
                        <span className="annonce-bedroom"><img src="bed.svg" width="20px"/> {e.bedrooms} <span>&nbsp;chambres</span></span>
                    </div>
                </Link>
            </Col>
        )
    })

    console.log(adsCopy)
    console.log(adsVisits)

    return (
  
        <Layout className="user-layout">

            <UserNavHeader current="Biens consultés"/>

            <Layout className='user-layout main-content'>

            <Content>
                    
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

                    {adsCopy.length > 0 &&
                        <div>
                            <h1 className='userTitle'>Mes biens consultés</h1>
                            <Row gutter={16} className="ads-row">
                                {adsAll}
                            </Row>
                        </div>
                    }
                   
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }


  function mapStateToProps(state) {
    return { 
        userToken : state.userToken
    }
  }
  
  export default connect(
    mapStateToProps,
    null
  )(Home)