import React from 'react'
import UserNavHeader from '../../components/UserNavHeader'
import { Layout} from 'antd'
const {Content} = Layout


function Template() {

    return (
  
        <Layout className="user-layout">
            <UserNavHeader/> 
            <Layout className='user-layout main-content'>
                <Content style={{ margin: '24px 16px 0' }}>
                   
                </Content>  
            </Layout>
        </Layout>
    )
}

export default Template