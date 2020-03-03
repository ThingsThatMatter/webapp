import React, {useState, useEffect} from 'react';
import { Layout, Row, Button } from 'antd';
import {Redirect} from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import AdCard from '../../components/AdCard';
import {PlusCircleOutlined} from '@ant-design/icons'

const { Header, Content, Footer, Sider } = Layout;

function Home() {
  
  const [navToCreateAd, setNavToCreateAd] = useState(false)
  const [navToAdDetail, setNavToAdDetail] = useState(false)

  /* Ad Cards */
  useEffect( () => {
    const adsFetch = async () => {
      const ads = await fetch('/pro/ads');
      console.log(ads)
    }
    adsFetch()
  }, [])
  
  /*  Navigation */ 
  if(navToCreateAd === true) {
    return <Redirect to="/createform/step1"/>
  }
  if(navToAdDetail === true) {
    return <Redirect to="/addesc"/>
  }
  

  return (
    
    <Layout>
      <Sidebar/>
      <Layout className='main-content'>
        <Content style={{ margin: '24px 16px 0' }}>

          <h1 className='pageTitle'>Mes biens</h1>
          <Button
            onClick={() => setNavToCreateAd(true)}
            type="primary"
            ghost
            style={buttonAdd}
          >
            Ajouter un bien
            <PlusCircleOutlined />
          </Button>

          <Row gutter={16}>
              <AdCard/><AdCard/><AdCard/><AdCard/>
          </Row>

        </Content>
      </Layout>
    </Layout>
  );
}



const buttonAdd = {
  marginTop : "1em",
  marginBottom : "1em",
  color: "#052040",
  fontWeight: 600,
  borderColor: "#052040",
  borderWidth : 2,

}

export default Home;
