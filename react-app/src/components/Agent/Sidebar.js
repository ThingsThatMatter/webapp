import React, {useState, useEffect} from 'react'
import {Redirect, useLocation, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { Layout, Menu } from 'antd'
import {HomeOutlined, EuroCircleOutlined, CalendarOutlined, MailOutlined} from '@ant-design/icons'
import {useCookies} from 'react-cookie'


const {Sider } = Layout

function Sidebar(props) {

  const [redirSignIn, setRedirSignIn] = useState(false)
  const [locationPathName, setLocationPathName] = useState()
  const [cookies, setCookie, removeCookie] = useCookies(['name']) // initializing state cookies
  const location = useLocation()

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
    setRedirSignIn(true)
  }

  useEffect( () => {
    setLocationPathName(location.pathname.startsWith('/pro/ad') ? '/pro' : location.pathname)
  }, [location])

  if (redirSignIn) {
    return <Redirect to="/pro/auth/signin" />
  }
  console.log('a')

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
          <Menu
            theme = "dark"
            mode = "inline"
            selectedKeys={[locationPathName]}
          >

            <Menu.Item key="/pro">
              <Link to='/pro'>
                <HomeOutlined />
                <span className="nav-text">Biens</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="/pro/offers">
              <Link to='/pro/offers' >
                <EuroCircleOutlined />
                <span className="nav-text">Offres</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="/pro/visits">
              <Link to= '/pro/visits' >
                <CalendarOutlined />
                <span className="nav-text">Visites</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="/pro/questions">
              <Link to='/pro/questions' >
                <MailOutlined />
                <span className="nav-text">Questions</span>
              </Link>
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