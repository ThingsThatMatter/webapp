import React from 'react'
import 'antd/dist/antd.css';import './App.css'
import {Provider} from 'react-redux'
import {createStore, combineReducers}  from 'redux'

import AgentRoutes from './AgentRoutes'
import BuyerRoutes from './BuyerRoutes'

import step from './reducers/Agent/step.reducer'
import formData from './reducers/Agent/formData.reducer'
import token from './reducers/Agent/authentification.reducer'
import edit from './reducers/Agent/edit.reducer'

import newOfferStep from './reducers/Buyer/newOfferStep.reducer'
import offerFormData from './reducers/Buyer/offerFormData.reducer'
import userToken from './reducers/Buyer/authentification.reducer'
import adId from './reducers/Buyer/adId.reducer'

const store = createStore(combineReducers({step, formData, token, edit, newOfferStep, offerFormData, userToken, adId}))

function App() {

  return (

    <Provider store={store}>
      <AgentRoutes/>
      <BuyerRoutes/>
    </Provider>

  );
}

export default App
