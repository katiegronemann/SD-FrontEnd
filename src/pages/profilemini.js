//This is a minified version of the profile screen intended for viewing on the chat page

import React, { useEffect, useState, useRef } from 'react';
import './profgrid.css';
import './css/theme.scss';
import { socket } from '../context/socket';
import Cookies from 'universal-cookie';
import { RANKS } from '../context/doodrarity';


const cookies = new Cookies();
const sdoodzorigin = 'f181e9e9883bc2dfb233b10e75a378f06715e25da5163d423d8f6d07a843bcdd_o2';

const formatter = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
  });

  
const Profile = () => {
	const [handle,setHandle] = useState('');
	const [name,setName] = useState('');
    const [paymail,setPaymail] = useState('');
	const [HCavatarURL,setHCavatarURL] = useState('');
	const [userNFTs,setUserNFTs] = useState([]);
	const [askedNFTs,setAskedNFTs] = useState(false);
    const [rpaymail,setRPaymail] = useState('');
	const [doodsum,setDoodSum] = useState([]);
	const [coinsum,setCoinSum] = useState([]);

	const [linkedRelay,setlinkedRelay] = useState(false);
	const [relayNFTs,setRelayNFTs] = useState([]);




	const [motd,setMotd] = useState('');


	const [profilepic,setProfilePic] = useState("");
	const [pfpsource,setPfpSource] = useState("");
	
	useEffect(() => {
	
		if(!cookies.get('authToken')){window.location.href = "/";}else{

			if(motd === ''){
				socket.on("motd", (arg) => { 
				//console.log(arg);
				setMotd(arg);
				//getPFPUrl();
				//console.log(test);
				});
			}

			if(!handle){
			socket.emit("gHCP", cookies.get('authToken'));
			}

			socket.on("rHCP", (arg)=>{
			var data = JSON.parse(arg[0]);
			//console.log(data);
			setHandle(JSON.stringify(data.handle).replace(/['"]+/g, ''));
			setName(JSON.stringify(data.displayName).replace(/['"]+/g, ''));
			setPaymail(JSON.stringify(data.paymail).replace(/['"]+/g, ''));
			setHCavatarURL(JSON.stringify(data.avatarUrl).replace(/['"]+/g, ''));
			
			});
			
			
			if(handle&&!askedNFTs){
				socket.on("dbinfo", (arg)=>{
					console.log(arg);
					//console.log(data);
					if(arg[0] === null){
						setRPaymail("<Not Linked>");
					}else{
					setRPaymail(JSON.stringify(arg[0]).replace(/['"]+/g, ''));
					checkOwnership(socket,handle,arg[0]);
					checkCoins(socket,handle,arg[0]);
					}
					if(arg[1] === null){
						setDoodSum("<Not Linked>");
					}else{
					setDoodSum(JSON.stringify(arg[1]).replace(/['"]+/g, ''));
					
					}
					
					if(arg[2] === null){
						setPfpSource("handcash");
					}else{setPfpSource(JSON.stringify(arg[2]).replace(/['"]+/g, ''));}
					
					if(arg[3] === null){
						setProfilePic(HCavatarURL);
					}else{setProfilePic(JSON.stringify(arg[3]).replace(/['"]+/g, ''));}
					
					
					
				});

				

			socket.emit("gNFTs", handle);
			setAskedNFTs(true);
			
			
			socket.on("rNFTs", (arg) => {
			var data = (JSON.parse(JSON.parse(arg).body));
			//console.log(data);
			setUserNFTs(data.body.nfts);
			//console.log(Object.keys(data.body.nfts).length);
			})
			}
			
			
		}
    }, [handle,name,paymail,HCavatarURL,askedNFTs,userNFTs,linkedRelay,motd,rpaymail,doodsum,profilepic,pfpsource,coinsum]);
	

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
async function checkCoins(socket,handle,arg){
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
	}
});
}

async function getAddress(){
let w = window;
if(!linkedRelay){
	const token = await w.relayone.authBeta();
	const [payload] = token.split(".");
	const data = JSON.parse(atob(payload)); // Buffer.from(payload, 'base64')

	//console.log(data);
	//console.log(signature);

	setRPaymail(data.paymail);
	let paymail = data.paymail;
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
		//let balances = jsonResponse.data['balances'];
		//console.log({balances});
		let selected = collectibles.filter(c => c.origin === 'f181e9e9883bc2dfb233b10e75a378f06715e25da5163d423d8f6d07a843bcdd_o2');
		//console.log(selected.length);
		socket.emit("doodsum", [handle,selected.length]);
		socket.emit("userrelay", [handle,paymail]);
		setlinkedRelay(true);
		var nfts = [];
		selected.forEach((element) => {
				nfts.push(element);
			})
		setRelayNFTs(nfts);
		
	  })
	  .catch((err) => {
		console.error(err);
	  });
		
	  })
	  .catch((err) => {
		console.error(err);
	  });
}else{
	console.log("RelayX Is Logged In")
}
}
function getMotd(){
	getAddress();
    var JSXret = [];
    if(!(motd === '')){
      JSXret = (
        <>
        <p>{motd.book} - {motd.chapter}:{motd.verse}<br></br>{motd.text}</p>
        </>
        );
    }else{socket.emit("gmotd");}
    return JSXret;
  }

function sortBy({ items, type, desc = false, parse = x => x }) {
    const sortOrder = desc ? -1 : 1;
    return items.sort((a, b) => {
        // sort comparison function
        let result = 0;

		if (type==="numerical"){
			if (parse(a.props.no) < parse(b.props.no)) {
            result = -1;
        }
        if (parse(a.props.no) > parse(b.props.no)) {
            result = 1;
        }}
		else if (type==="price"){
			if (parse(a.satoshis) < parse(b.satoshis)) {
				result = -1;
			}
			if (parse(a.satoshis) > parse(b.satoshis)) {
				result = 1;
			}
		}
		else if (type==="rarity"){
			if (RANKS.doodz[parse(a.props.no)].RNK < RANKS.doodz[parse(b.props.no)].RNK) {
				result = -1;
			}
			if (RANKS.doodz[parse(a.props.no)].RNK > RANKS.doodz[parse(b.props.no)].RNK) {
				result = 1;
			}
		}
        return result * sortOrder;
    });
}

return (
	
	<div className="idkwhat">
	
	<div className="grid-container" style={{width: 'fit-content'}}>
	<div className="grid-item">

	<table className="tg">
	<thead>
	<tr>
		<td className="tg-0lax" style={{width:'30%'}}>
		<img src={profilepic} className="pfp" alt="Profile"></img>
		</td>
		<td className="tg-1lax"><h2>Howdy {name}!</h2><p>Handle: ${handle}<br></br>Paymail: {paymail}
		<br></br>RelayX: {rpaymail} <br></br>Doodz Holdings: {doodsum}<br></br>$DOO Holdings: {coinsum/10000}</p>	</td>
	</tr>
	</thead>
	</table>

		
		</div>
  		
	</div>
	
    {getMotd()}
	</div>
);
};

export default Profile;

