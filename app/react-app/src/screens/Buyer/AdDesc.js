import React, {useState, useEffect} from 'react';
import { Layout, Button, Switch, Badge, Collapse } from 'antd';
import { Slide } from 'react-slideshow-image';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux'

const {Content} = Layout;
const { Panel } = Collapse;
   
  const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true,
    onChange: (oldIndex, newIndex) => {
    //   console.log(`slide transition from ${oldIndex} to ${newIndex}`);
    }
  }


function AdDesc() {

    const [toggle, setToggle] = useState(true)
    const [adDetails, setAdDetails] = useState({})

    const [adPhotos, setAdPhotos] = useState([])
    const [adDocuments, setAdDocuments] = useState([])

    let toggleStyle = {fontWeight: 600, color:"#1476E1", fontSize:"18px"}

    if(toggle === false) {
        toggleStyle = {fontWeight: 500, color:"#6F6E6E", fontSize:"18px"}
    }

    useEffect( () => {
        const dbFetch = async () => {
            const data = await fetch(`/user/ad/5e666272799a2825dcd8ec0e`)
            const body = await data.json()
    
            setAdDetails(body)
            setAdPhotos(body.photos)
            setAdDocuments(body.files)
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


    let photos = adPhotos.map((e,i) => {
        return (
            <div key={i} className="each-slide">
                <div style={{'backgroundImage': `url(${e})`}}> </div>
            </div>
        )
    });

    let documents = adDocuments.map((e,i) => {
        return (
            <div key={i}>
                <a href={e} target="_blank">{e.split('-')[1]}</a>
            </div>
        )
    });

    console.log(adDetails)
    return (
  
        <Layout>

            <Layout className='main-content'>

                <Content style={{ margin: '2em 3em' }}>

                <div className="buyer-ad-container">


                    <div className="buyer-left-content">

                        <div className="agent-section">

                            <h1 className='pageTitle'>{adDetails.title} - {adDetails.area}m<sup>2</sup> - {adDetails.address} {adDetails.postcode} {adDetails.city} - {priceFormatter.format(adDetails.price)}</h1>

                        </div>

                        <div className="slide-container">

                                <Slide {...properties}>

                                {photos}

                                </Slide>
                            </div>

                    {/* PARTIE DESCRIPTION */}

                    <h2 className='pageSubTitle'>Descriptif</h2>  

                    <div className="section ad-main-details">

                        <div className="row">
                            <span ><img src="../../../expand.svg" width="20px"/><strong>{adDetails.area}</strong> m<sup>2</sup></span>
                            <span ><img src="../../../floor-plan.png" width="20px"/><strong>{adDetails.rooms}</strong> pièces</span>
                            <span><img src="../../../bed.svg" width="20px"/><strong>{adDetails.bedrooms}</strong> chambres</span>
                        </div>

                        <div className="dark-row">

                            <div className="row">

                            <span ><img src="../../../elevator.png" width="20px"/> Ascenseur</span>
                            <span ><img src="../../../balcony.png" width="20px"/> Balcon</span>
                            <span><img src="../../../floor.png" width="20px"/> Terrasse</span>

                            </div>
                        </div>

                        <div className="section-text">
                            <p style={{textAlign: "justify"}}>{adDetails.description}</p>
                        </div>
                        
                    </div>

                    {/* PARTIE PRIX ET HONNORAIRES */}


                    <h2 className='pageSubTitle'>Prix & honoraires</h2>  

                    <div className="section">

                        <div className="section-text">
                            <p><span style={{fontWeight: 700}}>{priceFormatter.format(adDetails.price*adDetails.fees/100+adDetails.price)} </span> TTC</p>
                            <p><span style={{fontWeight: 700}}>{priceFormatter.format(adDetails.price)}</span> hors honoraires</p>
                            <p><span style={{fontWeight: 700}}>{adDetails.fees}</span>% honoraires à la charge de <span style={{fontWeight: 700}}>l'acquéreur</span></p>
                        </div>
                    </div>

                    {/* PARTIE DIAGNOSTIQUE ELECTRIQUE */}

                    <h2 className='pageSubTitle'>Diagnostique électrique</h2>  

                    <div className="section">
                    <div className="section-text">
                            <p><span style={{fontWeight: 700}}>{adDetails.dpe}</span> kWhEP/m² /an</p>
                            <p><span style={{fontWeight: 700}}>{adDetails.ges}</span> kgeqCO2/m² /an</p>
                        </div>
                    </div>

                    {/* PARTIE DOCUMENTS */}

                    <h2 className='pageSubTitle'>Documents</h2> 

                    <div className="section">
                        <div className="section-text">
                                {documents}                
                        </div>
                    </div>

                

                <h2 className='pageSubTitle'>Questions fréquentes</h2>  


                <Collapse style={{marginBottom: 20}} bordered={false} defaultActiveKey={['1']}>
                    <Panel className="faq" header="Qu'est ce qu'un m2 ? " key="1">
                    <p>Bacon ipsum dolor amet porchetta cupim tenderloin, prosciutto tail bacon ground round picanha swine. Rump ham hock shoulder shank picanha kielbasa. Cupim venison pork chop tongue pig buffalo drumstick chuck pork chislic ribeye. Chislic strip steak hamburger meatloaf, capicola filet mignon kevin cow bresaola salami. Porchetta alcatra biltong frankfurter, leberkas bacon short loin jowl drumstick. Venison pig turkey pancetta tail. Porchetta venison chislic ground round ball tip.</p>
                    </Panel>
                    <Panel className="faq" header="Ceci est une question longue très longue ? " key="2">
                    <p>Bacon ipsum dolor amet porchetta cupim tenderloin, prosciutto tail bacon ground round picanha swine. Rump ham hock shoulder shank picanha kielbasa. Cupim venison pork chop tongue pig buffalo drumstick chuck pork chislic ribeye. Chislic strip steak hamburger meatloaf, capicola filet mignon kevin cow bresaola salami. Porchetta alcatra biltong frankfurter, leberkas bacon short loin jowl drumstick. Venison pig turkey pancetta tail. Porchetta venison chislic ground round ball tip.</p>
                    </Panel>
                    <Panel className="faq" header="Ceci est une question longue très longue ? " key="3">
                     <p>Bacon ipsum dolor amet porchetta cupim tenderloin, prosciutto tail bacon ground round picanha swine. Rump ham hock shoulder shank picanha kielbasa. Cupim venison pork chop tongue pig buffalo drumstick chuck pork chislic ribeye. Chislic strip steak hamburger meatloaf, capicola filet mignon kevin cow bresaola salami. Porchetta alcatra biltong frankfurter, leberkas bacon short loin jowl drumstick. Venison pig turkey pancetta tail. Porchetta venison chislic ground round ball tip.</p>
                    </Panel>
                </Collapse>

                </div>

                <div className="buyer-right-content">

                    <div className="timeslot-picker">
                        <p>Sélectionnez un créneau de visite</p> 
                        {/* 
                        1) extraire jours >= today. les mettre dans un objet et dans un tableau [{jour : 02/01/2020, créneaux : [{id: id, start: 8h30, end: 9h00}, ...], ...]
                        
                         */}

                    </div>

                </div>

            </div>

                   
            </Content>  

         </Layout>
            
    
    </Layout>

    );
  }


// function mapStateToProps(state) {
//     return { 
//         token : state.token
//     }
// }

// export default connect(
//     mapStateToProps,
//     null
// )(AdDesc)

export default AdDesc