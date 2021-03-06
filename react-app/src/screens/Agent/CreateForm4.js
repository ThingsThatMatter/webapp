import React, {useState, useEffect} from 'react'
import {Button, Radio, InputNumber} from 'antd'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import StepDots from '../../components/StepDots'


function CreateFormFour(props) {

    const [feesPayer, setFeesPayer] = useState("")
    const [price, setPrice] = useState(0)
    const [fees, setFees] = useState(0)

    const [redirToStep5, setRedirToStep5] = useState(false)
    const [redirToStep3, setRedirToStep3] = useState(false)
    const [redirToStep6, setRedirToStep6] = useState(false)
    const [formError, setFormError] = useState("")

/* ---------------------------------------------------PREFILL FORM---------------------------------------------- */
    useEffect(() => {

        if(props.newAdFormData.price) {     // Display inputed info if user goes back from next form pages
            setFeesPayer(props.newAdFormData.feesPayer)
            setPrice(props.newAdFormData.price)
            setFees(props.newAdFormData.fees)        
        }
    }, [])

    if (!props.newAdFormData.type) {
        return <Redirect to ='/pro/ad/new/step2' />
    }

/*-------------------------------------------------- NAVIGATION ---------------------------------------------------*/
    const handleClick = () => {

        if(feesPayer !== "" && price !== 0 && fees !== 0) {
            props.saveFormData(feesPayer, price, fees)
            if(props.adEdit === true) {
                setRedirToStep6(true)
            } else {
                setRedirToStep5(true)
            }       

        } else {
            setFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }    
    }

/*----------------------------------------------- RENDER COMPONENT ---------------------------------------------------*/

    if(redirToStep5 === true) {
        return <Redirect push to="/pro/ad/new/step5"/> // When button "suivant" is clicked
    }
    if(redirToStep6 === true) {
        return <Redirect push to="/pro/ad/new/step6"/> // If in edit mode, skip to step 6 (recap)
    }

    if(redirToStep3 === true) {
        return <Redirect push to="/pro/ad/new/step3"/> // When butti-on "retour" is clicked
    }

    return (

        <div>
            <StepDots
                title = 'Prix & Honoraires'
                totalSteps = {6}
                currentStep = {4}
                filledDotsBackgroundColor = '#355c7d'
                filledDotsBorderColor = 'f8b195'
                emptyBackgroundColor = '#FFF'
                emptyDotsBorderColor = '#355c7d'
            />

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
                        value={price}
                        step={1000}
                        formatter={value => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                        onChange={e => setPrice(e)} 
                    />
                </label>
                <span style={{marginLeft: "1%", fontWeight: 700}}>€</span>

                <p className='formLabel'>Honoraires TTC en % du prix du bien</p>
                <label >
                    <InputNumber
                        min={0}
                        max={100}
                        step={0.1}
                        onChange={(e) => setFees(e)} 
                        value={fees} 
                    />
                </label>
                <span style={{marginLeft: "1%", fontWeight: 700}}>%</span>

                <p className='formLabel'>Prix calculé du bien incluant les honoraires</p>
                <label style={{fontWeight:700, color: '#355c7d'}}>
                    <span>
                        {String(Math.round(price*fees/100+price)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €
                    </span>
                </label>

            </form>
            {formError}

            <div className="form-buttons">

                <Button type="primary" className="button-back"
                    onClick={() => {
                        setRedirToStep3(true)
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
        newAdFormData: state.newAdFormData,
        adEdit: state.adEdit
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveFormData : function(feesPayer, price, fees) { 
            dispatch({
                type: 'agent_newAdSaveFormData4',
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