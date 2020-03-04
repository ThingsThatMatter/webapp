import React, {useState, useEffect} from 'react';
import {Form, Input, Button } from 'antd';
import {Redirect} from 'react-router-dom';

function SignUp() {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

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
                        <Form.Item >
                            <Button type="primary" className="button-validate button-sign-validate">Connexion</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export {SignUp};