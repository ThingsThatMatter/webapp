import React from 'react';
import { Layout, Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons'

const {Content} = Layout;


function Spinner() {

    const logo = <LoadingOutlined style={{ fontSize: 50, color: "#355c7d" }} spin/>

    return (
  
        <Layout className="user-layout">
            <Layout className='user-layout main-content'>
                <Content style={{ margin: '24px 16px 0', display: 'flex', justifyContent: 'center' }}>
                    <Spin
                        size="large"
                        indicator={logo}
                    />
                </Content>  
         </Layout>    
    </Layout>

    );
  }

  export default Spinner;