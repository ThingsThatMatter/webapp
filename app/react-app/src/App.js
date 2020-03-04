import React from 'react';
import 'antd/dist/antd.css';import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
import logo from './logo.svg';

import Home from './screens/Agent/Home';
import Offres from './screens/Agent/Offres';
import RendezVous from './screens/Agent/RendezVous';
import Questions from './screens/Agent/Questions';
import AdDesc from './screens/Agent/AdDesc';
import CreateFormOne from './screens/Agent/CreateForm1';
import CreateFormTwo from './screens/Agent/CreateForm2';
import {SignIn as agentSignIn} from './screens/Agent/SignIn'
import {SignUp as agentSignUp} from './screens/Agent/SignUp'

import step from './reducers/step.reducer';

const store = createStore(combineReducers({step}))

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={(props) => (
//       store.getState().token !== ''
//       ? <Component {...props} />
//       : <Redirect to='/' />
//   )} />
// )

function App() {
  return (

    <Provider store={store}>
      <Router>
        <Switch>
          <Route component={Home} path="/" exact />
          <Route component={Offres} path="/offres"  />
          <Route component={RendezVous} path="/rendezvous"  />
          <Route component={Questions} path="/questions"  />
          <Route component={AdDesc} path="/addesc"  />
          <Route component={CreateFormOne} path="/createform/step1"  />
          <Route component={CreateFormTwo} path="/createform/step2"  />
          <Route component={agentSignIn} path="/pro/signin" />
          <Route component={agentSignUp} path="/pro/signup" />
        </Switch>
      </Router>
    </Provider>


  );
}

export default App;
