export default function(newOfferStep = 1, action) {
  
    if (action.type === 'modifyStep') {
      var newOfferStep = action.futureStep;
      return newOfferStep;
      
    } else {
      return newOfferStep;
    }
}