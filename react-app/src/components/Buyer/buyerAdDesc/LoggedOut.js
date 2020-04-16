import React, {useState} from 'react'
import { Button } from 'antd'
import {Redirect} from 'react-router-dom'

import {connect} from 'react-redux'



function AdDescSidebarLogout(props) {

    const [redirectToSign, setRedirectToSign] = useState(false)

    const handleConnectSidebar = () => {
        props.pageToRedirect(`/ad/${props.adId}`)
        setRedirectToSign(true)
    }

    if (redirectToSign) {
        props.loggedOut() // Evite la redirection de déconnexion si il y avait un vieux token
        return <Redirect to='/sign' /> 
    }

    return (  
        
        <div className="sidebar-buyer">
            <div className="sidebar-logout">
                <p>Pour visiter le bien ou déposer une offre, veuillez vous connecter.</p>
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
        pageToRedirect: function(page) {
            dispatch({
                type: 'userRedirectIfLoggedIn',
                path: page
            })
        },
        loggedOut: function() {
            dispatch({ type: 'user_loggedOut' })
            dispatch({type: 'user_clearInfo'})
        }
    }
}
  
export default connect(
    null,
    mapDispatchToProps
)(AdDescSidebarLogout)
