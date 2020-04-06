import React, {useState, useEffect} from 'react'

import NotFound_404_Ad from '../../screens/Buyer/NotFound_404_Ad'
import Unauthorized_401 from '../../screens/Buyer/Unauthorized_401'
import GlobalSpin from './GlobalSpin'
import InternalError from '../../screens/Buyer/InternalError_500'

function APIFetch(props) {

    const [statusCode, setStatusCode] = useState()
    const [apiResponse, setApiResponse] = useState()

    useEffect( () => {
        const dbFetch = async () => {
            try {
                const response = await fetch(props.fetchUrl, props.fetchOptions)
                const body = await response.json()
                setApiResponse(body)
                setStatusCode(response.status)

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
            return <Unauthorized_401 />
            break

        case 404:
            return <NotFound_404_Ad />
            break
        
        case 500:
            return <InternalError />
            break
    }

}

export default APIFetch