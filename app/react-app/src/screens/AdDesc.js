import React, {useState} from 'react';
import Sidebar from '../components/Sidebar';
import { Layout, Button, Switch, Badge, Collapse} from 'antd';
import { Slide } from 'react-slideshow-image';

const {Content} = Layout;
const { Panel } = Collapse;


const slideImages = [
    '../house.jpeg',
    '../house2.jpg',
    '../house3.jpg',
  ];
   
  const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: false,
    indicators: true,
    arrows: true,
    onChange: (oldIndex, newIndex) => {
      console.log(`slide transition from ${oldIndex} to ${newIndex}`);
    }
  }


function AdDesc() {


    const [toggle, setToggle] = useState(true)


    let toggleStyle = {fontWeight: 600, color:"#1476E1", fontSize:"18px"}

    if(toggle === false) {
        toggleStyle = {fontWeight: 500, color:"#6F6E6E", fontSize:"18px"}
    }

    return (
  
        <Layout>

            <Sidebar/>

            <Layout className='main-content'>

                <Content style={{ margin: '24px 16px 0' }}>

                     <h1 className='pageTitle'>Appartement 8 rue Constance 75018</h1>  

                    {/* PARTIE ACTIONS */}

                    <div className="section">

                        <div className="row">

                            <Badge count={5}>
                            <Button type="primary" ghost style={buttonAdd}>Offres </Button>
                            </Badge>

                            <Badge count={2}>
                            <Button type="primary" ghost style={buttonAdd}>Visites</Button>            
                            </Badge>

                            <Badge count={10}>
                            <Button type="primary" ghost style={buttonAdd}>Questions</Button>
                            </Badge>

                        </div>

                        <div className="dark-row-radius">

                            <div className="row-between">

                                <span style={toggleStyle}>annonce en ligne  <Switch defaultChecked onChange={() => setToggle(!toggle)}/> </span>
                            
                                <span> 
                                <img src="edit.png" width="35px" style={{marginRight: 40, cursor: "pointer"}}/>
                                <img src="bin.png" width="35px" style={{cursor: "pointer"}}/>
                                </span>

                            </div>
                        </div>
                    </div>

                    {/* PARTIE DESCRIPTION */}

                    <h2 className='pageSubTitle'>Descriptif</h2>  

                    <div className="section">

                        <div className="row">

                            <span ><img src="expand.svg" width="20px"/> 55 <span>&nbsp;m2</span></span>
                            <span ><img src="floor-plan.png" width="20px"/> 3 <span>&nbsp;pièces</span></span>
                            <span><img src="bed.svg" width="20px"/> 2 <span>&nbsp;chambres</span></span>
                        </div>

                        <div className="dark-row">

                            <div className="row">

                            <span ><img src="elevator.png" width="20px"/> Ascenseur</span>
                            <span ><img src="balcony.png" width="20px"/> Balcon</span>
                            <span><img src="floor.png" width="20px"/> Terrasse</span>

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

                
                <h1 style={{marginTop: "30px"}} className='pageTitle'>Questions fréquentes</h1>

                <Collapse bordered={false} defaultActiveKey={['1']}>
                    <Panel style={panelStyle} header="This is panel header 1" key="1">
                    <p>Bacon ipsum dolor amet porchetta cupim tenderloin, prosciutto tail bacon ground round picanha swine. Rump ham hock shoulder shank picanha kielbasa. Cupim venison pork chop tongue pig buffalo drumstick chuck pork chislic ribeye. Chislic strip steak hamburger meatloaf, capicola filet mignon kevin cow bresaola salami. Porchetta alcatra biltong frankfurter, leberkas bacon short loin jowl drumstick. Venison pig turkey pancetta tail. Porchetta venison chislic ground round ball tip.</p>
                    </Panel>
                    <Panel style={panelStyle} header="This is panel header 2" key="2">
                    <p>Bacon ipsum dolor amet porchetta cupim tenderloin, prosciutto tail bacon ground round picanha swine. Rump ham hock shoulder shank picanha kielbasa. Cupim venison pork chop tongue pig buffalo drumstick chuck pork chislic ribeye. Chislic strip steak hamburger meatloaf, capicola filet mignon kevin cow bresaola salami. Porchetta alcatra biltong frankfurter, leberkas bacon short loin jowl drumstick. Venison pig turkey pancetta tail. Porchetta venison chislic ground round ball tip.</p>
                    </Panel>
                    <Panel style={panelStyle} header="This is panel header 3" key="3">
                     <p>Bacon ipsum dolor amet porchetta cupim tenderloin, prosciutto tail bacon ground round picanha swine. Rump ham hock shoulder shank picanha kielbasa. Cupim venison pork chop tongue pig buffalo drumstick chuck pork chislic ribeye. Chislic strip steak hamburger meatloaf, capicola filet mignon kevin cow bresaola salami. Porchetta alcatra biltong frankfurter, leberkas bacon short loin jowl drumstick. Venison pig turkey pancetta tail. Porchetta venison chislic ground round ball tip.</p>
                    </Panel>
                </Collapse>


                   
            </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  const buttonAdd = {
    color: "#052040",
    fontSize: "1.5em",
    fontWeight: 600,
    padding: 10,
    borderColor: "#052040",
    borderWidth : 2,
    height: "auto",
    borderRadius: "10px",
  }

  const panelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    border: 0,
    overflow: 'hidden',
  }

 
  
  export default AdDesc;