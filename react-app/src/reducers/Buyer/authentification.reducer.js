export default function(buyerLoginInfo = {login_request: false, login_success: false, token: null}, action){
    if (action.type === 'buyer_login_request') {
        return {
            login_request: true,
            login_success: false,
            token: null
        }
    } else if(action.type === 'buyer_login'){
        return {
            login_request: false,
            login_success: true,
            token: action.token
        }
    } else if (action.type === 'buyer_logout') {
        return {
            login_request: false,
            login_success: false,
            token: null
        }
    } else {
        return buyerLoginInfo
    }
}