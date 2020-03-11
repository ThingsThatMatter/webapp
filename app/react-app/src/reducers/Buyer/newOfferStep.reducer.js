export default function(newOfferStep = 1, action) {
  
    if (action.type === 'offerNextStep') {
      var newOfferStep = newOfferStep + 1;
      return newOfferStep;

    } else if (action.type === 'offerPrevStep') {
      var newOfferStep = newOfferStep - 1;
      return newOfferStep;
      
    } else {
      return newOfferStep;
    }
}