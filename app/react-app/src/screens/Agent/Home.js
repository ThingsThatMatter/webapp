import React, {useState, useEffect} from 'react';
import { Layout, Row, Button, Col, Collapse, Radio } from 'antd';
import {Redirect} from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import {PlusCircleOutlined} from '@ant-design/icons'
const { Panel } = Collapse;

const { Content } = Layout;
var tokenTest = "idMN5ebalGgc336ZVmkMI5n8P2zA8PXn"

function Home() {
  
  const [navToCreateAd, setNavToCreateAd] = useState(false)
  const [navToAdDetail, setNavToAdDetail] = useState(false)
  const [adsList, setAdslist] = useState([])
  const [onlineStatus, setOnlineStatus] = useState("All")
  const [visitStatus, setVisitStatus] = useState("All")
  const [offerStatus, setOfferStatus] = useState("All")
  const [filterChange, setFilterChange] = useState(false)

  /* Ad Cards */
  useEffect( () => {
    const adsFetch = async () => {
      const ads = await fetch('/pro/ads', {
        method: 'GET',
        headers: {'token': tokenTest}
      })
      const body = await ads.json();
      setAdslist(body.data.ads)
    }
    adsFetch()
  }, [])

  /* Filters */
  let ads = [...adsList]

  // useEffect(() => {
  //   const filter () => {
  //     if (onlineStatus === 'Y') {
  //       ads = adsList.filter( e => e.onlineStatus === true )
  //     } else if (onlineStatus === 'N') {
  //       ads = adsList.filter( e => e.onlineStatus === false )
  //     }
    
  //     if (visitStatus === 'Y') {
  //       ads = adsList.filter( e => e.visitStatus === true )
  //     } else if (visitStatus === 'N') {
  //       ads = adsList.filter( e => e.visitStatus === false )
  //     }
    
  //     if (offerStatus === 'Y') {
  //       ads = adsList.filter( e => e.offerStatus === true )
  //     } else if (offerStatus === 'N') {
  //       ads = adsList.filter( e => e.offerStatus === false )
  //     }
  //   }

  // }[filterChange])


  /* Price formatting */
  const priceFormatter = new Intl.NumberFormat('fr', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    useGrouping: true
  })
  
  /* Ad card rending */
    //sort
  ads = ads.sort((a,b) => {
    const dateCreate = (date) => {
      var year = date.slice(0,4)
      var month = Number(date.slice(5,7))-1
      var day = date.slice(8,10)
      var hour = date.slice(11,13)
      var min = date.slice(14,16)
      return new Date(year, month, day, hour, min)
    }
    return (dateCreate(a.creationDate) - dateCreate(b.creationDate))
  })
    //rend
  ads = ads.map( (e,i) => {
    return (
      <Col key = {i} xs={{span:24}} md={{span:12}} lg={{span:8}} xl={{span:6}}>
        <div className="annonce-element" onClick={() => setNavToAdDetail(true) }>
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
              <span className="annonce-area"><img src="expand.svg" width="20px"/> {e.area} <span>&nbsp;m2</span></span>
              <span className="annonce-room"><img src="floor-plan.png" width="20px"/> {e.rooms} <span>&nbsp;pièces</span></span>
              <span className="annonce-bedroom"><img src="bed.svg" width="20px"/> {e.bedrooms} <span>&nbsp;chambres</span></span>
          </div>
        </div>
      </Col>
    )
  })
  
  /*  Navigation */ 
  if(navToCreateAd === true) {
    return <Redirect to="/createform/step1"/>
  }
  if(navToAdDetail === true) {
    return <Redirect to="/addesc"/>
  }
  
  return (
    
    <Layout>
      <Sidebar/>
      <Layout className='main-content'>
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="ads-list-title">
            <h1 className='pageTitle'>Mes biens</h1>
            <Button
              onClick={() => setNavToCreateAd(true)}
              type="primary"
              ghost
              className= "button-add"
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
                      onChange={e => setOnlineStatus(e.target.value)}
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
              {ads}
          </Row>

        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
