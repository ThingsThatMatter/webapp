import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import Unauthorized401 from './Unauthorized401'

import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

import {Row, Col, Input, InputNumber, Button, Checkbox, Modal, message, Spin} from 'antd'
import {EditOutlined, LoadingOutlined} from '@ant-design/icons'
import StepDots from '../../components/StepDots'

const {TextArea} = Input

const logo = <LoadingOutlined style={{ fontSize: 22, color: "#355c7d", marginLeft: '4px', marginTop: '4px' }} spin/>


function OfferForm3(props) {

    const [notaryName, setNotaryName] = useState('')
    const [notaryEmail, setNotaryEmail] = useState('')
    const [notaryAddress, setNotaryAddress] = useState('')
    const [disableNotary, setDisableNotary] = useState(false)
    const [validityPeriod, setValidityPeriod] = useState('')
    const [offerLocation, setOfferLocation] = useState('')
    const [comments, setComments] = useState('')
    
    const [cookies, setCookie] = useCookies(['name']) // initializing state cookies
    const [offerFormError, setOfferFormError] = useState('')
    const [redirToHome, setRedirToHome] = useState(false)
    const [redirToStep1, setRedirToStep1] = useState(false)
    const [redirToStep2, setRedirToStep2] = useState(false)
    const [redirectTo401, setRedirectTo401] = useState(false)

    const [modalVisible, setModalVisible] = useState(false)
    const [postOfferErrorMsg, setPostOfferErrorMsg] = useState()
    const [postOfferLoad, setPostOfferLoad] = useState(false)

    /* Renew Access Token */
    const renewAccessToken = (token) => {
        if (token !== cookies.uT) {
            setCookie('uT', token, {path:'/'})
        }
    }

/* --------------------------------------------------PREFILL FORM-------------------------------------------- */
    useEffect(() => {

        if(props.offerFormData.validityPeriod) {     // Display inputed info if user goes back from next form pages
            setNotaryName(props.offerFormData.notaryName)
            setNotaryEmail(props.offerFormData.notaryEmail)
            setNotaryAddress(props.offerFormData.notaryAddress)
            setDisableNotary(props.offerFormData.disableNotary)
            setValidityPeriod(props.offerFormData.validityPeriod)
            setOfferLocation(props.offerFormData.offerLocation)
            setComments(props.offerFormData.comments)
        }
    }, [])


/* ----------------------------------------------------AD CARD---------------------------------------------- */

    if (!props.offerFormData.offerAmount) { // If previous step is not completed
        return <Redirect to ='/offer/new/step2' />
    }

    /* Price formatting */
    const priceFormatter = new Intl.NumberFormat('fr', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        useGrouping: true
    })

    /* Date Formatting */

    const visitStartDate= new Date(props.newOfferAd.timeSlots[0].start)
    const visitMessage = 
        <p className="annonce-messages-buyer">
            Visite effectuée le {visitStartDate.toLocaleDateString('fr-FR')} à {visitStartDate.toLocaleTimeString('fr-FR')}
        </p>

    const ad = 
        <div className="annonce-element offer-form">
            <img className="annonce-image" width="100%" src={props.newOfferAd.photos[0].url} />
            <div className="annonce-text-buyer">
                <div className="annonce-price-container">
                    <span className="annonce-price">{priceFormatter.format(props.newOfferAd.price)}</span>
                </div>
                <p className="annonce-address-title">{props.newOfferAd.title}</p>
                <p className="annonce-address-sub">{props.newOfferAd.postcode} {props.newOfferAd.city}</p>
            </div>
            <div className="annonce-infos-buyer">
                <span className="annonce-area"><img src="../../../expand.svg" width="20px"/> {props.newOfferAd.area} <span>&nbsp;m2</span></span>
                <span className="annonce-room"><img src="../../../floor-plan.png" width="20px"/> {props.newOfferAd.rooms} <span>&nbsp;{props.newOfferAd.rooms > 1 ? 'pièces' : 'pièce'}</span></span>
                <span className="annonce-bedroom"><img src="../../../bed.svg" width="20px"/> {props.newOfferAd.bedrooms} <span>&nbsp;{props.newOfferAd.bedrooms > 1 ? 'chambres' : 'chambre'}</span></span>
            </div>
            <div className="annonce-status-buyer">
                {visitMessage}
            </div>
        </div>


/* -----------------------------------------------FORM VALIDATION------------------------------------------ */

    const handleClick = () => {
        if(validityPeriod !== "" && offerLocation !== "" && comments !== "" ) {
            props.offerSaveFormData(validityPeriod, offerLocation, comments, notaryName, notaryEmail, notaryAddress)
            setModalVisible(true)

        } else {
            setOfferFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }
    }

/* ------------------------------------------OFFER CREATION IN DB------------------------------------------ */

    const createOffer = async() => {

        setPostOfferLoad(true)

        const postOffer = await fetch(`/user/ad/${props.newOfferAd._id}/offer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.uT}`
            },
            body: JSON.stringify({
                singleBuyer: !props.offerFormData.showSecondBuyer ? true : false ,
                lastName1: props.offerFormData.lastName1,
                firstName1: props.offerFormData.firstName1,
                lastName2: props.offerFormData.lastName2,
                firstName2: props.offerFormData.firstName2,
                address: props.offerFormData.address,
                postCode: props.offerFormData.postCode,
                city: props.offerFormData.city,
                amount: props.offerFormData.offerAmount,
                loan: !props.offerFormData.disableLoan ? true : false,
                loanAmount: props.offerFormData.loanAmount,
                contributionAmount: props.offerFormData.contributionAmount,
                monthlyPay: props.offerFormData.salary,
                notary: props.offerFormData.notaryName ? true : false,
                notaryName: props.offerFormData.notaryName,
                notaryAddress: props.offerFormData.notaryAddress,
                notaryEmail: props.offerFormData.notaryEmail,
                validityPeriod: props.offerFormData.validityPeriod,
                location: props.offerFormData.offerLocation,
                comments: props.offerFormData.comments
                }
            )
        })

        if (postOffer.status === 500) {
            setPostOfferLoad(false)
            setPostOfferErrorMsg('Nous rencontrons des difficultés pour déposer votre offre, veuillez réessayer.')
        
        } else if (postOffer.status === 401) {
            setRedirectTo401(true)
    
        } else if (postOffer.status === 201) {
            const body = await postOffer.json()
            renewAccessToken(body.accessToken)
            setPostOfferLoad(false)
            message.success('Votre offre a bien été transmise !', 4)
            setRedirToHome(true)
            props.offerClear()
            props.setOfferAd({})
        }
    }

/* -----------------------------------------------MODAL FOOTER-------------------------------------------- */
    const modalFooter =

        <div>
            <div className="modal-footer-buttons">            
                <Button type="primary" className="button-back" onClick={() => setModalVisible(false)}>
                    Annuler
                </Button>

                <div style={{display: 'flex', alignItems: 'center'}}>

                    {postOfferErrorMsg &&
                        <p style={{marginRight: '6px', color:'#f67280'}}>{postOfferErrorMsg}</p>
                    }

                    <Button type= "primary" className="button-validate" onClick={() => createOffer()}>
                        Déposer l'offre
                    </Button>

                    {postOfferLoad &&
                        <Spin
                            size="large"
                            indicator={logo}
                        />
                    }
                </div>
            </div>
        </div>

/*----------------------------------------------- RENDER COMPONENT ---------------------------------------------------*/

    if(redirToHome === true) {
        return <Redirect push to="/"/> // Triggered by button handleClick
    }
    if(redirToStep1 === true) {
        return <Redirect push to="/offer/new/step1"/> // Triggered by button handleClick
    }
    if(redirToStep2 === true) {
        return <Redirect push to="/offer/new/step2"/> // Triggered by button-back handleClick
    }

    if (redirectTo401) {
        return <Unauthorized401 />
    }

    return (

        <div>
                
            <Row className="newoffer-stepbar">
                <StepDots
                    title = 'Nouvelle offre - Informations complémentaires'
                    totalSteps = {3}
                    currentStep = {3}
                    filledDotsBackgroundColor = '#355c7d'
                    filledDotsBorderColor = '#355c7d'
                    emptyBackgroundColor = '#FFF'
                    emptyDotsBorderColor = '#355c7d'
                />
            </Row>

            <Row className="newoffer-form-body" gutter={16}>
                    <Col xs={24} md={12}>
                        <form>
                            
                            <h2 className="newoffer-subsection-title-first"> Notaire </h2>
                            <label>
                                <Checkbox
                                    className="second-buyer"
                                    onChange={ e => {
                                        setDisableNotary(e.target.checked)
                                        setNotaryName('')
                                        setNotaryAddress('')
                                        setNotaryEmail('')
                                    }}
                                >
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
                                <InputNumber
                                    type='number'
                                    min={0}
                                    value={validityPeriod}
                                    onChange={ e => setValidityPeriod(e)}
                                />
                            </label>

                            <p className='formLabel-offer'>Offre faite à</p>
                            <label>
                                <Input onChange={ e => setOfferLocation(e.target.value)} value={offerLocation} />
                            </label>
                            
                            <h2 className="newoffer-subsection-title"> Commentaires </h2>
                            <label>
                                <TextArea onChange={ e => setComments(e.target.value)} value={comments} />
                            </label>
                            
                        </form>
                        {offerFormError} 

                        <div className="form-buttons">
                            <Button
                                type="primary"
                                className="button-back"
                                onClick={() => {
                                    setRedirToStep2(true)
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
                        </div>
                    </Col>
                    <Col className="newoffer-ad-card"xs={0} md={12}>
                    {ad}
                    </Col>
            </Row >


            <Modal
                className="new-offer-modal"
                title= {<p className="newoffer-modal-title">RÉCAPITULATIF DE VOTRE OFFRE</p>}
                visible={modalVisible}
                centered
                footer= {modalFooter}
                destroyOnClose= {true}
                width= "80%"
                closable={true}
                mask={true}
                maskClosable={true}
                onCancel={() => setModalVisible(false)}
            >
                <div className="newoffer-modal">
                    <div className="newoffer-modal-section">
                        <div className="newoffer-modal-section-title">
                            <p>Informations personnelles</p>
                            <EditOutlined
                                className="newoffer-modal-section-title-icon"
                                onClick={() => setRedirToStep1(true)}
                            />
                        </div>
                        <div className="newoffer-modal-section-content">
                            <div className="newoffer-modal-section-content-block">
                                <span>Acheteur : </span>
                                <span className="newoffer-modal-section-content-data">{`${props.offerFormData.firstName1} ${props.offerFormData.lastName1}`}</span>
                            </div>
                            {props.offerFormData.showSecondBuyer &&
                            <div className="newoffer-modal-section-content-block">
                                <span>Acheteur 2 : </span>
                                <span className="newoffer-modal-section-content-data">{`${props.offerFormData.firstName2} ${props.offerFormData.lastName2}`}</span>
                            </div>
                            }
                            <div className="newoffer-modal-section-content-block">
                                <span>Adresse : </span>
                                <span className="newoffer-modal-section-content-data">{`${props.offerFormData.address} - ${props.offerFormData.postCode} ${props.offerFormData.city}`}</span>
                            </div>
                        </div>
                    </div>

                    <div className="newoffer-modal-section">
                        <div className="newoffer-modal-section-title">
                            <p>Offre</p>
                            <EditOutlined
                                className="newoffer-modal-section-title-icon"
                                onClick={() => setRedirToStep2(true)}
                            />
                        </div>
                        <div className="newoffer-modal-section-content">
                            <div className="newoffer-modal-section-content-block">
                                <span>Montant : </span>
                                <span className="newoffer-modal-section-content-data">{priceFormatter.format(props.offerFormData.offerAmount)}</span>
                            </div>
                            <div className="newoffer-modal-section-content-block">
                                <span className="newoffer-modal-section-content-minor">Dont apport : </span>
                                <span className="newoffer-modal-section-content-data">{priceFormatter.format(props.offerFormData.contributionAmount)}</span>
                            </div>
                            <div className="newoffer-modal-section-content-block">
                                <span className="newoffer-modal-section-content-minor">Dont emprunt : </span>
                                <span className="newoffer-modal-section-content-data">{priceFormatter.format(props.offerFormData.loanAmount)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="newoffer-modal-section">
                        <div className="newoffer-modal-section-title">
                            <p>Notaire</p>
                            <EditOutlined
                                className="newoffer-modal-section-title-icon"
                                onClick={() => setModalVisible(false)}
                            />
                        </div>
                        {props.offerFormData.notaryName ?
                        <div className="newoffer-modal-section-content">
                            <div className="newoffer-modal-section-content-block">
                                <span>Nom : </span>
                                <span className="newoffer-modal-section-content-data">{props.offerFormData.notaryName}</span>
                            </div>
                            <div className="newoffer-modal-section-content-block">
                                <span>Adresse email : </span>
                                <span className="newoffer-modal-section-content-data">{props.offerFormData.notaryEmail}</span>
                            </div>
                            <div className="newoffer-modal-section-content-block">
                                <span>Adresse postale : </span>
                                <span className="newoffer-modal-section-content-data">{props.offerFormData.notaryAddress}</span>
                            </div>
                        </div>
                        :
                        <div>Ces informations seront communiquées ultérieurement</div>
                        }
                    </div>

                    <div className="newoffer-modal-section">
                        <div className="newoffer-modal-section-title">
                            <p>Commentaires</p>
                            <EditOutlined
                                className="newoffer-modal-section-title-icon"
                                onClick={() => setModalVisible(false)}
                            />
                        </div>
                        <div className="newoffer-modal-section-content">
                            <div className="newoffer-modal-section-content-block">
                            {props.offerFormData.comments}
                            </div>
                        </div>
                    </div>

                    <div className="newoffer-modal-section">
                        <div className="newoffer-modal-section-title">
                            <p>Conditions</p>
                            <EditOutlined
                                className="newoffer-modal-section-title-icon"
                                onClick={() => setModalVisible(false)}
                            />
                        </div>
                        <div className="newoffer-modal-section-content">
                            <div className="newoffer-modal-section-content-block">
                                <span>Durée de validité de l'offre : </span>
                                <span className="newoffer-modal-section-content-data">{`${props.offerFormData.validityPeriod} jours`}</span>
                            </div>
                            <div className="newoffer-modal-section-content-block">
                                <span>Offre faite à : </span>
                                <span className="newoffer-modal-section-content-data">{props.offerFormData.offerLocation}</span>
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
        offerFormData: state.offerFormData,
        newOfferAd: state.newOfferAd,
        userLoginStatus: state.userLoginStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        offerSaveFormData : function(validityPeriod, offerLocation, comments, notaryName, notaryEmail, notaryAddress) { 
            dispatch({
                type: 'offerSaveFormData3',
                validityPeriod, offerLocation, comments, notaryName, notaryEmail, notaryAddress
            })
        },
        offerClear : function() {
            dispatch({type: 'offerClear'}) 
        },
        setOfferAd : function(ad) { 
            dispatch( {type: 'user_setOfferAd', ad} ) 
        }
    }
}


export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(OfferForm3)