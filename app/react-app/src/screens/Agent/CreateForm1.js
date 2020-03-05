import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout} from 'antd';
import { Steps, Button, Input, Radio } from 'antd';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';


const { Step } = Steps;
const {Content} = Layout;


function CreateFormOne(props) {

    const [street, setStreet] = useState("")
    const [postal, setPostal] = useState("")
    const [pref, setPref] = useState("")


    const [redir, setRedir] = useState(false) 

    const [formError, setFormError] = useState("")

    const [currentPage, setCurrentPage] = useState(0)

    const adID =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    useEffect(() => {
        if (props.formData.address) {
            setStreet(props.formData.address)
            setPostal(props.formData.postCode)
            setPref(props.formData.typeAddress)
        }
      },[]);

    const handleClick = () => {

        if(street !== "" && postal !== "" && pref !== "") {
            props.saveFormData(street, postal, pref, adID);
            props.nextStep();
            setRedir(true);

        } else {
            setFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }
        
    }

    if(redir === true) {
        return <Redirect to="/createform/step2"/> // Triggered by button handleClick
    }

    console.log("form 1", props.formData)
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
                            <Step title="Créneaux" />
                            <Step title="Récap" />
                    </Steps>

                    <div style={{width : "60%", marginLeft: 25, marginTop: "2%"}}>

                        <form>
                            
                        <p className='formLabel'>Numéro et rue</p>
                            <label >
                                <Input onChange={(e) => setStreet(e.target.value)} value={street} placeholder="8 rue constance"/>
                            </label>

                            <p className='formLabel'>Code postal</p>
                            <label>
                                <Input onChange={(e) => setPostal(e.target.value)} value={postal} placeholder="75018"/>
                            </label>

                            <p className='formLabel'>Comment souhaitez-vous afficher votre bien sur les cartes des sites d'annonces ?</p>
                            <label>
                                <Radio.Group value={pref} onChange={(e) => setPref(e.target.value)}>
                                <Radio value={true} style={{paddingTop : "1%"}}>Lieu exact</Radio>
                                <br/>
                                <Radio value={false} style={{paddingTop : "1%"}}>Quartier</Radio>
                                </Radio.Group>
                            </label>
                            
                        </form>
                        {formError} 
                        <Button onClick={()=> handleClick()} type="primary" className="button-validate">Suivant</Button>
                         
                    </div>
               
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  function mapStateToProps(state) {
    return { 
        formData: state.formData
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      nextStep : function() { 
        dispatch( {type: 'nextStep'} ) 
      },
      saveFormData : function(street, postal, pref, adID) { 
        dispatch( {type: 'saveFormData', address: street, postCode: postal, typeAddress: pref, adID: adID } ) 
    }

    }
  }

  export default connect (mapStateToProps, mapDispatchToProps) (CreateFormOne);