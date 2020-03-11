import React, {useState, useEffect} from 'react'
import { Button } from 'antd';
import {Link} from 'react-router-dom'
import {StopOutlined,HomeOutlined} from '@ant-design/icons'
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
        <Affix offsetTop={0}>
            <header className="nav-header">
                <div className="nav-header-logo"><Link to="/"><img src="http://localhost:3001/logo-ttm-white.png"/></Link></div>

                <nav className="nav-header-menu">
                    <ul className="nav-header-content nav-header-block-link">
                        <li><Link className={`nav-header-link ${propertiesClass}`} to="/">Mes biens</Link></li>
                        <li><Link className={`nav-header-link ${visitsClass}`} to="/visits">Mes visites</Link></li>
                    </ul>
                    <ul className="nav-header-content nav-header-block-link">
                        <li style={{margin:"0 10px 0 0"}}>
                            <Link to="/sign-in" 
                            style={{ 
                                backgroundColor: "#355c7d", 
                                color: "#fff", 
                                padding: "5px 10px",
                                border: "2px solid #355c7d"
                            }}>
                            <StopOutlined /> Déconnexion</Link></li>
                        <li>
                            <Link to="/pro" 
                            style={{ 
                                backgroundColor: "#fff", 
                                color: "#355c7d", 
                                padding: "5px 10px",
                                border: "2px solid #355c7d"
                            }}>
                            <HomeOutlined /> Espace PRO</Link>
                        </li>
                    </ul>
                        
                </nav>
            </header>
        </Affix>
    )
}

export default UserNavHeader