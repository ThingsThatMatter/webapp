import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout } from 'antd';

const { Content } = Layout;


function Questions() {
    return (
  
        <Layout>

            <Sidebar/>

            <Layout className='main-content'>
                <Content>
                    <h1 className='pageTitle'>Les messages</h1>
                </Content>         
            </Layout>
            
        
  
        </Layout>

    );
  }
  
  export default Questions;