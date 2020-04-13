import React from 'react'
import 'antd/dist/antd.css'
import './App.css'
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import {createStore, combineReducers}  from 'redux'

import AgentApp from './routes/AgentRoutes'
import BuyerApp from './routes/BuyerRoutes'
import ScrollToTop from './components/ScrollToTop'

import step from './reducers/Agent/step.reducer'
import formData from './reducers/Agent/formData.reducer'
import agentLoginStatus from './reducers/Agent/authentification.reducer'
import agentInfo from './reducers/Agent/agentInfo.reducer'
import edit from './reducers/Agent/edit.reducer'
import agentPageToRedirect from './reducers/Agent/pageToRedirect.reducer'

import newOfferStep from './reducers/Buyer/newOfferStep.reducer'
import offerFormData from './reducers/Buyer/offerFormData.reducer'
import userLoginStatus from './reducers/Buyer/authentification.reducer'
import userInfo from './reducers/Buyer/userInfo.reducer'
import newOfferAd from './reducers/Buyer/newOfferAd.reducer'
import userPageToRedirect from './reducers/Buyer/pageToRedirect.reducer'

const store = createStore(combineReducers({step, formData, agentLoginStatus, agentInfo, edit, agentPageToRedirect, newOfferStep, offerFormData, userLoginStatus, userInfo, newOfferAd, userPageToRedirect})
, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //redux devtool
)

function App() {

  return (

    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <Switch>
          <Route component={AgentApp} path ='/pro' />
          <Route component={BuyerApp} path='/' />
        </Switch>
      </Router>
    </Provider>

  )
}

export default App