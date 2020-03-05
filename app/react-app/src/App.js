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
import CreateFormThree from './screens/Agent/CreateForm3';
import CreateFormFour from './screens/Agent/CreateForm4';
import CreateFormFive from './screens/Agent/CreateForm5';
import CreateFormSix from './screens/Agent/CreateForm6';
import {SignIn as agentSignIn} from './screens/Agent/SignIn'
import {SignUp as agentSignUp} from './screens/Agent/SignUp'

import step from './reducers/step.reducer';
import formData from './reducers/formData.reducer';

const store = createStore(combineReducers({step, formData}))

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
          <Route component={CreateFormThree} path="/createform/step3"  />
          <Route component={CreateFormFour} path="/createform/step4"  />
          <Route component={CreateFormFive} path="/createform/step5"  />
          <Route component={CreateFormSix} path="/createform/step6"  />
          <Route component={agentSignIn} path="/pro/signin" />
          <Route component={agentSignUp} path="/pro/signup" />
        </Switch>
      </Router>
    </Provider>


  );
}

export default App;
