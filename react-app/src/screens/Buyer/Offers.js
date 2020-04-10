import React from 'react'
import UserNavHeader from '../../components/Buyer/UserNavHeader'
import { Layout} from 'antd'
const {Content} = Layout


function Offers() {

    return (
  
        <Layout className="user-layout">
            <UserNavHeader current="Offres"/>
            <Layout className='user-layout main-content'>

                <Content style={{ margin: '24px 16px 0' }}>
                   Offres
                </Content>  

            </Layout>
        </Layout>
    )
}

export default Offers