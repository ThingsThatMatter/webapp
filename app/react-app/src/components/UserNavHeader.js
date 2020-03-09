import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {UserOutlined} from '@ant-design/icons'



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
                case 'Offres':
                    setOffersClass('nav-header-link-main')
                    break;
                case 'Compte':
                    setAccountClass('nav-header-link-main')
                    break;
            }
        }
        addClass()
    }, [])

    return (
        <header className="nav-header">
            <div className="nav-header-logo">Logo</div>

            <nav className="nav-header-menu">
                <ul className="nav-header-content nav-header-block-link">
                    <li><Link className={`nav-header-link ${propertiesClass}`} to="/">Biens consultés</Link></li>
                    <li><Link className={`nav-header-link ${visitsClass}`} to="/visits">Visites</Link></li>
                    <li><Link className={`nav-header-link ${offersClass}`} to="/offers">Offres</Link></li>
                </ul>
                <div className="nav-header-account nav-header-block-account">
                    <p className={`nav-header-link ${accountClass}`}> Connexion </p>
                    <UserOutlined />
                </div>
            </nav>
        </header>
    )
}

export default UserNavHeader