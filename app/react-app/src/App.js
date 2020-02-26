import React from 'react';
import 'antd/dist/antd.css';import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
import logo from './logo.svg';


import { Layout } from 'antd';


import Home from './screens/Home';

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
        </Switch>
      </Router>


  );
}

export default App;
