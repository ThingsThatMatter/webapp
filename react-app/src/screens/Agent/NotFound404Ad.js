import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import Sidebar from '../../components/Agent/Sidebar'
import { Layout, Button } from 'antd'
const {Content} = Layout


function NotFound404Ad() {

    const [redirHome, setRedirHome] = useState(false)

    if (redirHome) {
        return <Redirect to='/pro'/>
    }

    return (
        <Layout className="user-layout">
            <Sidebar/> 
            <Layout className='user-layout main-content'>
                <Content style={{ margin: '24px 16px 0' }}>
                    <h1>L'annonce que vous souhaitez consulter n'existe plus</h1>
                    <Button
                        onClick={() => setRedirHome(true)}
                        type="primary"
                        className="button-validate"
                    >
                        Retour à la page d'accueil
                    </Button> 
                </Content>  
            </Layout>
        </Layout>
    )
}

export default NotFound404Ad