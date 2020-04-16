import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import {Spin} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'

import {useCookies} from 'react-cookie'


function Unauthorized401(props) {

    const [redirectToSignin, setRedirectToSignin] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(['name']) // initializing state cookies

    const logo = <LoadingOutlined style={{ fontSize: 50, color: "#355c7d" }} spin/>

    useEffect( () => {
        setTimeout( async () => {

            removeCookie('aT', { path: '/pro' })
            
            await fetch('/pro/logout', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.aT}`
                }
            })

            props.loggedOut()
            setRedirectToSignin(true)

        }, 4000)
    }, [])

    if (redirectToSignin) {
        return <Redirect to='/pro/auth/signin'/>
    }

    return (
        <div>
            <h1>Vous avez été déconnecté(e) après une période d'inactivité.</h1>
            <p style={{textAlign:'center', marginTop: '4em', fontSize: '20px'}}>Redirection vers la page de connexion...</p>
            <div className="spinner-top" style={{ margin: '24px 16px 0' }}>
                <Spin
                    size="large"
                    indicator={logo}
                />
            </div>
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        loggedOut: function() {
            dispatch({ type: 'agent_loggedOut' })
            dispatch({type: 'agent_clearInfo'})
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Unauthorized401)