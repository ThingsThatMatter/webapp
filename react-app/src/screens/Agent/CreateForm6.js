import React, {useState, useEffect} from 'react'
import {Button, message, Row, Col } from 'antd'

import Unauthorized401 from './Unauthorized401'
import StepDots from '../../components/StepDots'

import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

import { Slide } from 'react-slideshow-image'


const properties = {  // carroussel properties
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true
}


function CreateFormSix(props) {
 
    const [avantages, setAvantages] = useState([])

    const [redirToHome, setRedirToHome] = useState(false)
    const [redirToStep5, setRedirToStep5] = useState(false)
    const [redirToStep4, setRedirToStep4] = useState(false)
    const [redirectTo401, setRedirectTo401] = useState(false)

    const [cookies, setCookie] = useCookies(['name']) // initilizing state cookies



    /* Renew Access Token */
    const renewAccessToken = (token) => {
        if (token !== cookies.aT) {
            setCookie('aT', token, {path:'/pro'})
        }
    }

    useEffect(() => {

        let tempTable = []

        // Creates avantages list
        if (props.newAdFormData.advantages.findIndex(e => e === "ascenseur") !== -1) {
            tempTable.push(
                <span>
                <img src="../../../elevator.png" width="20px" alt="ascenseur" />
                Ascenseur
              </span>
            )
          }
  
        if (props.newAdFormData.advantages.findIndex(e => e === "balcon") !== -1) {
          tempTable.push(
            <span>
              <img src="../../../balcony.png" width="20px" alt="balcon" />
              Balcon
            </span>
          )
        }
        if (props.newAdFormData.advantages.findIndex(e => e === "terrasse") !== -1) {
          tempTable.push(
            <span>
              <img src="../../../floor.png" width="20px" alt="terrasse" />
              Terrasse
            </span>
          )
        }
        setAvantages(tempTable)

    }, [])

    if (!props.newAdFormData.price) {
        return <Redirect to ='/pro/ad/new/step4' />
    }

    /* Price formatting */
    const priceFormatter = new Intl.NumberFormat('fr', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        useGrouping: true
    })

    /* Photos, documents and questions */
    const imagesUpload = props.newAdFormData.photos.map( e => 
        <div className="each-slide" key={e.id}>
            <div style={{backgroundImage: `url(http://localhost:3000/pro/ad/${props.newAdFormData.adID}/file/${e.id}${e.extension}/temp)`}}> </div>
        </div>
    )
     
    const imagesDB = props.newAdFormData.photosDB.map( e => 
        <div className="each-slide" key = {e.id}>
            <div style={{'backgroundImage': `url(${e.url})`}}> </div>
        </div>
    )

    const allPhotos = [...imagesUpload, ...imagesDB]

/* --------------------------------------------------POST & UPDATE AD----------------------------------------------- */
    const postNewAd = async() => {
        
        const messageKey = "123"
        message.loading({ content: 'Création de l\'annonce en cours...', key: messageKey })

        let postAd = await fetch("/pro/ad", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.aT}`
            },
            body: JSON.stringify({
                adID: props.newAdFormData.adID,
                price: props.newAdFormData.price,
                fees: props.newAdFormData.fees,
                feesPayer: props.newAdFormData.feesPayer,
                type: props.newAdFormData.type,
                title: capFirst(props.newAdFormData.type) + ' - ' + props.newAdFormData.address + ' - ' + props.newAdFormData.area + 'm2 - ' + priceFormatter.format(props.newAdFormData.price),
                description: props.newAdFormData.description,
                typeAddress: props.newAdFormData.typeAddress,
                address: props.newAdFormData.address,
                postcode: props.newAdFormData.postcode,
                city: props.newAdFormData.city,
                photos: props.newAdFormData.photos,
                video: props.newAdFormData.video,
                area: props.newAdFormData.area,
                rooms: props.newAdFormData.rooms ,
                bedrooms: props.newAdFormData.bedrooms,
                advantages: props.newAdFormData.advantages,
                dpe: props.newAdFormData.dpe,
                ges: props.newAdFormData.ges,
                files: props.newAdFormData.files,
                color : props.newAdFormData.color,
                timeSlots: props.newAdFormData.timeSlots
            })
        })

        if (postAd.status === 500) {
            message.error({ content: "L'annonce n'a pas pu être sauvegardée. Veuillez réessayer", key: messageKey, duration: 3 })

        } else if (postAd.status === 401) {
            message.destroy()
            setRedirectTo401(true)
    
        } else if (postAd.status === 201) {
            const body = await postAd.json()
            renewAccessToken(body.accessToken)
            message.success({ content: "L'annonce a bien été créée !", key: messageKey, duration: 2 })
            setRedirToHome(true)
            props.clear()
        }
    }
    
    const updateAd = async () => {
        
        const messageKey = '456'
        message.loading({ content: 'Edition de l\'annonce en cours...', key: messageKey})

        let editAd = await fetch(`/pro/ad/${props.newAdFormData._id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.aT}`
            },
            body: JSON.stringify({
                adID: props.newAdFormData.adID,
                price: props.newAdFormData.price,
                fees: props.newAdFormData.fees,
                feesPayer: props.newAdFormData.feesPayer,
                type: props.newAdFormData.type,
                title: capFirst(props.newAdFormData.type) + ' - ' + props.newAdFormData.address + ' - ' + props.newAdFormData.area + 'm2 - ' + priceFormatter.format(props.newAdFormData.price),
                description: props.newAdFormData.description,
                typeAddress: props.newAdFormData.typeAddress,
                address: props.newAdFormData.address,
                postcode: props.newAdFormData.postcode,
                city: props.newAdFormData.city,
                photos: props.newAdFormData.photos,
                video: props.newAdFormData.video,
                area: props.newAdFormData.area,
                rooms: props.newAdFormData.rooms ,
                bedrooms: props.newAdFormData.bedrooms,
                advantages: props.newAdFormData.advantages,
                dpe: props.newAdFormData.dpe,
                ges: props.newAdFormData.ges,
                files: props.newAdFormData.files,
                color : props.newAdFormData.color,
                timeSlots: props.newAdFormData.timeSlots,
                photosDB: props.newAdFormData.photosDB,
                filesDB: props.newAdFormData.filesDB
            })
        })

        if (editAd.status === 500) {
            message.error({ content: "L'annonce n'a pas pu être modifiée. Veuillez réessayer", key: messageKey, duration: 3 })

        } else if (editAd.status === 401) {
            message.destroy()
            setRedirectTo401(true)
    
        } else if (editAd.status === 200) {
            const body = await editAd.json()
            renewAccessToken(body.accessToken)
            message.success({ content: "L'annonce a bien été modifiée !", key: messageKey, duration: 3 })
            setRedirToHome(true)
            props.clearEdit()
            props.clear()
        }
    }  


    function capFirst(a) {
        return (a+'').charAt(0).toUpperCase()+a.substr(1)
    }


/*----------------------------------------------- RENDER COMPONENT ---------------------------------------------------*/
    if(redirToHome === true) {
        return <Redirect push to="/pro"/> // Triggered by button-add handleClick
    }
    if(redirToStep5 === true) {
        return <Redirect push to="/pro/ad/new/step5"/> // Triggered by button-back handleClick
    }
    if(redirToStep4 === true) {
        return <Redirect push to="/pro/ad/new/step4"/> // Triggered by button-back handleClick
    }

    if (redirectTo401) {
        return <Unauthorized401 />
    }

    return (

        <div>
            <StepDots
                title = 'Récapitulatif'
                totalSteps = {6}
                currentStep = {6}
                filledDotsBackgroundColor = '#355c7d'
                filledDotsBorderColor = 'f8b195'
                emptyBackgroundColor = '#FFF'
                emptyDotsBorderColor = '#355c7d'
            />

            <div style={{margin : "3em 0"}}>
                <h1 className='pageTitle'>{capFirst(props.newAdFormData.type) + ' - ' + props.newAdFormData.address + ' - ' + props.newAdFormData.area + 'm2 - ' + priceFormatter.format(props.newAdFormData.price)}</h1>
            </div>

            <h2 className="pageSubTitle">Descriptif</h2>

            <div className="section ad-main-details">
                <div className="row">
                    <span>
                        <img src="../../../expand.svg" width="20px" />
                        <strong>{props.newAdFormData.area}</strong> m<sup>2</sup>
                    </span>
                    <span>
                        <img src="../../../floor-plan.png" width="20px" />
                        <strong>{props.newAdFormData.rooms}</strong> {props.newAdFormData.rooms > 1 ? 'pièces' : 'pièce'}
                    </span>
                    <span>
                        <img src="../../../bed.svg" width="20px" />
                        <strong>{props.newAdFormData.bedrooms}</strong> {props.newAdFormData.bedrooms > 1 ? 'chambres' : 'chambre'}
                    </span>
                </div>
                
                {avantages.length > 0 &&
                    <div className="dark-row">
                        <div className="row">
                            {avantages}
                        </div>
                    </div>
                }

                <Row gutter={16} className="section-text">
                    <Col
                        xs={{ span: 24 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        xl={{ span: 12 }}
                    >
                        <div className="slide-container">
                            <Slide {...properties}>{allPhotos}</Slide>
                        </div>
                    </Col>
                    <Col
                        xs={{ span: 24 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        xl={{ span: 12 }}
                    >
                        <p style={{ textAlign: "justify", whiteSpace: "pre-wrap" }}>{props.newAdFormData.description}</p>
                    </Col>
                </Row>
            </div>

            {/* PARTIE PRIX ET HONNORAIRES */}

            <Row gutter={30}>
                <Col
                    xs={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 8 }}
                    xl={{ span: 8 }}
                >
                    <h2 className='pageSubTitle'>Prix & honoraires</h2>  

                    <div className="section">
                        <div className="section-text">
                            <p><span style={{fontWeight: 700}}>{props.newAdFormData.price+props.newAdFormData.price*props.newAdFormData.fees/100}</span>€ TTC</p>
                            <p><span style={{fontWeight: 700}}>{props.newAdFormData.price}</span>€ hors honoraires</p>
                            <p><span style={{fontWeight: 700}}>{props.newAdFormData.fees}</span>% honoraires à la charge de <span style={{fontWeight: 700}}>l'acquéreur</span></p>
                        </div>
                    </div>
                </Col>

                {/* PARTIE DIAGNOSTIQUE ELECTRIQUE */}
                <Col
                    xs={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 8 }}
                    xl={{ span: 8 }}
                >
                    <h2 className='pageSubTitle'>Diagnostique électrique</h2>  

                    <div className="section">
                        <div className="section-text">
                            <p><span style={{fontWeight: 700}}>{props.newAdFormData.dpe}</span> kWhEP/m².an</p>
                            <p><span style={{fontWeight: 700}}>{props.newAdFormData.ges}</span> kgeqCO2/m².an</p>
                        </div>
                    </div>
                </Col>

            {/* PARTIE DOCUMENTS */}

                <Col
                    xs={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 8 }}
                    xl={{ span: 8 }}
                >
                    <h2 className='pageSubTitle'>Documents</h2> 

                    <div className="section">
                        <div className="section-text">
                            {props.newAdFormData.files.map((e, i) => 
                                <div>
                                    <a key={i} href={`http://localhost:3000/pro/ad/${props.newAdFormData.adID}/file/${e.id}${e.extension}/temp`} target="_blank">{e.name}</a>
                                </div>
                            )}                       
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="form-buttons">
                <Button type="primary" className="button-back"
                    onClick={() => {
                        props.adEdit ? setRedirToStep4(true) : setRedirToStep5(true)
                    }}
                >
                    Précédent
                </Button>  

                <Button type="primary" className="button-validate" 
                    onClick={async() => props.adEdit ? updateAd() : postNewAd()}
                >
                    {props.adEdit ? 'Editer l\'annonce' : 'Créer et diffuser l\'annonce'}
                </Button>

            </div>   
        </div>
    )
}

function mapStateToProps(state) {
    return {
        newAdFormData: state.newAdFormData,
        agentLoginInfo: state.agentLoginInfo,
        adEdit: state.adEdit
    }
}

function mapDispatchToProps(dispatch) {
    return {
        clear : function() { 
            dispatch( {type: 'agent_newAdClear'} ) 
        },
        clearAdEdit : function() {
            dispatch({type: 'agent_clearAdEdit'})
        }
    }
}


export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(CreateFormSix)