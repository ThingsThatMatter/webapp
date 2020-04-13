import React, {useState} from 'react'
import {Redirect, Link} from 'react-router-dom'
import { Form, Input, Button, Checkbox, Col, Row, Spin } from 'antd'
import {LoadingOutlined} from '@ant-design/icons'

import Spinner from './GlobalSpin'
import Unauthorized401 from './Unauthorized401'

import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

const logo = <LoadingOutlined style={{ fontSize: 22, color: "#355c7d", marginTop: '8px' }} spin/>

function Sign(props) {

    const [signinLoad, setSigninLoad] = useState(false)
    const [signupLoad, setSignupLoad] = useState(false)

    const [signupEmail, setSignupEmail] = useState(null)
    const [signupPassword, setSignupPassword] = useState(null)

    const [signupFirstname, setSignupFirstname] = useState(null)
    const [signupLastname, setSignupLastname] = useState(null)

    const [signinEmail, setSigninEmail] = useState(null)
    const [signinPassword, setSigninPassword] = useState(null)

    const [stayLoggedIn, setStayLoggedIn] = useState(false)

    const [msgErrorSignin, setMsgErrorSignin] = useState()
    const [msgErrorSignup, setMsgErrorSignup] = useState()
    const [toRedirect, setToRedirect] = useState(false)
    const [cookies, setCookie] = useCookies(['name']) // initilizing state cookies

/* --------------------------------------------------SIGN UP----------------------------------------------------------------------------- */

    const handleSubmitSignup = async () => {

        setMsgErrorSignup(null) //reset messagesError
        setSignupLoad(true)

        const postNewUser = await fetch('/user/sign-up', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `email=${signupEmail}&password=${signupPassword}&firstname=${signupFirstname}&lastname=${signupLastname}`
        })

        if (postNewUser.status === 500) {
            setSignupLoad(false)
            setMsgErrorSignup('Nous rencontrons des difficultés pour vous inscrire, veuillez réessayer.')
        
        } else {
            const body = await postNewUser.json()
            setSignupLoad(false)
            if (postNewUser.status === 400) {
                setMsgErrorSignup(body.details)
            
            } else if (postNewUser.status === 201) {
                const {lastname, firstname, email, id} = body.data.userInfo
                setCookie('uT', body.accessToken, {path:'/'})
                props.loggedIn()
                props.saveUserInfo({lastname, firstname, email, id})
                setToRedirect(true)
            }
        }
    }

    const handleSubmitSignin = async () => {

        setMsgErrorSignin(null)
        setSigninLoad(true)

        const checkUser = await fetch('/user/sign-in', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `email=${signinEmail}&password=${signinPassword}&stayLoggedIn=${stayLoggedIn}`
        })

        if (checkUser.status === 500) {
            setSigninLoad(false)
            setMsgErrorSignin('Nous rencontrons des difficultés pour vous inscrire, veuillez réessayer.')
        
        } else {
            const body = await checkUser.json()
            setSigninLoad(false)
            if (checkUser.status === 400) {
                setMsgErrorSignin(body.details)
            
            } else if (checkUser.status === 200) {
                const {lastname, firstname, email, id} = body.data.userInfo
                setCookie('uT', body.accessToken, {path:'/'})
                props.loggedIn()
                props.saveUserInfo({lastname, firstname, email, id})
                setToRedirect(true)
            }
        }
    }

    if (toRedirect) { // if login OK (from form) redirect to home
        if (props.userPageToRedirect !== '/') {
            return <Redirect to= {props.userPageToRedirect} />
        } else {
            return <Redirect to='/' /> 
        }
    }

    if (props.userLoginStatus.login_failed && !props.userLoginStatus.logout) {
        return <Unauthorized401 />
        
    } else {
        if (typeof cookies.uT !== 'undefined' && props.userLoginStatus.login_request) {
            return <Spinner />
            
        } else if (typeof cookies.uT !== 'undefined' && props.userLoginStatus.login_success) { 
            return <Redirect to={props.userPageToRedirect} />

        } else {

            return (
                <div className="user-sign-layout">

                    <div className="nav-header-logo" style={{margin:"30px 0"}} >
                        <Link to="/">
                            <img src="http://localhost:3001/logo-ttm.png" alt='ttm-logo'/>
                        </Link>
                    </div>

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
        userLoginStatus : state.userLoginStatus,
        redirectToAdId: state.redirectToAdId,
        userPageToRedirect: state.userPageToRedirect
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loggedIn: function() {
            dispatch( {type: 'user_loggedIn'} )
        },
        saveUserInfo: function(userInfo) {
            dispatch({
                type: 'user_saveInfo',
                userInfo
            })
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sign)
