import React, {useState, useEffect} from 'react'

import NotFound404Ad from '../../screens/Buyer/NotFound404Ad'
import Unauthorized401 from '../../screens/Buyer/Unauthorized401'
import GlobalSpin from './GlobalSpin'
import InternalError500 from '../../screens/Buyer/InternalError500'

import {useCookies} from 'react-cookie'

function APIFetch(props) {

    const [statusCode, setStatusCode] = useState()
    const [apiResponse, setApiResponse] = useState()
    const [cookies, setCookie] = useCookies(['name']) // initilizing state cookies

    useEffect( () => {
        const dbFetch = async () => {
            try {
                const response = await fetch(props.fetchUrl, props.fetchOptions)
                const body = await response.json()
                setApiResponse(body)
                setStatusCode(response.status)
                if (props.type !== 'public') { // don't renew token on public fetch
                    if (body.accessToken !== cookies.aT) {
                        setCookie('uT', body.accessToken, {path:'/'})
                    }
                }

            } catch(e) {
                setStatusCode(500)
            } 
        }
        dbFetch()
    }, [props.fetchUrl])

    switch(statusCode) {
        default: 
            return <GlobalSpin />
            
        case 200:
            props.getApiResponse(apiResponse)
            return props.children // return children of APIFetch component : the component we want to load !
            break

        case 401:
            return <Unauthorized401 />
            break

        case 404:
            return <NotFound404Ad />
            break
        
        case 500:
            return <InternalError500 />
            break
    }

}

export default APIFetch