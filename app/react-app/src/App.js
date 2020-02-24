import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
import logo from './logo.svg';
import './App.css';

// import ScreenHome from './ScreenHome';
// import ScreenArticlesBySource from './ScreenArticlesBySource'
// import ScreenMyArticles from './ScreenMyArticles'
// import ScreenSource from './ScreenSource'

// import wishlist from './wishlist.reducer';
// import token from './token.reducer';
// import lang from './lang.reducer';

// const store = createStore(combineReducers({wishlist, token, lang}),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={(props) => (
//       store.getState().token !== ''
//       ? <Component {...props} />
//       : <Redirect to='/' />
//   )} />
// )

function App() {
  return (

    <div></div>

    // <Provider store={store}>

    //   <Router>
    //     <Switch>
    //       <Route component={ScreenHome} path="/" exact />
    //       <PrivateRoute component={ScreenSource} path="/screensource" exact />
    //       <PrivateRoute component={ScreenArticlesBySource} path="/screenarticlesbysource/:id" exact />
    //       <PrivateRoute component={ScreenMyArticles} path="/screenmyarticles" exact />
    //     </Switch>
    //   </Router>

    // </Provider>

  );
}

export default App;
