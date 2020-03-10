import React, {useState, useEffect} from 'react';
import UserNavHeader from '../../components/UserNavHeader';
import {Link} from 'react-router-dom'

import { Layout, Col, Row} from 'antd';
const {Content} = Layout;

var tokenTest = 'njn2MLOiFPpUhfrAFUh1XeJj5ZBNgFHk'

function Home() {

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
            headers: {'token': tokenTest}
        })
        const body = await ads.json();
        setAdsListFromDb(body.data.ads)
        console.log(body)
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
        return (dateCreate(a.creationDate) - dateCreate(b.creationDate))
    })
    //rend
    adsCopy = adsCopy.map( (e,i) => {
        
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

         /* Offer status translation */
        const statusInFrench = {
            'pending' : 'En attente',
            'declined' : 'Refusée',
            'accepted' : 'Acceptée'
        }
        const statusTranslate = (state) => statusInFrench[state]

        let offerMessage;
        if ( e.offers.length > 0) {
            const offerDate = dateCreate(e.offers[0].creationDate)
            const offerStatus = statusTranslate(e.offers[0].status)
            offerMessage = 
                <p className="annonce-messages-buyer">
                    Offre déposée le {offerDate.toLocaleDateString('fr-FR')} à {offerDate.toLocaleTimeString('fr-FR')} - <span className={`annonce-messages-buyer-offer-${e.offers[0].status}`}>{offerStatus}</span>
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
                        <p className="annonce-address-title">{e.title}</p>
                        <p className="annonce-address-sub">{e.postcode} {e.city}</p>
                    </div>
                    <div className="annonce-infos-buyer">
                        <span className="annonce-area"><img src="expand.svg" width="20px"/> {e.area} <span>&nbsp;m2</span></span>
                        <span className="annonce-room"><img src="floor-plan.png" width="20px"/> {e.rooms} <span>&nbsp;pièces</span></span>
                        <span className="annonce-bedroom"><img src="bed.svg" width="20px"/> {e.bedrooms} <span>&nbsp;chambres</span></span>
                    </div>
                    <div className="annonce-status-buyer">
                        {visitMessage}
                        {offerMessage}
                    </div>
                </Link>
            </Col>
        )
    })

    return (
  
        <Layout className="user-layout">

            <UserNavHeader current="Biens consultés"/>

            <Layout className='user-layout main-content'>

                <Content style={{ margin: '2em 3em' }}>

                    <h1 className='pageTitle'>Mes biens consultés</h1>
                    
                    <Row gutter={16}>
                        {adsCopy}
                    </Row>
                   
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  export default Home;