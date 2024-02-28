import React, { useEffect, useState, useRef } from 'react';
import './profgrid.css';
import testimg from './test.png';
import './css/theme.scss';
import { socket } from '../context/socket';
import Cookies from 'universal-cookie';
import { RANKS } from '../context/doodrarity';


import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalTitle,
  } from '@react-ui-org/react-ui';



import {
	Button,
} from './StyledElements';

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
	const [relaylogin,setRelaylogin] = useState(false);
	const [relayNFTs,setRelayNFTs] = useState([]);
	const [currentCollection,setCurrentCollection]=useState([]);
	const [currentNFT,setCurrentNFT]=useState([]);
	const [currentSource,setCurrentSource] = useState('');

	const [modalOpen, setModalOpen] = useState(false);
	const modalPrimaryButtonRef = useRef();
	const modalCloseButtonRef = useRef();
	const [modalSize, setModalSize] = useState('large');

	const [motd,setMotd] = useState('');
	const [bagOrder,setBagOrder] = useState("asc");
	const [bagSort,setBagSort] = useState('numerical');

	const [profilepic,setProfilePic] = useState("");
	const [pfpsource,setPfpSource] = useState("");
	const [pfptier,setPfpTier] = useState("");

	const [activeTab, setActiveTab] = useState("tab1");
  
	const handleTabClick = (tabId) => {
	setActiveTab(tabId);
	setUserNFTs([]);
	console.log(tabId)
	switch(tabId){
        case "tab1":
            updateNFTS("63793d0569849dcee305bc2f");
        break;
		case "tab2":
            updateNFTS("633b31a709d1ac7280c50dfc");
        break;
		case "tab3":
            updateNFTS("633b320009d1acdc4ec50e04");
        break;
		case "tab4":
            updateNFTS("633b321809d1ac44c8c50e0c");
        break;
		case "tab5":
            updateNFTS("633b322e09d1acfdddc50e14");
        break;
		default:
			//updateNFTS("63793d0569849dcee305bc2f");
		break;

    }
	}

	
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
			setStuff(data);
			
			
			});
			
			
			if(handle&&!askedNFTs){
				socket.on("dbinfo", (arg)=>{
					//console.log(arg);
					//console.log(data);
					if(arg[0] === ""){
						setRPaymail("<Not Linked>");
						setlinkedRelay(false);
					}else{
					setRPaymail(JSON.stringify(arg[0]).replace(/['"]+/g, ''));
					setlinkedRelay(true);
					checkOwnership(socket,handle,arg[0]);
					checkCoins(socket,handle,arg[0]);
					}
					if(arg[1] === ""){
						setDoodSum("<Not Linked>");
					}else{
					setDoodSum(JSON.stringify(arg[1]).replace(/['"]+/g, ''));
					
					}
					
					if(arg[2] === ""){
						setPfpSource("handcash");
					}else{setPfpSource(JSON.stringify(arg[2]).replace(/['"]+/g, ''));}
					
					if(arg[3] === ""){
						setProfilePic(HCavatarURL);
					}else{setProfilePic(JSON.stringify(arg[3]).replace(/['"]+/g, ''));}
					
					if(arg[4] === ""){
						setPfpTier("Unranked");
					}else{setPfpTier(JSON.stringify(arg[4]).replace(/['"]+/g, ''));}
					
				});

				
			//socket.emit("gNFTs", handle) old functionality to grab ALL
			//socket.emit("gNFTsInSlot", [handle, "63793d0569849dcee305bc2f"]);
			socket.on("rNFTs", (arg) => {
				var data = (JSON.parse(JSON.parse(arg).body));
				//console.log(data);
				if(data.body){
				setUserNFTs(data.body.nfts);
				setAskedNFTs(true);
				}
				
				//console.log(Object.keys(data.body.nfts).length);
				})
			
			
			}

			
		}
    }, [handle,name,paymail,HCavatarURL,askedNFTs,userNFTs,relaylogin,linkedRelay,motd,rpaymail,doodsum,pfptier,profilepic,pfpsource,coinsum]);
	function setStuff(data){
		//updateNFTS("63793d0569849dcee305bc2f");
		//setActiveTab("tab1");
		setHandle(JSON.stringify(data.handle).replace(/['"]+/g, ''));
		setName(JSON.stringify(data.displayName).replace(/['"]+/g, ''));
		setPaymail(JSON.stringify(data.paymail).replace(/['"]+/g, ''));
		setHCavatarURL(JSON.stringify(data.avatarUrl).replace(/['"]+/g, ''));
	}
	function customPFP(url, tier){
		let sample = tier;
		setPfpSource("custom");
		setProfilePic(url);
		if(activeTab==="tab1"){sample="Legendary"}
		setPfpTier(sample);
		socket.emit("setPFP",[handle,"custom",url,sample]);
	}

	function setPFPdrop(event){
		setPfpSource(event.target.value)
		setPfpTier("Unranked");
		var source = event.target.value;
		var url = "";
		if (source === "handcash"){
			setProfilePic(HCavatarURL)
			url = HCavatarURL;
		}else if(source === "relayx"){
			setProfilePic("https://a.relayx.com/u/"+rpaymail);
			url = "https://a.relayx.com/u/"+rpaymail;
		}
		socket.emit("setPFP",[handle,source,url,"Unranked"]);
	}
	function pfpsourcehelper(){
		var JSXtoReturn = [];
		if (linkedRelay){
			JSXtoReturn.push(
				<option key="relayx" value="relayx">Relayx</option>
			);
		}else{

		}
		return JSXtoReturn;
	}
function changepfpSource(){
	var JSXtoReturn = [];
	JSXtoReturn.push(
		<div key="pfpdrop">
		

		<select name="pfpdrop" id="pfpdrop" 
		value = {pfpsource}
		onChange = {(setPFPdrop)}
		>
		  <option value="handcash">Handcash</option>
		  
		  {pfpsourcehelper()}
		  
		  <option hidden value="custom">Custom</option>
		  
		</select> 

		</div>
		
	);
	return JSXtoReturn;
}
function galleryModal(Collection, NFT, source){
	setCurrentCollection(Collection)
	setCurrentNFT(NFT);
	setCurrentSource(source);
	if(!modalOpen){
		//console.log(NFT);
	

	if (window.screen.availWidth>=800){
		setModalSize('large')
	}else{
		setModalSize('small')
	}
	modalSetup();
	setModalOpen(true);
	
	}
	}

  function modalSetup(){
	var imgloc = "";
	var text=[];
	if(currentSource === "RX")  //this chunk is about relay lol
	{
		if (window.screen.availWidth>=800){
		text=(<>
			<div key = {`modal${Math.random}`}>
			  {modalOpen && (
				<Modal
				  closeButtonRef={modalCloseButtonRef}
				  primaryButtonRef={modalPrimaryButtonRef}
				  size={modalSize}
				>
				  <ModalHeader>
					<ModalTitle>{currentCollection.name}: {currentNFT.props.no}</ModalTitle>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				  </ModalHeader>
				  <ModalBody>
					<ModalContent>
						
					<table className="tg">
					<thead>
					<tr>
						<td className="tg-0lax" width="50%">
						<img src={"https://berry2.relayx.com/"+currentNFT["berry"]["txid"]} alt="NFT" className='modalView' />
						</td>
						<td className="tg-0lax" width="50%">
							<h2>{RANKS.doodz[currentNFT["props"]["no"]].TIER} -- Rank: {RANKS.doodz[currentNFT["props"]["no"]].RNK}</h2>
							
							<table className="tg">
							<thead>
							</thead>
							<tbody>
							<tr>
							<td className="rarity">
							BG: {RANKS.doodz[currentNFT["props"]["no"]].BG} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].BGR*100)}%)
							</td>
							<td className="rarity">
							Pattern: {RANKS.doodz[currentNFT["props"]["no"]].BGP} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].BGPR*100)}%)
							</td>
							</tr>
							<tr>
							<td className="rarity">
							Base: {RANKS.doodz[currentNFT["props"]["no"]].CHR} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].CHRR*100)}%)
							</td>
							<td className="rarity">
							Arms: {RANKS.doodz[currentNFT["props"]["no"]].ARM} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].ARMR*100)}%)
							</td>
							</tr>
							<tr>
							<td className="rarity">
							Eyes: {RANKS.doodz[currentNFT["props"]["no"]].EYE} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].EYER*100)}%)
							</td>
							<td className="rarity">
							Glasses: {RANKS.doodz[currentNFT["props"]["no"]].GLA} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].GLAR*100)}%)
							</td>
							</tr>
							<tr>
							<td className="rarity">
							Mouth: {RANKS.doodz[currentNFT["props"]["no"]].MOU} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].MOUR*100)}%)
							</td>
							<td className="rarity">
							Hat: {RANKS.doodz[currentNFT["props"]["no"]].HAT} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].HATR*100)}%)
							</td>
							</tr>
							</tbody>
							</table>
							
							<p>Location: <a href={`https://whatsonchain.com/tx/${currentNFT["location"].split("_")[0]}`}>Output {currentNFT["location"].split("_")[1]}</a></p>
							<p><a href={`https://relayx.com/assets/${sdoodzorigin}/${currentNFT["location"]}`}>View on RelayX</a></p>
						</td>
					</tr>
					</thead>
					</table>
					
					</ModalContent>
				  </ModalBody>
				  <ModalFooter>
				  <Button
					  label="Set as PFP"
					  onClick={() => customPFP("https://berry2.relayx.com/"+currentNFT["berry"]["txid"], RANKS.doodz[currentNFT["props"]["no"]].TIER)}
					  priority="outline"
					  ref={modalCloseButtonRef}
					>Set as PFP</Button>
					<Button
					  label="Close"
					  theme="red"
					  onClick={() => setModalOpen(false)}
					  priority="outline"
					  ref={modalCloseButtonRef}
					>Close</Button>
				  </ModalFooter>
				</Modal>
			  )}
			</div>
		  </>)
		  }else{
			text=(
		  <>
			<div>
			  {modalOpen && (
				<Modal
				  closeButtonRef={modalCloseButtonRef}
				  primaryButtonRef={modalPrimaryButtonRef}
				  size={modalSize}
				>
				  <ModalHeader>
					<ModalTitle>{currentCollection.name}: {currentNFT.props.no}</ModalTitle>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				  </ModalHeader>
				  <ModalBody>
					<ModalContent>
						
						<img src={"https://berry2.relayx.com/"+currentNFT["berry"]["txid"]} alt="NFT" className='modalView' />

						<h2 className="modalhead">{RANKS.doodz[currentNFT["props"]["no"]].TIER} -- Rank: {RANKS.doodz[currentNFT["props"]["no"]].RNK}</h2>
							
							<table className="tg">
							<thead>
							
							<tr>
							<td className="rarity">
							BG: {RANKS.doodz[currentNFT["props"]["no"]].BG} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].BGR*100)}%)
							</td>
							<td className="rarity">
							Pattern: {RANKS.doodz[currentNFT["props"]["no"]].BGP} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].BGPR*100)}%)
							</td>
							</tr>
							<tr>
							<td className="rarity">
							Base: {RANKS.doodz[currentNFT["props"]["no"]].CHR} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].CHRR*100)}%)
							</td>
							<td className="rarity">
							Arms: {RANKS.doodz[currentNFT["props"]["no"]].ARM} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].ARMR*100)}%)
							</td>
							</tr>
							<tr>
							<td className="rarity">
							Eyes: {RANKS.doodz[currentNFT["props"]["no"]].EYE} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].EYER*100)}%)
							</td>
							<td className="rarity">
							Glasses: {RANKS.doodz[currentNFT["props"]["no"]].GLA} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].GLAR*100)}%)
							</td>
							</tr>
							<tr>
							<td className="rarity">
							Mouth: {RANKS.doodz[currentNFT["props"]["no"]].MOU} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].MOUR*100)}%)
							</td>
							<td className="rarity">
							Hat: {RANKS.doodz[currentNFT["props"]["no"]].HAT} ({formatter.format(RANKS.doodz[currentNFT["props"]["no"]].HATR*100)}%)
							</td>
							</tr>
							</thead>
							</table>
						<p className="modalhead"><a href={`https://relayx.com/assets/${sdoodzorigin}/${currentNFT["location"]}`}>View on RelayX</a></p>	
						
						<p className="mini">Location: <a href={`https://whatsonchain.com/tx/${currentNFT["location"].split("_")[0]}`}>Output {currentNFT["location"].split("_")[1]}</a></p>

					
					</ModalContent>
				  </ModalBody>
				  <ModalFooter>
				  <Button
					  label="Set as PFP"
					  onClick={() => customPFP("https://berry2.relayx.com/"+currentNFT["berry"]["txid"], RANKS.doodz[currentNFT["props"]["no"]].TIER)}
					  priority="outline"
					  ref={modalCloseButtonRef}
					>Set as PFP</Button>
					<Button
					  label="Close"
					  theme="red"
					  onClick={() => setModalOpen(false)}
					  priority="outline"
					  ref={modalCloseButtonRef}
					>Close</Button>
				  </ModalFooter>
				</Modal>
			  )}
			</div>
		  </>)

		  }}
	else if (currentSource === "AL")
	{
		if(currentNFT["expressionValues"][0]["expression"]["expressionName"] === "ImageExpression"){
			imgloc = currentNFT["expressionValues"][0]["value"].replace(/['"]+/g, '')
		}else{
			let count = 0;
			currentNFT.expressionValues.forEach(element => {
				//console.log(element);
				//if(element["expressionAttribute"]["expressionAttributeName"] === "Image"){
					//element["expression"]["expressionName"] === "Menu View"
				if(element["expression"]["expressionName"] === "Menu View" ){
				//console.log("Menu view at " + count)
				imgloc = currentNFT["expressionValues"][count]["value"].replace(/['"]+/g, '')
				}
				count+=1;
			});
		}
		if (window.screen.availWidth>=800){
			
		text = (<>
			<div>
			  {modalOpen && (
				<Modal
				  closeButtonRef={modalCloseButtonRef}
				  primaryButtonRef={modalPrimaryButtonRef}
				  size={modalSize}
				>
				  <ModalHeader>
					<ModalTitle>{currentNFT["collectionName"]}: {currentNFT["serial"]}</ModalTitle>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				  </ModalHeader>
				  <ModalBody>
					<ModalContent>
						
					<table className="tg">
					<thead>
					<tr>
						<td className="tg-0lax" width="50%">
						<div className='modalIMGDIV'>
						<img src={imgloc} alt="NFT" className='modalView' />
						</div>
						</td>
						<td className="tg-0lax" width="50%">
							<p>collectionID: {currentNFT["collectionId"]}</p>
							<p>nftId: {currentNFT["nftId"]}</p>	
							<p>Location: <a href={`https://whatsonchain.com/tx/${currentNFT["location"].split("_")[0]}`}>Output {currentNFT["location"].split("_")[1]}</a></p>
								
						</td>
					</tr>
					</thead>
					</table>
					
					</ModalContent>
				  </ModalBody>
				  <ModalFooter>
				  <Button
					  label="Set as PFP"
					  onClick={() => customPFP(imgloc,"Common")}
					  priority="outline"
					  ref={modalCloseButtonRef}
					>Set as PFP</Button>
					<Button
					  label="Close"
					  theme="red"
					  onClick={() => setModalOpen(false)}
					  priority="outline"
					  ref={modalCloseButtonRef}
					>Close</Button>
				  </ModalFooter>
				</Modal>
			  )}
			</div>
		  </>)
		  }else{
			text = (
		  <>
			<div>
			  {modalOpen && (
				<Modal
				  closeButtonRef={modalCloseButtonRef}
				  primaryButtonRef={modalPrimaryButtonRef}
				  size={modalSize}
				>
				  <ModalHeader>
					<ModalTitle>{currentNFT["collectionName"]}: {currentNFT["serial"]}</ModalTitle>
					<ModalCloseButton onClick={() => setModalOpen(false)} />
				  </ModalHeader>
				  <ModalBody>
					<ModalContent>
						
						<img src={imgloc} alt="NFT" className='modalView' />

							<p>collectionID: {currentNFT["collectionId"]}</p>
							<p>nftId: {currentNFT["nftId"]}</p>	
							<p>Location: <a href={`https://whatsonchain.com/tx/${currentNFT["location"].split("_")[0]}`}>Output {currentNFT["location"].split("_")[1]}</a></p>
								

					
					</ModalContent>
				  </ModalBody>
				  <ModalFooter>
				  <Button
					  label="Set as PFP"
					  onClick={() => customPFP(imgloc,"Common")}
					  priority="outline"
					  ref={modalCloseButtonRef}
					>Set as PFP</Button>
					<Button
					  label="Close"
					  theme="red"
					  onClick={() => setModalOpen(false)}
					  priority="outline"
					  ref={modalCloseButtonRef}
					>Close</Button>
				  </ModalFooter>
				</Modal>
			  )}
			</div>
		  </>)
		  }}
	return (
	  text
	)
  }
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
if(!relaylogin){
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
		setRelaylogin(true);
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
	console.log("relay is logged in??")
}
}
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
function setBSort(event){
	setBagSort(event.target.value)
}
function setBOrd(event){
	setBagOrder(event.target.value);
}

function bagBottom(){
	var JSXtoReturn = [];
	var junk=[];
	var myArray = sortBy({items:relayNFTs, type:bagSort, desc:(bagOrder==="desc")});

	myArray.forEach(thing=>{
		//console.log(thing);

		if(thing["origin"]==="f181e9e9883bc2dfb233b10e75a378f06715e25da5163d423d8f6d07a843bcdd_o2"){
			junk["name"] = "Stick D00dz";
		}
		JSXtoReturn.push(
			<div key={"galleryimg"+thing["berry"]["txid"]} className="responsive" id={"galleryimg"+thing["berry"]["txid"]}>
			<div className="gallery">
			
			<img src={"https://berry2.relayx.com/"+thing["berry"]["txid"]} alt="NFT" width="400" height="400"onClick={() => galleryModal(junk,thing,"RX")}></img>

			<div className="desc">
			<h2>{RANKS.doodz[thing["props"]["no"]].TIER}</h2>
			<p>{junk["name"]+": "+thing["props"]["no"]}<br></br>{"Rank: "+RANKS.doodz[thing["props"]["no"]].RNK}</p>
			</div>

		</div>
		</div>

		);
	}); return JSXtoReturn;
}

function relayBuilder(){
var JSXtoReturn = [];

if (!relaylogin){
	JSXtoReturn.push(
		<div key={`relayZone${Math.random}`}>
		<Button
        className="App"
        onClick={() => getAddress() }
      >
        Login with RelayX
      </Button>
	  </div>
	)
}else{
	
	//var myArray = sortBy({items:relayNFTs});
	checkOwnership(socket,handle,rpaymail);
	//console.log(myArray);
	JSXtoReturn.push(
		<div key="its my bag">
		<h2>{rpaymail}'s Bag:</h2>
		<label htmlFor="bagsort">Sort By: </label>

		<select name="bagsort" id="bagsort" 
		value = {bagSort}
		onChange = {(setBSort)}
		>
		  <option value="numerical">Mint</option>
		  <option value="rarity">Rank</option>
		</select> 

		<label htmlFor="bagorder"> Order: </label>

		<select name="bagorder" id="bagorder" 
		value = {bagOrder} 
		onChange = {(setBOrd)}>
		  <option value="asc">Ascending</option>
		  <option value="desc">Descending</option>
		</select> 
		
		<p></p>
		{bagBottom()}
		</div>
		
	);
	
}
return JSXtoReturn;
}

function updateNFTS(slotId){
	setAskedNFTs(false);
	socket.emit("gNFTsInSlot", [handle, slotId]);
}
function galleryBuilder(){
	//		<p>{JSON.stringify(userNFTs[0])}</p>
	var text = [];
	var junk = [];
	//console.log(userNFTs);
	/* We have to initiate a new call to refresh userNFTs with just ones pertaining to our slot*/
	//socket.emit("gNFTsInSlot", [handle, slotId]);
	
	
	userNFTs.forEach(selectedNFT => {
		//console.log(selectedNFT)
		
//
		//console.log(userNFTs[i].expressionValues.length);
		//console.log(selectedNFT);
		selectedNFT.expressionValues.forEach(element => {
			//console.log(element);
			//if(element["expressionAttribute"]["expressionAttributeName"] === "Image"){
				//element["expression"]["expressionName"] === "Menu View"
			if(element["expression"]["expressionName"] === "Menu View" || element["expression"]["expressionName"] === "ImageExpression"){
			
				text.push (
					<div  key={"gallery"+selectedNFT.nftId} className="responsive" id={"gallerygallery"+selectedNFT.nftId}>
					<div key={"galleryimg"+selectedNFT.nftId} className="gallery" id={"galleryimg"+selectedNFT.nftId}>
						
						<img src={element["value"].replace(/['"]+/g, '')} className="galleryimg" alt="NFT" width="400" height="400" onClick={() => galleryModal(junk, selectedNFT,"AL")}>
						</img>
						<div className="desc"><p>{selectedNFT["collectionName"]+": "+selectedNFT["serial"]}</p>
						
						</div>
					</div>
					</div>
				
				)
			}
		});
		 
	});
	
	return text;
}
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
		<div key="pfparea" className="pfparea" style={{
			
			filter: 'drop-shadow(0 0 10px '+bordercolor+')',
			
		}}>
		<img className="pfpimg" style={{
			borderWidth: 'thick', 
			borderRadius:'50%',
		  	borderColor:bordercolor, 
			borderStyle:'solid', 
			 
			
		}} src={profilepic} alt="Profile" ></img>
		</div>
	);
	return JSXtoReturn;
}



return (
	
	<div className="idkwhat">
	
	<div className="grid-container" style={{width: '100%'}}>
	<div className="grid-item">

	<table className="tg">
	<thead>
	<tr>
		<td className="tg-0lax" style={{width:'40%'}}>
			{pfpDisplay()}
			{changepfpSource()}
		</td>
		<td className="tg-2lax"><h2>Howdy {name}!</h2><p>Handle: ${handle}<br></br>Paymail: {paymail}
		<br></br>RelayX: {rpaymail} <br></br>Doodz Holdings: {doodsum}<br></br>$DOO Holdings: {coinsum/10000}</p>	</td>
	</tr>
	</thead>
	</table>

		
		</div>
  		<div key="algal" className="grid-item" id="assetlayer">
		<p>NFTs:</p>
			<div className="tab-container">
			<ul className="nav nav-tabs nav-justified">
				<li style={{
					borderStyle: 'outset',
					borderWidth: '2px',
					borderColor: 'black',
					
				}}
				className={activeTab === "tab1" ? "active" : ""}
				onClick={() => handleTabClick("tab1")}
				>
				<h2>Stick D00dz</h2>
				</li>
				<li style={{
					borderStyle: 'outset',
					borderWidth: '2px',
					borderColor: 'black'
				}}
				className={activeTab === "tab2" ? "active" : ""}
				onClick={() => handleTabClick("tab2")}
				>
				<h2>DuroDogs</h2>
				</li>
				<li style={{
					borderStyle: 'outset',
					borderWidth: '2px',
					borderColor: 'black'
				}}
				className={activeTab === "tab3" ? "active" : ""}
				onClick={() => handleTabClick("tab3")}
				>
				<h2>DD Hats</h2>
				</li>
				<li style={{
					borderStyle: 'outset',
					borderWidth: '2px',
					borderColor: 'black'
				}}
				className={activeTab === "tab4" ? "active" : ""}
				onClick={() => handleTabClick("tab4")}
				>
				<h2>DD Glasses</h2>
				</li>
				<li style={{
					borderStyle: 'outset',
					borderWidth: '2px',
					borderColor: 'black'
				}}
				className={activeTab === "tab5" ? "active" : ""}
				onClick={() => handleTabClick("tab5")}
				>
				<h2>DD Collars</h2>
				</li>
			</ul>
			<div className="tab-content">
				<div className={`tab-pane ${activeTab === "tab1" ? "active" : ""}`} id="tab1">
				<p>Stickdoodz Artwork: 63793d0569849dcee305bc2f</p>

				</div>
				<div className={`tab-pane ${activeTab === "tab2" ? "active" : ""}`} id="tab2">
				<p>Dogs: 633b31a709d1ac7280c50dfc</p>

				</div>
				<div className={`tab-pane ${activeTab === "tab3" ? "active" : ""}`} id="tab3">
				<p>Hats: 633b320009d1acdc4ec50e04</p>

				</div>
				<div className={`tab-pane ${activeTab === "tab4" ? "active" : ""}`} id="tab4">
				<p>Glasses: 633b321809d1ac44c8c50e0c</p>

				</div>
				<div className={`tab-pane ${activeTab === "tab5" ? "active" : ""}`} id="tab5">
				<p>Collars: 633b322e09d1acfdddc50e14</p>

				</div>
			</div>
			</div>
			{galleryBuilder()}
		</div>
		
		<div key = "rxgal" className="grid-item" id="relayx">
		
		{relayBuilder()}

		{modalSetup()}
		
		</div>
	</div>
	
    {getMotd()}
	</div>
);
};

export default Profile;

