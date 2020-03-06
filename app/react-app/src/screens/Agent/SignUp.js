import React, {useState} from 'react';
import {Form, Input, Button } from 'antd';
import {connect} from 'react-redux'


function SignUp(props) {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [msgErrorSignin, setMsgErrorSignin] = useState()


    const signup = async () => {

        setMsgErrorSignin(null) //reset messagesError
        const postNewAgent = await fetch('/pro/sign-up', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `email=${email}&password=${password}`
          })

        const body = await postNewAgent.json()
        if (body.message === 'OK') {
            props.cookies.set(body.data.token)
            props.setToken(body.data.token)
        } else {
            setMsgErrorSignin(body.details)
        }
    }

    return (
        <div className="pro-sign-layout">
            <div className="pro-sign-content">
                <div className="logo-ttm-sign">LOGO</div>
                <div className="pro-sign-box">
                    <div className="pro-sign-box-title">
                        Création d'un compte agent
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
                            label="Mot de passe (temporaire)"
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
                                className="button-validate button-sign-validate"
                                onClick={signup}
                            >
                                Inscription
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state, ownProps) {
    return { 
        token : state.token,
        cookies: ownProps.cookies
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
)(SignUp)
