import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import { Button } from 'antd'


function NotFound404Ad() {

    const [redirHome, setRedirHome] = useState(false)

    if (redirHome) {
        return <Redirect to='/pro'/>
    }

    return (
        <div>
            <h1>L'annonce que vous souhaitez consulter n'existe plus</h1>
            <Button
                onClick={() => setRedirHome(true)}
                type="primary"
                className="button-validate"
            >
                Retour à la page d'accueil
            </Button>
        </div>
    )
}

export default NotFound404Ad