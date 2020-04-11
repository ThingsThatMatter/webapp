import React, {useState, useEffect} from 'react'
import { Layout, Row, Button, Col, Modal, message } from 'antd'

import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

import Sidebar from '../../components/Agent/Sidebar'
import Unauthorized401 from './Unauthorized401'
import InternalError500 from './InternalError500'
import GlobalSpin from '../../components/Agent/GlobalSpin'

import {CheckCircleOutlined, WarningOutlined} from '@ant-design/icons'

const { Content } = Layout

function Offers() {

    const [offersList, setOfferslist] = useState([])

    const [displayOffers, setDisplayOffers] = useState(true)
    const [offerStatus, setOfferStatus] = useState(null)

    const [offerModalVisible, setOfferModalVisible] = useState(false)
    const [offerModalProperties, setOfferModalProperties] = useState({_id:'',status:'',firstname1:'',lastname1:'',firstname2:'',lastname2:'',amount:'',loanAmount:'',contributionAmount:'',monthlyPay:'',notaryName:'',notaryAddress:'',notaryEmail:'',validityPeriod:'',creationDate:'',message:''})
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
            setOfferModalProperties({_id:'',status:'',firstname1:'',lastname1:'',firstname2:'',lastname2:'',amount:'',loanAmount:'',contributionAmount:'',monthlyPay:'',notaryName:'',notaryAddress:'',notaryEmail:'',validityPeriod:'',creationDate:'',message:''})
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
            setOfferModalProperties({_id:'',status:'',firstname1:'',lastname1:'',firstname2:'',lastname2:'',amount:'',loanAmount:'',contributionAmount:'',monthlyPay:'',notaryName:'',notaryAddress:'',notaryEmail:'',validityPeriod:'',creationDate:'',message:''})
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
            setOfferModalProperties({_id:'',status:'',firstname1:'',lastname1:'',firstname2:'',lastname2:'',amount:'',loanAmount:'',contributionAmount:'',monthlyPay:'',notaryName:'',notaryAddress:'',notaryEmail:'',validityPeriod:'',creationDate:'',message:''})
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
  
        <Layout>
            <Sidebar menuKey='2'/>
            <Layout className='main-content'>
                <Content>
                <h1 className='pageTitle'>Les offres</h1>

                    {sortedOffers}
                    
                    <Modal
                        title="Offre d'achat"
                        visible={offerModalVisible}
                        footer= {modalFooter}
                        destroyOnClose= {true}
                        width= "50%"
                        closable={true}
                        mask={true}
                        maskClosable={true}
                        onCancel={hideModal}
                    >
                        <div className="offer-modal">
                            <Row gutter={16}>
                                <Col xs={12}>
                                    <p><span>Acheteur #1 : </span>{offerModalProperties.firstName1} {offerModalProperties.lastName1}</p>
                                    <p><span>Acheteur #2 : </span>{offerModalProperties.firstName2} {offerModalProperties.lastName2}</p>
                                    <p><span>Montant de l'offre : </span>{priceFormatter.format(offerModalProperties.amount)}</p>
                                    <p><span>Emprunt : </span>{priceFormatter.format(offerModalProperties.loanAmount)}</p>
                                    <p><span>Apport : </span>{priceFormatter.format(offerModalProperties.contributionAmount)}</p>
                                    <p><span>Salaire mensuel : </span>{priceFormatter.format(offerModalProperties.monthlyPay)} /mois</p>
                                </Col>
                                <Col xs={12}>
                                    <p><span>Notaire acheteur : </span>{offerModalProperties.notaryName} à {offerModalProperties.notaryAddress}</p>
                                    <p><span>Email notaire : </span>{offerModalProperties.notaryEmail}</p>

                                    <p><span>Validité de l'offre : </span>{offerModalProperties.validityPeriod} jours</p>
                                    <p>Fait à {offerModalProperties.location}, le {new Date(offerModalProperties.creationDate).toLocaleDateString('fr-FR')}</p>

                                    <p><span>Message de l'acheteur : </span>{offerModalProperties.message}</p>
                                </Col>
                            </Row>
                        </div>
                    </Modal>
                </Content>         
            </Layout>
        </Layout>
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