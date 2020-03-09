import React from 'react';
import 'antd/dist/antd.css';import './App.css';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware}  from 'redux';

import AgentRoutes from './AgentRoutes';

import step from './reducers/step.reducer';
import formData from './reducers/formData.reducer';
import token from './reducers/authentification.reducer'

const store = createStore(combineReducers({step, formData, token}))

function App() {

  return (

    <Provider store={store}>
      <AgentRoutes>
      </AgentRoutes>
    </Provider>

  );
}

export default App
