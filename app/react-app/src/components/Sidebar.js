import React from 'react';
import {Link} from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {HomeOutlined, EuroCircleOutlined, CalendarOutlined, MailOutlined} from '@ant-design/icons'


const {Sider } = Layout;


function Sidebar() {
  return (
    
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        className="sidebar"
      >
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
      </Sider>
    

  );
}

export default Sidebar;
