import React from 'react';
import 'antd/dist/antd.css';import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
import logo from './logo.svg';


import { Layout } from 'antd';


import Home from './screens/Home';
import Offres from './screens/Offres';
import RendezVous from './screens/RendezVous';
import Questions from './screens/Questions';
import AdDesc from './screens/AdDesc';



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
        </Switch>
      </Router>


  );
}

export default App;
