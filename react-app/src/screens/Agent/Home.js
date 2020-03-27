import React, {useState, useEffect} from 'react'
import { Layout, Row, Button, Col, Collapse, Radio } from 'antd'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import {useCookies} from 'react-cookie'

import Sidebar from '../../components/Sidebar'
import {PlusCircleOutlined} from '@ant-design/icons'
const { Panel } = Collapse;

const { Content } = Layout;

function Home(props) {
  
  const [navToCreateAd, setNavToCreateAd] = useState(false)
  const [navToAdDetail, setNavToAdDetail] = useState(false)
  const [adsListFromDb, setAdsListFromDb] = useState([])
  const [onlineStatus, setOnlineStatus] = useState("All")
  const [visitStatus, setVisitStatus] = useState("All")
  const [offerStatus, setOfferStatus] = useState("All")
  const [adsToShow, setAdsToShow] = useState([])

  const [cookies, setCookie] = useCookies(['name']); // initilizing state cookies

  const [urlAd, setUrlAd] = useState(null);

  /* Token refresh */
  const renewAccessToken = (token) => {
    if (token !== cookies.aT) {
        setCookie('aT', token, {path:'/pro'})
    }
  }

  /* Ad Cards */
  useEffect( () => {
    const adsFetch = async () => {
      const ads = await fetch('/pro/ads', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${cookies.aT}`
        }
      })
      const body = await ads.json()
      renewAccessToken(body.data.accessToken) // Renew token if invalid soon
      setAdsListFromDb(body.data.ads)
    }
    adsFetch()
  }, [])


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
  adsCopy = adsCopy.sort((a,b) => {
    const dateCreate = (date) => {
      var year = date.slice(0,4)
      var month = Number(date.slice(5,7))-1
      var day = date.slice(8,10)
      var hour = date.slice(11,13)
      var min = date.slice(14,16)
      return new Date(year, month, day, hour, min)
    }
    return (dateCreate(b.creationDate) - dateCreate(a.creationDate))
  })
    //rend
    adsCopy = adsCopy.map( (e,i) => {
    return (
      <Col key = {i} xs={{span:24}} md={{span:12}} lg={{span:8}} xl={{span:8}}>
        <div className="annonce-element" 
              onClick={() => {
                setUrlAd(`/pro/ad/${e._id}`)
                setNavToAdDetail(true) 
              }}>
          <img className="annonce-image" src={e.photos[0]} />
          <div className="annonce-text">
              <div className="annonce-price-container">
                  <span className="annonce-price">{priceFormatter.format(e.price)}</span>
                  <span className={`annonce-state open-${e.onlineStatus}`}></span>
              </div>
              <p className="annonce-address-title">{e.address}</p>
              <p className="annonce-address-sub">{e.postcode} {e.city}</p>
          </div>
          <div className="annonce-infos">
              <span className="annonce-area"><img src="http://localhost:3001/expand.svg" width="20px"/> {e.area} <span>&nbsp;m2</span></span>
              <span className="annonce-room"><img src="http://localhost:3001/floor-plan.png" width="20px"/> {e.rooms} <span>&nbsp;pièces</span></span>
              <span className="annonce-bedroom"><img src="http://localhost:3001/bed.svg" width="20px"/> {e.bedrooms} <span>&nbsp;chambres</span></span>
          </div>
        </div>
      </Col>
      )
    })
  
  /*  Navigation */ 
  if(navToCreateAd === true) {
    return <Redirect to="/pro/createform/step1"/>
  }
  if(navToAdDetail === true) {
    return <Redirect to={urlAd} />
  }
  
  return (
    
    <Layout>
      <Sidebar/>
      <Layout className='main-content'>
        <Content style={{ margin: '2em 3em' }}>
          <div className="ads-list-title">
            <h1 className='pageTitle'>Mes biens</h1>
            <Button
              onClick={() => setNavToCreateAd(true)}
              type="secondary"
            >
              Ajouter un bien
              <PlusCircleOutlined />
            </Button>
          </div>

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

          <Row gutter={16}>
              {adsCopy}
          </Row>

        </Content>
      </Layout>
    </Layout>
  );
}

function mapStateToProps(state) {
  return { 
    agentLoginInfo : state.agentLoginInfo
  }
}

export default connect(
  mapStateToProps,
  null
)(Home)