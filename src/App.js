
import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
// import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useCookies } from 'react-cookie';
// import components

import Header from './components/Header/Header'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import NotFound from './components/NotFound/NotFound'
import Account from './components/Account/Account'
import Dashboard from './components/Dashboard/Dashboard'
import Observation from './components/Dashboard/Observation';
import AboutUs from './components/AboutUs/AboutUs';
import Anatomy from './components/Anatomy/Anatomy';
import Logout from './components/Login/Logout';
import BirdSearch from './components/BirdSearch/BirdSearch';

function App() {
  const userHandler = useState(null) // null = no user logged in
  const [user, setUser] = userHandler
  

  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  // if user cookie exists, log user in
  
  useEffect(() => {
    if (cookies['user'] && user == null) {
      console.log("Cookie found, attempting to login")
        // user exists, so we can grab their email information and send it to the backend
  
        fetch("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + cookies['user'])
        .then(res => res.json())
        .then((result) => {
            console.log(result)
            // setting user information
            if (result.error) {
              console.log("Invalid cookie/token expired. User must login again.")
            }
            else {
              console.log("Token valid. User should be logged in")
              login(result.email, cookies['user'], result.name)
              console.log("User:"+user)
            }
  
        }
        )
    }}, [])

  const login = (email, token, name) => {
    console.log("Logging in with token: " + token)
    fetch("http://localhost:5000/api/auth/login", {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({email: email, token: token, name: name})
    })
    .then(res => res.json())
    .then((res) => {
      console.log(res)
      if (res.error) {
        console.log("Error logging in")
      }
      else {
        console.log("Login successful")
        console.log("Response from backend:"+JSON.stringify(res))
        setUser({
          email: email,
          name: res.user.name,
          defaultLocation: res.user.defaultLocation,
          token: token
        })
      }
    })
  }

  const ProtectedRoute = ({ user, children }) => {
    if (user == null) {
      return <Navigate to="../login" replace />;
    }
  
    return children;
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}>
    <div className="App">
      
      <BrowserRouter>
        <Header user={user}></Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="login" element={<Login handler={userHandler}/>} />
          <Route path="anatomy" element={<Anatomy/>}/>
          <Route path="search" element={<BirdSearch/>}/>
          
          <Route path="search">
            <Route index element={
              <ProtectedRoute user={user}>
                <BirdSearch user={user}/>
              </ProtectedRoute>}/>
            <Route path=":species" element={
              <BirdSearch user={user}/>}/>
          </Route>
          <Route path="dashboard" element={
            <ProtectedRoute user={user}>
              <Dashboard user={user}/>
            </ProtectedRoute>
          }
          />
          <Route path="account" element={
            <ProtectedRoute user={user}>
              <Account handler={userHandler}/>
            </ProtectedRoute>
          }
          />
          <Route path="observation" element={
            <ProtectedRoute user={user}>
              <Observation user={user}/>
            </ProtectedRoute>
          }
          />
          <Route path="logout" element={<Logout handler={userHandler}/>}/>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
    </GoogleOAuthProvider>
  );
}

export default App;
