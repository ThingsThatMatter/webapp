import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout, Steps, Button, message } from 'antd';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import { Slide } from 'react-slideshow-image';


const { Step } = Steps;
const {Content} = Layout;


function CreateFormSix(props) {
 
    const [avantages, setAvantages] = useState([])
 

    const [currentPage, setCurrentPage] = useState(0)
    const [redir, setRedir] = useState(false)
    const [backRedir, setBackRedir] = useState(false)
    
    useEffect(() => {

        setCurrentPage(props.step)     // Gets current page number from redux sotre for steps display

        let tempTable = []

        // Creates avantages list
        if(props.formData.advantages.findIndex((e) => e === "ascenseur") !== -1){
            tempTable.push(<span ><img src="../../../elevator.png" width="20px" alt="ascenseur"/>Ascenseur</span>)
        };
        if(props.formData.advantages.findIndex((e) => e === "balcon") !== -1){
            tempTable.push(<span ><img src="../../../balcony.png" width="20px" alt="balcon"/>Balcon</span>)
        };
        if(props.formData.advantages.findIndex((e) => e === "terrasse") !== -1){
            tempTable.push(<span><img src="../../../floor.png" width="20px" alt="terrasse"/>Terrasse</span>)
        };

        setAvantages(tempTable)

    },[]);
       
      const properties = {  // carroussel properties
        duration: 5000,
        transitionDuration: 500,
        infinite: true,
        indicators: true,
        arrows: true,
        // onChange: (oldIndex, newIndex) => {
        //   console.log(`slide transition from ${oldIndex} to ${newIndex}`);
        // }
      }


    if(redir === true) {
        return <Redirect to="/pro"/> // Triggered by button-add handleClick
    }
    if(backRedir === true) {
        return <Redirect to="/pro/createform/step5"/> // Triggered by button-back handleClick
    }

    function capFirst(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}

    /* Price formatting */
    const priceFormatter = new Intl.NumberFormat('fr', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        useGrouping: true
    })

    console.log("form 6", props.formData)
    console.log(avantages)
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

                    <div className='detail'>
                        <p>{props.formData.type.toUpperCase()}</p>
                        <p>{props.formData.address} {props.formData.postCode}</p> {props.formData.typeAddress === false && <p>(uniquement le quartier sera communiqué sur les plateformes)</p>}
                    </div>

                    <div className="section">

                        <div className="row">

                            <span style={{justifySelf: "start"}} ><img src="../../../expand.svg" alt="surface" width="20px"/>{props.formData.area}<span>&nbsp;m2</span></span>
                            <span style={{justifySelf: "center"}} ><img src="../../../floor-plan.png" alt="pièces" width="20px"/>{props.formData.rooms}<span>&nbsp;pièces</span></span>
                            <span style={{justifySelf: "end"}} ><img src="../../../bed.svg" alt="chambres" width="20px"/> {props.formData.bedrooms} <span>&nbsp;chambres</span></span>
                        </div>
                        
                        {props.formData.advantages && <div className="dark-row">

                        <div className="row">
                        {avantages}
                        </div>
                        </div>}
                        

                        <div className="row">
                        <p style={{textAlign: "justify", whiteSpace: "pre-wrap"}}>{props.formData.description}</p>
                        </div>

                            <div className="slide-container">

                                <Slide {...properties}>

                                {
                                    props.formData.photos.map((e, i) => (
                                    <div className="each-slide">
                                        <div key={i} style={{'backgroundImage': `url(http://localhost:3000/pro/tempfiles/?name=${props.formData.adID}-${e})`}}> </div>
                                    </div>
                                    ))
                                }

                                </Slide>
                            </div>
                        
                    </div>

                    {/* PARTIE PRIX ET HONNORAIRES */}


                    <h2 className='pageSubTitle'>Prix & honnoraires</h2>  

                    <div className="section">

                        <div className="section-text">
                            <p><span style={{fontWeight: 700}}>{props.formData.price+props.formData.price*props.formData.fees/100}</span>€ TTC</p>
                            <p><span style={{fontWeight: 700}}>{props.formData.price}</span>€ hors honnoraires</p>
                            <p><span style={{fontWeight: 700}}>{props.formData.fees}</span>% honnoraires à la charge de <span style={{fontWeight: 700}}>l'acquéreur</span></p>
                        </div>
                    </div>

                    {/* PARTIE DIAGNOSTIQUE ELECTRIQUE */}

                    <h2 className='pageSubTitle'>Diagnostique électrique</h2>  

                    <div className="section">
                    <div className="section-text">
                            <p><span style={{fontWeight: 700}}>{props.formData.dpe}</span> kWhEP/m².an</p>
                            <p><span style={{fontWeight: 700}}>{props.formData.ges}</span> kgeqCO2/m².an</p>
                        </div>
                    </div>

                    {/* PARTIE DOCUMENTS */}

                    <h2 className='pageSubTitle'>Documents</h2> 

                    <div className="section">
                        <div className="section-text">

                        {
                            props.formData.files.map((e, i) => (
                                <div>
                                <a key={i} href={`http://localhost:3000/pro/tempfiles/?name=${props.formData.adID}-${e}`} target="_blank">{e}</a> 
                                </div>
                            ))
                        }
                           
                                                        
                        </div>
                    </div>

                    <Button type="primary" className="button-back"
                        onClick={() => {
                            setBackRedir(true)
                            props.previousStep()
                        }}
                        >
                        Précédent</Button>  

                        <Button type="primary" className="button-validate" 
                        onClick={async() => {

                            const key = "updatable"

                            message.loading({ content: 'Création en cours...', key });

                            let rawResponse = await fetch("/pro/ad", {
                                method: 'post',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'token': props.token
                                },
                                body: JSON.stringify(
                                    {
                                    adID: props.formData.adID,
                                    price: props.formData.price,
                                    fees: props.formData.fees,
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
                                    timeSlots: props.formData.timeslots
                                    }
                                )
                            })

                            let response = await rawResponse.json()

                            if(response.message === "OK") {

                                message.success({ content: "annonce créée !", key, duration: 2 });
                                setRedir(true)
                                props.clear()

                            } else {
                                message.error(response.details);
                            }

                            }}>Créer et diffuser l'annonce</Button>
                           
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  function mapDispatchToProps(dispatch) {
    return {
      clear : function() { 
        dispatch( {type: 'clear'} ) 
      },
      previousStep : function() {
        dispatch( {type: 'prevStep'} )
    }

    }
  }

  function mapStateToProps(state) {
    return {
        step : state.step,
        formData: state.formData,
        token: state.token
    }
  }

  export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(CreateFormSix);