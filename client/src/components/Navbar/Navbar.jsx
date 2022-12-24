import React from 'react';
import { useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import search from '../../assets/search-solid.svg';
import Avatar from '../../components/Avatar/Avatar';
import './Navbar.css';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { setCurrentUser } from '../../actions/currentUser';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const Navbar = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  var User = useSelector((state) => (state.currentUserReducer))

  

  const handleLogout = () =>{
    dispatch({ type: 'LOGOUT'});
    navigate('/');
    dispatch(setCurrentUser(null))
  }

  useEffect(() => {
    const token = User?.token
    if(token){
      const decodedToken = decode(token)
      if(decodedToken.exp * 1000 < new Date().getTime()){
        handleLogout();
      }
    }
    dispatch(setCurrentUser( JSON.parse(localStorage.getItem('Profile'))))
  },[dispatch]) // eslint-disable-line react-hooks/exhaustive-deps
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

  var log = firebase.auth().currentUser;
    const auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    }
  });

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.open("/", "_self");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };


  return (
    <nav className='main-nav'>
        <div className='navbar'>
            <Link to='/' className='nav-item nav-logo'>
                <img src={logo} alt="logo" />
            </Link>
            <a href="https://stackoverflow.co" className='nav-item nav-btn'>About</a>
            <a href="https://stackoverflow.co/talent/" className='nav-item nav-btn'>Products</a>
            <a href="https://stackoverflow.co/teams/" className='nav-item nav-btn'>For Teams</a>
            <form>
                <input type="text" placeholder='Search...'/>
                <img src={search} alt="" width="18" className='search-icon'/>
            </form>
            
           

            {User === null ? 
            <Link to='/Auth' className='nav-item nav-links'>Log in</Link> :
            <>
            <Avatar className='avatar' backgroundColor='blue' px="12px" py="6px" borderRadius="50%" color="white"><Link to={`/Users/${User?.result?._id}`} style={{color:"white", textDecoration:'none'}}>{User.result.name.charAt(0).toUpperCase()}</Link></Avatar>
            <button className='nav-item nav-links' onClick={handleLogout}>Log out</button>
            </>
            }
            { firebase.auth().currentUser ?
              <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" className='nav-item nav-links' >
              {log && user.phoneNumber}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/SignIn" onClick={signOut} class="dropdown-item" aria-labelledby="dropdownMenuButton">Logout</Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>
            :null
          }
            
        </div>
    </nav>
  )
}

export default Navbar