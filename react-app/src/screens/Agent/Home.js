import React, {useState, useEffect} from 'react'
import { Row, Button, Col, Collapse, Radio } from 'antd'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

import APIFetch from '../../components/Agent/APIFetch'

import {PlusCircleOutlined} from '@ant-design/icons'
const { Panel } = Collapse


function Home(props) {

  const [dataLoaded, setDataLoaded] = useState(false)
  
  const [navToCreateAd, setNavToCreateAd] = useState(false)
  const [navToAdDetail, setNavToAdDetail] = useState(false)
  const [adsListFromDb, setAdsListFromDb] = useState([])
  const [onlineStatus, setOnlineStatus] = useState("All")
  const [visitStatus, setVisitStatus] = useState("All")
  const [offerStatus, setOfferStatus] = useState("All")
  const [adsToShow, setAdsToShow] = useState([])

  const [cookies] = useCookies(['name']) // initilizing state cookies

  const [urlAd, setUrlAd] = useState(null)


  /* Filters */
  useEffect(() => {
    let ads = [...adsListFromDb]
    const filter = () => {
      if (onlineStatus === 'Y') {
        ads = ads.filter( e => e.onlineStatus === true )
      } else if (onlineStatus === 'N') {
        ads = ads.filter( e => e.onlineStatus === false )
      }
    
      if (visitStatus === 'Y') {
        ads = ads.filter( e => e.visitStatus === true )
      } else if (visitStatus === 'N') {
        ads = ads.filter( e => e.visitStatus === false )
      }
    
      if (offerStatus === 'Y') {
        ads = ads.filter( e => e.offerStatus === true )
      } else if (offerStatus === 'N') {
        ads = ads.filter( e => e.offerStatus === false )
      }
      setAdsToShow(ads)
    }
    filter()
  }, [adsListFromDb, onlineStatus, visitStatus, offerStatus])


  /* Price formatting */
  const priceFormatter = new Intl.NumberFormat('fr', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    useGrouping: true
  })
  
  /* Ad card rending */
    //sort
  let adsCopy = [...adsToShow]
  adsCopy = adsCopy.sort((a,b) => new Date(b.creationDate) - new Date(a.creationDate))
  
    //rend
    adsCopy = adsCopy.map( (e,i) => {
    return (
      <Col key = {i} xs={{span:24}} md={{span:12}} lg={{span:8}} xl={{span:8}}>
        <div className="annonce-element" 
              onClick={() => {
                setUrlAd(`/pro/ad/${e._id}`)
                setNavToAdDetail(true) 
              }}>
          <img className="annonce-image" src={e.photos[0].url} alt={e.photos[0].name}/>
          <div className="annonce-text">
              <div className="annonce-price-container">
                  <span className="annonce-price">{priceFormatter.format(e.price)}</span>
                  <span className={`annonce-state open-${e.onlineStatus}`}></span>
              </div>
              <p className="annonce-address-title">{e.address}</p>
              <p className="annonce-address-sub">{e.postcode} {e.city}</p>
          </div>
          <div className="annonce-infos">
              <span className="annonce-area"><img src="http://localhost:3001/expand.svg" width="20px" alt=''/> {e.area} <span>&nbsp;m2</span></span>
              <span className="annonce-room"><img src="http://localhost:3001/floor-plan.png" width="20px" alt=''/> {e.rooms} <span>&nbsp;{e.rooms > 1 ? 'pièces' : 'pièce'}</span></span>
              <span className="annonce-bedroom"><img src="http://localhost:3001/bed.svg" width="20px" alt=''/> {e.bedrooms} <span>&nbsp;{e.bedrooms > 1 ? 'chambres' : 'chambre'}</span></span>
          </div>
        </div>
      </Col>
      )
    })
  
  /*  Navigation */ 
  if(navToCreateAd === true) {
    return <Redirect push to="/pro/ad/new/step1"/>
  }
  if(navToAdDetail === true) {
    return <Redirect push to={urlAd} />
  }

/* ----------------------------------------------RENDER COMPONENT----------------------------------------------- */
  return (

    <APIFetch
      fetchUrl= '/pro/ads'
      fetchOptions={{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${cookies.aT}`
        }
      }}
      getApiResponse = { response => {
          if (!dataLoaded) {
            setAdsListFromDb(response.data.ads)
          }
          setDataLoaded(true)
      }}
    >
      <div className="ads-list-title">
        <h1 className='pageTitle'>Mes biens</h1>
        <Button
          onClick={() => {
            props.clearNewAd()
            props.clearAdEdit()
            setNavToCreateAd(true)
          }}
          type="secondary"
        >
          Ajouter un bien
          <PlusCircleOutlined />
        </Button>
      </div>

      {adsCopy.length > 0 &&
        <Collapse className="filter-header" bordered={false}>
          <Panel className="filter-bar" header="Filtres">
            <div className="filter-group">
              <div>
                <p className='filter-label'>En Ligne</p>
                  <Radio.Group
                    onChange={e => {
                      setOnlineStatus(e.target.value)
                    }}
                    value={onlineStatus}
                  >
                  <Radio className="filter-radio-button-main" value="All">
                    Voir tout
                  </Radio>
                  <Radio className="filter-radio-button" value="Y">
                    Oui
                  </Radio>
                  <Radio className="filter-radio-button" value="N">
                    Non
                  </Radio>
                  </Radio.Group>
              </div>

              <div>
                <p className='filter-label'>Ouvert aux visites</p>
                  <Radio.Group
                    onChange={e => setVisitStatus(e.target.value)}
                    value={visitStatus}
                  >
                  <Radio className="filter-radio-button-main" value="All">
                    Voir tout
                  </Radio>
                  <Radio className="filter-radio-button" value="Y">
                    Oui
                  </Radio>
                  <Radio className="filter-radio-button" value="N">
                    Non
                  </Radio>
                  </Radio.Group>
              </div>

              <div>
                <p className='filter-label'>Ouvert aux offres</p>
                  <Radio.Group
                    onChange={e => setOfferStatus(e.target.value)}
                    value={offerStatus}
                  >
                  <Radio className="filter-radio-button-main" value="All">
                    Voir tout
                  </Radio>
                  <Radio className="filter-radio-button" value="Y">
                    Oui
                  </Radio>
                  <Radio className="filter-radio-button" value="N">
                    Non
                  </Radio>
                  </Radio.Group>
              </div>
            </div>
          </Panel>
        </Collapse>
      }

      {adsCopy.length > 0
        ? <Row gutter={16}>
            {adsCopy}
          </Row>
        : <h3>Vous n'avez pas de biens à gérer. </h3>
      }

    </APIFetch>
  )
}


function mapDispatchToProps(dispatch) {
  return {
    clearNewAd : function() { 
      dispatch( {type: 'agent_clearNewAd'} ) 
    },
    clearAdEdit : function() {
      dispatch({type: 'agent_clearAdEdit'})
    }
  }
}

function mapStateToProps(state) {
  return { 
    agentLoginInfo : state.agentLoginInfo
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)