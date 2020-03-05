import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout, Steps, Button, Input, Radio, InputNumber, Checkbox, Upload, message } from 'antd';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import { Slide } from 'react-slideshow-image';


const { Step } = Steps;
const {Content} = Layout;


function CreateFormSix(props) {

    

    // const [type, setType] = useState("")
    // const [area, setArea] = useState(0)
    // const [rooms, setRooms] = useState(0)
    // const [avantages, setAvantages] = useState([])
    // const [title, setTitle] = useState("")
    // const [desc, setDesc] = useState("")
    // const [fileList, setFileList] = useState([])
    // const [video, setVideo] = useState("")
    // const [emission, setEmission] = useState(0)
    // const [conso, setConso] = useState(0)

    const [currentPage, setCurrentPage] = useState(0)
    // const [redir, setRedir] = useState(false)
    // const [backRedir, setBackRedir] = useState(false)
    // const [formError, setFormError] = useState("")


    // useEffect(() => {
    //     setCurrentPage(props.step)     // Gets current page number from redux sotre for steps display

    //     if(props.formData.rooms) {     // Display inputed info if user goes back from next form pages
    //         setType(props.formData.type)
    //         setArea(props.formData.area)
    //         setRooms(props.formData.rooms)
    //         setAvantages(props.formData.avantages)
    //         setTitle(props.formData.title)
    //         setDesc(props.formData.description)
    //         setFileList(props.formData.photos)
    //         setVideo(props.formData.video)
    //         setEmission(props.formData.ges)
    //         setConso(props.formData.dpe)
    //     }
    //   },[]);
       
      const properties = {
        duration: 5000,
        transitionDuration: 500,
        infinite: true,
        indicators: true,
        arrows: true,
        onChange: (oldIndex, newIndex) => {
          console.log(`slide transition from ${oldIndex} to ${newIndex}`);
        }
      }    

    return (

        <Layout>

            <Sidebar/>

            <Layout className='main-content'>

                <Content style={{ margin: '24px 16px 0' }}>

                    <Steps progressDot current={currentPage}>
                            <Step title="Localisation" />
                            <Step title="Description" />
                            <Step title="Documents" />
                            <Step title="Prix/honnoraires" />
                            <Step title="Plateformes" />
                            <Step title="Créneaux" />
                            <Step title="Récap" />
                    </Steps>

                    <h1 className='pageTitle'>Appartement 8 rue Constance 75018</h1> 

                    <div className="section">

                        <div className="row">

                            <span ><img src="../expand.svg" width="20px"/> 55 <span>&nbsp;m2</span></span>
                            <span ><img src="../floor-plan.png" width="20px"/> 3 <span>&nbsp;pièces</span></span>
                            <span><img src="../bed.svg" width="20px"/> 2 <span>&nbsp;chambres</span></span>
                        </div>

                        <div className="dark-row">

                            <div className="row">

                            <span ><img src="../elevator.png" width="20px"/> Ascenseur</span>
                            <span ><img src="../balcony.png" width="20px"/> Balcon</span>
                            <span><img src="../floor.png" width="20px"/> Terrasse</span>

                            </div>
                        </div>

                        <div className="row">
                            <p style={{textAlign: "justify"}}>Bacon ipsum dolor amet porchetta cupim tenderloin, prosciutto tail bacon ground round picanha swine. Rump ham hock shoulder shank picanha kielbasa. Cupim venison pork chop tongue pig buffalo drumstick chuck pork chislic ribeye. Chislic strip steak hamburger meatloaf, capicola filet mignon kevin cow bresaola salami. Porchetta alcatra biltong frankfurter, leberkas bacon short loin jowl drumstick. Venison pig turkey pancetta tail. Porchetta venison chislic ground round ball tip.</p>
                        </div>

                            <div className="slide-container">

                                <Slide {...properties}>

                                <div className="each-slide">
                                    <div style={{'backgroundImage': "url(../house2.jpg)"}}> </div>
                                </div>

                                <div className="each-slide">
                                    <div style={{'backgroundImage': "url(../house2.jpg)"}}> </div>
                                </div>

                                <div className="each-slide">
                                    <div style={{'backgroundImage': "url(../house2.jpg)"}}> </div>
                                </div> 

                                </Slide>
                            </div>
                        
                    </div>

                    {/* PARTIE PRIX ET HONNORAIRES */}


                    <h2 className='pageSubTitle'>Prix & honnoraires</h2>  

                    <div className="section">

                        <div className="section-text">
                            <p><span style={{fontWeight: 700}}>500 000 €</span> TTC</p>
                            <p><span style={{fontWeight: 700}}>475 000 €</span> hors honnoraires</p>
                            <p><span style={{fontWeight: 700}}>5%</span> honnoraires à la charge de <span style={{fontWeight: 700}}>l'acquéreur</span></p>
                        </div>
                    </div>

                    {/* PARTIE DIAGNOSTIQUE ELECTRIQUE */}

                    <h2 className='pageSubTitle'>Diagnostique électrique</h2>  

                    <div className="section">
                    <div className="section-text">
                            <p><span style={{fontWeight: 700}}>290</span> kWhEP/m².an</p>
                            <p><span style={{fontWeight: 700}}>14</span> kgeqCO2/m².an</p>
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
                           
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  function mapStateToProps(state) {
    return { 
        step : state.step,
        formData: state.formData
    }
  }

  export default connect(
    mapStateToProps, 
    null
  )(CreateFormSix);