import React from 'react'
import UserNavHeader from '../../components/Buyer/UserNavHeader'

import { Layout} from 'antd'
const {Content} = Layout


function InternalError500() {

    return (
        <Layout>
            <UserNavHeader/>
            <Layout className='main-content'>
                <Content style={{ margin: '24px 16px 0' }}>
                    <p style = {{marginBottom: '20em'}}>
                        Nous rencontrons des difficultés pour afficher la page demandée. Merci de réessayer.
                    </p>
                </Content>  
            </Layout>
        </Layout>
    )
}

export default InternalError500