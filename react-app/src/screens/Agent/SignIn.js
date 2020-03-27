import React, {useState} from 'react';
import {Redirect,Link} from 'react-router-dom'
import {Form, Input, Button, Row, Col, Checkbox} from 'antd';
import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

import Spinner from './Spin'

function SignIn(props) {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [stayLoggedIn, setStayLoggedIn] = useState(false)
    const [msgErrorSignin, setMsgErrorSignin] = useState()
    const [toRedirect, setToRedirect] = useState(false)
    const [cookies, setCookie] = useCookies(['name']); // initilizing state cookies


    const handleSubmitSignin = async () => {
        const checkAgent = await fetch('/pro/sign-in', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `email=${email}&password=${password}&stayLoggedIn=${stayLoggedIn}`
          })
      
        const body = await checkAgent.json()
        if (body.message === 'OK') {
            const {lastname, firstname, email, id} = body.data.agentInfo
            setCookie('aT', body.data.accessToken, {path:'/pro'})
            props.login()
            props.saveAgentInfo({lastname, firstname, email, id})
            setToRedirect(true)
        } else {
            setMsgErrorSignin(body.details)
        }
    }

    if (toRedirect) { // if login OK (from form) redirect to home
        return <Redirect to='/pro' /> 
    } else {
        if (typeof cookies.aT !== 'undefined' && props.agentLoginStatus.login_request) {
            return <Spinner />
        } else if (typeof cookies.aT !== 'undefined' && props.agentLoginStatus.login_success) {  //if landing on signin and has a valid token
            return <Redirect to='/pro' />
        }
        else {

            return (
                <div className="pro-sign-layout">
                    <div className="nav-header-logo" style={{margin:"30px 0"}}>
                        <Link to="/"><img src="http://localhost:3001/logo-ttm-white.png"/></Link>
                    </div>
                    <Row>
                        <Col
                            xs={{ span: 24 }}
                            md={{ span: 8 }}
                            lg={{ span: 8 }}
                            xl={{ span: 8 }}
                        >
                            <div className="pro-sign-box">
                                <div className="pro-sign-box-title">
                                    Se Connecter
                                </div>
                                <Form layout="vertical" >

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
                                            onKeyPress={e => e.key === 'Enter' ?  handleSubmitSignin() : ""}
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                    <Checkbox
                                        className="stay-logged-in"
                                        onChange={ e => {
                                            setStayLoggedIn(e.target.checked)
                                        }}
                                    >
                                        Rester connecté(e)
                                    </Checkbox>

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

function mapStateToProps(state) {
    return { 
        agentLoginStatus : state.agentLoginStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login: function() {
            dispatch( {type: 'agent_login'} )
        },
        saveAgentInfo: function(agentInfo) {
            dispatch({
                type: 'agent_saveInfo',
                agentInfo
            })
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignIn)