export default function(userInfo = {lastname: null, firstname: null, email: null, id: null}, action){
    
    if (action.type === 'user_saveInfo') {
        return action.userInfo

    } else {
        return userInfo
    }
}