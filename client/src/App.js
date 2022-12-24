import React, { useState, useEffect} from "react";



// react router
import { BrowserRouter as Router } from "react-router-dom";

//components

import { useDispatch } from 'react-redux';
import AllRoutes from './AllRoutes';
import Logs from './Logs';

import Navbar from './components/Navbar/Navbar';
import { fetchAllQuestions } from './actions/question'
import { fetchAllUsers } from './actions/users'
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader'

const App = () => {

 const [loading, setLoading] = useState(false);

 useEffect (()=> {
  setLoading(true);
  setTimeout(()=>{setLoading(false);
  },4000);
 },[]);

  const dispatch = useDispatch()
  ;
  useEffect(() => {
    dispatch(fetchAllQuestions())
    dispatch(fetchAllUsers())
  }, [dispatch])


  return (
    <div className="App">
    
    {loading ?(
        <ClimbingBoxLoader size={30} color={'#ef8236'} loading={loading} display={'flex'} />
      )
      :(  <Router>
    <Navbar/>
      <AllRoutes />
      <div id="recaptcha-container"></div>
      <Logs />
    </Router>)
    
    }</div>
    
    

  );
};

export default App;