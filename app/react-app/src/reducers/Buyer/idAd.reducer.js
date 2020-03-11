export default function(id = '', action){
    if(action.type == 'setIdAd'){
        return action.id
    } else {
        return id
    }
}