import logom from './dood.jpg';
import './App.css';
import React, { useEffect, useState } from "react"
import { socket } from './context/socket';
import styled from 'styled-components';

import "./App.css"
//https://app.handcash.io/#/authorizeApp?appId=6375871c75b8310213222515
//this is my handcash app auth login link
const StyledInput = styled.input`
  display: block;
  margin: 20px 0px;
  border: 1px solid lightblue;
`;

function useInput(defaultValue) {
  const [value, setValue] = useState(defaultValue);
  function onChange(e) {
    setValue(e.target.value);
  }
  return {
    value,
    onChange,
  };
}


function App() {
  const [test,setTest] = useState('');
  const [test2,setTest2] = useState('');
  const [logo,setLogo] = useState(logom);

  useEffect(() => {
    socket.on("test", (arg) => { 
        setTest(arg);
        console.log(test);
        });
    socket.on("rCI", (arg) => { 
      arg = JSON.parse(JSON.parse(arg).body);
      setTest2(JSON.stringify(arg.body.collection.collectionName));
      setLogo(JSON.stringify(arg.body.collection.collectionImage).replace(/['"]+/g, ''));
      console.log(arg.body);
      });



    },[test,test2,logo]);



    function emitTest(socket,data){
      socket.emit("test",data);
    }
    function getCollection(socket,data){
      socket.emit("gCI",data);
    }
    
  const inputProps = useInput();
  const imgbox = useInput();

  return (
    <div className="App">
      <header className="App-header">
        <img id="logoimage" src={logo} className="App-logo" alt="logo" />
        
        <a
          className="App-link"
          href="https://stickdoodz.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          view the original stickdoodz.net
        </a>

        <StyledInput
        {...inputProps}
        placeholder="Type in here"
        />
        <button
        className="App"
        onClick={() => emitTest(socket,inputProps.value) }
      >
        Test Server Connection
      </button>
      <p>
        {test}
      </p>
      <StyledInput
        {...imgbox}
        placeholder="AL Collection"
        />
        <button
        className="App"
        onClick={() => getCollection(socket,imgbox.value) }
      >
        Change Logo Image
      </button>
      {test2}
      </header>
      <p>Why did you scroll down here?</p>
    </div>
  );
}

export default App;
