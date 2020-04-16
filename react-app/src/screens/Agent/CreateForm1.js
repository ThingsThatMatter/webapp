import React, {useState, useEffect} from 'react'
import { Button, Input, Radio, InputNumber } from 'antd'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import StepDots from '../../components/StepDots'


function CreateFormOne(props) {

    const [street, setStreet] = useState("")
    const [postal, setPostal] = useState("")
    const [pref, setPref] = useState("")
    const [city, setCity] = useState("")

    const [redirToStep2, setRedirToStep2] = useState(false) 

    const [formError, setFormError] = useState("")

    const adID =  (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).slice(0, 15)

/* ---------------------------------------------------PREFILL FORM---------------------------------------------- */
    useEffect(() => {
        if (props.newAdFormData.address) {
            setStreet(props.newAdFormData.address)
            setPostal(props.newAdFormData.postcode)
            setPref(props.newAdFormData.typeAddress)
            setCity(props.newAdFormData.city)
        }
    }, [])


/* -----------------------------------------------FORM VALIDATION------------------------------------------ */
    const handleClick = () => {

        if(street !== "" && postal !== "" && pref !== "") {
            props.saveFormData(street, postal, city, pref, adID)
            setRedirToStep2(true)

        } else {
            setFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        } 
    }

/* -----------------------------------------------RENDER------------------------------------------ */
    if(redirToStep2 === true) {
        return <Redirect push to="/pro/ad/new/step2"/> // Triggered by button handleClick
    }

    return (

        <div>
            <StepDots
                title = 'Localisation'
                totalSteps = {6}
                currentStep = {1}
                filledDotsBackgroundColor = '#355c7d'
                filledDotsBorderColor = 'f8b195'
                emptyBackgroundColor = '#FFF'
                emptyDotsBorderColor = '#355c7d'
            />

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
        </div>
    )
}

function mapStateToProps(state) {
    return { 
        newAdFormData: state.newAdFormData,
        edit: state.edit
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveFormData : function(street, postal, city, pref, adID) { 
            dispatch( {type: 'agent_newAdSaveFormData1', address: street, postcode: postal, city: city, typeAddress: pref, adID: adID } ) 
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateFormOne)