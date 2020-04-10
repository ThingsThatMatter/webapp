const success = (token, data) => {
    return {
        status: 200,
        response: {
            message: 'Success',
            details: 'Request successfully fulfilled',
            accessToken: token,
            data
        }
    }
}

const created = (token, data) => {
    return {
        status: 201,
        response: {
            message: 'Success',
            details: 'Request successfully fulfilled',
            accessToken: token,
            data
        }
    }
}

const badRequest = detail => {
    return {
        status: 400,
        response: {
            message: 'Wrong data, please provide all required fields',
            details: detail
        }
    }
}

const unauthorized = () => {
    return {
        status: 401,
        response: {
            message: 'Wrong credentials',
            details: 'You are not allowed to access requested data'
        }
    }
}

const forbidden = () => {
    return {
        status: 403,
        response: {
            message: 'Access denied',
            details: 'You do not have the rights to access requested data'
        }
    }
}

const notFound = () => {
    return {
        status: 404,
        response: {
            message: 'Not Found',
            details: 'The ressource could not be found'
        }
    }
}

const internalError = () => {
    return {
        status: 500,
        response: {
            message: 'Internal server error',
            details: 'The server encountered an unexpected condition which prevented it from fulfilling the request'
        }
    }
}

module.exports = {success, created, badRequest, forbidden, unauthorized, notFound, internalError}