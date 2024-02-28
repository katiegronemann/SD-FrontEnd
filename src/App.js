import './App.css';
import React from "react"
//import { socket } from './context/socket';

import "./App.css"
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import About from './pages/about';
import Market from './pages/market';
import Profile from './pages/profile';
import Chat from './pages/chat';
import SignIn from './pages/signin';
import SignOut from './pages/signout';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

cookies.set('cookiecheck', 'You have cookies enabled, what a good Christian you are :)', { path: '/', sameSite: 'strict'});
console.log(cookies.get('cookiecheck')); // Pacman

const queryParameters = new URLSearchParams(window.location.search);
const authtoken = queryParameters.get("authToken");
if (authtoken){
  console.log("Valid auth, " + authtoken);
  cookies.set('authToken', authtoken, { path: '/', sameSite: 'strict'});
  //user has just logged in, ready to go
}else{
  console.log("No authtoken received");
  //client has just visited organically

  if (cookies.get('authToken')){
    console.log("Have one saved though, its: " + cookies.get('authToken'));
  //we have a cached login, we are good to go

  }else{
    console.log("No active user");
  //client has no active authorization
  }
}

function App() {
 

  return (
    
    <Router>
    <Navbar />
    <Routes>
      <Route path='/' exact element={<Home/>}></Route>
      <Route path='/about' element={<About/>}></Route>
      <Route path='/market' element={<Market/>}></Route>
      <Route path='/profile' element={<Profile/>}></Route>
      <Route path='/chat' element={<Chat/>}></Route>
      <Route path='/sign-in' element={<SignIn/>}></Route>
      <Route path='/sign-out' element={<SignOut/>}></Route>
    </Routes>
    </Router>
    
    
  );
}

export default App;
