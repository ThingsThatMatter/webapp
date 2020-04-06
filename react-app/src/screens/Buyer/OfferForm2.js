import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import UserNavHeader from '../../components/Buyer/UserNavHeader'

import {connect} from 'react-redux'

import { Layout, Row, Col, Checkbox, InputNumber, Button} from 'antd'
const {Content} = Layout


function OfferForm2(props) {

    const [offerAmount, setOfferAmount] = useState('')
    const [loanAmount, setLoanAmount] = useState('')
    const [disableLoan, setDisableLoan] = useState(false)
    const [contributionAmount, setContributionAmount] = useState('')
    const [salary, setSalary] = useState('')

    const [offerFormError, setOfferFormError] = useState('')
    const [offerRedir, setOfferRedir] = useState(false)
    const [backOfferRedir, setOfferBackRedir] = useState(false)

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

    const visitStartDate= dateCreate(props.newOfferAd.timeSlots[0].start)
    const visitMessage = 
        <p className="annonce-messages-buyer">
            Visite effectuée le {visitStartDate.toLocaleDateString('fr-FR')} à {visitStartDate.toLocaleTimeString('fr-FR')}
        </p>

    const ad = 
        <div className="annonce-element offer-form">
            <img className="annonce-image" width="100%" src={props.newOfferAd.photos[0]} />
            <div className="annonce-text-buyer">
                <div className="annonce-price-container">
                    <span className="annonce-price">{priceFormatter.format(props.newOfferAd.price)}</span>
                </div>
                <p className="annonce-address-title">{props.newOfferAd.title}</p>
                <p className="annonce-address-sub">{props.newOfferAd.postcode} {props.newOfferAd.city}</p>
            </div>
            <div className="annonce-infos-buyer">
                <span className="annonce-area"><img src="../expand.svg" width="20px"/> {props.newOfferAd.area} <span>&nbsp;m2</span></span>
                <span className="annonce-room"><img src="../floor-plan.png" width="20px"/> {props.newOfferAd.rooms} <span>&nbsp;pièces</span></span>
                <span className="annonce-bedroom"><img src="../bed.svg" width="20px"/> {props.newOfferAd.bedrooms} <span>&nbsp;chambres</span></span>
            </div>
            <div className="annonce-status-buyer">
                {visitMessage}
            </div>
        </div>

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

/* --------------------------------------------------PREFILL FORM-------------------------------------------- */
    useEffect(() => {

        if(props.offerFormData.offerAmount) {     // Display inputed info if user goes back from next form pages
            setOfferAmount(props.offerFormData.offerAmount)
            setLoanAmount(props.offerFormData.loanAmount)
            setDisableLoan(props.offerFormData.disableLoan)
            setContributionAmount(props.offerFormData.contributionAmount)
            setSalary(props.offerFormData.salary)
        }
    },[]);

    

/* -----------------------------------------------FORM VALIDATION------------------------------------------ */

    const handleClick = () => {
        if(offerAmount !== "" && loanAmount !== "" && contributionAmount !== "") {
            const salaryOk = salary !=='' ? salary : 0
            props.offerSaveFormData(offerAmount, loanAmount, disableLoan, contributionAmount, salaryOk);
            props.modifyStep(3);
            setOfferRedir(true);

        } else {
            setOfferFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }
    }

    if(offerRedir === true) {
        return <Redirect to="/newoffer/step3"/> // Triggered by button handleClick
    }
    if(backOfferRedir === true) {
        return <Redirect to="/newoffer/step1"/> // Triggered by button-back handleClick
    }

    return (
  
        <Layout className="user-layout">
            <UserNavHeader/> 
            <Layout className='user-layout main-content'>
                <Content>
                   
                    <Row className="newoffer-stepbar">
                        <h1 className="newoffer-stepbar-title"> Nouvelle offre - Offre et Profil économique </h1>
                        <div> {stepDots(props.newOfferStep)} </div>
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
                                        setOfferBackRedir(true)
                                        props.modifyStep(1)
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

                </Content>  
            </Layout>
        </Layout>

    );
}

function mapStateToProps(state) {
    return { 
        newOfferStep : state.newOfferStep,
        offerFormData: state.offerFormData,
        newOfferAd: state.newOfferAd,
        userLoginStatus: state.userLoginStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        modifyStep : function(step) { 
            dispatch( {type: 'buyer_modifyStep', futureStep: step} ) 
        },
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