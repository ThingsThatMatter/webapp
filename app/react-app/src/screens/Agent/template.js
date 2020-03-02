import React, {useState} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout} from 'antd';
const {Content} = Layout;


function Template() {

    return (
  
        <Layout>

            <Sidebar/>

            <Layout className='main-content'>

                <Content style={{ margin: '24px 16px 0' }}>


                   
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  export default Template;