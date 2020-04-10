import React, {useState, useEffect} from 'react'
import { Button } from 'antd';
import {Link, Redirect} from 'react-router-dom'
import {StopOutlined} from '@ant-design/icons'
import { Affix } from 'antd';
import {connect} from 'react-redux'

import {useCookies} from 'react-cookie'


function UserNavHeader(props) {

    const [propertiesClass, setPropertiesClass] = useState(null)
    const [visitsClass, setVisitsClass] = useState(null)
    const [accountClass, setAccountClass] = useState(null)
    const [redirHome, setRedirHome] = useState(false)

    const [cookies, setCookie, removeCookie] = useCookies(['name']); // initilizing state cookies

    useEffect( () => {
        const addClass = () => {
            switch (props.current) {
                case 'Biens consultés':
                    setPropertiesClass('nav-header-link-main')
                    break;
                case 'Visites':
                    setVisitsClass('nav-header-link-main')
                    break;
                case 'Compte':
                    setAccountClass('nav-header-link-main')
                    break;
            }
        }
        addClass()
    }, [])


    const logout = async () => {
        removeCookie('uT', { path: '/' })

        await fetch('/user/logout', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'Authorization': `Bearer ${cookies.uT}`
            }
          })

        props.loggedOut()
        setRedirHome(true)
    }

    if (redirHome) {
        return <Redirect to="/sign"/>
    }

    return (
        <Affix offsetTop={0} className="header">
            <header className="nav-header">
                <div className="nav-header-logo"><Link to="/"><img src="http://localhost:3001/logo-ttm-white.png"/></Link></div>

                <nav className="nav-header-menu">
                    <ul className="nav-header-content nav-header-block-link">
                        <li><Link className={`nav-header-link ${propertiesClass}`} to="/">Mes biens</Link></li>
                        <li><Link className={`nav-header-link ${visitsClass}`} to="/visits">Mes visites</Link></li>
                    </ul>
                    {props.userLoginStatus.login_success &&
                        <ul className="nav-header-content nav-header-block-link">
                            <li style={{margin:"0 10px 0 0"}}>
                                <Button 
                                onClick={logout}
                                style={{ 
                                    backgroundColor: "#355c7d", 
                                    color: "#fff", 
                                    padding: "5px 10px",
                                    border: "2px solid #355c7d"
                                }}>
                                <StopOutlined /> Déconnexion</Button>
                            </li>
                        </ul>
                    }
                </nav>
            </header>
        </Affix>
    )
}

function mapStateToProps(state) {
    return { 
        userLoginStatus : state.userLoginStatus,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loggedOut: function() {
            dispatch({ type: 'user_loggedOut' })
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserNavHeader)
