import React, { useEffect, useState } from 'react';
import { socket } from '../context/socket';
import logom from '../dood.jpg';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import {
	Button,
} from './StyledElements';

const cookies = new Cookies();

const StyledInput = styled.input`
  display: block;
  width: 100%;
  margin: 20px 0px;
  border: 2px solid lightblue;
  
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
async function getRelay(){
  //let w = window;

  //const token = await w.relayone.authBeta();
  //const [payload] = token.split(".");
  //payload is our localdata
  //const data = JSON.parse(atob(payload)); // Buffer.from(payload, 'base64')
  //console.log(data);
}

const Home = () => {
    const [test,setTest] = useState('');
    const [motd,setMotd] = useState('');

    const [handle,setHandle] = useState('');
    const [ActiveCollectionName,setActiveCollectionName] = useState('');
    const [logo,setLogo] = useState(logom);
  
    useEffect(() => {

      getRelay();

      if(cookies.get('authToken')&&!handle){
        socket.emit("gHCP", cookies.get('authToken'));
        }
      
   
    if(handle === ''){
    socket.on("rHCP", (arg)=>{
      var data = JSON.parse(arg[0]);
    //console.log(data);
    setHandle(JSON.stringify(data.handle).replace(/['"]+/g, ''));
    });
  }
  if(motd === ''){
    socket.on("motd", (arg) => { 
      //console.log(arg);
      setMotd(arg);
      //console.log(test);
    });
  }
    socket.on("test", (arg) => { 
      setTest(arg);
      //console.log(test);
    });
        
    socket.on("rCI", (arg) => { 
      arg = JSON.parse(JSON.parse(arg).body);
      console.log(arg);
      setActiveCollectionName(JSON.stringify(arg.body.collections[0].collectionName));
      setLogo(JSON.stringify(arg.body.collections[0].collectionImage).replace(/['"]+/g, ''));
      console.log(arg.body);
      });

  
  
  },[test,ActiveCollectionName,logo,handle,motd]);
  function getMotd(){

    var JSXret = [];
    if(!(motd === '')){
      JSXret = (
        <>
        <p style={{position:'relative', bottom:0}}>{motd.book} - {motd.chapter}:{motd.verse}<br></br>{motd.text}</p>
        </>
        );
    }else{socket.emit("gmotd");}
    return JSXret;
  }
  
  /*
      function emitTest(socket,data){
        socket.emit("test",data);
      }
  */
      function getCollection(socket,data){
        socket.emit("gCI",data);
      }
      
    //const inputProps = useInput();
    const imgbox = useInput();

return (
	<div className="App"
	style={{
		display: 'grid',
		justifyContent: 'Center',
		alignItems: 'Center',
		height: '100vh'
	}}
	>
    
    <header className="App-header">
        <img id="logoimage" src={logo} className="App-logo" alt="" />
    </header>
	<p>
      {ActiveCollectionName}
    </p>
    <h1>Welcome to The New Stick D00dz Dot Net
    </h1>
    
    
    <div>
    
      <StyledInput
        {...imgbox}
        placeholder="AL Collection"
        />
        <Button
        className="App"
        onClick={() => getCollection(socket,imgbox.value) }
      >
        Change Logo Image
      </Button>
      
    </div>
    {getMotd()}
	</div>
    

);
};

export default Home;
