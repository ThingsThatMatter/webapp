export default function(agentPageToRedirect = '/pro', action) {
  
    if(action.type === 'agentRedirectIfLoggedIn') {
        return action.path
    
    } else {
        return agentPageToRedirect
    }
}