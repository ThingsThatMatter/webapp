import React, {useState} from 'react'
import {Redirect,Link} from 'react-router-dom'
import {Form, Input, Button, Row, Col, Checkbox, Spin} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'

import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

import Spinner from '../../components/Agent/GlobalSpin'
import Unauthorized401 from './Unauthorized401'

const logo = <LoadingOutlined style={{ fontSize: 22, color: "#355c7d", marginTop: '8px' }} spin/>

function SignIn(props) {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [stayLoggedIn, setStayLoggedIn] = useState(false)
    
    const [msgErrorSignin, setMsgErrorSignin] = useState()
    const [signinLoad, setSigninLoad] = useState(false)
    
    const [toRedirect, setToRedirect] = useState(false)
    const [cookies, setCookie] = useCookies(['name']) // initializing state cookies


    const handleSubmitSignin = async () => {

        setMsgErrorSignin(null)
        setSigninLoad(true)

        const checkAgent = await fetch('/pro/sign-in', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `email=${email}&password=${password}&stayLoggedIn=${stayLoggedIn}`
        })

        if (checkAgent.status === 500) {
            setSigninLoad(false)
            setMsgErrorSignin('Nous rencontrons des difficultés pour vous inscrire, veuillez réessayer.')
        
        } else {
            const body = await checkAgent.json()
            setSigninLoad(false)
            if (checkAgent.status === 400) {
                setMsgErrorSignin(body.details)
            
            } else if (checkAgent.status === 200) {
                const {lastname, firstname, email, id} = body.data.agentInfo
                setCookie('aT', body.accessToken, {path:'/pro'})
                props.loggedIn()
                props.saveAgentInfo({lastname, firstname, email, id})
                setToRedirect(true)
            }
        }
    }

    if (toRedirect) { // if login OK (from form) redirect to home
        return <Redirect to='/pro' /> 
    }
       
    if (props.agentLoginStatus.login_failed && !props.agentLoginStatus.logout) {
        return <Unauthorized401 />
        
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
                                        <div className='local-loader-block'>
                                            <Button 
                                                type="primary"
                                                onClick={() => handleSubmitSignin()}
                                            >
                                                Connexion
                                            </Button>
                                            {signinLoad &&
                                                <Spin
                                                    size="large"
                                                    indicator={logo}
                                                />
                                            }
                                        </div>
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
        loggedIn: function() {
            dispatch( {type: 'agent_loggedIn'} )
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