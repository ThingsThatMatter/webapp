import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import UserNavHeader from '../../components/Buyer/UserNavHeader'
import { Layout, Button} from 'antd'
const {Content} = Layout


function NotFound_404() {

    const [redirHome, setRedirHome] = useState(false)

    if (redirHome) {
        return <Redirect to='/'/>
    } else {

        return (
    
            <Layout className="user-layout">
                <UserNavHeader/> 
                <Layout className='user-layout main-content'>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <h1>La page demandée n'existe pas</h1>
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
  }

  export default NotFound_404