import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout} from 'antd';



function Offres() {
    return (
  
        <Layout>


            <Sidebar/>

            <Layout className='main-content'>
            <p>Offres</p>
            </Layout>
            
        
  
        </Layout>

    );
  }
  
  export default Offres;