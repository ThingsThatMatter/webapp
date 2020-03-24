export default function(formData = {}, action) {
  
    if(action.type === 'agent_newOfferSaveFormData') {
      var newData = {
        ...formData,
        address: action.address,
        postcode: action.postcode,
        city: action.city,
        typeAddress: action.typeAddress,
        adID: action.adID
      }

      return newData;

    } else if(action.type === 'agent_newOfferSaveFormData2') {
        
        var newData = {
            ...formData,
            type : action.typeBien,
            area : action.area,
            rooms : action.rooms,
            bedrooms : action.bedrooms,
            advantages : action.avantages,
            description : action.description,
            photos : action.photos,
            video : action.video,
            ges : action.ges,
            dpe : action.dpe,
            photosDB : action.photosDB
        }
        return newData;

    } else if(action.type === 'agent_newOfferSaveFormData3') {
        var newData = {
            ...formData,
            files: action.files,
            filesDB: action.filesDB
        }
        return newData;

    } else if(action.type === 'agent_newOfferSaveFormData4') {
        var newData = {
            ...formData,
            feesPayer : action.feesPayer,
            price: action.price,
            fees: action.fees
        }
        return newData;
    
    } else if (action.type === 'agent_newOfferSaveFormData5') {
        const timeSlots = action.timeSlots.map( e => {
          const {start, end, priv} = e
          return {
            start: start,
            end: end,
            booked: false,
            private: priv
          }
        })

        var newData = {
            ...formData,
            timeSlots,
            color: action.color
        }
        return newData;
  
    } else if (action.type == 'agent_newOfferClear') {
        
        const newData = {}
        return newData;

    } else if (action.type == 'agent_newOfferSaveForEdit') {

      let newData = {...formData,...action.data};

      return newData;
      
    } else {
        return formData;
    }
}