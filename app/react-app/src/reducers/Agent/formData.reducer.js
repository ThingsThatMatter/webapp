export default function(formData = {}, action) {
  
    if(action.type === 'saveFormData') {
      var newData = {
        ...formData,
        address: action.address,
        postcode: action.postcode,
        city: action.city,
        typeAddress: action.typeAddress,
        adID: action.adID
      }

      return newData;

    } else if(action.type === 'saveFormData2') {
        
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

    } else if(action.type === 'saveFormData3') {
        var newData = {
            ...formData,
            files: action.files,
            filesDB: action.filesDB
        }
        return newData;

    } else if(action.type === 'saveFormData4') {
        var newData = {
            ...formData,
            feesPayer : action.feesPayer,
            price: action.price,
            fees: action.fees
        }
        return newData;
    
    } else if (action.type === 'saveFormData5') {
        const timeslots = action.timeslots.map( e => {
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
            timeslots,
            color: action.color
        }
        return newData;
  
    } else if (action.type == 'clear') {
        
        const newData = {}
        return newData;

    } else if (action.type == 'saveForEdit') {

      let newData = {...formData,...action.data};

      return newData;
      
    } else {
        return formData;
    }
}