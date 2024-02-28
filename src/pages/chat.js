//This page is out chatroom. This handles quite a lot, sending several socket messages per user to our API server.
//This shows chat messages, profile pictures, usernames, and allows users to send "Dood Token" to one another
import React, { useEffect, useState, useRef } from 'react';
import './css/chat.css';
import './css/theme.scss';
import { socket } from '../context/socket';
import Cookies from 'universal-cookie';
//import { RANKS } from '../context/doodrarity';
import styled from 'styled-components';

import {
	Button,
	ScrollButton,
	SendButton,
	HeaderButton,
	EmoButton,
} from './StyledElements';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
const W = window;
const formatter = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: 0,
	maximumFractionDigits: 4,
  });


const StyledInput = styled.input`
  display: block;
  
  margin: 0px 0px;
  border: 2px solid violet;
  
`;

function useInput(defaultValue) {
  const [value, setValue] = useState(defaultValue);
  function onChange(e) {
	
	if(e.target.value >= 0){
	
    setValue(formatter.format(e.target.value));
	}else{

		setValue(formatter.format(0));
	}
  }

  
  return {
    value,
    onChange,
  };
}


const StyledTA = styled.textarea`
  display: block;
  width: 100%;
  margin: 20px 0px;
  border: 2px solid violet;
  
`;

function useTA(defaultValue) {
  const [value, setValue] = useState(defaultValue);
  
  function onChange(e) {
    setValue(e.target.value);
  }
  function clear(){
	setValue("");

  }
  
  return {

    value,
    onChange,
	clear
  };
}



const cookies = new Cookies();



  
const Profile = () => {
//This handles the states of several variables on screen
	const [handle,setHandle] = useState('');
	const [handleasked,setHandleasked] = useState(false);
	//const [name,setName] = useState('');
    const [paymail,setPaymail] = useState('');
	const [HCavatarURL,setHCavatarURL] = useState('');


    const [rpaymail,setRPaymail] = useState('');
	const [doodsum,setDoodSum] = useState([]);
	const [coinsum,setCoinSum] = useState([]);
	const [motd,setMotd] = useState('');

	const [pfptier,setPfpTier] = useState("");
	const [profilepic,setProfilePic] = useState("");

	const [chatarray,setChatArray] = useState([""]);
	const [receivedchats,setReceivedChats] = useState(false);

	const [newmessagealert,setNewMessageAlert] = useState("");

	const scroller = useRef();

	const scroll = document.getElementById('scrollbox');
	const txtbox = document.getElementById('textbox');

	const [headerOpen, setHeaderOpen] = useState(false);
	
	const [relaylogin,setRelaylogin] = useState(false);
	const [pickerOpen, setPickerOpen] = useState(false);
	const [canchat,setCanChat] = useState(true);
	const [ownerAddr,setOwnerAddr] = useState("");
    
	const [chatText, setChatText] = useState("");

	const inputbox = useTA();
	const chatRef = useRef(null);
	const tipbox = useInput(1);

	useEffect(() => {
		//Anything that changes here will dynamically update on the page
		if(!cookies.get('authToken')){window.location.href = "/";}else{

			if(motd === ''){
				socket.on("motd", (arg) => { 
				//console.log(arg);
				setMotd(arg);
				
				//getPFPUrl();
				//console.log(test);
				});
			}
			if(!handleasked){
			socket.emit("gHCP", cookies.get('authToken'));
			setHandleasked(true);
			}
			if(!handle){
			socket.on("rHCP", (arg)=>{
				var data = JSON.parse(arg[0]);
				//console.log(data);
				setStuff(data);
				});
			}
			if (!receivedchats){
			socket.emit("getchats","");

			//setReceivedChats(true);
			
			}
			socket.on("chatlog", (arg) => {
				//console.log(arg);
				setReceivedChats(true);
				setChatArray(arg);
				
				
				
			});
			socket.on("newchat",(arg =>{
				setReceivedChats(false);
				setNewMessageAlert("New Messages!")
				
				//socket.emit("getchats","");
			}));

			if(handle){
				
				socket.on("dbinfo", (arg)=>{
					//console.log(arg);
					//console.log(data);
					if(arg[0] === ""){
						setRPaymail("<Not Linked>");
					}else{
					setRPaymail(JSON.stringify(arg[0]).replace(/['"]+/g, ''));
					checkOwnership(socket,handle,arg[0]);
					checkCoins(arg[0]);
					}
					if(arg[1] === ""){
						setDoodSum("<Not Linked>");
					}else{
					setDoodSum(JSON.stringify(arg[1]).replace(/['"]+/g, ''));
					
					}
					if(arg[3] === ""){
						setProfilePic(HCavatarURL);
					}else{setProfilePic(JSON.stringify(arg[3]).replace(/['"]+/g, ''));}
					
					if(arg[4] === ""){
						setPfpTier("Unranked");
					}else{setPfpTier(JSON.stringify(arg[4]).replace(/['"]+/g, ''));}
					
				});
				
			}
		}
    }, [canchat,txtbox, scroll, handle,motd,handleasked,HCavatarURL,pfptier,chatarray,receivedchats,newmessagealert, ownerAddr, relaylogin]);

//This is called on page initialization
function setStuff(data){
	setHandle(JSON.stringify(data.handle).replace(/['"]+/g, ''));
	//setName(JSON.stringify(data.displayName).replace(/['"]+/g, ''));
	setPaymail(JSON.stringify(data.paymail).replace(/['"]+/g, ''));
	setHCavatarURL(JSON.stringify(data.avatarUrl).replace(/['"]+/g, ''));

}

//This checks how the current amount of Stick D00dz the current user has from RelayX. This influences things like border intensity.
async function checkOwnership(socket,handle,arg){
	
	await fetch("https://staging-backend.relayx.com/api/token/f181e9e9883bc2dfb233b10e75a378f06715e25da5163d423d8f6d07a843bcdd_o2/owners", {
    "credentials": "omit",
    "headers": {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site"
    },
    "method": "GET",
    "mode": "cors"
}).then((res) => { 
	return res.json() 
  })
  .then((jsonResponse) => {
	
	let selected = jsonResponse.data.owners.filter(c => c.paymail === arg);
	if(selected[0]){
	socket.emit("doodsum",[handle,selected[0].amount]);
	setDoodSum(selected[0].amount);
	//
	}
});
}

//This checks how the current amount of Dood Token the current user has from RelayX.
async function checkCoins(arg){
	await fetch("https://staging-backend.relayx.com/api/token/afe659d9ac6961c172d533ffde17507b34d521fcaefe3e49513077f1f75aa4c7_o2/owners", {
    "credentials": "omit",
    "headers": {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site"
    },
    "method": "GET",
    "mode": "cors"
}).then((res) => { 
	return res.json() 
  })
  .then((jsonResponse) => {
	
	let selected = jsonResponse.data.owners.filter(c => c.paymail === arg);
	if(selected[0]){
	//socket.emit("doodsum",[handle,selected[0].amount]);
	setCoinSum(selected[0].amount);
	//console.log(arg +"  " +selected[0].amount)
	}
});
}

//This function simply pulls dummy data from our server to ensure connection
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

  //This function displays profile pictures in chat and sets their border color based on the rarity tier of the NFT.
  function pfpDisplay(){
	
	var JSXtoReturn = [];
	var bordercolor = "#000000";
	if(!pfptier){
		//setPfpTier("");
	}else if(pfptier === "Unranked"){
		bordercolor = "#ffffff";
	}else if(pfptier === "Common"){
		bordercolor = "#a0a0a0";
	}else if(pfptier === "Uncommon"){
		bordercolor = "#5131c5";
	}else if(pfptier === "Rare"){
		bordercolor = "#31c562";
	}else if(pfptier === "Epic"){
		bordercolor = "#c53131";
	}else if(pfptier === "Legendary"){
		bordercolor = "#c57e31";
	}else if(pfptier === "Exotic"){
		bordercolor = "#fc1ee6";
	}
	JSXtoReturn.push(
		<div key="pfparea" className="ctpfparea" style={{
			
			filter: 'drop-shadow(0 0 10px '+bordercolor+')',
			
		}}>
		<img className="ctpfpimg" style={{
			borderWidth: 'medium', 
			borderRadius:'50%',
		  	borderColor:bordercolor, 
			borderStyle:'solid', 
			 
			
		}} src={profilepic} alt="Profile" ></img>
		</div>
	);
	return JSXtoReturn;
}

//This function displays the current profiles picture and sets their border color based on the rarity tier of the NFT.
function userPFP(chat){
	var width = "0.5em"
	if (window.screen.availWidth>=800){
		width = "thick"
	}else{
		width = "0.2em"
	}
	var JSXtoReturn = [];
	var bordercolor = "#000000";
	if(!chat.tier){
		//setPfpTier("");
	}else if(chat.tier === "Unranked"){
		bordercolor = "#ffffff";
	}else if(chat.tier === "Common"){
		bordercolor = "#a0a0a0";
	}else if(chat.tier === "Uncommon"){
		bordercolor = "#5131c5";
	}else if(chat.tier === "Rare"){
		bordercolor = "#31c562";
	}else if(chat.tier === "Epic"){
		bordercolor = "#c53131";
	}else if(chat.tier === "Legendary"){
		bordercolor = "#c57e31";
	}else if(chat.tier === "Exotic"){
		bordercolor = "#fc1ee6";
	}
	JSXtoReturn.push(
		<div key="pfparea" className="cpfparea" style={{
			
			filter: 'drop-shadow(0 0 10px '+bordercolor+')',
			
		}}>
		<img className="cpfpimg" style={{
			borderWidth: width, 
			borderRadius:'50%',
		  	borderColor:bordercolor, 
			borderStyle:'solid', 
			 
			
		}} src={chat.pfp} alt="Profile" ></img>
		</div>
	);
	return JSXtoReturn;
}


//cause a delay between sending messages or tips, for the sake of spam and slow APIs lol
function timeout(delay) {
	return new Promise( res => setTimeout(res, delay) );
}

//Sends a message from the text box to the server
async function postMessage(text, inputbox){
	setCanChat(false);
	setNewMessageAlert("Sending Message");

	const time = Date.now();
  	const date = new Date(time);
	socket.emit("chatmessage",[handle,doodsum,profilepic,pfptier,text,rpaymail]);
	
	//socket.emit("getchats","");
	var temp = chatarray;
	temp.push({
		posted: Date.now(),
        date: date.toUTCString(),
        handle: handle,
		doodz: doodsum,
		pfp: profilepic,
		tier: pfptier,
        message: text,
		rx: rpaymail,
		tips: 0
	}
	);

	setChatArray(temp);
	await timeout(1000).then(()=>{
		inputbox.clear();
		setChatText("");
		scrollDiv(scroll);
		setCanChat(true)
	});
	
	
}
//[^\x00-\x7F\ude00-\ude4f]+\ *(?:[^\x00-\x7F\ude00-\ude4f]| )*
function parseMultiLine(chat){
	var JSXtoreturn = [];
	if(chat.message !== null && typeof chat.message !== 'undefined'){
		let par = chat.message.split(/\r?\n/);
		par.forEach((line,index) => {
//{line.replace(/[^x00-x7F]+ *(?:[^x00-x7F]|)*/g, '')}
//.replace(/[\u2500-\u25FF]/g, '')
			JSXtoreturn.push(
				<p style={{maxWidth:(window.screen.availWidth-100)+"px"}}key={"line"+index+"post"+chat.posted}>
					{line}
				</p>
				);


		});
	}
	
	return JSXtoreturn;
}

//Unfortunately RelayX is very strangely designed and must rely on frontend fetch requests for user security. Basically it's all between the user and RelayX.
async function sendTip(id, recepient, amount){
	var ownerTMP;
	if(!relaylogin) {await relayXLogin()}

		
		if(rpaymail !== recepient){
			
			//First we have to resolve RelayX username to their ownership address
			fetch("https://api.relayx.io/v1/paymail/run/"+rpaymail, {
				"credentials": "omit",
				"headers": {
					"Sec-Fetch-Dest": "empty",
					"Sec-Fetch-Mode": "cors",
					"Sec-Fetch-Site": "cross-site"
				},
				"method": "GET",
				"mode": "cors"
			}).then((res) => { 
				return res.json() 
			  })
			  .then((jsonResponse) => {
				if (!ownerAddr){
				ownerTMP=jsonResponse.data;
				}else{ownerTMP = ownerAddr}
			  
			//Same for the recipient
			fetch("https://api.relayx.io/v1/paymail/run/"+recepient, {
				"credentials": "omit",
				"headers": {
					"Sec-Fetch-Dest": "empty",
					"Sec-Fetch-Mode": "cors",
					"Sec-Fetch-Site": "cross-site"
				},
				"method": "GET",
				"mode": "cors"
			}).then((res) => { 
				return res.json() 
			  })

			  //Then we can tell RelayX to prompt the user for consent of this transaction
			  .then((jsonResponse) => {
				//console.log(jsonResponse)
				fetch("https://staging-backend.relayx.com/api/run/send", {
				"credentials": "omit",
				"headers": {
				"Accept": "application/json, text/plain, */*",
					"Content-Type": "application/json",
					"Sec-Fetch-Dest": "empty",
					"Sec-Fetch-Mode": "cors",
					"Sec-Fetch-Site": "cross-site"
				},
				"body": "{\"amount\":"+amount
				+",\"location\":\"afe659d9ac6961c172d533ffde17507b34d521fcaefe3e49513077f1f75aa4c7_o2\"" //Dood Token TX
				+",\"owner\":\""+ownerTMP+"\""
				+",\"to\":\""+jsonResponse.data+"\"}",
				"method": "POST",
				"mode": "cors"
			}).then((res) => { 
				return res.json() 
			  }).then((jsonResponse) => {
				//If successful we have a rawtx here so we use relayone to broadcast.
				W.relayone.send(jsonResponse.data.rawtx).then((res)=>{
					if (res.txid)
					{
						timeout(1).then(()=>{
						checkCoins(rpaymail);
						socket.emit("tipchat",[id, amount])
						console.log("Successfully paid "+amount+" $DOO to "+recepient+", txid: " + res.txid)
						socket.emit("getchats","");
						});
					}
				});
				
			
			  })
			})
			  });
			}else{
				alert("You can't tip yourself silly goose!")
			}
	
}

//This takes the chat Database and turns it into pretty boxes
function parseChats(){
	
	var JSXtoreturn = [];
	chatarray.forEach((chat) => {		
		//console.log(chat)
		var totaltips;
		var tipmargin;
		var tipwidth;
		if(chat.tips){
			totaltips = chat.tips;
		}else{
			totaltips = 0;
		}
		var myDate = new Date(chat.date);
		if (window.screen.availWidth>=800){
			tipmargin = "0vh"
			tipwidth = "5rem"
		}else{
			tipmargin = "2vh"
			tipwidth = "3rem"
		}
		/*
{relaylogin && 
		}
		*/

		JSXtoreturn.push(
			<div className="message" key={"message"+chat.posted}>
			<table>
				<thead>
					<tr>
						<td style={{verticalAlign:'top'}}>
							{userPFP(chat)}
							
							
							<div>
							<StyledInput
							{...tipbox}
							placeholder="$DOO Amt"
							id="textbox"
							type="number"
							pattern="d\*"
							inputMode='decimal'
							style={{marginTop:tipmargin, width: tipwidth}}
							/>
							<Button id={"relayx-button"}
							onClick={() => sendTip(chat._id, chat.rx, parseFloat(tipbox.value))}
							style= {{width:"100%"}}
							>Tip
							</Button>
							</div>
							
						</td>
						<td style={{verticalAlign:'top', paddingLeft:"5px"}}>
							<h2>{chat.handle} -- {totaltips} $DOOD<br></br>{myDate.toLocaleString()}</h2>
							{parseMultiLine(chat)}
							
						</td>
					</tr>

					
				</thead>
			</table>
			
			</div>
	)
	})
	return JSXtoreturn;
	}

	function scrollDiv(ele){
		//var element = document.getElementById('scrollbox');
		ele.scrollTop = ele.scrollHeight;
		//ele.scrollTop = (ele.scrollHeight+10000);
		setNewMessageAlert("");
	}
	const handleKeyDown = (event) => {
		if(!event.shiftKey)
		{if (event.key === 'Enter' ) {
		postMessage(event.target.value, inputbox);
		//console.log(event.target.value)
		}}
	  }
	function toggleHeader(){
		if(headerOpen){
			setHeaderOpen(false);
		}else{
			setHeaderOpen(true);
		}
		
	}
	function generateScrollbox(){
		var JSXtoReturn = [];
		var hg = 5;
		if (window.screen.availWidth>=800){
			if(headerOpen){hg=31;}else{hg=40;}
		}else{
			if(headerOpen){hg=20;}else{hg=28;}
		}
		
		JSXtoReturn.push(
			<div 
			key="scrollbox"
			id="scrollbox"
			className="scroll"
			ref={scroller}
			style={{
				width: '100%',
				height: hg+'rem',
				overflowX: 'hidden',
				overflowY: 'scroll',
				textAlign: 'left',
				padding: '2px',
			}}>
				{parseChats()}
			</div>
		);
		return JSXtoReturn;
	}

	//This handles relevant functions for the user to login to RelayX
 async function relayXLogin(){

	if(!relaylogin){ //Not currently logged in
		console.log("Logging into relayx")
		
		const token =  await W.relayone.authBeta(); //This prompts relayone to serve a RelayX login modal which then gives us an active session
		setRelaylogin(true);
		const [payload] = token.split(".");
		const data = JSON.parse(atob(payload)); // Buffer.from(payload, 'base64')
		//var owneraddtmp;
	
		//console.log(data);
		//console.log(signature);
	
		setRPaymail(data.paymail);
		
		let paymail = data.paymail;
		//This is how we have to read the user's address to see their balances
		fetch("https://api.relayx.io/v1/paymail/run/"+paymail, {
			"credentials": "omit",
			"headers": {
				"Sec-Fetch-Dest": "empty",
				"Sec-Fetch-Mode": "cors",
				"Sec-Fetch-Site": "cross-site"
			},
			"method": "GET",
			"mode": "cors"
		}).then((res) => { 
			return res.json() 
		  })
		  .then((jsonResponse) => {
			//console.log(jsonResponse)
			setOwnerAddr(jsonResponse.data)
			fetch("https://staging-backend.relayx.com/api/user/balance2/"+jsonResponse.data, {
			"credentials": "omit",
			"headers": {
				"Sec-Fetch-Dest": "empty",
				"Sec-Fetch-Mode": "cors",
				"Sec-Fetch-Site": "cross-site"
			},
			"method": "GET",
			"mode": "cors"
		}).then((res) => { 
			return res.json() 
		  })
		  .then((jsonResponse) => {
			//console.log(jsonResponse.data);
			let collectibles = jsonResponse.data['collectibles'];
			let balances = jsonResponse.data['balances'];
			//let coins = balances.filter(c => c.origin === 'afe659d9ac6961c172d533ffde17507b34d521fcaefe3e49513077f1f75aa4c7_o2');
			let selected = collectibles.filter(c => c.origin === 'f181e9e9883bc2dfb233b10e75a378f06715e25da5163d423d8f6d07a843bcdd_o2');
			console.log(balances["afe659d9ac6961c172d533ffde17507b34d521fcaefe3e49513077f1f75aa4c7_o2"]);
			//console.log(selected.length);
			//socket.emit("doodsum", [handle,selected.length]);
			//socket.emit("userrelay", [handle,paymail]);

			

			console.log("Logged in as "+paymail)
			var nfts = [];
			selected.forEach((element) => {
					nfts.push(element);
				})
			//return owneraddtmp;
			//setRelayNFTs(nfts);
			
			
		  })
		  .catch((err) => {
			console.error(err);
		  });
			
		  })
		  .catch((err) => {
			console.error(err);
		  });
	}else{
		console.log("relay is logged in??")
	}

	}



	//Helper function for emoji entry lol
const onSelectEmoji = (emoji) => {
	console.log('emoji', emoji); 
	
	setChatText(`${chatText}${emoji.native}`); 

}; 

//Handles text entry, send button, emoji buttons
function chatBox(){
	var JSXtoreturn = [];
	var pos = ""
	if (window.screen.availWidth>=800){
		pos = "translate(-70%, -102%)"
	}else{
		pos = "translate(-65%, -102%)"
	}
	if(doodsum>0){
	JSXtoreturn.push(

		<div className="grid-item" key="chatbox" >
	
		{generateScrollbox()}
		
		 
	  <table width="100%">
		<thead>
			<tr>
				<td width="90%">
					<StyledTA
						{...inputbox}
						placeholder="Enter Message"
						id="textbox"
						onKeyDown={handleKeyDown}
						onChange={(e) => setChatText(e.target.value)}
						ref={chatRef}
						value={chatText}
						disabled = {!canchat}
					/>
				</td>
				<td >
				{pickerOpen && 
					<div style={{
					  display:"flex",
					  position:"absolute",
					  zIndex:20,
					  transform: pos
					}}><Picker 
					maxFrequentRows="2"
					
					data={data} 
					onEmojiSelect={onSelectEmoji} 
					/></div>}
				<EmoButton
					className="App"
					onClick={() => setPickerOpen(!pickerOpen) }
				><span>😀</span>
				</EmoButton>
				</td>
				<td >
				<SendButton
					className="App"
					onClick={() => postMessage(chatText, inputbox) }
				><span>👉</span>
				</SendButton>
				</td>
			</tr>
			<tr>
				<td>{newmessagealert}</td>
			</tr>
		</thead>
	  </table>
		
        
	  <HeaderButton
        className="App"
        onClick={() => toggleHeader() }
      >
        &#128100;
      </HeaderButton> 
	  <ScrollButton
        className="App"
        onClick={() => scrollDiv(scroll) }
      >
        👇
      </ScrollButton>
	  {!relaylogin && <Button
				className="App"
				onClick={() => relayXLogin() }
			>
				Login with RelayX
			</Button>}
	  
		</div>

	)
	}else{
		JSXtoreturn.push(

			<div className="grid-item" key="chatbox">
			<p>You Have No Stick D00dz<br></br>No chat for you!</p>
			</div>
	
		)
	}
	
	return JSXtoreturn;
}


return (
	
	<div className="idkwhat" style={{}}>
	
	<div className="grid-container" style={{width: '100%'}}>

	

	{headerOpen && (
	<div className="grid-head" >
		<table className="tg">
		<thead>
		<tr>
			<td className="tg-0lax" style={{width:'35%'}}>
			{pfpDisplay()}
			</td>
			<td className="tg-1lax"><p>Handle: ${handle}<br></br>Paymail: {paymail}
			<br></br>RelayX: {rpaymail} <br></br>Doodz Holdings: {doodsum}<br></br>$DOO Holdings: {coinsum/10000}</p>	</td>
			<td className="tg-0lax" style={{width:'10%', verticalAlign:'top'}}>
			
			</td>
		</tr>
		</thead>
		</table>
	</div>)}


	{chatBox()}
	
	</div>
	
    {getMotd()}
	
	
	</div>
);
};

export default Profile;

