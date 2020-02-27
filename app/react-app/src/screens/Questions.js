import React from 'react';
import Sidebar from '../components/Sidebar';
import { Layout} from 'antd';



function Questions() {
    return (
  
        <Layout>


            <Sidebar/>

            <Layout className='main-content'>
            <p>Questions</p>
            </Layout>
            
        
  
        </Layout>

    );
  }
  
  export default Questions;