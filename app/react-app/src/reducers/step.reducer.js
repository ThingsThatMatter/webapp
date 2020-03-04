export default function(step = 0, action) {
  
    if(action.type == 'nextStep') {
      var newStep = step + 1;
      return newStep;

    } else if (action.type == 'prevStep') {
      var newStep = step - 1;
      return newStep;
      
    } else {
      return step;
    }
  }