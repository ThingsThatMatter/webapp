import React, { useState, useEffect } from "react"
import { Button, Switch, Badge, Collapse, Col, Row, Popconfirm, message } from "antd"
import { Slide } from "react-slideshow-image"
import { Redirect} from "react-router-dom"
import {HashLink as Link} from "react-router-hash-link"

import { connect } from "react-redux"
import {useCookies} from 'react-cookie'

import APIFetch from '../../components/Agent/APIFetch'
import Unauthorized401 from './Unauthorized401'

const { Panel } = Collapse

const properties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true
}

function AdDesc(props) {

  const [dataLoaded, setDataLoaded] = useState(false)
  
  const [toggle, setToggle] = useState(true)
  const [adDetails, setAdDetails] = useState({})

  const [adPhotos, setAdPhotos] = useState([])
  const [adDocuments, setAdDocuments] = useState([])
  const [adQuestions, setAdQuestions] = useState([])
  const [adOffers, setAdOffers] = useState([])
  const [adVisits, setAdVisits] = useState([])
  const [avantages, setAvantages] = useState([])

  const [redirectToHome, setRedirectToHome] = useState(false)
  const [redirectToAdEdit, setRedirectToAdEdit] = useState(false)
  const [redirectTo401, setRedirectTo401] = useState(false)
  const [cookies, setCookie] = useCookies(['name']) // initilizing state cookies

  const [pendingQuestions, setPendingQuestions] = useState([])

  let toggleStyle = { fontWeight: 600, color: "#1476E1", fontSize: "18px" }

  if (toggle === false) {
    toggleStyle = { fontWeight: 500, color: "#6F6E6E", fontSize: "18px" }
  }

  /* Renew Access Token */
  const renewAccessToken = (token) => {
    if (token !== cookies.aT) {
        setCookie('aT', token, {path:'/pro'})
    }
  }


  /* ----------------------------------------------PREPARE COMPONENT----------------------------------------------- */
  
  /* Set data to be displayed */
  useEffect(() => {

    if (adDetails._id) {
      setAdPhotos(adDetails.photos)
      setAdDocuments(adDetails.files)
      setAdOffers(adDetails.offers)
      setAdVisits(adDetails.timeSlots)
      setAdQuestions(adDetails.questions.filter(question => question.status === 'answered'))
      setPendingQuestions(adDetails.questions.filter(question => question.status === 'pending'))

      const tempTable = []

      if (adDetails.advantages.findIndex(e => e === "ascenseur") !== -1) {
          tempTable.push(
              <span>
              <img src="../../../elevator.png" width="20px" alt="ascenseur" />
              Ascenseur
            </span>
          )
        }

      if (adDetails.advantages.findIndex(e => e === "balcon") !== -1) {
        tempTable.push(
          <span>
            <img src="../../../balcony.png" width="20px" alt="balcon" />
            Balcon
          </span>
        )
      }
      if (adDetails.advantages.findIndex(e => e === "terrasse") !== -1) {
        tempTable.push(
          <span>
            <img src="../../../floor.png" width="20px" alt="terrasse" />
            Terrasse
          </span>
        )
      }
      setAvantages(tempTable)
    }

  }, [adDetails])

    /* Price formatting */
    const priceFormatter = new Intl.NumberFormat("fr", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      useGrouping: true
    })
    

    /* Photos, documents and questions */
    let photos = adPhotos.map((e, i) => 
      <div key={i} className="each-slide">
        <div style={{ backgroundImage: `url(${e.url})` }}> </div>
      </div>
    )
  
    let documents = adDocuments.map(e => 
      <div key={e.id}>
        <a href={e.url} target="_blank">
          {e.name}
        </a>
      </div>
    )
  
    let questions = adQuestions.map((e, i) => {
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

/* ----------------------------------------------EDIT, DELETE AN AD----------------------------------------------- */

  const handleDelete = async () => {

    const messageKey = 'key1'
    message.loading({
      content: 'Suppression de l\'annonce en cours...',
      key: messageKey,
      duration: 10
    })

    const deleteAd = await fetch(`/pro/ad/${props.match.params.id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${cookies.aT}`
      }
    })

    if (deleteAd.status === 500) {
      message.warning({
        content: 'Erreur lors de la suppression de l\'annonce, veuillez réessayer.',
        key: messageKey,
        duration: 4
      })
  
    } else if (deleteAd.status === 401) {
      setRedirectTo401(true)

    } else if (deleteAd.status === 200) {
      const body = await deleteAd.json()
      renewAccessToken(body.accessToken)
      message.success({
        content: 'L\'annonce a été supprimée',
        key: messageKey,
        duration: 3
      })
      setRedirectToHome(true)
    }
  }

  // Edit an ad
  const handleEdit = async () => {
    props.saveforEdit(adDetails)
    setRedirectToAdEdit(true)
    props.edit()
  }


/* --------------------------------------------------REDIRECTS----------------------------------------------- */
  if (redirectToHome === true) {
    return <Redirect to="/pro" />
  }

  if (redirectToAdEdit === true) {
    return <Redirect push to="/pro/ad/new/step1" />
  }

  if (redirectTo401) {
    return <Unauthorized401 />
  }


/* ----------------------------------------------RENDER COMPONENT----------------------------------------------- */
  return (

    <APIFetch
      fetchUrl= {`/pro/ad/${props.match.params.id}`}
      fetchOptions={{
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${cookies.aT}`
        }
      }}
      getApiResponse = { response => {
          if (!dataLoaded) {
            setAdDetails(response.data.ad)
          }
          setDataLoaded(true)
      }}
    >
      <div className="agent-section">
        <h1 className="pageTitle">{adDetails.title}</h1>

        <div className="agent-action">
          <Switch defaultChecked onChange={() => setToggle(!toggle)} />
          <div>
            <img
              src="../../../edit.png"
              width="20px"
              style={{ marginRight: 20, cursor: "pointer" }}
              onClick={handleEdit}
            />
            <Popconfirm
                title="Êtes vous sûr(e) de vouloir supprimer l'annonce ?"
                onConfirm={() => handleDelete()}
                okText="Oui"
                okButtonProps={{type:'primary', className:'pop-confirm-buttons'}}
                cancelText="Non"
                cancelButtonProps={{type:'secondary', className:'pop-confirm-buttons'}}
                placement="bottomLeft"
              >
            <img
              src="../../../bin.png"
              width="20px"
              style={{ cursor: "pointer" }}
            />
            </Popconfirm>
          </div>
        </div>
      </div>
      <div className="agent-resume">
        <Badge count={adOffers.length}>
        <Link to={`/pro/offers#${props.match.params.id}`}>
          <Button type="primary" ghost className="button-add">
            Offres
          </Button>
        </Link>
        </Badge>

        <Badge count={adVisits.length}>
          <Link to={`/pro/visits`}>
            <Button type="primary" ghost className="button-add">
              Visites
            </Button>
          </Link>
        </Badge>

        <Badge count={pendingQuestions.length}>
          <Link to={`/pro/questions#${props.match.params.id}`}>
            <Button type="primary" ghost className="button-add">
              Questions
            </Button>
          </Link>
        </Badge>
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
            <strong>{adDetails.rooms}</strong> {adDetails.rooms > 1 ? 'pièces' : 'pièce'}
          </span>
          <span>
            <img src="../../../bed.svg" width="20px" />
            <strong>{adDetails.bedrooms}</strong> {adDetails.bedrooms > 1 ? 'chambres' : 'chambre'}
          </span>
        </div>

        {avantages.length > 0 && (
          <div className="dark-row">
            <div className="row">{avantages}</div>
          </div>
        )}

        <Row gutter={16} className="section-text">
          <Col
            xs={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
          >
            <div className="slide-container">
              <Slide {...properties}>{photos}</Slide>
            </div>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
          >
            <p style={{ textAlign: "justify", whiteSpace: "pre-wrap" }}>{adDetails.description}</p>
          </Col>
        </Row>
      </div>

      {/* PARTIE PRIX ET HONORAIRES */}
      <Row gutter={30}>
        <Col
          xs={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 8 }}
          xl={{ span: 8 }}
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
                <span style={{ fontWeight: 700 }}>{adDetails.fees}</span>%
                honoraires à la charge de{" "}
                <span style={{ fontWeight: 700 }}>l'acquéreur</span>
              </p>
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

        {/* PARTIE DOCUMENTS */}
        <Col
          xs={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 8 }}
          xl={{ span: 8 }}
        >
          <h2 className="pageSubTitle">Documents</h2>

          <div className="section">
            <div className="section-text">{documents}</div>
          </div>
        </Col>
      </Row>

      <h2 className="pageSubTitle">Questions fréquentes</h2>

      <Collapse
        style={{ marginBottom: 20 }}
        bordered={false}
        defaultActiveKey={["1"]}
      >
        {questions}
      </Collapse>
      
    </APIFetch>
  )
}

function mapDispatchToProps(dispatch) {
  return {
    saveforEdit : function(adDetails) { 
      dispatch( {type: 'agent_adSaveForEdit', data: adDetails } ) 
    },
    edit : function() { 
      dispatch( {type: 'agent_adEdit'} )
    }  
  }
}

function mapStateToProps(state) {
  return {
    agentLoginInfo: state.agentLoginInfo
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdDesc)
