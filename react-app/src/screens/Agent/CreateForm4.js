import React, {useState, useEffect} from 'react'
import { Steps, Button, Radio, InputNumber} from 'antd'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

const { Step } = Steps


function CreateFormFour(props) {

    const [feesPayer, setFeesPayer] = useState("")
    const [price, setPrice] = useState(0)
    const [fees, setFees] = useState(0)

    const [currentPage, setCurrentPage] = useState(0)
    const [redir, setRedir] = useState(false)
    const [backRedir, setBackRedir] = useState(false)
    const [skipRedir, setSkipRedir] = useState(false)
    const [formError, setFormError] = useState("")


    useEffect(() => {
        setCurrentPage(props.step)     // Gets current page number from redux sotre for steps display

        if(props.formData.price) {     // Display inputed info if user goes back from next form pages
            setFeesPayer(props.formData.feesPayer)
            setPrice(props.formData.price)
            setFees(props.formData.fees)        
        }
    }, [])

     
    const handleClick = () => {

        if(feesPayer !== "" && price !== 0 && fees !== 0) {
            props.nextStep()
            props.saveFormData(feesPayer, price, fees)
            if(props.edit === true) {
                props.nextStep()
                setSkipRedir(true)
            } else {
                setRedir(true)
            }       

        } else {
            setFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }    
    }

    if(redir === true) {
        return <Redirect push to="/pro/ad/new/step5"/> // When button "suivant" is clicked
    }
    if(skipRedir === true) {

        return <Redirect push to="/pro/ad/new/step6"/> // If in edit mode, skip to step 6 (recap)
    }

    if(backRedir === true) {
        return <Redirect push to="/pro/ad/new/step3"/> // When butti-on "retour" is clicked
    }

    return (

        <div>
            <Steps progressDot current={currentPage}>
                <Step title="Localisation" />
                <Step title="Description" />
                <Step title="Documents" />
                <Step title="Prix/honoraires" />
                <Step title="Créneaux" />
                <Step title="Récap" />
            </Steps>

            <form>
                
                <p className='formLabel'>Les honoraires sont à la charge de</p>
                <label>
                    <Radio.Group 
                        value={feesPayer} 
                        onChange={(e) => setFeesPayer(e.target.value)} 
                    >
                        <Radio 
                            value="buyer" 
                            style={{paddingTop : "1%"}}>
                            l'acquéreur
                        </Radio>
                        <br/>
                        <Radio 
                            value="seller" 
                            style={{paddingTop : "1%"}}
                        >
                            le vendeur
                        </Radio>
                    </Radio.Group>
                </label>

                <p className='formLabel'>Prix du bien hors honoraires</p>
                <label >
                    <InputNumber 
                        min={0} 
                        onChange={(e) => setPrice(e)} 
                        value={price} 
                        placeholder="700000"
                    />
                </label>
                <span style={{marginLeft: "1%", fontWeight: 700}}>€</span>

                <p className='formLabel'>Honoraires TTC en % du prix du bien</p>
                <label >
                    <InputNumber 
                        min={0} 
                        onChange={(e) => setFees(e)} 
                        value={fees} 
                        placeholder="8"
                    />
                </label>
                <span style={{marginLeft: "1%", fontWeight: 700}}>%</span>

                <p className='formLabel'>Prix du bien incluant les honoraires</p>
                <label >
                    <InputNumber 
                        value={price*fees/100+price} 
                        placeholder="75"
                    />
                </label>
                <span style={{marginLeft: "1%", fontWeight: 700}}>€</span>
                
            </form>
            {formError}

            <div className="form-buttons">

                <Button type="primary" className="button-back"
                    onClick={() => {
                        setBackRedir(true)
                        props.previousStep()
                    }}
                >
                    Précédent
                </Button>  

                <Button type="primary" className="button-validate"
                    onClick={() => handleClick()}
                >
                    Suivant
                </Button>
            </div>                                
        </div>
    )
}

function mapStateToProps(state) {
    return { 
        step : state.step,
        formData: state.formData,
        edit: state.edit
    }
}

function mapDispatchToProps(dispatch) {
    return {
        nextStep : function() { 
            dispatch( {type: 'agent_newOfferNextStep'} ) 
        },
        previousStep : function() {
            dispatch( {type: 'agent_newOfferPrevStep'} )
        },
        saveFormData : function(feesPayer, price, fees) { 
            dispatch({
                type: 'agent_newOfferSaveFormData4',
                feesPayer : feesPayer,
                price: price,
                fees: fees
            })
        } 
    }
}
    
export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(CreateFormFour)