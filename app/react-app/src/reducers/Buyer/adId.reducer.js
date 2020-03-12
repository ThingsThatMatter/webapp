export default function(adId = '', action){
    if(action.type == 'setOfferAdId'){
        return action.adId
    }
    if(action.type == 'setIdAd'){
        return action.id
    } else {
        return adId
    }
}