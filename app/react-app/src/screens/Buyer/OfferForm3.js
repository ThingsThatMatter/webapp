import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import UserNavHeader from '../../components/UserNavHeader'

import {connect} from 'react-redux'

import { Layout, Row, Col, Input, InputNumber, Button, Checkbox, Modal} from 'antd'
import {EditOutlined} from '@ant-design/icons'
const {Content} = Layout
const {TextArea} = Input

var ad_id = '5e5e7acc9e95c72c1a48542b' //will come from redux after
var tokenTest = 'njn2MLOiFPpUhfrAFUh1XeJj5ZBNgFHk'

function OfferForm3(props) {

    const [adFromDb, setAdFromDb] = useState(null)

    const [notaryName, setNotaryName] = useState('')
    const [notaryEmail, setNotaryEmail] = useState('')
    const [notaryAddress, setNotaryAddress] = useState('')
    const [disableNotary, setDisableNotary] = useState(false)
    const [validityPeriod, setValidityPeriod] = useState('')
    const [offerLocation, setOfferLocation] = useState('')
    const [comments, setComments] = useState('')
    
    const [offerFormError, setOfferFormError] = useState('')
    const [offerRedirHome, setOfferRedirHome] = useState(false)
    const [offerRedirStep1, setOfferRedirStep1] = useState(false)
    const [offerBackRedir, setOfferBackRedir] = useState(false)

    const [modalVisible, setModalVisible] = useState(false)

    /* ----------------------------------------------------AD CARD--------------------------------------- */

    /* Price formatting */
    const priceFormatter = new Intl.NumberFormat('fr', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        useGrouping: true
    })

    /* Date Formatting */
    const dateCreate = (date) => {
        var year = date.slice(0,4)
        var month = Number(date.slice(5,7))-1
        var day = date.slice(8,10)
        var hour = date.slice(11,13)
        var min = date.slice(14,16)
        return new Date(year, month, day, hour, min)
    }

    /* Get Ad info */
    useEffect( () => {
        const adFetch = async () => {
          const ad = await fetch(`/user/ad/${ad_id}`, {
            method: 'GET',
            headers: {'token': tokenTest}
        })
          const body = await ad.json();
          setAdFromDb(body.data.ad)
        }
        adFetch()
      }, [])

    let ad;
    if (adFromDb !== null) {

    const visitStartDate= dateCreate(adFromDb.timeSlots[0].start)
    const visitMessage = 
        <p className="annonce-messages-buyer">
            Visite effectuée le {visitStartDate.toLocaleDateString('fr-FR')} à {visitStartDate.toLocaleTimeString('fr-FR')}
        </p>

    ad = 
        <div className="annonce-element offer-form">
            <img className="annonce-image" width="100%" src={adFromDb.photos[0]} />
            <div className="annonce-text-buyer">
                <div className="annonce-price-container">
                    <span className="annonce-price">{priceFormatter.format(adFromDb.price)}</span>
                </div>
                <p className="annonce-address-title">{adFromDb.title}</p>
                <p className="annonce-address-sub">{adFromDb.postcode} {adFromDb.city}</p>
            </div>
            <div className="annonce-infos-buyer">
                <span className="annonce-area"><img src="expand.svg" width="20px"/> {adFromDb.area} <span>&nbsp;m2</span></span>
                <span className="annonce-room"><img src="floor-plan.png" width="20px"/> {adFromDb.rooms} <span>&nbsp;pièces</span></span>
                <span className="annonce-bedroom"><img src="bed.svg" width="20px"/> {adFromDb.bedrooms} <span>&nbsp;chambres</span></span>
            </div>
            <div className="annonce-status-buyer">
                {visitMessage}
            </div>
        </div>
    }

/* ------------------------------------------------------DOTS-------------------------------------------- */

    const stepDots = step => {
        let spans = []
        for (let i=0 ; i<step ; i++) {
            spans.push(<span key={i} className="newoffer-step-dots filled-dots"> </span>);
        }
        for (let i=0 ; i<3-step ; i++) {
            spans.push(<span key={step+i} className="newoffer-step-dots empty-dots"> </span>);
        }
        return spans
    }

/* -----------------------------------------------FORM VALIDATION------------------------------------------ */

    const handleClick = () => {
        if(validityPeriod !== "" && offerLocation !== "" && comments !== "" ) {
            props.offerSaveFormData(validityPeriod, offerLocation, comments, notaryName, notaryEmail, notaryAddress);
            setModalVisible(true)

        } else {
            setOfferFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }
    }

    if(offerRedirHome === true) {
        return <Redirect to="/"/> // Triggered by button handleClick
    }
    if(offerRedirStep1 === true) {
        return <Redirect to="/newoffer/step1"/> // Triggered by button handleClick
    }
    if(offerBackRedir === true) {
        return <Redirect to="/newoffer/step2"/> // Triggered by button-back handleClick
    }

    return (
  
        <Layout className="user-layout">
            <UserNavHeader/> 
            <Layout className='user-layout main-content'>
                <Content style={{ margin: '24px 16px 0' }}>
                   
                   <Row className="newoffer-stepbar">
                       <h1 className="newoffer-stepbar-title"> Nouvelle offre - Informations complémentaires </h1>
                       <div> {stepDots(props.newOfferStep)} </div>
                   </Row>

                   <Row className="newoffer-form-body" gutter={16}>
                        <Col xs={24} md={16}>
                            <form>
                                
                                <h2 className="newoffer-subsection-title"> Notaire </h2>
                                <label>
                                    <Checkbox className="second-buyer" onChange={ e => setDisableNotary(e.target.checked)} >
                                        Je fournirai ces informations plus tard
                                    </Checkbox>
                                </label>

                                <p className='formLabel-offer'>Nom du notaire</p>
                                <label >
                                    <Input onChange={(e) => setNotaryName(e.target.value)} value={notaryName} disabled={disableNotary}/>
                                </label>

                                <p className='formLabel-offer'>Adresse email du notaire</p>
                                <label>
                                    <Input className="last-name-1-offer" onChange={ e => setNotaryEmail(e.target.value)} value={notaryEmail} disabled={disableNotary} />
                                </label>

                                <p className='formLabel-offer'>Adresse postale du notaire</p>
                                <label >
                                    <Input onChange={ e => setNotaryAddress(e.target.value)} value={notaryAddress} disabled={disableNotary} />
                                </label>

                                <h2 className="newoffer-subsection-title"> Conditions </h2>
                                <p className='formLabel-offer'>Durée de validité de l'offre (jours)</p>
                                <label >
                                    <InputNumber onChange={ e => setValidityPeriod(e)} value={validityPeriod}/>
                                </label>

                                <p className='formLabel-offer'>Offre faite à</p>
                                <label>
                                    <Input onChange={ e => setOfferLocation(e.targetValue)} value={offerLocation} />
                                </label>
                                
                                <h2 className="newoffer-subsection-title"> Commentaires </h2>
                                <label>
                                    <TextArea onChange={ e => setComments(e.target.value)} value={comments} />
                                </label>
                                
                            </form>
                            {offerFormError} 
                            <Button
                                type="primary"
                                className="button-back"
                                onClick={() => {
                                    setOfferBackRedir(true)
                                    props.offerPreviousStep()
                                }}
                            >
                                Précédent
                            </Button> 
                            <Button
                                onClick={()=> handleClick()}
                                type="primary"
                                className="button-validate"
                            >
                                Valider - Voir récapitulatif
                            </Button>

                        </Col>
                        <Col className="newoffer-ad-card"xs={0} md={8}>
                        {ad}
                        </Col>
                   </Row >


                   <Modal
                        className="new-offer-modal"
                        title= {<p className="newoffer-modal-title">RÉCAPITULATIF DE VOTRE OFFRE</p>}
                        visible={modalVisible}
                        centered
                        okText="Déposer l'offre"
                        onOk={() => () => {setModalVisible(false) ; setOfferRedirHome(true) }}
                        cancelText="Annuler"
                        cancelButtonProps={{type: 'primary', className:'button-back'}}
                        onCancel={ () => setModalVisible(false)}
                        destroyOnClose= {true}
                        width= "80%"
                        closable={true}
                        mask={true}
                        maskClosable={true}
                    >
                        <div className="newoffer-modal">
                            <div className="newoffer-modal-section first-section">
                                <div className="newoffer-modal-section-title">
                                    <p>Informations personnelles</p>
                                    <EditOutlined
                                        className="newoffer-modal-section-title-icon"
                                        onClick={() => setOfferRedirStep1(true)}
                                    />
                                </div>
                                <div className="newoffer-modal-section-content">
                                    <div className="newoffer-modal-section-content-block">
                                        <span>Acheteur : </span>
                                        <span className="newoffer-modal-section-content-data">Jean-Claude Dusse</span>
                                    </div>
                                    <div className="newoffer-modal-section-content-block">
                                        <span>Acheteur 2 : </span>
                                        <span className="newoffer-modal-section-content-data">Jacqueline Dusse</span>
                                    </div>
                                    <div className="newoffer-modal-section-content-block">
                                        <span>Adresse : </span>
                                        <span className="newoffer-modal-section-content-data">25, avenue du Général de Gaulle - 94000 - Chatenay Malabri</span>
                                    </div>
                                </div>
                            </div>

                            <div className="newoffer-modal-section">
                                <div className="newoffer-modal-section-title">
                                    <p>Offre</p>
                                    <EditOutlined
                                        className="newoffer-modal-section-title-icon"
                                        onClick={() => setOfferRedirStep1(true)}
                                    />
                                </div>
                                <div className="newoffer-modal-section-content">
                                    <div className="newoffer-modal-section-content-block">
                                        <span>Montant : </span>
                                        <span className="newoffer-modal-section-content-data">300 000€</span>
                                    </div>
                                    <div className="newoffer-modal-section-content-block">
                                        <span className="newoffer-modal-section-content-minor">Dont apport : </span>
                                        <span className="newoffer-modal-section-content-data">100 000 €</span>
                                    </div>
                                    <div className="newoffer-modal-section-content-block">
                                        <span className="newoffer-modal-section-content-minor">Dont emprunt : </span>
                                        <span className="newoffer-modal-section-content-data">200 000€</span>
                                    </div>
                                </div>
                            </div>

                            <div className="newoffer-modal-section">
                                <div className="newoffer-modal-section-title">
                                    <p>Notaire</p>
                                    <EditOutlined
                                        className="newoffer-modal-section-title-icon"
                                        onClick={() => setOfferRedirStep1(true)}
                                    />
                                </div>
                                <div className="newoffer-modal-section-content">
                                    <div className="newoffer-modal-section-content-block">
                                        <span>Nom : </span>
                                        <span className="newoffer-modal-section-content-data">Maitre Gims</span>
                                    </div>
                                    <div className="newoffer-modal-section-content-block">
                                        <span>Adresse email : </span>
                                        <span className="newoffer-modal-section-content-data">gimsbg75@gmail.com</span>
                                    </div>
                                    <div className="newoffer-modal-section-content-block">
                                        <span>Adresse postale : </span>
                                        <span className="newoffer-modal-section-content-data">25, avenue du Général de Gaulle - 94000 - Chatenay Malabri</span>
                                    </div>
                                </div>
                            </div>

                            <div className="newoffer-modal-section">
                                <div className="newoffer-modal-section-title">
                                    <p>Commentaires</p>
                                    <EditOutlined
                                        className="newoffer-modal-section-title-icon"
                                        onClick={() => setOfferRedirStep1(true)}
                                    />
                                </div>
                                <div className="newoffer-modal-section-content">
                                    <div className="newoffer-modal-section-content-block">
                                        Bacon ipsum dolor amet sausage leberkas pancetta filet mignon. Meatloaf buffalo ham shankle chicken, frankfurter bacon meatball corned beef tail porchetta kielbasa. Ground round jerky sausage cow pork prosciutto, bacon pork belly jowl cupim. Meatloaf chislic beef porchetta. Brisket frankfurter kielbasa short loin burgdoggen turkey pastrami. Tenderloin ham hock buffalo beef ribs strip steak cow porchetta, chicken short loin.
                                    </div>
                                </div>
                            </div>

                            <div className="newoffer-modal-section">
                                <div className="newoffer-modal-section-title">
                                    <p>Conditions</p>
                                    <EditOutlined
                                        className="newoffer-modal-section-title-icon"
                                        onClick={() => setOfferRedirStep1(true)}
                                    />
                                </div>
                                <div className="newoffer-modal-section-content">
                                    <div className="newoffer-modal-section-content-block">
                                        <span>Durée de validité de l'offre : </span>
                                        <span className="newoffer-modal-section-content-data">7 jours</span>
                                    </div>
                                    <div className="newoffer-modal-section-content-block">
                                        <span>Offre faite à : </span>
                                        <span className="newoffer-modal-section-content-data">Moncul</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </Modal>

                </Content>  
            </Layout>
        </Layout>

    );
}

function mapStateToProps(state) {
    return { 
        newOfferStep : state.newOfferStep,
        offerFormData: state.offerFormData
    }
  }

function mapDispatchToProps(dispatch) {
    return {
        offerNextStep : function() { 
            dispatch( {type: 'offerNextStep'} ) 
        },
        offerPreviousStep : function() {
            dispatch( {type: 'offerPrevStep'} )
        },
        offerSaveFormData : function(validityPeriod, offerLocation, comments, notaryName, notaryEmail, notaryAddress) { 
            dispatch({
                type: 'offerSaveFormData3',
                validityPeriod, offerLocation, comments, notaryName, notaryEmail, notaryAddress
            })
        } 
    }
  }
    
  export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(OfferForm3);