import React from 'react'
import 'antd/dist/antd.css'
import './App.css'
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import {createStore, combineReducers}  from 'redux'

import AgentRoutes from './routes/AgentRoutes'
import BuyerRoutes from './routes/BuyerRoutes'

import step from './reducers/Agent/step.reducer'
import formData from './reducers/Agent/formData.reducer'
import agentLoginStatus from './reducers/Agent/authentification.reducer'
import agentInfo from './reducers/Agent/agentInfo.reducer'
import edit from './reducers/Agent/edit.reducer'

import newOfferStep from './reducers/Buyer/newOfferStep.reducer'
import offerFormData from './reducers/Buyer/offerFormData.reducer'
import userLoginStatus from './reducers/Buyer/authentification.reducer'
import userInfo from './reducers/Buyer/userInfo.reducer'
import newOfferAd from './reducers/Buyer/newOfferAd.reducer'
import redirectToAdId from './reducers/Buyer/adRedirection'

const store = createStore(combineReducers({step, formData, agentLoginStatus, agentInfo, edit, newOfferStep, offerFormData, userLoginStatus, userInfo, newOfferAd, redirectToAdId})
, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //redux devtool
)

function App() {

  return (

    <Provider store={store}>
      <Router>
        <Switch>
          <Route component={BuyerRoutes} path='/' />
          <Route component={AgentRoutes} path ='/pro' />
        </Switch>
      </Router>

      <AgentRoutes/>
      <BuyerRoutes/>
    </Provider>

  );
}

export default App
