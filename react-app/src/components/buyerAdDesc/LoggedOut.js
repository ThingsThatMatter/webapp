import React, {useState} from 'react';
import { Col, Button } from 'antd';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux'



function AdDescSidebarLogout(props) {

    const [toRedirect, setToRedirect] = useState(false);

    const handleConnectSidebar = () => {
        props.setRedirectAdId(props.adId)
        setToRedirect(true)
    }

    if (toRedirect) { // if login OK (from form) redirect to home
        return <Redirect to='/' /> 
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
