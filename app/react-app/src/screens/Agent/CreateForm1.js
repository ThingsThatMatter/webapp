import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout} from 'antd';
import { Steps, Button, Input, Radio, InputNumber } from 'antd';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';


const { Step } = Steps;
const {Content} = Layout;


function CreateFormOne(props) {

    const [street, setStreet] = useState("")
    const [postal, setPostal] = useState("")
    const [pref, setPref] = useState("")
    const [city, setCity] = useState("")


    const [redir, setRedir] = useState(false) 

    const [formError, setFormError] = useState("")

    const adID =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    useEffect(() => {
        if (props.formData.address) {
            setStreet(props.formData.address)
            setPostal(props.formData.postcode)
            setPref(props.formData.typeAddress)
            setCity(props.formData.city)
        }
      },[]);

    const handleClick = () => {

        if(street !== "" && postal !== "" && pref !== "") {
            props.saveFormData(street, postal, city, pref, adID);
            props.nextStep();
            setRedir(true);

        } else {
            setFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }
        
    }

    if(redir === true) {
        return <Redirect to="/pro/createform/step2"/> // Triggered by button handleClick
    }

    console.log("form 1", props.formData)
    console.log(street, postal, city, pref)

    return (

        <Layout>

            <Sidebar/>

            <Layout className='main-content'>

                <Content style={{ margin: '2em 3em' }}>

                    <Steps progressDot current={0}>
                            <Step title="Localisation" />
                            <Step title="Description" />
                            <Step title="Documents" />
                            <Step title="Prix/honoraires" />
                            <Step title="Créneaux" />
                            <Step title="Récap" />
                    </Steps>


                        <form>
                            
                            <p className='formLabel'>Numéro et rue</p>
                            <label >
                                <Input onChange={(e) => setStreet(e.target.value)} value={street} placeholder="8 rue constance" className="short"/>
                            </label>

                            <p className='formLabel'>Code postal</p>
                            <label>
                                <InputNumber onChange={(e) => setPostal(e)} value={postal} maxLength="5" placeholder="75018"/>
                            </label>

                            <p className='formLabel'>Ville</p>
                            <label >
                                <Input onChange={(e) => setCity(e.target.value)} value={city} placeholder="Paris" className="short"/>
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

                        <div className="form-buttons">
                            <Button onClick={()=> handleClick()} type="primary" className="button-primary">Suivant</Button>
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
      saveFormData : function(street, postal, city, pref, adID) { 
        dispatch( {type: 'saveFormData', address: street, postcode: postal, city: city, typeAddress: pref, adID: adID } ) 
    }

    }
  }

  export default connect (mapStateToProps, mapDispatchToProps) (CreateFormOne);