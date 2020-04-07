import React from 'react'
import UserNavHeader from '../../components/Buyer/UserNavHeader'
import {Layout} from 'antd'
const {Content} = Layout


function EmailConf() {

    return (
  
        <Layout className="user-layout">

            <UserNavHeader/> 

            <Layout className='user-layout main-content'>

                <Content style={{ margin: '24px 16px 0' }}>

                    <div>
                        <h1>Votre adresse email est confirmée !</h1>
                        <button>Me connecter</button>
                    </div>
                   
                </Content>  

         </Layout>
            
    
    </Layout>

    )
  }

  export default EmailConf;