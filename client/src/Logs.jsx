import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import SignIn from "./components/PhoneAuth/SignIn";
import { signin } from './actions/auth'
import Navbar from './components/Navbar/Navbar';
import { useEffect, useState } from "react";


import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// react router

const Logs = () => {
  
  const [viewOtpForm, setViewOtpForm] = useState(false);
  const [user, setUser] = useState(false);
  const firebaseConfig = {
    apiKey: "AIzaSyAhbKmpZDP_6Qi-42vIv3ni3FBEFCTkSDs",
    authDomain: "stack-overflow-cloneapp.firebaseapp.com",
    projectId: "stack-overflow-cloneapp",
    storageBucket: "stack-overflow-cloneapp.appspot.com",
    messagingSenderId: "351494291410",
    appId: "1:351494291410:web:a500a5b87ea0993def120b"
    
  };

  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: function (response) {
          console.log("Captcha Resolved");
          this.onSignInSubmit();
        },
        defaultCountry: "IN",
      }
    );
  }, []);

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }

  const auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    }
  });

  const loginSubmit = (e) => {
    e.preventDefault();

    let phone_number = "+91" + e.target.phone.value;
    const appVerifier = window.recaptchaVerifier;

    auth
      .signInWithPhoneNumber(phone_number, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        console.log("otp sent");
        setViewOtpForm(true);
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        alert(error.message);
      });
  };

  const otpSubmit = (e) => {
    e.preventDefault();

    let opt_number = e.target.otp_value.value;

    window.confirmationResult
      .confirm(opt_number)
      .then((confirmationResult) => {
        console.log(confirmationResult);
        console.log("success");
        window.open("/", "_self");
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        alert(error.message);
      });
  };


  return (
   
        
        <Routes>
        
                
        <Route path = '/SignIn'  element = { <SignIn
                    loginSubmit={loginSubmit}
                    otpSubmit={otpSubmit}
                    viewOtpForm={viewOtpForm}
                /> }/>
        </Routes>
   
  )
}

export default Logs