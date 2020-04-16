import React, {useState, useEffect} from 'react'
import { Row, Button, Col, Modal, message } from 'antd'

import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

import Unauthorized401 from './Unauthorized401'
import InternalError500 from './InternalError500'
import GlobalSpin from './GlobalSpin'

import {CheckCircleOutlined, WarningOutlined} from '@ant-design/icons'

function Offers() {

    const [offersList, setOfferslist] = useState([])

    const [displayOffers, setDisplayOffers] = useState(true)
    const [offerStatus, setOfferStatus] = useState(null)

    const [offerModalVisible, setOfferModalVisible] = useState(false)
    const [offerModalProperties, setOfferModalProperties] = useState({_id:'',singleBuyer:true,status:'',firstname1:'',lastname1:'',firstname2:'',lastname2:'',amount:'',loanAmount:'',contributionAmount:'',monthlyPay:'',notaryName:'',notaryAddress:'',notaryEmail:'',validityPeriod:'',creationDate:'',message:''})
    const [adModalProperties, setAdModalProperties] = useState({_id:''})

    const [offerAcceptLoading, setOfferAcceptLoading] = useState(false)
    const [offerDeclineLoading, setOfferDeclineLoading] = useState(false)
    const [offerCancelLoading, setOfferCancelLoading] = useState(false)
    const [offerError, setOfferError] = useState('')

    const [cookies, setCookie] = useCookies(['name']) // initilizing state cookies

    const [redirectTo401, setRedirectTo401] = useState(false)
    const [internalError, setInternalError] = useState(false)
  
    const [dbLoading, setDbLoading] = useState(true)
  
    /* Token refresh */
    const renewAccessToken = (token) => {
        if (token !== cookies.aT) {
            setCookie('aT', token, {path:'/pro'})
        }
    }

    /* Offer Cards */
    useEffect( () => {
        const dbFetch = async () => {
            const getAds = await fetch(`/pro/ads`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${cookies.aT}`
                }
            })

            if (getAds.status === 500) {
                setInternalError(true)
            
            } else if (getAds.status === 401) {
                setRedirectTo401(true)
          
            } else if (getAds.status === 200) {
                const response = await getAds.json()
                renewAccessToken(response.accessToken) // Renew token if invalid soon
                setOfferslist(response.data.ads.filter( e => e.offers.length > 0))
                setDbLoading(false)
            }
        }   
    dbFetch()
    }, [displayOffers])

    let showModal = () => {
        setOfferModalVisible(true)
    }

    let hideModal = () => {
        setOfferError('')
        setOfferModalVisible(false)
    }

    // Accept offer
    const handleAcceptOffer = async () => {

        setOfferAcceptLoading(true)
        const acceptOffer = await fetch(`/pro/ad/${adModalProperties._id}/offer/${offerModalProperties._id}/accept`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.aT}`
            }
        })

        if (acceptOffer.status === 500) {
            setOfferError('Votre créneau n\'a pas pu être modifié, veuillez réessayer.')
            setOfferAcceptLoading(false)
        
        } else if (acceptOffer.status === 401) {
            setRedirectTo401(true)
            setOfferAcceptLoading(false)
            setOfferError('')
    
        } else if (acceptOffer.status === 200) {
            const body = await acceptOffer.json()
            renewAccessToken(body.accessToken)
            message.success('L\'offre a bien été acceptée', 3) // add a message with email 
            setOfferModalProperties({_id:'',singleBuyer:true,status:'',firstname1:'',lastname1:'',firstname2:'',lastname2:'',amount:'',loanAmount:'',contributionAmount:'',monthlyPay:'',notaryName:'',notaryAddress:'',notaryEmail:'',validityPeriod:'',creationDate:'',message:''})
            setOfferModalVisible(false)
            setOfferAcceptLoading(false)
            setDisplayOffers(!displayOffers)
            setOfferError('')
        }
    }

    // Decline offer
    const handleDeclineOffer = async () => {

        setOfferDeclineLoading(true)
        const declineOffer = await fetch(`/pro/ad/${adModalProperties._id}/offer/${offerModalProperties._id}/decline`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.aT}`
            }
        })

        if (declineOffer.status === 500) {
            setOfferError('L\'offre n\'a pas pu être refusée, veuillez réessayer.')
            setOfferDeclineLoading(false)
        
        } else if (declineOffer.status === 401) {
            setRedirectTo401(true)
            setOfferDeclineLoading(false)
            setOfferError('')
    
        } else if (declineOffer.status === 200) {
            const body = await declineOffer.json()
            renewAccessToken(body.accessToken)
            message.success('L\'offre a bien été refusée', 3) // add a message with email 
            setOfferModalProperties({_id:'',singleBuyer:true,status:'',firstname1:'',lastname1:'',firstname2:'',lastname2:'',amount:'',loanAmount:'',contributionAmount:'',monthlyPay:'',notaryName:'',notaryAddress:'',notaryEmail:'',validityPeriod:'',creationDate:'',message:''})
            setOfferModalVisible(false)
            setDisplayOffers(!displayOffers)
            setOfferDeclineLoading(false)
            setOfferError('')
        }
    }

    // Cancel offer acceptation
    const handleCancelOffer = async () => {
        
        setOfferCancelLoading(true)
        const cancelOffer = await fetch(`/pro/ad/${adModalProperties._id}/offer/${offerModalProperties._id}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.aT}`
            }
        })

        if (cancelOffer.status === 500) {
            setOfferError('L\'offre n\'a pas pu être annulée, veuillez réessayer.')
            setOfferCancelLoading(false)
        
        } else if (cancelOffer.status === 401) {
            setRedirectTo401(true)
            setOfferCancelLoading(false)
            setOfferError('')
    
        } else if (cancelOffer.status === 200) {
            const body = await cancelOffer.json()
            renewAccessToken(body.accessToken)
            message.success('L\'offre n\'est plus acceptée', 3) // add a message with email 
            setOfferModalProperties({_id:'', singleBuyer:true, status:'',firstname1:'',lastname1:'',firstname2:'',lastname2:'',amount:'',loanAmount:'',contributionAmount:'',monthlyPay:'',notaryName:'',notaryAddress:'',notaryEmail:'',validityPeriod:'',creationDate:'',message:''})
            setOfferModalVisible(false)
            setDisplayOffers(!displayOffers)
            setOfferCancelLoading(false)
            setOfferError('')
        }
    }

    const modalFooter = 
    <div className="modal-footer">
        {offerError !=='' &&
          <div style={{marginBottom: '8px', textAlign: 'center', color:'#f67280'}}>
            <WarningOutlined style={{marginRight: '2px'}}/>
            <span style={{marginLeft: '2px'}}>
                {offerError}
            </span>
            </div>
        }
        {offerStatus === true
        ?
        <Button className="button-decline" loading={offerCancelLoading} onClick={handleCancelOffer}>
            Annuler l'offre
        </Button>
        :
        <div className="modal-footer-buttons">
        <Button type="primary" className="button-decline" loading={offerDeclineLoading} onClick={handleDeclineOffer}>
            Refuser l'offre
        </Button>
        <Button type="primary" className="button-validate" loading={offerAcceptLoading} onClick={handleAcceptOffer}>
            Accepter l'offre
        </Button>
        </div>
        }
    </div>
    

    /* Price formatting */
    const priceFormatter = new Intl.NumberFormat('fr', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        useGrouping: true
    })

    let sortedOffers = offersList.map((e,i) => {
        return (
        <div key={i} id={e._id} className='offer-section'>
            <h2 className='title'>{e.title}</h2>
            
                <Row gutter={16} className="offer-carrousel">
                    { e.offers.map( (f,i) => {
                        let color
                        let unclickable
                        let picto
                        if(f.status === 'accepted') {
                            color = '#6ce486'
                        }
                        if(f.status === 'declined') {
                            color = '#e86b43'
                            unclickable='unclickable'
                        } else if(f.status === 'canceled') {
                            color = '#e86b43'
                            unclickable='unclickable'
                        } 
                        if(f.amount === e.price) {
                            picto = <CheckCircleOutlined />
                        }
                        if(f.status === 'pending') {
                            color = '#116BD9'
                        }
                        
                        return (
                            <Col key = {i} 
                                onClick={ () => {
                                    console.log(f)
                                    showModal()
                                    setOfferModalProperties(f)
                                    setAdModalProperties(e)
                                    {if(f.status === 'accepted') { setOfferStatus(true) } else { setOfferStatus(false) }}
                                }}
                                className={unclickable}
                            >
                                <div className="offre-element">
                                    <div className="offre-amount" style={{backgroundColor: color}}>
                                    {picto}<span className="annonce-price"> {priceFormatter.format(f.amount)}</span>
                                    </div>
                                    <div className="offre-buyer">
                                        <p className="offre-buyer-name">{f.firstName1} {f.lastName1}</p>
                                    </div>
                                    <div className="offre-money">
                                        <p className="offre-contribution"><span>Apport : </span>{priceFormatter.format(f.contributionAmount)}</p>
                                        <p className="offre-loan"><span>Emprunt : </span>{priceFormatter.format(f.loanAmount)}</p>
                                    </div>
                                    <div className="offre-bottom">
                                        <span className="offre-details">reçue le {new Date(f.creationDate).toLocaleDateString('fr-FR')} <br/>à {new Date(f.creationDate).toLocaleTimeString('fr-FR')}</span>
                                    </div>
                                </div>
                            </Col>
                        )
                    })}
                </Row>
        </div>
        )  
    })


/*----------------------------------------------- RENDER COMPONENT ---------------------------------------------------*/
    if (redirectTo401) {
        return <Unauthorized401 />
    }
      if (internalError) {
        return <InternalError500 />
    }
    
    if (dbLoading) {
        return <GlobalSpin />
    }

    return (
  
        <div>
        <h1 className='pageTitle'>Les offres</h1>

            {sortedOffers}
            
            <Modal
                className="new-offer-modal"
                title= {<p className="newoffer-modal-title">RÉCAPITULATIF DE L'OFFRE</p>}
                visible={offerModalVisible}
                centered
                footer= {modalFooter}
                destroyOnClose= {true}
                width= "60%"
                closable={true}
                mask={true}
                maskClosable={true}
                onCancel={hideModal}
            >
                <div className="newoffer-modal">
                    <div className="newoffer-modal-section">
                        <div className="newoffer-modal-section-title">
                            <p>Informations personnelles</p>
                        </div>
                        <div className="newoffer-modal-section-content">
                            <div className="newoffer-modal-section-content-block">
                                <span>Acheteur : </span>
                                <span className="newoffer-modal-section-content-data">{`${offerModalProperties.firstName1} ${offerModalProperties.lastName1}`}</span>
                            </div>
                            {!offerModalProperties.singleBuyer &&
                            <div className="newoffer-modal-section-content-block">
                                <span>Acheteur 2 : </span>
                                <span className="newoffer-modal-section-content-data">{`${offerModalProperties.firstName2} ${offerModalProperties.lastName2}`}</span>
                            </div>
                            }
                            <div className="newoffer-modal-section-content-block">
                                <span>Adresse : </span>
                                <span className="newoffer-modal-section-content-data">{`${offerModalProperties.address} - ${offerModalProperties.postCode} ${offerModalProperties.city}`}</span>
                            </div>
                        </div>
                    </div>
                

                    <div className="newoffer-modal-section">
                            <div className="newoffer-modal-section-title">
                                <p>Offre</p>
                            </div>
                            <div className="newoffer-modal-section-content">
                                <div className="newoffer-modal-section-content-block">
                                    <span>Montant : </span>
                                    <span className="newoffer-modal-section-content-data">{priceFormatter.format(offerModalProperties.amount)}</span>
                                </div>
                                <div className="newoffer-modal-section-content-block">
                                    <span className="newoffer-modal-section-content-minor">Dont apport : </span>
                                    <span className="newoffer-modal-section-content-data">{priceFormatter.format(offerModalProperties.contributionAmount)}</span>
                                </div>
                                <div className="newoffer-modal-section-content-block">
                                    <span className="newoffer-modal-section-content-minor">Dont emprunt : </span>
                                    <span className="newoffer-modal-section-content-data">{priceFormatter.format(offerModalProperties.loanAmount)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="newoffer-modal-section">
                            <div className="newoffer-modal-section-title">
                                <p>Notaire</p>
                        </div>
                        {offerModalProperties.notaryName ?
                        <div className="newoffer-modal-section-content">
                            <div className="newoffer-modal-section-content-block">
                                <span>Nom : </span>
                                <span className="newoffer-modal-section-content-data">{offerModalProperties.notaryName}</span>
                            </div>
                            <div className="newoffer-modal-section-content-block">
                                <span>Adresse email : </span>
                                <span className="newoffer-modal-section-content-data">{offerModalProperties.notaryEmail}</span>
                            </div>
                            <div className="newoffer-modal-section-content-block">
                                <span>Adresse postale : </span>
                                <span className="newoffer-modal-section-content-data">{offerModalProperties.notaryAddress}</span>
                            </div>
                        </div>
                        :
                        <div>Ces informations seront communiquées ultérieurement</div>
                        }
                    </div>

                    <div className="newoffer-modal-section">
                        <div className="newoffer-modal-section-title">
                            <p>Commentaires</p>
                        </div>
                        <div className="newoffer-modal-section-content">
                            <div className="newoffer-modal-section-content-block">
                            {offerModalProperties.comments}
                            </div>
                        </div>
                    </div>

                    <div className="newoffer-modal-section">
                        <div className="newoffer-modal-section-title">
                            <p>Conditions</p>
                        </div>
                        <div className="newoffer-modal-section-content">
                            <div className="newoffer-modal-section-content-block">
                                <span>Durée de validité de l'offre : </span>
                                <span className="newoffer-modal-section-content-data">{`${offerModalProperties.validityPeriod} jours`}</span>
                            </div>
                            <div className="newoffer-modal-section-content-block">
                                <span>Offre faite à : </span>
                                <span className="newoffer-modal-section-content-data">{offerModalProperties.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

function mapStateToProps(state) {
    return { 
        agentLoginInfo : state.agentLoginInfo
    }
}

export default connect(
    mapStateToProps,
    null
)(Offers)