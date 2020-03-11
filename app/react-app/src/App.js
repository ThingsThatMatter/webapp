import React from 'react'
import 'antd/dist/antd.css';import './App.css'
import {Provider} from 'react-redux'
import {createStore, combineReducers}  from 'redux'

import AgentRoutes from './AgentRoutes'
import BuyerRoutes from './BuyerRoutes'

import step from './reducers/step.reducer'
import formData from './reducers/formData.reducer'
import token from './reducers/authentification.reducer'
import edit from './reducers/edit.reducer'

const store = createStore(combineReducers({step, formData, token, edit}))

function App() {

  return (

    <Provider store={store}>
      <AgentRoutes/>
      <BuyerRoutes/>
    </Provider>

  );
}

export default App
