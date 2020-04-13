import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import {Button} from 'antd'


function NotFound404() {

    const [redirHome, setRedirHome] = useState(false)

    if (redirHome) {
        return <Redirect to='/'/>
    }

    return (

        <div>
            <h1>La page demandée n'existe pas</h1>
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

export default NotFound404