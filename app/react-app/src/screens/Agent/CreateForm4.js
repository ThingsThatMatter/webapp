import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout, Steps, Button, Input, Radio, InputNumber} from 'antd';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

const { Step } = Steps;
const {Content} = Layout;


function CreateFormFour(props) {

    const [feesPayer, setFeesPayer] = useState("")
    const [price, setPrice] = useState(0)
    const [fees, setFees] = useState(0)

    const [currentPage, setCurrentPage] = useState(0)
    const [redir, setRedir] = useState(false)
    const [backRedir, setBackRedir] = useState(false)
    const [formError, setFormError] = useState("")


    useEffect(() => {
        setCurrentPage(props.step)     // Gets current page number from redux sotre for steps display

        if(props.formData.feesPayer) {     // Display inputed info if user goes back from next form pages
            setFeesPayer(props.formData.feesPayer)
            setPrice(props.formData.price)
            setFees(props.formData.fees)        
        }
      },[]);

     
    const handleClick = () => {

        if(feesPayer !== "" && price !== 0 && fees !== 0) {
            props.nextStep();
            props.saveFormData(feesPayer, price, fees)
            setRedir(true)

        } else {
            setFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }    
    }

    if(redir === true) {
        return <Redirect to="/pro/createform/step5"/> // Triggered by button-add handleClick
    }
    if(backRedir === true) {
        return <Redirect to="/pro/createform/step3"/> // Triggered by button-back handleClick
    }

    console.log("form 4", props.formData)

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

                    <div style={{width : "60%", marginLeft: 25, marginTop: "2%"}}>

                        <form>
                            
                            <p className='formLabel'>Les honorraires sont à la charge de</p>
                            <label>
                                <Radio.Group 
                                value={feesPayer} 
                                onChange={(e) => setFeesPayer(e.target.value)} 
                                >
                                <Radio 
                                value="acquéreur" 
                                style={{paddingTop : "1%"}}>
                                l'acquéreur</Radio>
                                <br/>
                                <Radio 
                                value="vendeur" 
                                style={{paddingTop : "1%"}}>
                                    le vendeur</Radio>
                                </Radio.Group>
                            </label>

                            <p className='formLabel'>Prix du bien hors honnoraires</p>
                            <label >
                                <InputNumber 
                                min={0} 
                                onChange={(e) => setPrice(e)} 
                                value={price} 
                                placeholder="700000"/>
                            </label>
                            <span style={{marginLeft: "1%", fontWeight: 700}}>€</span>

                            <p className='formLabel'>Honoraires TTC en % du prix du bien</p>
                            <label >
                                <InputNumber 
                                min={0} 
                                onChange={(e) => setFees(e)} 
                                value={fees} 
                                placeholder="8"/>
                            </label>
                            <span style={{marginLeft: "1%", fontWeight: 700}}>%</span>

                            <p className='formLabel'>Prix du bien incluant les honnoraires</p>
                            <label >
                                <InputNumber 
                                value={price*fees/100+price} 
                                placeholder="75"/>
                            </label>
                            <span style={{marginLeft: "1%", fontWeight: 700}}>€</span>
                            
                        </form>
                        {formError}

                        <Button type="primary" className="button-back"
                        onClick={() => {
                            setBackRedir(true);
                            props.previousStep();
                        }}
                        >
                        Précédent</Button>  

                        <Button type="primary" className="button-validate" onClick={() => handleClick()}>Suivant</Button>
                        
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

  function mapDispatchToProps(dispatch) {
    return {
      nextStep : function() { 
          dispatch( {type: 'nextStep'} ) 
      },
      previousStep : function() {
          dispatch( {type: 'prevStep'} )
      },
      saveFormData : function(feesPayer, price, fees) { 
        dispatch( {
            type: 'saveFormData4',
            feesPayer : feesPayer,
            price: price,
            fees: fees
        } ) } 
    }
  }
    
  export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(CreateFormFour);