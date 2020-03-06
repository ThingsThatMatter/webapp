import React, {useState} from 'react';
import {Redirect} from 'react-router-dom'
import {Form, Input, Button } from 'antd';
import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

function SignIn(props) {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [msgErrorSignin, setMsgErrorSignin] = useState()
    const [toRedirect, setToRedirect] = useState(false)
    const [cookies, setCookie] = useCookies(['name']); // initilizing state cookies
    

    // useEffect( () => {
    //     console.log(props.token)
    //     console.log(cookies.token)
    //     const redirect = () => {
    //         if(props.token !== '' || cookies.token !== ''){
    //             return <Redirect to='/' />
    //         }
    //     }
    //     redirect()
    // }, [])

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
        return <Redirect to='/' /> 
    } else {
        if (typeof cookies.token !== 'undefined') {  //if landing on signin but has a valid token
            props.setToken(cookies.token)
            return <Redirect to='/' /> 
        }

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
    )}
}

function mapStateToProps(state) {
    return { 
        token : state.token
    }
}

function mapDispatchToProps(dispatch){
    return {
        setToken: function(token){
            dispatch({type: 'setToken', token})
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignIn)