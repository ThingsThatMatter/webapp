import React from 'react';
import 'antd/dist/antd.css';import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
import logo from './logo.svg';


import { Layout } from 'antd';


import Home from './screens/Agent/Home';
import Offres from './screens/Agent/Offres';
import RendezVous from './screens/Agent/RendezVous';
import Questions from './screens/Agent/Questions';
import AdDesc from './screens/Agent/AdDesc';
import CreateFormOne from './screens/Agent/CreateForm1';



// import wishlist from './wishlist.reducer';
// import token from './token.reducer';
// import lang from './lang.reducer';

// const store = createStore(combineReducers({}),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={(props) => (
//       store.getState().token !== ''
//       ? <Component {...props} />
//       : <Redirect to='/' />
//   )} />
// )

function App() {
  return (


      <Router>
        <Switch>
          <Route component={Home} path="/" exact />
          <Route component={Offres} path="/offres"  />
          <Route component={RendezVous} path="/rendezvous"  />
          <Route component={Questions} path="/questions"  />
          <Route component={AdDesc} path="/addesc"  />
          <Route component={CreateFormOne} path="/createform1"  />
        </Switch>
      </Router>


  );
}

export default App;
