import React from 'react'
import 'antd/dist/antd.css'
import './App.css'
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import {createStore, combineReducers}  from 'redux'

import AgentApp from './routes/AgentRoutes'
import BuyerApp from './routes/BuyerRoutes'
import ScrollToTop from './components/ScrollToTop'

import newAdFormData from './reducers/Agent/newAdFormData.reducer'
import agentLoginStatus from './reducers/Agent/authentification.reducer'
import agentInfo from './reducers/Agent/agentInfo.reducer'
import adEdit from './reducers/Agent/adEdit.reducer'
import agentPageToRedirect from './reducers/Agent/pageToRedirect.reducer'

import offerFormData from './reducers/Buyer/offerFormData.reducer'
import userLoginStatus from './reducers/Buyer/authentification.reducer'
import userInfo from './reducers/Buyer/userInfo.reducer'
import newOfferAd from './reducers/Buyer/newOfferAd.reducer'
import userPageToRedirect from './reducers/Buyer/pageToRedirect.reducer'

const reducer= combineReducers({
  // Agent
  agentLoginStatus,
  agentInfo,
  agentPageToRedirect,
  newAdFormData,
  adEdit,
  // User
  userLoginStatus,
  userInfo,
  userPageToRedirect,
  offerFormData,
  newOfferAd,
})


const store = createStore(reducer
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