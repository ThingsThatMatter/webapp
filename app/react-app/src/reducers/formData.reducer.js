export default function(formData = {}, action) {
  
    if(action.type == 'saveFormData') {
      var newData = {
        ...formData,
        address: action.address,
        postCode: action.postCode,
        typeAddress: action.typeAddress,
        adID: action.adID
      }

      return newData;

    } else if(action.type == 'saveFormData2') {
        
        var newData = {
            ...formData,
            type : action.typeBien,
            area : action.area,
            rooms : action.rooms,
            avantages : action.avantages,
            title : action.title,
            description : action.description,
            photos : action.photos,
            video : action.video,
            ges : action.ges,
            dpe : action.dpe
        }
        return newData;

    } else if(action.type == 'saveFormData3') {
        var newData = {
            ...formData,
            files: action.files
        }
        return newData;

    } else if(action.type == 'saveFormData4') {
        var newData = {
            ...formData,
            feesPayer : action.feesPayer,
            price: action.price,
            fees: action.fees
        }
        return newData;
    
    } else if (action.type == 'saveFormData5') {
        const timeslots = action.timeslots.map( e => {
          const {start, end, priv} = e
          return {
            start: start,
            end: end,
            private: priv
          }
        })

        var newData = {
            ...formData,
            timeslots,
            color: action.color
        }
        return newData;
  
  }else {
      return formData;
    }
  }