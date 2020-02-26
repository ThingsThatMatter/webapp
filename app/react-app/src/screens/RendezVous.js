import React from 'react';
import Sidebar from '../components/Sidebar';
import { Layout} from 'antd';



function RendezVous() {
    return (
  
        <Layout>


        <Sidebar/>

        <Layout className='main-content'>
        <p>Rendez-vous</p>
        </Layout>
        
    

    </Layout>

    );
  }
  
  export default RendezVous;