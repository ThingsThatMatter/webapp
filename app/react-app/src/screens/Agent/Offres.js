import React, {useState, useEffect} from 'react';
import { Layout, Row, Button, Col, Collapse, Carousel, Modal } from 'antd';
import {Redirect} from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import {PlusCircleOutlined} from '@ant-design/icons'
const { Panel } = Collapse;

const { Content } = Layout;
var tokenTest = "idMN5ebalGgc336ZVmkMI5n8P2zA8PXn"

function Offres() {

    const [offersList, setOfferslist] = useState([])

    const [displayOffers, setDisplayOffers] = useState(true)
    const [offerStatus, setOfferStatus] = useState(null)

    const [offerModalVisible, setOfferModalVisible] = useState(false)
    
    const [offerModalProperties, setOfferModalProperties] = useState({_id:'',status:'',firstname1:'',lastname1:'',firstname2:'',lastname2:'',amount:'',loanAmount:'',contributionAmount:'',monthlyPay:'',notaryName:'',notaryAddress:'',notaryEmail:'',validityPeriod:'',creationDate:'',message:''})

    const [adModalProperties, setAdModalProperties] = useState({_id:''})
  
    /* Offre Cards */
    useEffect( () => {
        const dbFetch = async () => {
            const ads = await fetch(`/pro/ads`, {
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', token: tokenTest}
            })
            const body = await ads.json();
          
            let adsWithOffers = body.data.ads.filter( e => e.offers.length > 0);
    
        setOfferslist(adsWithOffers)

        }   
    dbFetch()
    }, [displayOffers]);

    let showModal = () => {
        setOfferModalVisible(true)
    };

    let hideModal = () => {
        setOfferModalVisible(false)
    };

    // Accepter une offre d'achat
    const handleAcceptOffer = async () => {
        const dbFetch = async () => {
            const acceptOffer = await fetch(`/pro/ad/${adModalProperties._id}/offer/${offerModalProperties._id}/accept`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', token: tokenTest}
            })
            const body = await acceptOffer.json();
        }   
        dbFetch()
        setOfferModalProperties({_id:'',status:'',firstname1:'',lastname1:'',firstname2:'',lastname2:'',amount:'',loanAmount:'',contributionAmount:'',monthlyPay:'',notaryName:'',notaryAddress:'',notaryEmail:'',validityPeriod:'',creationDate:'',message:''})
        setOfferModalVisible(false)
        setDisplayOffers(!displayOffers)
    }

    // Refuser une offre d'achat
    const handleDeclineOffer = async () => {
        const dbFetch = async () => {
            const declineOffer = await fetch(`/pro/ad/${adModalProperties._id}/offer/${offerModalProperties._id}/decline`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', token: tokenTest}
            })
            const body = await declineOffer.json();
        }   
        dbFetch()
    }

    // Annuler une offre d'achat
    const handleCancelOffer = async () => {
        const dbFetch = async () => {
            const cancelOffer = await fetch(`/pro/ad/${adModalProperties._id}/offer/${offerModalProperties._id}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', token: tokenTest}
            })
            const body = await cancelOffer.json();
        }   
        dbFetch()
    }

    const modalFooter = 
    <div className="modal-footer">
        {offerStatus === true
        ?
        <Button className="button-decline" onClick={handleCancelOffer}>
            Annuler l'offre
        </Button>
        :
        <div className="modal-footer-buttons">
        <Button className="button-decline" onClick={handleDeclineOffer}>
            Refuser l'offre
        </Button>
        <Button type="primary" className="button-validate" onClick={handleAcceptOffer}>
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
            <div key={i} className='offer-section'>
                <h2 className='title'>{e.title} - {e.area}m<sup>2</sup> - {e.address} {e.postcode} {e.city} - {priceFormatter.format(e.price)}</h2>
                
                    <Row gutter={16} className="offer-carrousel">
                        { e.offers.map( (f,i) => {
                            let color;
                            let unclickable;
                            if(f.status === 'accepted') {
                                color = '#6ce486';
                            }
                            if(f.status === 'declined') {
                                unclickable= 'unclickable';
                            }
                            console.log(f)
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
                                        <span className="annonce-price">{priceFormatter.format(f.amount)}</span>
                                    </div>
                                    <div className="offre-buyer">
                                        <p className="offre-buyer-name">{f.firstname1} {f.lastname1}</p>
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
                        })
                        }
                    </Row>
            </div>
            )
            
        });


    return (
  
        <Layout>


            <Sidebar/>

            <Layout className='main-content'>
                <Content style={{ margin: '24px 16px 0' }}>
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
                                    <p><span>Acheteur #1 : </span>{offerModalProperties.firstname1} {offerModalProperties.lastname1}</p>
                                    <p><span>Acheteur #2 : </span>{offerModalProperties.firstname2} {offerModalProperties.lastname2}</p>
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

    );
  }
  
  export default Offres;