import React, {useState} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout} from 'antd';
import { Steps, Button, message, Input, Radio } from 'antd';

const { Step } = Steps;
const {Content} = Layout;


function CreateFormOne() {

    const [street, setStreet] = useState("")
    const [postal, setPostal] = useState("")
    const [pref, setPref] = useState("")


    const [currentPage, setCurrentPage] = useState(0)

    const next = () => {
        setCurrentPage(currentPage ++)
    }

    const prev = () => {

        if(currentPage > 0) {
            setCurrentPage(currentPage --)
        }
    }

    console.log(street, postal, pref)

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
                            
                            <label >
                                Numéro et rue
                                <Input onChange={(e) => setStreet(e.target.value)} value={street} style={{marginBottom: "3%"}} placeholder="8 rue constance"/>
                            </label>
                            <label>
                                Code postal
                                <Input onChange={(e) => setPostal(e.target.value)} value={postal} style={{marginBottom: "3%"}} placeholder="75018"/>
                            </label>
                            <label>
                                Comment souhaitez-vous afficher votre bien sur les cartes des sites d'annonces ?
                                <Radio.Group value={pref} onChange={(e) => setPref(e.target.value)}>
                                <Radio value={true} style={{paddingTop : "1%"}}>Lieu exact</Radio>
                                <br/>
                                <Radio value={false} style={{paddingTop : "1%"}}>Quartier</Radio>
                                </Radio.Group>
                            </label>
                            
                        </form>      

                        <Button type="primary" className="button-success">Suivant</Button>

                    </div>
              
                
                
                   
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  export default CreateFormOne;