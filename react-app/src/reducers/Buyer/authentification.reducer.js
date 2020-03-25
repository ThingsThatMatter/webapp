export default function(userToken = '', action){
    if(action.type == 'setUserToken'){
        return action.token
    } else {
        return userToken
    }
}