import React from 'react';

import logo from '../../images/logo.png'
import { useGoogleLogin } from '@react-oauth/google';
import './Login.css'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Login({handler}) {
    const [user, setUser] = handler
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const navigate = useNavigate()

    const onSuccess = response => {
        console.log("oauth response" + response);
        // user exists, so we can grab their email information and send it to the backend
        fetch("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + response.access_token)
        .then(res => res.json())
        .then((result) => {
            console.log(result)
            // setting user information
            login(result.email, response.access_token, result.name)
            // setting user cookie
            setCookie('user', response.access_token, { path: '/' });
            // navigate to dashboard
            console.log("Navigating to home")
            navigate('/')
        }
        )
    };
    const onFailure = response => console.error(response);
    
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
            console.log("Response from backend:" + res.user.name)

            setUser({
              email: email,
              name: res.user.name,
              defaultLocation: res.user.defaultLocation,
              token: token
            })
          }
        })
      }
      
    const googleLogin = useGoogleLogin({
        onSuccess: onSuccess,
        onFailure: onFailure,
        flow: 'implicit',
      });
      


    return (
        <div>
            {/* {(user == null ? "Login to get start" : JSON.stringify(user, null, 2))} */}
            {(user == null ? "Login to upload bird observation record" : "User email: " + user.email)}
            <br></br>
            {(user == null ? "" : "User name: " +  user.name)}
            <h1>Login</h1>
            <img src={logo} alt="logo" id="logo"/>
            <div id="oauth">
            <button onClick={() => googleLogin()}>
                Sign in with Google {' '}
            </button>
            </div>
        </div>
    )
}

export default Login