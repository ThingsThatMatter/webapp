export default function(adEdit = false, action) {
  
    if(action.type === 'agent_adEdit') {
        return true
      
    } else if (action.type === 'agent_clearAdEdit') {
        return false
    }
    
    else {
        return adEdit
    }
}