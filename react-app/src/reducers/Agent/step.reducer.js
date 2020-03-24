export default function(step = 0, action) {
  
    if(action.type === 'agent_newOfferNextStep') {
      var newStep = step + 1;
      return newStep;

    } else if (action.type === 'agent_newOfferPrevStep') {
      var newStep = step - 1;
      return newStep;

    } else if (action.type === 'agent_newOfferClearSteps') {
      var newStep = step - 5;
      return newStep;
      
    } else {
      return step;
    }
  }