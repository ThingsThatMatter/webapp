import React from 'react'
import 'antd/dist/antd.css';import './App.css'
import {Provider} from 'react-redux'
import {createStore, combineReducers}  from 'redux'

import AgentRoutes from './AgentRoutes'
import BuyerRoutes from './BuyerRoutes'

import step from './reducers/Agent/step.reducer'
import formData from './reducers/Agent/formData.reducer'
import agentLoginInfo from './reducers/Agent/authentification.reducer'
import edit from './reducers/Agent/edit.reducer'

import newOfferStep from './reducers/Buyer/newOfferStep.reducer'
import offerFormData from './reducers/Buyer/offerFormData.reducer'
import buyerLoginInfo from './reducers/Buyer/authentification.reducer'
import adId from './reducers/Buyer/adId.reducer'

<<<<<<< HEAD

import createHistory from "history/createBrowserHistory"
export const history = createHistory()
history.listen((location, action) => {
    window.scrollTo(0, 0)
})

const store = createStore(combineReducers({step, formData, token, edit, newOfferStep, offerFormData, userToken, adId}))
=======
const store = createStore(combineReducers({step, formData, agentLoginInfo, edit, newOfferStep, offerFormData, buyerLoginInfo, adId})
, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //redux devtool
)
>>>>>>> 7a7b78f1292a32d4569b6b4a500a2ad05992d821

function App() {

  return (

    <Provider store={store}>
      <AgentRoutes/>
      <BuyerRoutes/>
    </Provider>

  );
}

export default App
