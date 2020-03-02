import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout} from 'antd';
import { Steps, Button, message, Input, Radio, InputNumber, Checkbox } from 'antd';
import {connect} from 'react-redux';


const { Step } = Steps;
const {Content} = Layout;
const { TextArea } = Input;


function CreateFormTwo(props) {

    const [type, setType] = useState("")
    const [area, setArea] = useState(0)
    const [rooms, setRooms] = useState(0)
    const [avantages, setAvantages] = useState([])
    const [title, setTitle] = useState("")
    const [currentPage, setCurrentPage] = useState(0)


    const options = [
        {label : "Ascenseur", value : "ascenseur"},
        {label : "Balcon", value : "balcon"},
        {label : "Terrasse", value : "terrasse"}
    ]


    


    useEffect(() => {
        setCurrentPage(props.step)     // Gets current page number from redux sotre for steps display
      },[]);

    console.log(title)

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

                    <div style={{width : "60%", marginLeft: 25, marginTop: "4%"}}>

                        <form>
                            
                            <p className='formLabel'>Type de bien </p>
                            <label>
                                <Radio.Group 
                                value={type} 
                                onChange={(e) => setType(e.target.value)} 
                                style={{marginBottom: "3%"}}>
                                <Radio 
                                value="appartement" 
                                style={{paddingTop : "1%"}}>
                                Appartement</Radio>
                                <br/>
                                <Radio 
                                value="maison" 
                                style={{paddingTop : "1%"}}>
                                    Maison</Radio>
                                </Radio.Group>
                            </label>

                            <p className='formLabel'>Surface</p>
                            <label >
                                <InputNumber 
                                min={1} 
                                onChange={(e) => setArea(e)} 
                                value={area} 
                                style={{marginBottom: "3%"}} 
                                placeholder="75 m2"/>
                            </label>
                            <span style={{marginLeft: "1%"}}>m2</span>

                            <p className='formLabel'>Nombre de pièces</p>
                            <label>
                                <InputNumber 
                                min={1} 
                                onChange={(e) => setRooms(e)} 
                                value={rooms} 
                                style={{marginBottom: "3%"}} 
                                placeholder="75018"/>
                            </label>

                            <p className='formLabel'>Avantages</p>
                                <label>
                                <Checkbox.Group options={options} onChange={(values) => setAvantages(values)}/>
                                </label>
                            
                            <p className='formLabel'>Titre de l'annonce</p>
                            <label >
                                <Input onChange={(e) => setTitle(e.target.value)} value={title} style={{marginBottom: "3%"}} placeholder="8 rue constance"/>
                            </label>

                            <p className='formLabel'>Texte de l'annonce</p>
                            <label >
                                <TextArea rows={4} />
                            </label>
                            
                         
                            
                        </form>      

                        <Button type="primary" className="button-validate">Suivant</Button>

                    </div>
              
                
                
                   
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  function mapStateToProps(state) {
    return { step : state.step }
  }
    
  export default connect(
    mapStateToProps, 
    null
  )(CreateFormTwo);

