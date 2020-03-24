import React, {useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import { Layout, Menu } from 'antd'
import {HomeOutlined, EuroCircleOutlined, CalendarOutlined, MailOutlined} from '@ant-design/icons'
import {useCookies} from 'react-cookie'


const {Sider } = Layout


function Sidebar(props) {

  const [redirHome, setRedirHome] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['name']); // initilizing state cookies

  const logout = () => {
    removeCookie('aT', { path: '/pro' })
    props.logout()
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
              <Link to="/pro">
                <HomeOutlined />
                <span className="nav-text">Biens</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="2">
              <Link to="/pro/offres">
                <EuroCircleOutlined />
                <span className="nav-text">Offres</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="3">
              <Link to="/pro/rendezvous">
                <CalendarOutlined />
                <span className="nav-text">Rendez-vous</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="4">
              <Link to="/pro/questions">
                <MailOutlined />
                <span className="nav-text">Messages</span>
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
          <div className="logo-ttm"><Link to="/"><img src="http://localhost:3001/logo-ttm-white.png"/></Link></div>
        </div>
      </Sider>
    

  );
}

function mapDispatchToProps(dispatch) {
  return {
      logout: function() {
          dispatch({ type: 'agent_logout' })
      }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Sidebar)