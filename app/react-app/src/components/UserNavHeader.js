import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {UserOutlined} from '@ant-design/icons'
import { Affix } from 'antd';



function UserNavHeader(props) {

    const [propertiesClass, setPropertiesClass] = useState(null)
    const [visitsClass, setVisitsClass] = useState(null)
    const [offersClass, setOffersClass] = useState(null)
    const [accountClass, setAccountClass] = useState(null)


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

    return (
        <Affix offsetTop={0}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}>
            <header className="nav-header">
                <div className="nav-header-logo"><Link to="/"><img src="http://localhost:3001/logo-ttm-white.png"/></Link></div>

                <nav className="nav-header-menu">
                    <ul className="nav-header-content nav-header-block-link">
                        <li><Link className={`nav-header-link ${propertiesClass}`} to="/">Mes biens</Link></li>
                        <li><Link className={`nav-header-link ${visitsClass}`} to="/visits">Mes visites</Link></li>
                    </ul>
                    <div className="nav-header-account nav-header-block-account">
                        <UserOutlined />
                        <span className={`${accountClass}`}>Connexion</span>
                    </div>
                </nav>
            </header>
        </Affix>
    )
}

export default UserNavHeader