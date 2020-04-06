export default function(newOfferAd = {}, action){
    if(action.type == 'user_setOfferAd'){
        return action.ad
    } else {
        return newOfferAd
    }
}