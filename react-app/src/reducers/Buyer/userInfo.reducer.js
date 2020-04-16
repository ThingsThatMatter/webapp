export default function(userInfo = {lastname: null, firstname: null, email: null, id: null}, action){
    
    if (action.type === 'user_saveInfo') {
        return action.userInfo

    } else if (action.type === 'user_clearInfo') {
        return {
            lastname: null,
            firstname: null,
            email: null,
            id: null
        }

    } else {
        return userInfo
    }
}