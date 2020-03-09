import React, {useState} from 'react';
import {Redirect} from 'react-router-dom'
import {Form, Input, Button } from 'antd';
import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

import setToken from '../../actions/token.actions'

function SignIn(props) {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [msgErrorSignin, setMsgErrorSignin] = useState()
    const [toRedirect, setToRedirect] = useState(false)
    const [cookies, setCookie] = useCookies(['name']); // initilizing state cookies


    const handleSubmitSignin = async () => {
        const checkAgent = await fetch('/pro/sign-in', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `email=${email}&password=${password}`
          })
      
        const body = await checkAgent.json()
        if (body.message === 'OK') {
            setCookie('token', body.data.token, {path:'/'})
            props.setToken(body.data.token)
            setToRedirect(true)
        } else {
            setMsgErrorSignin(body.details)
        }
    }

    if (toRedirect) { // if login OK (from form) redirect to home
        return <Redirect to='/pro' /> 
    } else {
        if (typeof cookies.token !== 'undefined' && props.token !== '') {  //if landing on signin and has a valid token : does not work
            return <Redirect to='/pro' /> // redirect is takeing time (wait dor redux to be updated -> how to wait ?)
        }
        else {

    return (
        <div className="pro-sign-layout">
            <div className="pro-sign-content">
                <div className="logo-ttm-sign">LOGO</div>
                <div className="pro-sign-box">
                    <div className="pro-sign-box-title">
                        Se Connecter
                    </div>
                    <Form
                        layout="vertical"
                        // form={form}
                        // initialValues={{ layout: formLayout }}
                        // onValuesChange={onFormLayoutChange}
                    >
                        <Form.Item
                            label="Email"
                            required={true}
                        >
                            <Input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="sign-input-field"
                                placeholder="Saisissez votre adresse email"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mot de passe"
                            required= {true}
                        >
                            <Input.Password
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="sign-input-field"
                                placeholder="Saisissez votre mot de passe"
                            />
                        </Form.Item>
                        <p className="sign-error-text">{msgErrorSignin}</p>
                        <Form.Item >
                            <Button 
                                type="primary"
                                className="button-validate button-sign-validate"
                                onClick={() => handleSubmitSignin()}
                            >
                                Connexion
                            </Button>
                        </Form.Item>
                    </Form>
                    <a
                        className="forgotten-password"
                        href="#">Mot de passe oublié
                    </a>
                </div>
            </div>
        </div>
    )}}
}

function mapStateToProps(state) {
    return { 
        token : state.token
    }
}

function mapDispatchToProps(dispatch){
    return {
        setToken: function(token){
            dispatch(setToken(token))
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignIn)