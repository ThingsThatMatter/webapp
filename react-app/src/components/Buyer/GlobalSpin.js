import React from 'react'
import UserNavHeader from './UserNavHeader'

import { Layout, Spin} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
const {Content} = Layout;


function Spinner() {

    const logo = <LoadingOutlined style={{ fontSize: 70, color: "#355c7d" }} spin/>

    return (
        <Layout>
            <UserNavHeader/>
            <Layout className='main-content'>
                <Content className="spinner" style={{ margin: '24px 16px 0' }}>
                    <Spin
                        size="large"
                        indicator={logo}
                    />
                </Content>  
            </Layout>
        </Layout>
    )
}

export default Spinner