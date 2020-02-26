import React from 'react';
import Sidebar from '../components/Sidebar';
import { Layout, Button, Switch} from 'antd';

const {Content} = Layout;




function AdDesc() {
    return (
  
        <Layout>

            <Sidebar/>

            <Layout className='main-content'>

                <Content style={{ margin: '24px 16px 0' }}>

                     <h1 className='pageTitle'>Appartement 8 rue Constance 75018</h1>  

                    <div className="action">

                        <div className="action-buttons">

                        <Button type="primary" ghost style={buttonAdd}>Offres</Button>
                        <Button type="primary" ghost style={buttonAdd}>Visites</Button>
                        <Button type="primary" ghost style={buttonAdd}>Questions</Button>

                        </div>

                        <div className="other-actions">
                        <span>annonce en ligne  <Switch defaultChecked/> </span>
                       
                        <span> 
                        <img src="edit.png" width="20px"/>
                        <img src="bin.png" width="20px"/>
                        </span>

                        </div>

                    </div>

                </Content>  

            </Layout>
            
        
  
        </Layout>

    );
  }

  const buttonAdd = {
    margin : "3em",
    color: "#052040",
    fontSize: "1.5em",
    fontWeight: 600,
    padding: 15,
    borderColor: "#052040",
    borderWidth : 2,
    height: "auto",
    borderRadius: "10px",
    
  }
  
  export default AdDesc;