import React, {useState, useEffect} from 'react';
import {Form, Input, Button } from 'antd';
import {Redirect} from 'react-router-dom';

function SignIn() {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [msgErrorSignin, setMsgErrorSignin] = useState()

    const handleSubmitSignin = async () => {
        const data = await fetch('/pro/sign-in', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `email=${email}&password=${password}`
          })
      
          const body = await data.json()
      
          if(body.state == true){
            //props.addToken(body.token)
            
          }  else {
            setMsgErrorSignin(body.message)
          }
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
    )
}

export {SignIn};