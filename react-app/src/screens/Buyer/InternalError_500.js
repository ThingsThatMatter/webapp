import React from 'react'
import UserNavHeader from '../../components/Buyer/UserNavHeader'

import { Layout} from 'antd';
import {LoadingOutlined} from '@ant-design/icons'
const {Content} = Layout;


function InternalError() {

    return (
        <Layout>
            <UserNavHeader/>
            <Layout className='main-content'>
                <Content className="spinner">
                    <p style = {{marginBottom: '20em'}}>
                        Nous rencontrons des difficultés pour afficher la page demandée. Merci de réessayer.
                    </p>
                </Content>  
            </Layout>
        </Layout>
    )
}

export default InternalError