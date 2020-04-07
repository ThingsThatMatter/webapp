export default function(agentLoginStatus = {login_request: false, login_success: false, login_failed: false, logout: true}, action){
    if (action.type === 'agent_login_request') {
        return {
            login_request: true,
            login_success: false,
            login_failed: false,
            logout: false,
        }
    } else if(action.type === 'agent_authenticationFailed'){
        return {
            login_request: false,
            login_success: false,
            login_failed: true,
            logout: false,
        }
    } else if(action.type === 'agent_loggedIn'){
        return {
            login_request: false,
            login_success: true,
            login_failed: false,
            logout: false,
        }
    } else if (action.type === 'agent_loggedOut') {
        return {
            login_request: false,
            login_success: false,
            login_failed: true,
            logout: true,
        }
    } else {
        return agentLoginStatus
    }
}