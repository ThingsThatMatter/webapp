import React, {useState, useEffect} from 'react';
import { Layout, Row, Button, Col, Collapse, Radio, Carousel } from 'antd';
import {Redirect} from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import {PlusCircleOutlined} from '@ant-design/icons'
const { Panel } = Collapse;

const { Content } = Layout;
var tokenTest = "idMN5ebalGgc336ZVmkMI5n8P2zA8PXn"

function Offres() {

    const [offersList, setOfferslist] = useState([]);
  
    /* Offre Cards */
    useEffect( () => {
        const dbFetch = async () => {
            const ads = await fetch(`/pro/ads?token=${tokenTest}`)
            const body = await ads.json();
          
            let adsWithOffers = body.data.ads.filter( e => e.offers.length > 0);
    
        setOfferslist(adsWithOffers)

        }   
      dbFetch()
      }, []);

        /* Price formatting */
        const priceFormatter = new Intl.NumberFormat('fr', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            useGrouping: true
        })

        console.log(offersList)

        let sortedOffers = offersList.map((e,i) => {
            return (
            <div key={i} className='offers-row'>
                <h2 className='title'>{e.title} - {e.area}m<sup>2</sup> - {e.address} {e.postcode} {e.city} - {priceFormatter.format(e.price)}</h2>
                
                    <Row gutter={16}>
                        { e.offers.map( (f,i) => {
                            
                            let color;
                            if(f.amount == e.price) {
                                color = '#6ce486';
                            }
                        return (
                            <Col key = {i}>
                                <div className="offre-element">
                                    <div className="offre-amount" style={{backgroundColor: color}}>
                                        <span className="annonce-price">{priceFormatter.format(f.amount)}</span>
                                    </div>
                                    <div className="offre-buyer">
                                        <p className="offre-buyer-name">{f.firstname1} {f.lastname1}</p>
                                    </div>
                                    <div className="offre-money">
                                        <p className="offre-contribution"><span>Apport : </span>{priceFormatter.format(f.contributionAmount)}</p>
                                        <p className="offre-loan"><span>Emprunt : </span>{priceFormatter.format(f.loanAmount)}</p>
                                    </div>
                                    <div className="offre-bottom">
                                        <Button className="button-validate">Détails</Button>
                                        <span className="offre-details">reçue le {f.creationDate}</span>
                                    </div>
                                </div>
                            </Col>
                        )
                        })
                        }
                    </Row>
            </div>
            )
            
        });


    return (
  
        <Layout>


            <Sidebar/>

            <Layout className='main-content'>
                <Content style={{ margin: '24px 16px 0' }}>
                <h1 className='pageTitle'>Les offres</h1>
                    {sortedOffers}
                </Content>         
            </Layout>
            
        
  
        </Layout>

    );
  }
  
  export default Offres;