import React, {useState, useEffect} from 'react';
import { Layout, Button, Switch, Badge, Collapse, Col, Row } from 'antd';
import { Slide } from 'react-slideshow-image';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux'


import Sidebar from '../../components/Sidebar';
import {PlusCircleOutlined, CheckCircleOutlined} from '@ant-design/icons'

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


function AdDesc(props) {


    const [toggle, setToggle] = useState(true)
    const [adDetails, setAdDetails] = useState({})

    const [adPhotos, setAdPhotos] = useState([])
    const [adDocuments, setAdDocuments] = useState([])
    const [adOffers, setAdOffers] = useState([])
    const [adVisits, setAdVisits] = useState([])
    const [avantages, setAvantages] = useState([])

    const [redir, setRedir] = useState(false)
    const [editRedir, setEditRedir] = useState(false)


    let toggleStyle = {fontWeight: 600, color:"#1476E1", fontSize:"18px"}

    if(toggle === false) {
        toggleStyle = {fontWeight: 500, color:"#6F6E6E", fontSize:"18px"}
    }

    useEffect( () => {
        const dbFetch = async () => {
            const data = await fetch(`/pro/ad/${props.match.params.id}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', token: props.token}
            })
            const body = await data.json()
            setAdDetails(body.data)
            setAdPhotos(body.data.photos)
            setAdDocuments(body.data.files)
            setAdOffers(body.data.offers)
            setAdVisits(body.data.timeSlots)

            const tempTable = []

            if(body.data.advantages.findIndex((e) => e === "ascenseur") !== -1){
                tempTable.push(<span ><img src="../../../elevator.png" width="20px" alt="ascenseur"/>Ascenseur</span>)
            };
            if(body.data.advantages.findIndex((e) => e === "balcon") !== -1){
                tempTable.push(<span ><img src="../../../balcony.png" width="20px" alt="balcon"/>Balcon</span>)
            };
            if(body.data.advantages.findIndex((e) => e === "terrasse") !== -1){
                tempTable.push(<span><img src="../../../floor.png" width="20px" alt="terrasse"/>Terrasse</span>)
            };
    
            setAvantages(tempTable)
        }   
        dbFetch()
    }, []);

    // Supprimer une ad
    const handleDelete = async () => {
        const deleteAd = await fetch(`/pro/ad/${props.match.params.id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', token: props.token}
        })
        const body = await deleteAd.json();

        if(body.message === "OK") {
            setRedir(true)
        }
    }

    // Editer une ad
    const handleEdit = async () => {
        props.saveforEdit(adDetails)
        setEditRedir(true)
    }

    // Redirection
    if(redir === true) {
        return <Redirect to="/pro"/>
    }

    if(editRedir === true) {
        return <Redirect to="/pro/createform/step1"/>
    }

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

    return (
  
        <Layout>

            <Sidebar/>

            <Layout className='main-content'>

                <Content style={{ margin: '2em 3em' }}>

                        <div className="agent-section">

                            <h1 className='pageTitle'>{adDetails.title}</h1>

                            <div className="agent-action">
                                <Switch defaultChecked onChange={() => setToggle(!toggle)}/>
                                <div> 
                                    <img src="../../../edit.png" width="20px" style={{marginRight: 20, cursor: "pointer"}} onClick={handleEdit}/>
                                    <img src="../../../bin.png" width="20px" style={{cursor: "pointer"}} onClick={handleDelete}/>
                                </div>
                            </div>

                        </div>
                        <div className="agent-resume">
                            <Badge count={adOffers.length}>
                                <Button type="primary" ghost className="button-add">Offres </Button>
                            </Badge>

                            <Badge count={adVisits.length}>
                                <Button type="primary" ghost className="button-add">Visites</Button>            
                            </Badge>

                            <Badge count={3}>
                                <Button type="primary" ghost className="button-add">Questions</Button>
                            </Badge>
                        </div>
                    
                    {/* PARTIE DESCRIPTION */}


                    <h2 className='pageSubTitle'>Descriptif</h2>  

                    <div className="section ad-main-details">

                        <div className="row">
                                <span ><img src="../../../expand.svg" width="20px"/><strong>{adDetails.area}</strong> m<sup>2</sup></span>
                                <span ><img src="../../../floor-plan.png" width="20px"/><strong>{adDetails.rooms}</strong> pièces</span>
                                <span><img src="../../../bed.svg" width="20px"/><strong>{adDetails.bedrooms}</strong> chambres</span>
                        </div>

<<<<<<< HEAD
                        {avantages.length > 0 && <div className="dark-row">

                        <div className="row">
                        {avantages}
=======
                        <div className="dark-row">
                            <div className="row">
                                <span ><img src="../../../elevator.png" width="20px"/> Ascenseur</span>
                                <span ><img src="../../../balcony.png" width="20px"/> Balcon</span>
                                <span><img src="../../../floor.png" width="20px"/> Terrasse</span>
                            </div>
>>>>>>> 192ec5b6c848a772e87752a3197a879265f10070
                        </div>
                        </div>}

                        <Row gutter={16} className="section-text">
                            <Col xs={{span:24}} md={{span:12}} lg={{span:12}} xl={{span:12}}>
                                <div className="slide-container">

                                    <Slide {...properties}>

                                    {photos}

                                    </Slide>
                                </div>
                            </Col>
                            <Col xs={{span:24}} md={{span:12}} lg={{span:12}} xl={{span:12}}>
                                <p style={{textAlign: "justify"}}>{adDetails.description}</p>
                            </Col>
                        </Row>
                    </div>

                    {/* PARTIE PRIX ET HONORAIRES */}
                    <Row gutter={30}>
                        <Col xs={{span:24}} md={{span:24}} lg={{span:8}} xl={{span:8}}>
                            <h2 className='pageSubTitle'>Prix & honoraires</h2>  

                            <div className="section">
                                <div className="section-text">
                                    <p><span style={{fontWeight: 700}}>{priceFormatter.format(adDetails.price*adDetails.fees/100+adDetails.price)} </span> TTC</p>
                                    <p><span style={{fontWeight: 700}}>{priceFormatter.format(adDetails.price)}</span> hors honoraires</p>
                                    <p><span style={{fontWeight: 700}}>{adDetails.fees}</span>% honoraires à la charge de <span style={{fontWeight: 700}}>l'acquéreur</span></p>
                                </div>
                            </div>
                        </Col>

                    {/* PARTIE DIAGNOSTIQUE ELECTRIQUE */}
                        <Col xs={{span:24}} md={{span:24}} lg={{span:8}} xl={{span:8}}>
                            <h2 className='pageSubTitle'>Diagnostique électrique</h2>  

                            <div className="section">
                                <div className="section-text">
                                    <p><span style={{fontWeight: 700}}>{adDetails.dpe}</span> kWhEP/m² /an</p>
                                    <p><span style={{fontWeight: 700}}>{adDetails.ges}</span> kgeqCO2/m² /an</p>
                                </div>
                            </div>
                        </Col>

                    {/* PARTIE DOCUMENTS */}
                        <Col xs={{span:24}} md={{span:24}} lg={{span:8}} xl={{span:8}}>
                            <h2 className='pageSubTitle'>Documents</h2> 

                            <div className="section">
                                <div className="section-text">
                                        {documents}                
                                </div>
                            </div>
                        </Col>
                    </Row>

                

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
                   
            </Content>  

         </Layout>
            
    
    </Layout>

    );
  }


    function mapStateToProps(state) {
        return { 
            token : state.token
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            saveforEdit : function(adDetails) { 
            dispatch( {type: 'saveForEdit', data: adDetails } )
        }

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdDesc)