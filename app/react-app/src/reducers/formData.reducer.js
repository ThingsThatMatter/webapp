export default function(formData = {}, action) {
  
    if(action.type == 'saveFormData') {
      var newData = {
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

    } else {
      return formData;
    }
  }