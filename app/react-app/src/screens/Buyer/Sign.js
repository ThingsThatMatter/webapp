import React, {useState} from 'react';
import {Redirect, Link} from 'react-router-dom'
import { Form, Input, Button, Collapse, Col, Row } from "antd";

import Spinner from './Spin'

import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'


function SignUp(props) {

    const [signupEmail, setSignupEmail] = useState(null)
    const [signupPassword, setSignupPassword] = useState(null)

    const [signupFirstname, setSignupFirstname] = useState(null)
    const [signupLastname, setSignupLastname] = useState(null)

    const [signinEmail, setSigninEmail] = useState(null)
    const [signinPassword, setSigninPassword] = useState(null)

    const [msgErrorSignin, setMsgErrorSignin] = useState()
    const [msgErrorSignup, setMsgErrorSignup] = useState()
    const [toRedirect, setToRedirect] = useState(false)
    const [cookies, setCookie] = useCookies(['name']); // initilizing state cookies


    const handleSubmitSignup = async () => {

        setMsgErrorSignup(null) //reset messagesError
        const postNewUser = await fetch('/user/sign-up', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `email=${signupEmail}&password=${signupPassword}&firstname=${signupFirstname}&lastname=${signupLastname}`
        })

        const body = await postNewUser.json()

        if (body.message === 'OK') {
            setCookie('userToken', body.data.token, {path:'/'})
            props.setUserToken(body.data.token)
            setToRedirect(true)
        } else {
            setMsgErrorSignup(body.details)
        }
    }

    const handleSubmitSignin = async () => {
        const checkUser = await fetch('/user/sign-in', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `email=${signinEmail}&password=${signinPassword}`
          })
      
        const body = await checkUser.json()

        if (body.message === 'OK') {
            setCookie('userToken', body.data.token, {path:'/'})
            props.setUserToken(body.data.token)
            setToRedirect(true)
        } else {
            setMsgErrorSignin(body.details)
        }
    }

    if (toRedirect) { // if login OK (from form) redirect to home
        if (props.adId !== '') {
            return <Redirect to={{pathname: `/ad/${props.adId}`}} />
        } else {
            return <Redirect to='/' /> 
        }

    } else {
        if (typeof cookies.userToken !== 'undefined' && props.userToken === '') {
            return <Spinner />
            
        } else if (typeof cookies.userToken !== 'undefined' && props.userToken !== '') { 
            return <Redirect to='/' /> // redirect is takeing time (wait dor redux to be updated -> how to wait ?)

        } else {

        return (
            <div className="user-sign-layout">

                <div className="nav-header-logo" style={{margin:"30px 0"}}><Link to="/"><img src="http://localhost:3001/logo-ttm.png"/></Link></div>

                <Row gutter={32}>
                    <Col
                    xs={{ span: 24 }}
                    md={{ span: 12 }}
                    lg={{ span: 12 }}
                    xl={{ span: 12 }}
                    >
                    <div className="pro-sign-box">
                        <div className="pro-sign-box-title">
                            Inscription
                        </div>
                        <Form layout="vertical" >
                            <Form.Item
                                label="Nom"
                                required={true}
                            >
                                <Input
                                    value={signupLastname}
                                    onChange={e => setSignupLastname(e.target.value)}
                                    className="sign-input-field"
                                    placeholder="Nom"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Prénom"
                                required={true}
                            >
                                <Input
                                    value={signupFirstname}
                                    onChange={e => setSignupFirstname(e.target.value)}
                                    className="sign-input-field"
                                    placeholder="Prénom"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                required={true}
                            >
                                <Input
                                    value={signupEmail}
                                    onChange={e => setSignupEmail(e.target.value)}
                                    className="sign-input-field"
                                    placeholder="Email"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Mot de passe"
                                required= {true}
                            >
                                <Input.Password
                                    value={signupPassword}
                                    onChange={e => setSignupPassword(e.target.value)}
                                    className="sign-input-field"
                                    placeholder="Saisissez votre mot de passe"
                                    onKeyPress={(e) => e.key === 'Enter' ?  handleSubmitSignup() : ""}
                                />
                            </Form.Item>
                            <p className="sign-error-text">{msgErrorSignup}</p>
                            <Form.Item >
                                <Button
                                    type="primary"
                                    onClick={handleSubmitSignup}
                                >
                                    Inscription
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    </Col>
                    <Col
                    xs={{ span: 24 }}
                    md={{ span: 12 }}
                    lg={{ span: 12 }}
                    xl={{ span: 12 }}
                    >
                    <div className="pro-sign-box">
                    <div className="pro-sign-box-title">
                        Se Connecter
                    </div>
                    <Form
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            required={true}
                        >
                            <Input
                                value={signinEmail}
                                onChange={e => setSigninEmail(e.target.value)}
                                className="sign-input-field"
                                placeholder="Email"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mot de passe"
                            required= {true}
                        >
                            <Input.Password
                                value={signinPassword}
                                onChange={e => setSigninPassword(e.target.value)}
                                className="sign-input-field"
                                placeholder="Mot de passe"
                                onKeyPress={(e) => e.key === 'Enter' ?  handleSubmitSignin() : ""}
                            />
                        </Form.Item>
                        <p className="sign-error-text">{msgErrorSignin}</p>
                        <Form.Item >
                            <Button 
                                type="primary"
                                onClick={() => handleSubmitSignin()}
                            >
                                Connexion
                            </Button>
                        </Form.Item>
                    </Form>
                    <a
                        className="forgotten-password"
                        href="#">Mot de passe oublié ?
                    </a>
                </div>
                </Col>
                </Row>
            </div>
        )
        }
    }
}

function mapStateToProps(state, ownProps) {
    return { 
        userToken : state.userToken,
        cookies: ownProps.cookies,
        adId: state.adId
    }
}

function mapDispatchToProps(dispatch){
    return {
    setUserToken: function(token){
        dispatch({type: 'setUserToken', token})
      }
    }
  }
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp)
