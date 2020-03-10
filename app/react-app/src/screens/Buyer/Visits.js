import React from 'react';
import UserNavHeader from '../../components/UserNavHeader';
import { Layout} from 'antd';
const {Content} = Layout;


function Visits() {

    return (
  
        <Layout className="user-layout">

            <UserNavHeader current="Visites"/>

            <Layout className='user-layout main-content'>

                <Content style={{ margin: '24px 16px 0' }}>
                   Visits
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  export default Visits;