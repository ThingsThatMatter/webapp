export default function(edit = false, action) {
  
    if(action.type === 'edit') {

        let newState = true
        return newState;
      
    } else if (action.type === 'clearEdit') {
        let newState = false
        return newState;
    }
    
    else {
        return edit;
    }
}