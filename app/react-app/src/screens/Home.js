import React from 'react';
import { Layout, Menu, Icon, Row } from 'antd';

import Sidebar from '../components/Sidebar';
import AdCard from '../components/AdCard';


const { Header, Content, Footer, Sider } = Layout;




function Home() {
  return (
    
    <Layout>

        <Sidebar/>

        <Layout className='main-content'>
            <Content style={{ margin: '24px 16px 0' }}>

                <Row gutter={16}>
                    <AdCard/><AdCard/><AdCard/><AdCard/>
                </Row>

            </Content>
        </Layout>
    
    </Layout>

  );
}

export default Home;
