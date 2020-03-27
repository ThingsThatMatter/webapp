import React, {useState} from 'react';
import {Redirect,Link} from 'react-router-dom'

import {Form, Input, Button, Row, Col } from 'antd';
import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'


function SignUp(props) {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [lastname, setLastName] = useState(null)
    const [firstname, setFirstName] = useState(null)
    const [msgErrorSignin, setMsgErrorSignin] = useState()
    const [toRedirect, setToRedirect] = useState(false)
    const [cookies, setCookie] = useCookies(['name']); // initilizing state cookies


    const handleSubmitSignup = async () => {

        setMsgErrorSignin(null) //reset messagesError
        const postNewAgent = await fetch('/pro/sign-up', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `email=${email}&password=${password}&lastname=${lastname}&firstname=${firstname}`
        })

        const body = await postNewAgent.json()
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

        return (
            <div className="pro-sign-layout">
                <div className="nav-header-logo" style={{margin:"30px 0"}}><Link to="/"><img src="http://localhost:3001/logo-ttm-white.png"/></Link></div>
                <Row>
                    <Col
                    xs={{ span: 24 }}
                    md={{ span: 8 }}
                    lg={{ span: 8 }}
                    xl={{ span: 8 }}
                    >
                    <div className="pro-sign-box">
                        <div className="pro-sign-box-title">
                            Création d'un compte agent
                        </div>
                        <Form layout="vertical" >

                            <Form.Item
                                label="Nom"
                                required={true}
                            >
                                <Input
                                    value={lastname}
                                    onChange={e => setLastName(e.target.value)}
                                    className="sign-input-field"
                                    placeholder="Saisissez votre nom"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Prénom"
                                required={true}
                            >
                                <Input
                                    value={firstname}
                                    onChange={e => setFirstName(e.target.value)}
                                    className="sign-input-field"
                                    placeholder="Saisissez votre prénom"
                                />
                            </Form.Item>

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
                                label="Mot de passe (temporaire)"
                                required= {true}
                            >
                                <Input.Password
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="sign-input-field"
                                    placeholder="Saisissez votre mot de passe"
                                    onKeyPress={(e) => e.key === 'Enter' ?  handleSubmitSignup() : ""}
                                />
                            </Form.Item>
                            <p className="sign-error-text">{msgErrorSignin}</p>
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
                </Row>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { 
        agentLoginInfo : state.agentLoginInfo
    }
}

function mapDispatchToProps(dispatch){
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
)(SignUp)
