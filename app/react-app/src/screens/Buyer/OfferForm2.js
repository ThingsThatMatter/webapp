import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import UserNavHeader from '../../components/UserNavHeader'

import {connect} from 'react-redux'

import { Layout, Row, Col, Checkbox, InputNumber, Button} from 'antd'
const {Content} = Layout

var ad_id = '5e5e7acc9e95c72c1a48542b' //will come from redux after
var tokenTest = 'njn2MLOiFPpUhfrAFUh1XeJj5ZBNgFHk'

function OfferForm2(props) {

    const [adFromDb, setAdFromDb] = useState(null)

    const [offerAmount, setOfferAmount] = useState('')
    const [loanAmount, setLoanAmount] = useState('')
    const [disableLoan, setDisableLoan] = useState(false)
    const [contributionAmount, setContributionAmount] = useState('')
    const [salary, setSalary] = useState('')

    const [formError, setFormError] = useState('')
    const [redir, setRedir] = useState(false)
    const [backRedir, setBackRedir] = useState(false)

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

/* --------------------------------------------------PREFILL FORM-------------------------------------------- */
    useEffect(() => {

        if(props.offerFormData) {     // Display inputed info if user goes back from next form pages
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
            props.saveFormData(offerAmount, loanAmount, disableLoan, contributionAmount, salaryOk);
            props.nextStep();
            setRedir(true);

        } else {
            setFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }
    }

    if(redir === true) {
        return <Redirect to="/newoffer/step3"/> // Triggered by button handleClick
    }
    if(backRedir === true) {
        return <Redirect to="/newoffer/step1"/> // Triggered by button-back handleClick
    }

    return (
  
        <Layout className="user-layout">
            <UserNavHeader/> 
            <Layout className='user-layout main-content'>
                <Content style={{ margin: '24px 16px 0' }}>
                   
                    <Row className="newoffer-stepbar">
                        <h1 className="newoffer-stepbar-title"> Nouvelle offre - Offre et Profil économique </h1>
                        <div> {stepDots(props.newOfferStep)} </div>
                    </Row>

                   <Row className="newoffer-form-body" gutter={16}>
                        <Col xs={24} md={{span: 13, offset: 3}}>

                            <form>

                                <h2 className="newoffer-subsection-title"> Offre </h2>
                                <div className="newoffer-input-step2">
                                    <div className="formLabel-offer step-2-label">
                                        <p className='formLabel-offer step-2'>Mon offre est faite au prix NET vendeur de:</p>
                                        <p className="new-offer-form-disclaimer">(hors frais d'agence)</p>
                                    </div>
                                    <label >
                                        <InputNumber
                                            onChange={ e => setOfferAmount(e)}
                                            value={offerAmount}
                                            formatter={value => value + ' €'}
                                        />
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
                                            formatter={value => value + ' €'}
                                        />
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
                                            formatter={value => value + ' €'}
                                        />
                                    </label>
                                </div>

                                <div className="newoffer-input-step2">
                                    <p className='formLabel-offer step-2'>Salaire mensuel cumulé des acheteurs (optionnel)</p>
                                    <label>
                                        <InputNumber
                                            onChange={ e => setSalary(e)}
                                            value={salary}
                                            formatter={value => value + ' €'}
                                        />
                                    </label>
                                </div>
                                
                            </form>
                            {formError}
                            <Button
                                type="primary"
                                className="button-back"
                                onClick={() => {
                                    setBackRedir(true)
                                    props.previousStep()
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

                        </Col>
                        <Col className="newoffer-ad-card"xs={0} md={8}>
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
        offerFormData: state.offerFormData
    }
  }

function mapDispatchToProps(dispatch) {
    return {
        nextStep : function() { 
            dispatch( {type: 'nextStep'} ) 
        },
        previousStep : function() {
            dispatch( {type: 'prevStep'} )
        },
        saveFormData : function(offerAmount, loanAmount, disableLoan, contributionAmount, salaryOk) { 
            dispatch({
                type: 'saveFormData2',
                offerAmount, loanAmount, disableLoan, contributionAmount, salaryOk
            })
        } 
    }
  }
    
  export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(OfferForm2);