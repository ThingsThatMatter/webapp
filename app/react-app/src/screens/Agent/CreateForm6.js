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
        if(props.formData.advantages.findIndex((e) => e == "ascenseur") !== -1){
            tempTable.push(<span ><img src="../elevator.png" width="20px"/> Ascenseur</span>)
        };
        if(props.formData.advantages.findIndex((e) => e == "balcon") !== -1){
            tempTable.push(<span ><img src="../balcony.png" width="20px"/> Balcon</span>)
        };
        if(props.formData.advantages.findIndex((e) => e == "terrasse") !== -1){
            tempTable.push(<span><img src="../floor.png" width="20px"/> Terrasse</span>)
        };

        setAvantages(tempTable)

        // const getFiles = async() => {
        //     const data = await fetch(`/pro/tempfiles?id=${props.formData.adID}&photos=${JSON.stringify(props.formData.photos)}&files=${JSON.stringify(props.formData.files)}`)
        //     console.log("response: ", data)
        //   }
      
        //   getFiles()  


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
        return <Redirect to="/"/> // Triggered by button-add handleClick
    }
    if(backRedir === true) {
        return <Redirect to="/createform/step5"/> // Triggered by button-back handleClick
    }

    console.log("form 6", props.formData)
    return (

        <Layout>

            <Sidebar/>

            <Layout className='main-content'>

                <Content style={{ margin: '2em 3em' }}>

                    <Steps progressDot current={currentPage}> 
                            <Step title="Localisation" />
                            <Step title="Description" />
                            <Step title="Documents" />
                            <Step title="Prix/honnoraires" />
                            <Step title="Créneaux" />
                            <Step title="Récap" />
                    </Steps>

                    <h1 style={{marginTop: "3%"}} className='pageTitle'>{props.formData.title}</h1> 

                    <div className='detail'>
                     <p>{props.formData.type.toUpperCase()}</p>
                     <p>{props.formData.address} {props.formData.postCode}</p> {props.formData.typeAddress === false && <p>(uniquement le quartier sera communiqué sur les plateformes)</p>}
                     </div>

                    <div className="section">

                        <div className="row">

                            <span style={{justifySelf: "start"}} ><img src="../expand.svg" width="20px"/>{props.formData.area}<span>&nbsp;m2</span></span>
                            <span style={{justifySelf: "center"}} ><img src="../floor-plan.png" width="20px"/>{props.formData.rooms}<span>&nbsp;pièces</span></span>
                            <span style={{justifySelf: "end"}} ><img src="../bed.svg" width="20px"/> {props.formData.bedrooms} <span>&nbsp;chambres</span></span>
                        </div>
                        
                        {props.formData.advantages.length > 0 && <div className="dark-row">

                        <div className="row">
                        {avantages}
                        </div>
                        </div>}
                        

                        <div className="row">
                        <p style={{textAlign: "justify"}}>{props.formData.description}</p>
                        </div>

                            <div className="slide-container">

                                <Slide {...properties}>

                                {
                                    props.formData.photos.map((e) => (
                                    <div className="each-slide">
                                        <div style={{'backgroundImage': `url(http://localhost:3000/temp/${props.formData.adID}-${e.name})`}}> </div>
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
                            <div>
                                <a>PV-AG-2020.jpg</a>
                            </div>
                            <div>
                                <a>PV-AG-2020.jpg</a>
                            </div>
                                                        
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
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(
                                    {
                                    token : "idMN5ebalGgc336ZVmkMI5n8P2zA8PXn",
                                    adID: props.formData.adID,
                                    price: props.formData.price,
                                    fees: props.formData.fees,
                                    type: props.formData.type,
                                    title:props.formData.title,
                                    description: props.formData.description,
                                    typeAddress: props.formData.typeAddress,
                                    address: props.formData.address,
                                    postcode: props.formData.postCode,
                                    city:"",
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

                                message.success({ content: `${props.formData.title} créé !`, key, duration: 2 });
                                props.clear()
                                setRedir(true)

                            } else {
                                message.error(response.details);
                            }

                            }}>Suivant</Button>
                           
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  function mapDispatchToProps(dispatch) {
    return {
      clear : function() { 
        dispatch( {type: 'clear'} ) 
      }

    }
  }

  function mapStateToProps(state) {
    return { 
        step : state.step,
        formData: state.formData
    }
  }

  export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(CreateFormSix);