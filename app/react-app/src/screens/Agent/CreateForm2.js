import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout} from 'antd';
import { Steps, Button, message, Input, Radio, InputNumber } from 'antd';
import {connect} from 'react-redux';


const { Step } = Steps;
const {Content} = Layout;


function CreateFormTwo(props) {

    const [type, setType] = useState("")
    const [area, setArea] = useState(0)
    const [rooms, setRooms] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        setCurrentPage(props.step)        // Gets current page number from redux sotre for steps display
      },[]);

    console.log(type, area, rooms)

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
                            
                            <label>
                                <p>Type de bien </p>
                                <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
                                <Radio value="appartement" style={{paddingTop : "1%"}}>Appartement</Radio>
                                <br/>
                                <Radio value="maison" style={{paddingTop : "1%"}}>Maison</Radio>
                                </Radio.Group>
                            </label>
                            <label >
                                <p>Surface</p>
                                <Input onChange={(e) => setArea(e.target.value)} suffix="m2" value={area} style={{marginBottom: "3%"}} placeholder="75018"/>
                            </label>
                            <label>
                                <p>Nombre de pièces</p>
                                <InputNumber onChange={(e) => setRooms(e.target.value)} value={rooms} style={{marginBottom: "3%"}} placeholder="75018"/>
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

