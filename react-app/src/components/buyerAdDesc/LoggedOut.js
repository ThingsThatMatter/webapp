import React, {useState} from 'react';
import { Col, Button } from 'antd';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux'



function AdDescSidebarLogout(props) {

    const [redirectToSign, setRedirectToSign] = useState(false);

    const handleConnectSidebar = () => {
        props.setRedirectAdId(props.adId)
        setRedirectToSign(true)
    }

    if (redirectToSign) { 
        return <Redirect to='/sign' /> 
    }

    return (  
        
        <div className="sidebar-buyer">
            <div className="sidebar-logout">
                <p>Pour accéder aux visites, veuillez vous connecter.</p>
                <Button
                type="primary"
                onClick={() => handleConnectSidebar()}
                >
                Connexion
                </Button>
            </div>
        </div>

    )
}

function mapDispatchToProps(dispatch){
    return {
        setRedirectAdId : function(id) { 
            dispatch( {type: 'setRedirectAdId', adId: id} ) 
        }
    }
}
  
export default connect(
    null,
    mapDispatchToProps
)(AdDescSidebarLogout)
