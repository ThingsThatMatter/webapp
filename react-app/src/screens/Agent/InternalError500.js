import React from 'react'
import Sidebar from '../../components/Agent/Sidebar'

import { Layout} from 'antd'
const {Content} = Layout


function InternalError500() {

    return (
        <Layout>
            <Sidebar/>
            <Layout className='main-content'>
                <Content style={{ margin: '24px 16px 0' }}>
                    <h1>Erreur</h1>
                    <p style = {{marginBottom: '20em'}}>
                        Nous rencontrons des difficultés pour afficher la page demandée. Merci de réessayer.
                    </p>                  
                </Content>  
            </Layout>
        </Layout>
    )
}

export default InternalError500