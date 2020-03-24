export default function(agentLoginInfo = {login_success: false, token: null}, action){
    if(action.type === 'login'){
        return {
            login_success: true,
            token: action.token
        }
    }
    else if (action.type === 'logout') {
        return agentLoginInfo
    } else {
        return agentLoginInfo
    }
}