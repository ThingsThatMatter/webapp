export default function(edit = false, action) {
  
    if(action.type === 'agent_newOfferEdit') {

        let newState = true
        return newState;
      
    } else if (action.type === 'agent_newOfferClearEdit') {
        let newState = false
        return newState;
    }
    
    else {
        return edit;
    }
}