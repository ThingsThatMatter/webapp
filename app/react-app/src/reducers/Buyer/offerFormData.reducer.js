export default function(offerFormData = {}, action) {
  
    if(action.type === 'offerSaveFormData1') {
    
      var newData = {
        ...offerFormData,
        firstname1: action.firstName1,
        lastname1: action.lastName1,
        showSecondBuyer: action.showSecondBuyer,
        firstname2: action.firstName2,
        lastname2: action.lastName2,
        address: action.address,
        postcode: action.postal,
        city: action.city
      }
      return newData;

    } else if(action.type === 'offerSaveFormData2') {
        
        var newData = {
            ...offerFormData,
            offerAmount : action.offerAmount,
            loanAmount : action.loanAmount,
            disableLoan : action.disableLoan,
            contributionAmount : action.contributionAmount,
            salary : action.salaryOk
        }
        return newData;

    } else if(action.type === 'offerSaveFormData3') {
        var newData = {
            ...offerFormData,
            validityPeriod: action.validityPeriod,
            offerLocation : action.offerLocation,
            comments : action.comments,
            notaryName : action.notaryName,
            notaryEmail : action.notaryEmail,
            notaryAddress : action.notaryAddress
        }
        return newData;

    } else if (action.type == 'clear') {
        let newData = {}
        return newData;
      
    } else {
        return offerFormData;
    }
}