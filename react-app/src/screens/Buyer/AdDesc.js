import React, { useState, useEffect } from 'react'
import { Layout, Button, Input, Collapse, Col, Row, message, Modal, Spin } from 'antd'
import {LoadingOutlined} from '@ant-design/icons'

import { Slide } from 'react-slideshow-image'
import { Link } from 'react-router-dom'

import UserNavHeader from '../../components/Buyer/UserNavHeader'
import LoggedOut from '../../components/Buyer/buyerAdDesc/LoggedOut'
import SidebarBuyer from '../../components/Buyer/buyerAdDesc/SidebarBuyer'
import Spinner from '../../components/Buyer/buyerAdDesc/Spin'
import Unauthorized401 from './Unauthorized401'

import APIFetch from '../../components/Buyer/APIFetch'

import { connect } from 'react-redux'
import {useCookies} from 'react-cookie'

const { Content } = Layout
const { Panel } = Collapse

const logo = <LoadingOutlined style={{ fontSize: 22, color: "#355c7d", marginLeft: '4px', marginTop: '4px' }} spin/>

const properties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true
}

function AdDesc(props) {

  const [dataLoaded, setDataLoaded] = useState(false)

  const [adDetails, setAdDetails] = useState({})

  const [adPhotos, setAdPhotos] = useState([])
  const [adQuestions, setAdQuestions] = useState([])
  const [question, setQuestion] = useState()

  const [questionModalVisible, setQuestionModalVisible] = useState(false)
  const [questionLoad, setQuestionLoad] = useState(false)
  const [questionErrorMsg, setQuestionErrorMsg] = useState()

  const [redirectTo401, setRedirectTo401] = useState(false)

  const [cookies, setCookie] = useCookies(['name']) // initializing state cookies

  message.config({
    top: 80
  })

  /* Renew Access Token */
  const renewAccessToken = (token) => {
    if (token !== cookies.uT) {
        setCookie('uT', token, {path:'/'})
    }
  }
 
 
/* -----------------------------------------------SAVE USER AD------------------------------------------ */
  useEffect(() => {
    const saveAd = async () => {
      const saveAdUser = await fetch(`/user/ad/${props.match.params.ad_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${cookies.uT}`
        }
      })

      if (saveAdUser.status === 500) {
        message.warning('Nous rencontrons des difficultés pour sauvegarder cette annonce dans votre liste des biens consultés, veuillez actualiser la page.', 6)

      } else if (saveAdUser.status === 200) {
        const body = await saveAdUser.json()
        // No token refresh, because we also call the sidebar if user is loggedin
        if(body.data.message) {
          message.success(body.data.message, 5)
        }
      }

    }
    if (props.userLoginStatus.login_success) {
      saveAd()
    }

  }, [props.userLoginStatus.login_success])

  /* -----------------------------------------------CONTENT FORMATTING------------------------------------------ */
  /* Price formatting */
  const priceFormatter = new Intl.NumberFormat("fr", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    useGrouping: true
  })

  /* Photos*/
  const photos = adPhotos.map((e, i) => {
    return (
      <div key={i} className="each-slide">
        <div style={{ backgroundImage: `url(${e.url})` }}> </div>
      </div>
    )
  })

  /*Questions */
  const questions = adQuestions.map((e, i) => {
    return (
      <Panel
        className="faq"
        header={e.question}
        key={i}
      >
        <p>{e.response}</p>
      </Panel>
    )
  })

  /* -----------------------------------------------SUBMIT QUESTIONS------------------------------------------ */

  const sendQuestion = async() => {

    if (['', 'null'].indexOf(question) > 0 || !question) {
      setQuestionErrorMsg('Veuillez écrire votre question !')
    } else {
      
      setQuestionLoad(true)

      let newQuestion = await fetch(`/user/ad/${props.match.params.ad_id}/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${cookies.uT}`
        },
        body: JSON.stringify({question:question})
      })

      if (newQuestion.status === 500) {
        setQuestionLoad(false)
        setQuestionErrorMsg('Nous rencontrons des difficultés pour enregistrer votre question, veuillez réessayer.')
    
      } else if (newQuestion.status === 401) {
        setRedirectTo401(true)
        message.destroy()

      } else if (newQuestion.status === 201) {
        const body = await newQuestion.json()
        renewAccessToken(body.accessToken)
        setQuestionLoad(false)
        setQuestionModalVisible(false)
        message.success('Votre question a bien été envoyée. Votre agent y répondra dans les plus brefs délais', 40)
      }
    }
  }


  /* -----------------------------------------------HANDLE SIDEBAR------------------------------------------ */
  let sidebar
  if (props.userLoginStatus.login_request) {
    sidebar = <Spinner />
  } else {
      if (!props.userLoginStatus.login_success) {
      sidebar = <LoggedOut adId={props.match.params.ad_id}/>
    } else {
      sidebar = <SidebarBuyer adId={props.match.params.ad_id} buyerToken={props.userLoginStatus.token}/>
    }
  }

  if (redirectTo401) {
    return <Unauthorized401 />
  }

  return (

    <APIFetch
      fetchUrl={`/user/ad/${props.match.params.ad_id}/public`}
      fetchOptions={{}}
      type= 'public'
      getApiResponse = { response => {
        if (!dataLoaded) {
          setAdDetails(response.data.ad)
          setAdPhotos(response.data.ad.photos)
          setAdQuestions(response.data.ad.questions.filter(question => question.status === 'answered'))
        }
        setDataLoaded(true)
      }}
    >
      <Link
        className="go-back"
        to={`/`}
        style={{ margin: "0px 0px 2em 0px" }}
        onClick={() => message.destroy()}
      >
        &lt; Retour aux annonces
      </Link>

      <h4>> {adDetails.city}</h4>
      <h1>{adDetails.title}</h1>

      <Row gutter={32} className="section-text">
        <Col
          xs={{ span: 24 }}
          md={{ span: 18 }}
          lg={{ span: 18 }}
          xl={{ span: 18 }}
        >
          <div className="slide-container">
            <Slide {...properties}>{photos}</Slide>
          </div>

          {/* PARTIE DESCRIPTION */}

          <h2 className="pageSubTitle">Descriptif</h2>

          <div className="section ad-main-details">
            <div className="row">
              <span>
                <img src="../../../expand.svg" width="20px" />
                <strong>{adDetails.area}</strong> m<sup>2</sup>
              </span>
              <span>
                <img src="../../../floor-plan.png" width="20px" />
                <strong>{adDetails.rooms}</strong> pièces
              </span>
              <span>
                <img src="../../../bed.svg" width="20px" />
                <strong>{adDetails.bedrooms}</strong> chambres
              </span>
            </div>

            <div className="dark-row">
              <div className="row">
                <span>
                  <img src="../../../elevator.png" width="20px" /> Ascenseur
                </span>
                <span>
                  <img src="../../../balcony.png" width="20px" /> Balcon
                </span>
                <span>
                  <img src="../../../floor.png" width="20px" /> Terrasse
                </span>
              </div>
            </div>

            <div className="section-text">
              <p style={{ textAlign: "justify" }}>
                {adDetails.description}
              </p>
            </div>
          </div>

          {/* PARTIE PRIX ET HONNORAIRES */}

          <Row gutter={30}>
            <Col
              xs={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 24 }}
              xl={{ span: 24 }}
            >
              <h2 className="pageSubTitle">Prix & honoraires</h2>

              <div className="section">
                <div className="section-text">
                  <p>
                    <span style={{ fontWeight: 700 }}>
                      {priceFormatter.format(
                        (adDetails.price * adDetails.fees) / 100 +
                          adDetails.price
                      )}{" "}
                    </span>{" "}
                    TTC
                  </p>
                  <p>
                    <span style={{ fontWeight: 700 }}>
                      {priceFormatter.format(adDetails.price)}
                    </span>{" "}
                    hors honoraires
                  </p>
                  <p>
                    <span style={{ fontWeight: 700 }}>
                      {adDetails.fees}
                    </span>
                    % honoraires à la charge de{" "}
                    <span style={{ fontWeight: 700 }}>l'acquéreur</span>
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          {/* PARTIE DIAGNOSTIQUE ELECTRIQUE */}
          <Row>
            <Col
              xs={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 24 }}
              xl={{ span: 24 }}
            >
              <h2 className="pageSubTitle">Diagnostique électrique</h2>

              <div className="section">
                <div className="section-text">
                  <p>
                    <span style={{ fontWeight: 700 }}>{adDetails.dpe}</span>{" "}
                    kWhEP/m² /an
                  </p>
                  <p>
                    <span style={{ fontWeight: 700 }}>{adDetails.ges}</span>{" "}
                    kgeqCO2/m² /an
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          {/* QUESTIONS FREQUENTES */}
          <Row>
            <Col
              xs={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 24 }}
              xl={{ span: 24 }}
            >
              <h2 className="pageSubTitle">Questions fréquentes</h2>

              <Collapse
                style={{ marginBottom: 20 }}
                bordered={false}
                defaultActiveKey={["1"]}
              >
                
                {questions}
                
              </Collapse>
            </Col>
          </Row>
          
          <Button type="primary" onClick={ () => setQuestionModalVisible(true)}>Poser une question</Button>

          <Modal
            className="new-question-modal"
            title= {<p className="newoffer-modal-title">Ma question</p>}
            visible={questionModalVisible}
            centered
            footer={
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Button
                  type="primary"
                  onClick={ () => sendQuestion()}
                >
                    Envoyer
                </Button>
                {questionLoad &&
                  <Spin
                      size="large"
                      indicator={logo}
                  />
                }
                {questionErrorMsg &&
                  <p style={{marginLeft: '6px', color:'#f67280'}}>{questionErrorMsg}</p>
                }
              </div>
            }
            destroyOnClose= {true}
            width= "80%"
            closable={true}
            mask={true}
            maskClosable={true}
            onCancel={() => {
              setQuestionModalVisible(false)
              setQuestionErrorMsg()
            }}
          >
            <label>
              <Input className="question-content" onChange={ e => setQuestion(e.target.value)} value={question} placeholder="Pourquoi vos biens sont-ils toujours si beaux ?" />
            </label>         
          </Modal>

        </Col>

        <Col
          xs={{ span: 24 }}
          md={{ span: 6 }}
          lg={{ span: 6 }}
          xl={{ span: 6 }}
        >
          {sidebar}
        </Col>
      </Row>
    </APIFetch>
  )
}

function mapStateToProps(state) {
  return { 
      userLoginStatus : state.userLoginStatus,
      adId: state.adId
  }
}

export default connect(
  mapStateToProps,
  null
)(AdDesc)
