export default function(redirectToAdId = '', action){
    if(action.type == 'setRedirectAdId'){
        return action.adId
    } else {
        return redirectToAdId
    }
}