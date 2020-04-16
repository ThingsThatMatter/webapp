import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'

import {connect} from 'react-redux'

import {Row, Col, Checkbox, InputNumber, Button} from 'antd'

import StepDots from '../../components/StepDots'


function OfferForm2(props) {

    const [offerAmount, setOfferAmount] = useState('')
    const [loanAmount, setLoanAmount] = useState('')
    const [disableLoan, setDisableLoan] = useState(false)
    const [contributionAmount, setContributionAmount] = useState('')
    const [salary, setSalary] = useState('')

    const [offerFormError, setOfferFormError] = useState('')
    const [redirToStep3, setRedirToStep3] = useState(false)
    const [redirToStep1, setRedirToStep1] = useState(false)


/* --------------------------------------------------PREFILL FORM-------------------------------------------- */
useEffect(() => {

    if(props.offerFormData.offerAmount) {     // Display inputed info if user goes back from next form pages
        setOfferAmount(props.offerFormData.offerAmount)
        setLoanAmount(props.offerFormData.loanAmount)
        setDisableLoan(props.offerFormData.disableLoan)
        setContributionAmount(props.offerFormData.contributionAmount)
        setSalary(props.offerFormData.salary)
    }
}, [])


/* ----------------------------------------------------AD CARD--------------------------------------- */

    if (!props.offerFormData.firstName1) { // If previous step is not completed
        return <Redirect to ='/offer/new/step1' />
    }

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

    const visitStartDate= dateCreate(props.newOfferAd.timeSlots[0].start)
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
        if(offerAmount !== "" && loanAmount !== "" && contributionAmount !== "") {
            const salaryOk = salary !=='' ? salary : 0
            props.offerSaveFormData(offerAmount, loanAmount, disableLoan, contributionAmount, salaryOk)
            setRedirToStep3(true)

        } else {
            setOfferFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }
    }

    if(redirToStep3 === true) {
        return <Redirect push to="/offer/new/step3"/> // Triggered by button handleClick
    }
    if(redirToStep1 === true) {
        return <Redirect push to="/offer/new/step1"/> // Triggered by button-back handleClick
    }

    return (
  
        <div>                  
            <Row className="newoffer-stepbar">
                <StepDots
                    title = 'Nouvelle offre - Offre et Profil économique'
                    totalSteps = {3}
                    currentStep = {2}
                    filledDotsBackgroundColor = '#355c7d'
                    filledDotsBorderColor = '#355c7d'
                    emptyBackgroundColor = '#FFF'
                    emptyDotsBorderColor = '#355c7d'
                />
            </Row>

            <Row className="newoffer-form-body" gutter={16}>
                <Col xs={24} md={12}>

                    <form>

                        <h2 className="newoffer-subsection-title-first"> Offre </h2>
                        <div className="newoffer-input-step2">
                            <div className="formLabel-offer step-2-label">
                                <p className='formLabel-offer step-2'>Mon offre est faite au prix NET vendeur de:</p>
                                <p className="new-offer-form-disclaimer">(hors frais d'agence)</p>
                            </div>
                            <label >
                                <InputNumber
                                    onChange={ e => setOfferAmount(e)}
                                    value={offerAmount}
                                /> €
                            </label> 
                        </div>


                        <h2 className="newoffer-subsection-title"> Profil économique </h2>
                        <div className="newoffer-input-step2 exception-field">
                            <p className='formLabel-offer step-2'>Montant emprunté</p>
                            <label>
                                <InputNumber
                                    onChange={ e => {setLoanAmount(e)}}
                                    value={loanAmount}
                                    disabled={disableLoan}
                                /> €
                            </label>
                        </div>
                        <label>
                            <Checkbox
                                className="no-loan"
                                onChange={ e => {
                                    setDisableLoan(e.target.checked)
                                    setLoanAmount(0)
                                }}
                                checked={disableLoan}
                            >
                                Je ne sollicite pas d'emprunt bancaire
                            </Checkbox>
                        </label>
                        

                        <div className="newoffer-input-step2">
                            <p className='formLabel-offer step-2'>Apport Personnel</p>
                            <label >
                                <InputNumber
                                    onChange={ e => setContributionAmount(e)}
                                    value={contributionAmount}
                                /> €
                            </label>
                        </div>

                        <div className="newoffer-input-step2">
                            <p className='formLabel-offer step-2'>Salaire mensuel cumulé des acheteurs (optionnel)</p>
                            <label>
                                <InputNumber
                                    onChange={ e => setSalary(e)}
                                    value={salary}
                                /> €
                            </label>
                        </div>
                        
                    </form>
                    {offerFormError}
                    <div className="form-buttons">
                        <Button
                            type="primary"
                            className="button-back"
                            onClick={() => {
                                setRedirToStep1(true)
                            }}
                        >
                            Précédent
                        </Button> 
                        <Button
                            onClick={()=> handleClick()}
                            type="primary"
                            className="button-validate"
                        >
                            Suivant
                        </Button>
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
        userLoginStatus: state.userLoginStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        offerSaveFormData : function(offerAmount, loanAmount, disableLoan, contributionAmount, salaryOk) { 
            dispatch({
                type: 'offerSaveFormData2',
                offerAmount, loanAmount, disableLoan, contributionAmount, salaryOk
            })
        } 
    }
}
    
export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(OfferForm2);