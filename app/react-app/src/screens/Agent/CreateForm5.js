import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout, Steps, Button} from 'antd';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

const { Step } = Steps;
const {Content} = Layout;


function CreateFormFive(props) {


    const [currentPage, setCurrentPage] = useState(0)
    const [redir, setRedir] = useState(false)
    const [backRedir, setBackRedir] = useState(false)
    const [formError, setFormError] = useState("")


    useEffect(() => {
        setCurrentPage(props.step)     // Gets current page number from redux sotre for steps display
      },[]);


    if(redir === true) {
        return <Redirect to="/createform/step6"/> // Triggered by button-add handleClick
    }
    if(backRedir === true) {
        return <Redirect to="/createform/step4"/> // Triggered by button-back handleClick
    }

    console.log("form 5", props.formData)

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

                    <div>Calendar</div>


                        

                        <Button type="primary" className="button-back"
                        onClick={() => {
                            setBackRedir(true)
                            props.previousStep()
                        }}
                        >
                        Précédent</Button>  

                        <Button type="primary" className="button-validate" onClick={() => {
                            setRedir(true)
                            props.nextStep()
                            }}>Suivant</Button>
                        
                           
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
            type: 'saveFormData5',
            feesPayer : feesPayer,
            price: price,
            fees: fees
        } ) } 
    }
  }
    
  export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(CreateFormFive);