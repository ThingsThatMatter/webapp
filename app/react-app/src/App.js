import React from 'react';
import 'antd/dist/antd.css';import './App.css';
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';

import AgentRoutes from './AgentRoutes';

import step from './reducers/step.reducer';
import formData from './reducers/formData.reducer';
import token from './reducers/token'

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
