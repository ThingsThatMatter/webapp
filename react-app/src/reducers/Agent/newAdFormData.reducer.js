export default function(newAdFormData = {}, action) {
  
    if(action.type === 'agent_newAdSaveFormData1') {
      return {
        ...newAdFormData,
        address: action.address,
        postcode: action.postcode,
        city: action.city,
        typeAddress: action.typeAddress,
        adID: action.adID
      }

    } else if(action.type === 'agent_newAdSaveFormData2') {
        
        return {
            ...newAdFormData,
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

    } else if(action.type === 'agent_newAdSaveFormData3') {
        return {
            ...newAdFormData,
            files: action.files,
            filesDB: action.filesDB
        }

    } else if(action.type === 'agent_newAdSaveFormData4') {
        return {
            ...newAdFormData,
            feesPayer : action.feesPayer,
            price: action.price,
            fees: action.fees
        }
    
    } else if (action.type === 'agent_newAdSaveFormData5') {
        const timeSlots = action.timeSlots.map( e => {
          const {start, end, priv} = e
          return {
            start: start,
            end: end,
            booked: false,
            private: priv
          }
        })

        return {
            ...newAdFormData,
            timeSlots,
            color: action.color
        }
  
    } else if (action.type == 'agent_clearNewAd') {
        return {}

    } else if (action.type == 'agent_adSaveForEdit') {
      return {...newAdFormData,...action.data}
      
    } else {
        return newAdFormData
    }
}