import React from 'react';
//import Sidebar from '../../components/Sidebar';
import { Layout} from 'antd';
const {Content} = Layout;


function Home() {

    return (
  
        <Layout>

            {/* <Sidebar/> */}

            <Layout className='main-content'>

                <Content style={{ margin: '24px 16px 0' }}>

                    <p>Home</p>
                   
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  export default Home;