export default function(agentLoginStatus = {login_request: false, login_success: false}, action){
    if (action.type === 'agent_login_request') {
        return {
            login_request: true,
            login_success: false
        }
    } else if(action.type === 'agent_login'){
        return {
            login_request: false,
            login_success: true
        }
    }
    else if (action.type === 'agent_logout') {
        return {
            login_request: false,
            login_success: false
        }
    } else {
        return agentLoginStatus
    }
}