import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'
import './assets/css/App.css';

import Home from './containers/Home';
import Login from './users/components/authentication/Login';
import Signup from './users/components/authentication/Signup';
import Activate from './users/components/authentication/Activate';
import ResetPassword from './users/components/authentication/ResetPassword';
import ResetPasswordConfirm from './users/components/authentication/ResetPasswordConfirm';
import Layout from './hocs/Layout';
import { store }  from './redux/app/store';

const App = () => (
  <Provider store={store}>
    <Router>
      <Layout>
        <Routes>
          <Route path='/' Component={Home}/>
          <Route path='/login' Component={Login}/>
          <Route path='/signup' Component={Signup}/>
          <Route path='/activate/:uid/:token' Component={Activate}/>
          <Route path='/reset-password' Component={ResetPassword}/>
          <Route path='/password/reset/confirm/:uid/:token' Component={ResetPasswordConfirm}/>
        </Routes>
      </Layout>
    </Router>
  </Provider>
)

export default App