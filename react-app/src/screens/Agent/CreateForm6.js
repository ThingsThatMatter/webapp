import React, {useState, useEffect} from 'react'
import { Layout, Steps, Button, message, Row, Col } from 'antd'

import Sidebar from '../../components/Agent/Sidebar'
import Unauthorized401 from './Unauthorized401'

import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

import { Slide } from 'react-slideshow-image'

const { Step } = Steps
const {Content} = Layout

const properties = {  // carroussel properties
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true
}


function CreateFormSix(props) {
 
    const [avantages, setAvantages] = useState([])

    const [currentPage, setCurrentPage] = useState(0)
    const [redir, setRedir] = useState(false)
    const [backRedir, setBackRedir] = useState(false)
    const [redirectTo401, setRedirectTo401] = useState(false)

    const [cookies, setCookie] = useCookies(['name']) // initilizing state cookies

    /* Renew Access Token */
    const renewAccessToken = (token) => {
        if (token !== cookies.aT) {
            setCookie('aT', token, {path:'/pro'})
        }
    }

    useEffect(() => {

        setCurrentPage(props.step)     // Gets current page number from redux sotre for steps display
        let tempTable = []

        // Creates avantages list
        if (props.formData.advantages.findIndex(e => e === "ascenseur") !== -1) {
            tempTable.push(
                <span>
                <img src="../../../elevator.png" width="20px" alt="ascenseur" />
                Ascenseur
              </span>
            )
          }
  
        if (props.formData.advantages.findIndex(e => e === "balcon") !== -1) {
          tempTable.push(
            <span>
              <img src="../../../balcony.png" width="20px" alt="balcon" />
              Balcon
            </span>
          )
        }
        if (props.formData.advantages.findIndex(e => e === "terrasse") !== -1) {
          tempTable.push(
            <span>
              <img src="../../../floor.png" width="20px" alt="terrasse" />
              Terrasse
            </span>
          )
        }
        setAvantages(tempTable)

    }, [])

    /* Price formatting */
    const priceFormatter = new Intl.NumberFormat('fr', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        useGrouping: true
    })

    /* Photos, documents and questions */
    const imagesUpload = props.formData.photos.map( e => 
        <div className="each-slide" key={e.id}>
            <div style={{backgroundImage: `url(http://localhost:3000/pro/ad/${props.formData.adID}/file/${e.id}${e.extension}/temp)`}}> </div>
        </div>
    )
     
    const imagesDB = props.formData.photosDB.map( e => 
        <div className="each-slide" key = {e.id}>
            <div style={{'backgroundImage': `url(${e.url})`}}> </div>
        </div>
    )

    const allPhotos = [...imagesUpload, ...imagesDB]
    console.log(allPhotos)

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
                adID: props.formData.adID,
                price: props.formData.price,
                fees: props.formData.fees,
                feesPayer: props.formData.feesPayer,
                type: props.formData.type,
                title: capFirst(props.formData.type) + ' - ' + props.formData.address + ' - ' + props.formData.area + 'm2 - ' + priceFormatter.format(props.formData.price),
                description: props.formData.description,
                typeAddress: props.formData.typeAddress,
                address: props.formData.address,
                postcode: props.formData.postcode,
                city: props.formData.city,
                photos: props.formData.photos,
                video: props.formData.video,
                area: props.formData.area,
                rooms: props.formData.rooms ,
                bedrooms: props.formData.bedrooms,
                advantages: props.formData.advantages,
                dpe: props.formData.dpe,
                ges: props.formData.ges,
                files: props.formData.files,
                color : props.formData.color,
                timeSlots: props.formData.timeSlots
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
            setRedir(true)
            props.clear()
            props.clearSteps()
        }
    }
    
    const updateAd = async () => {
        
        const messageKey = '456'
        message.loading({ content: 'Edition de l\'annonce en cours...', key: messageKey})

        let editAd = await fetch(`/pro/ad/${props.formData._id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.aT}`
            },
            body: JSON.stringify({
                adID: props.formData.adID,
                price: props.formData.price,
                fees: props.formData.fees,
                feesPayer: props.formData.feesPayer,
                type: props.formData.type,
                title: capFirst(props.formData.type) + ' - ' + props.formData.address + ' - ' + props.formData.area + 'm2 - ' + priceFormatter.format(props.formData.price),
                description: props.formData.description,
                typeAddress: props.formData.typeAddress,
                address: props.formData.address,
                postcode: props.formData.postcode,
                city: props.formData.city,
                photos: props.formData.photos,
                video: props.formData.video,
                area: props.formData.area,
                rooms: props.formData.rooms ,
                bedrooms: props.formData.bedrooms,
                advantages: props.formData.advantages,
                dpe: props.formData.dpe,
                ges: props.formData.ges,
                files: props.formData.files,
                color : props.formData.color,
                timeSlots: props.formData.timeSlots,
                photosDB: props.formData.photosDB,
                filesDB: props.formData.filesDB
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
            setRedir(true)
            props.clearSteps()
            props.clearEdit()
            props.clear()
        }
    }  


    function capFirst(a) {
        return (a+'').charAt(0).toUpperCase()+a.substr(1)
    }


/*----------------------------------------------- RENDER COMPONENT ---------------------------------------------------*/
    if(redir === true) {
        return <Redirect to="/pro"/> // Triggered by button-add handleClick
    }
    if(backRedir === true) {
        return <Redirect to="/pro/createform/step5"/> // Triggered by button-back handleClick
    }

    if (redirectTo401) {
        return <Unauthorized401 />
    }

    return (

        <Layout>
            <Sidebar/>
            <Layout className='main-content'>
                <Content style={{ margin: '2em 3em' }}>

                    <Steps progressDot current={currentPage}> 
                        <Step title="Localisation" />
                        <Step title="Description" />
                        <Step title="Documents" />
                        <Step title="Prix/honoraires" />
                        <Step title="Créneaux" />
                        <Step title="Récap" />
                    </Steps>

                    <div style={{margin : "3em 0"}}>
                        <h1 className='pageTitle'>{capFirst(props.formData.type) + ' - ' + props.formData.address + ' - ' + props.formData.area + 'm2 - ' + priceFormatter.format(props.formData.price)}</h1>
                    </div>

                    <h2 className="pageSubTitle">Descriptif</h2>

                    <div className="section ad-main-details">
                        <div className="row">
                            <span>
                                <img src="../../../expand.svg" width="20px" />
                                <strong>{props.formData.area}</strong> m<sup>2</sup>
                            </span>
                            <span>
                                <img src="../../../floor-plan.png" width="20px" />
                                <strong>{props.formData.rooms}</strong> pièces
                            </span>
                            <span>
                                <img src="../../../bed.svg" width="20px" />
                                <strong>{props.formData.bedrooms}</strong> chambres
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
                                <p style={{ textAlign: "justify", whiteSpace: "pre-wrap" }}>{props.formData.description}</p>
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
                                    <p><span style={{fontWeight: 700}}>{props.formData.price+props.formData.price*props.formData.fees/100}</span>€ TTC</p>
                                    <p><span style={{fontWeight: 700}}>{props.formData.price}</span>€ hors honoraires</p>
                                    <p><span style={{fontWeight: 700}}>{props.formData.fees}</span>% honoraires à la charge de <span style={{fontWeight: 700}}>l'acquéreur</span></p>
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
                                    <p><span style={{fontWeight: 700}}>{props.formData.dpe}</span> kWhEP/m².an</p>
                                    <p><span style={{fontWeight: 700}}>{props.formData.ges}</span> kgeqCO2/m².an</p>
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
                                    {props.formData.files.map((e, i) => 
                                        <div>
                                            <a key={i} href={`http://localhost:3000/pro/ad/${props.formData.adID}/file/${e.id}${e.extension}/temp`} target="_blank">{e.name}</a>
                                        </div>
                                    )}                       
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div className="form-buttons">
                        <Button type="primary" className="button-back"
                            onClick={() => {
                                setBackRedir(true)
                                props.previousStep()
                            }}
                        >
                            Précédent
                        </Button>  
 
                        <Button type="primary" className="button-validate" 
                            onClick={async() => props.edit ? updateAd() : postNewAd()}
                        >
                            {props.edit ? 'Editer l\'annonce' : 'Créer et diffuser l\'annonce'}
                        </Button>

                    </div>   
                </Content>  
            </Layout>
        </Layout>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        clear : function() { 
            dispatch( {type: 'agent_newOfferClear'} ) 
        },
        clearSteps : function() { 
            dispatch( {type: 'agent_newOfferClearSteps'} ) 
        },
        previousStep : function() {
            dispatch( {type: 'agent_newOfferPrevStep'} )
        },
        clearEdit : function() {
            dispatch({type: 'agent_newOfferClearEdit'})
        }
    }
}


function mapStateToProps(state) {
    return {
        step : state.step,
        formData: state.formData,
        agentLoginInfo: state.agentLoginInfo,
        edit: state.edit
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(CreateFormSix)