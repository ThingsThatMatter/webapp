export default function(adId = '', action){
    if(action.type == 'setOfferAdId'){
        return action.adId
    }
    if(action.type == 'setRedirectAdId'){
        return action.adId
    } else {
        return adId
    }
}