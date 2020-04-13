export default function(userPageToRedirect = '/', action) {
  
    if(action.type === 'userRedirectIfLoggedIn') {
        return action.path
    
    } else {
        return userPageToRedirect
    }
}