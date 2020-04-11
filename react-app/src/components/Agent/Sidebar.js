import React, {useState} from 'react'
import {div, Redirect, useHistory} from 'react-router-dom'
import {connect} from 'react-redux'
import { Layout, Menu } from 'antd'
import {HomeOutlined, EuroCircleOutlined, CalendarOutlined, MailOutlined} from '@ant-design/icons'
import {useCookies} from 'react-cookie'


const {Sider } = Layout

function Sidebar(props) {

  const [redirHome, setRedirHome] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['name']) // initializing state cookies
  const history = useHistory()

  const logout = async () => {
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
    setRedirHome(true)
  }

  if (redirHome) {
    return <Redirect to="/pro/signin" />
  }

  return (
    
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        className="sidebar"
      >
        <div>
          <div className="logo">
            <img width="100%" src='http://localhost:3001/logo.jpg'/>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>

            <Menu.Item key="1">
              <div onClick = {() => history.push('/pro')}>
                <HomeOutlined />
                <span className="nav-text">Biens</span>
              </div>
            </Menu.Item>

            <Menu.Item key="2">
              <div onClick = {() => history.push('/pro/offers')} >
                <EuroCircleOutlined />
                <span className="nav-text">Offres</span>
              </div>
            </Menu.Item>

            <Menu.Item key="3">
              <div onClick = {() => history.push('/pro/visits')} >
                <CalendarOutlined />
                <span className="nav-text">Visites</span>
              </div>
            </Menu.Item>

            <Menu.Item key="4">
              <div onClick = {() => history.push('/pro/questions')} >
                <MailOutlined />
                <span className="nav-text">Questions</span>
              </div>
            </Menu.Item>

          </Menu>
        </div>
        <div className="sidebar-bottom">
          <div
            className="agent-logout"
            onClick={logout}
          >
            Déconnexion
          </div>
          <div className="logo-ttm"><div to="/pro"><img src="http://localhost:3001/logo-ttm-white.png"/></div></div>
        </div>
      </Sider>
    

  );
}

function mapDispatchToProps(dispatch) {
  return {
    loggedOut: function() {
          dispatch({ type: 'agent_loggedOut' })
      }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Sidebar)