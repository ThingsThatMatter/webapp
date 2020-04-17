import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'

import {connect} from 'react-redux'

import {Row, Col, Input, InputNumber, Button, Checkbox} from 'antd'

import StepDots from '../../components/StepDots'

function OfferForm1(props) {

    const [firstName1, setFirstName1] = useState(props.userInfo.firstname)
    const [lastName1, setLastName1] = useState(props.userInfo.lastname)
    const [firstName2, setFirstName2] = useState('')
    const [lastName2, setLastName2] = useState('')
    const [address, setAddress] = useState('')
    const [postal, setPostal] = useState('')
    const [city, setCity] = useState('')
    
    const [showSecondBuyer, setShowSecondBuyer] = useState(false)

    const [offerFormError, setOfferFormError] = useState('')
    const [redirToStep2, setRedirToStep2] = useState(false)


/* ---------------------------------------------------PREFILL FORM---------------------------------------------- */
    useEffect(() => {

        if(Object.keys(props.offerFormData).length !== 0) {     // Display inputed info if user goes back from next form pages
            setFirstName1(props.offerFormData.firstName1)
            setLastName1(props.offerFormData.lastName1)
            setShowSecondBuyer(props.offerFormData.showSecondBuyer)
            setFirstName2(props.offerFormData.firstName2)
            setLastName2(props.offerFormData.lastName2)
            setAddress(props.offerFormData.address)
            setPostal(props.offerFormData.postCode)
            setCity(props.offerFormData.city)
        }
    }, [])

/* ----------------------------------------------------AD CARD-------------------------------------------------- */

    if (!props.newOfferAd.title) { // If coming from an other page than the ad 
        return <Redirect to ='/' />
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
        if(firstName1 !== "" && lastName1 !== "" && address !== "" && postal !== "" && city !== "") {
            props.offerSaveFormData(firstName1, lastName1, showSecondBuyer, firstName2, lastName2, address, postal, city)
            setRedirToStep2(true)

        } else {
            setOfferFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }
    }


/* -----------------------------------------------RENDER------------------------------------------ */

    if (redirToStep2 === true) {
        return <Redirect push to='/offer/new/step2'/> // Triggered by button handleClick
    }

    return (
  
        <div>               
            <Row>
                <StepDots
                    title = 'Nouvelle offre - Informations personnelles'
                    totalSteps = {3}
                    currentStep = {1}
                    filledDotsBackgroundColor = '#355c7d'
                    filledDotsBorderColor = '#355c7d'
                    emptyBackgroundColor = '#FFF'
                    emptyDotsBorderColor = '#355c7d'
                />
            </Row>

            <Row className="newoffer-form-body" gutter={16}>
                <Col xs={24} md={12}>
                    <form>
                        
                        <p className='formLabel-offer'>Prénom de l'acheteur</p>
                        <label >
                            <Input onChange={(e) => setFirstName1(e.target.value)} value={firstName1}/>
                        </label>

                        <p className='formLabel-offer'>Nom de l'acheteur</p>
                        <label>
                            <Input className="last-name-1-offer" onChange={ e => setLastName1(e.target.value)} value={lastName1} />
                        </label>

                        <label>
                            <Checkbox
                                className="second-buyer"
                                onChange={ e => {
                                    setShowSecondBuyer(e.target.checked)
                                    setFirstName2('')
                                    setLastName2('')
                                }}
                                checked={showSecondBuyer} >
                                J'ajoute un second acheteur
                            </Checkbox>
                        </label>

                        {showSecondBuyer &&
                            <div>
                                <p className='formLabel-offer second-buyer-firstname'>Prénom du second acheteur</p>
                                <label >
                                    <Input onChange={ e => setFirstName2(e.target.value)} value={firstName2}/>
                                </label>

                                <p className='formLabel-offer'>Nom du second acheteur</p>
                                <label>
                                    <Input className="last-name-1-offer" onChange={ e => setLastName2(e.target.value)} value={lastName2} />
                                </label>
                            </div>
                        }

                        <p className='formLabel-offer'>Numéro et rue</p>
                        <label >
                            <Input onChange={ e => setAddress(e.target.value)} value={address} placeholder="3 rue Constance"/>
                        </label>

                        <p className='formLabel-offer'>Code postal</p>
                        <label>
                            <InputNumber onChange={ e => setPostal(e)} value={postal} maxLength="5" placeholder="75018" type='number'/>
                        </label>

                        <p className='formLabel-offer'>Ville</p>
                        <label>
                            <Input onChange={ e => setCity(e.target.value)} value={city} placeholder="Paris"/>
                        </label>
                        
                    </form>
                    {offerFormError}
                    <div className="form-buttons">
                        <Button onClick={()=> handleClick()} type="primary" className="button-validate">Suivant</Button>
                    </div>
                </Col>

                <Col className="newoffer-ad-card"xs={0} md={12}>
                    {ad}
                </Col>

            </Row >
        </div>
    )
}

function mapStateToProps(state) {
    return { 
        offerFormData: state.offerFormData,
        newOfferAd: state.newOfferAd,
        userLoginStatus: state.userLoginStatus,
        userInfo : state.userInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        offerSaveFormData : function(firstName1, lastName1, showSecondBuyer, firstName2, lastName2, address, postal, city) {
            dispatch({
                type: 'offerSaveFormData1',
                firstName1, lastName1, showSecondBuyer, firstName2, lastName2, address, postal, city
            })
        } 
    }
  }
    
export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(OfferForm1)