import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import UserNavHeader from '../../components/UserNavHeader'

import {connect} from 'react-redux'

import { Layout, Row, Col, Input, InputNumber, Button, Checkbox} from 'antd'
const {Content} = Layout

var ad_id = '5e5e7acc9e95c72c1a48542b' //will come from redux after
var tokenTest = 'njn2MLOiFPpUhfrAFUh1XeJj5ZBNgFHk'

function OfferForm1(props) {

    const [adFromDb, setAdFromDb] = useState(null)

    const [firstName1, setFirstName1] = useState('')
    const [lastName1, setLastName1] = useState('')
    const [firstName2, setFirstName2] = useState('')
    const [lastName2, setLastName2] = useState('')
    const [address, setAddress] = useState('')
    const [postal, setPostal] = useState('')
    const [city, setCity] = useState('')
    
    const [showSecondBuyer, setShowSecondBuyer] = useState(false)

    const [formError, setFormError] = useState('')
    const [redir, setRedir] = useState(false)

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
          setLastName1(body.data.user.lastname)
          setFirstName1(body.data.user.firstname)
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
        setFirstName1(props.offerFormData.firstname1)
        setLastName1(props.offerFormData.lastname1)
        setShowSecondBuyer(props.offerFormData.showSecondBuyer)
        setFirstName2(props.offerFormData.firstname2)
        setLastName2(props.offerFormData.lastname2)
        setAddress(props.offerFormData.address)
        setPostal(props.offerFormData.postcode)
        setCity(props.offerFormData.city)
    }
  },[]);

/* -----------------------------------------------FORM VALIDATION------------------------------------------ */

const handleClick = () => {
    if(firstName1 !== "" && lastName1 !== "" && address !== "" && postal !== "" && city !== "") {
        props.saveFormData(firstName1, lastName1, showSecondBuyer, firstName2, lastName2, address, postal, city);
        props.nextStep();
        setRedir(true);

    } else {
        setFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
    }
}

if(redir === true) {
    return <Redirect to="/newoffer/step2"/> // Triggered by button handleClick
}

    return (
  
        <Layout className="user-layout">
            <UserNavHeader/> 
            <Layout className='user-layout main-content'>
                <Content style={{ margin: '24px 16px 0' }}>
                   
                   <Row className="newoffer-stepbar">
                       <h1 className="newoffer-stepbar-title"> Nouvelle offre - Informations personnelles </h1>
                       <div> {stepDots(props.newOfferStep)} </div>
                   </Row>

                   <Row className="newoffer-form-body" gutter={16}>
                        <Col xs={24} md={16}>
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
                                    <Checkbox className="second-buyer" onChange={ e => setShowSecondBuyer(e.target.checked)} checked={showSecondBuyer} >
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
                                    <InputNumber onChange={ e => setPostal(e)} value={postal} maxLength="5" placeholder="75018"/>
                                </label>

                                <p className='formLabel-offer'>Ville</p>
                                <label>
                                    <Input onChange={ e => setCity(e.target.value)} value={city} placeholder="Paris"/>
                                </label>
                                
                            </form>
                            {formError} 
                            <Button onClick={()=> handleClick()} type="primary" className="button-validate">Suivant</Button>

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
        saveFormData : function(firstName1, lastName1, showSecondBuyer, firstName2, lastName2, address, postal, city) {
            dispatch({
                type: 'saveFormData1',
                firstName1, lastName1, showSecondBuyer, firstName2, lastName2, address, postal, city
            })
        } 
    }
  }
    
  export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(OfferForm1);