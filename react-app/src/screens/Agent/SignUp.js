import React, {useState} from 'react'
import {Redirect,Link} from 'react-router-dom'

import {Form, Input, Button, Row, Col, Spin } from 'antd'
import {LoadingOutlined} from '@ant-design/icons'

import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

const logo = <LoadingOutlined style={{ fontSize: 22, color: "#355c7d", marginTop: '8px' }} spin/>


function SignUp(props) {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [lastname, setLastName] = useState(null)
    const [firstname, setFirstName] = useState(null)

    const [msgErrorSignup, setMsgErrorSignup] = useState()
    const [signupLoad, setSignupLoad] = useState(false)

    const [toRedirect, setToRedirect] = useState(false)
    const [cookies, setCookie] = useCookies(['name']) // initializing state cookies


    const handleSubmitSignup = async () => {

        setMsgErrorSignup(null)
        setSignupLoad(true)

        const postNewAgent = await fetch('/pro/sign-up', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `email=${email}&password=${password}&lastname=${lastname}&firstname=${firstname}`
        })

        if (postNewAgent.status === 500) {
            setSignupLoad(false)
            setMsgErrorSignup('Nous rencontrons des difficultés pour vous inscrire, veuillez réessayer.')
        
        } else {
            const body = await postNewAgent.json()
            setSignupLoad(false)
            if (postNewAgent.status === 400) {
                setMsgErrorSignup(body.details)
            
            } else if (postNewAgent.status === 201) {
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
                        <p className="sign-error-text">{msgErrorSignup}</p>
                        <Form.Item >
                            <div className='local-loader-block'>
                                <Button
                                    type="primary"
                                    onClick={handleSubmitSignup}
                                >
                                    Inscription
                                </Button>
                                {signupLoad &&
                                    <Spin
                                        size="large"
                                        indicator={logo}
                                    />
                                }
                            </div>
                        </Form.Item>
                    </Form>
                </div>

                </Col>
            </Row>
        </div>
    )
}

function mapStateToProps(state) {
    return { 
        agentLoginInfo : state.agentLoginInfo
    }
}

function mapDispatchToProps(dispatch){
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
)(SignUp)
