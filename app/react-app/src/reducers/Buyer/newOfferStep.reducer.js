export default function(newOfferStep = 1, action) {
  
    if (action.type === 'nextStep') {
      var newOfferStep = newOfferStep + 1;
      return newOfferStep;

    } else if (action.type === 'prevStep') {
      var newOfferStep = newOfferStep - 1;
      return newOfferStep;
      
    } else {
      return newOfferStep;
    }
}