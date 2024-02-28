import React, { useEffect, useState, useRef } from 'react';
import { RANKS } from '../context/doodrarity';
import './profgrid.css';
import './css/theme.scss';



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
const W = window;
const sdoodzorigin = 'f181e9e9883bc2dfb233b10e75a378f06715e25da5163d423d8f6d07a843bcdd_o2';
const formatter = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
  });

  
const Market = () => {

    const [rpaymail,setRPaymail] = useState('');


	const [linkedRelay,setlinkedRelay] = useState(false);
	const [bagOpen,setBagOpen] = useState(false);
	
	const [relayNFTs,setRelayNFTs] = useState([]);
	const [openOrders,setOpenOrders] = useState([]);

	const [hasListings,setHasListings] = useState(false);
	const [currentCollection,setCurrentCollection]=useState([]);
	const [currentNFT,setCurrentNFT]=useState([]);
	const [currentSource,setCurrentSource] = useState('');
	const [currentListed,setCurrentListed] = useState(false);

	const [modalOpen, setModalOpen] = useState(false);
	const modalPrimaryButtonRef = useRef();
	const modalCloseButtonRef = useRef();
	const [modalSize, setModalSize] = useState('large');

	const [marketOrder,setMarketOrder] = useState("asc");
	const [marketSort,setMarketSort] = useState('price');
	const [bagOrder,setBagOrder] = useState("asc");
	const [bagSort,setBagSort] = useState('numerical');

	const [ownerAddr, setOwnerAddr] = useState("");

	useEffect(() => {
		if(!linkedRelay){
		getListings(sdoodzorigin);
		getAddress();
		
		}
    });
	
 
  function galleryModal(Collection, NFT, source){
	setCurrentCollection(Collection)
	setCurrentNFT(NFT);
	setCurrentSource(source);
	if(NFT.txid){setCurrentListed(true)}else{setCurrentListed(false)}
	if(!modalOpen){
		//console.log(NFT);
		modalSetup()

	if (window.screen.availWidth>=800){
		setModalSize('large')
	}else{
		setModalSize('small')
	}

	setModalOpen(true);
	
	}
  }
  function modalSetup(){
	var text=[];
	//console.log(currentCollection.name);

	if(currentSource === "RX")
	{
		console.log(currentNFT)
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

							{currentListed && <div>
							<Button style=
							{{width:"100%", 
							fontSize:"1rem", 
							padding:"4px 1px 4px 1px", 
							margin:"0px 0px 0px 0px"}} 
							onClick={() => buyNFT(currentNFT.location, currentNFT.txid)}>Buy Now For: {currentNFT["satoshis"]/100000000} BSV </Button>
							
							</div>}
							<p><a href={`https://relayx.com/assets/${sdoodzorigin}/${currentNFT["location"]}`}>View on RelayX</a> -- Location: <a href={`https://whatsonchain.com/tx/${currentNFT["location"].split("_")[0]}`}>Output {currentNFT["location"].split("_")[1]}</a></p>
							
						</td>
					</tr>
					</thead>
					</table>
					
					</ModalContent>
				  </ModalBody>
				  <ModalFooter>
					<Button
					  label="Close"
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
							
							<table className="tg" >
							<thead>
							</thead>
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
							</table>
							{currentListed &&
							<Button style=
							{{width:"100%", 
							fontSize:"1rem", 
							padding:"2px 1px 2px 1px", 
							margin:"0px 0px 0px 0px"}} onClick={() => buyNFT(currentNFT.location, currentNFT.txid)}>Buy Now For: {currentNFT["satoshis"]/100000000} BSV </Button>	}
						
						
						<p className="mini"><a href={`https://relayx.com/assets/${sdoodzorigin}/${currentNFT["location"]}`}>View on RelayX</a> -- Location: <a href={`https://whatsonchain.com/tx/${currentNFT["location"].split("_")[0]}`}>Output {currentNFT["location"].split("_")[1]}</a></p>

					
					</ModalContent>
				  </ModalBody>
				  <ModalFooter>
					<Button
					  label="Close"
					  onClick={() => setModalOpen(false)}
					  priority="outline"
					  ref={modalCloseButtonRef}
					>Close</Button>
				  </ModalFooter>
				</Modal>
			  )}
			</div>
		  </>)

		  }
		}
	
	return (
	  text
	)
  }
  function timeout(delay) {
	return new Promise( res => setTimeout(res, delay) );
}
  async function buyNFT(location,txid){


	await fetch("https://staging-backend.relayx.com/api/dex/buy", {
    "credentials": "omit",
    "headers": {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site"
    },
    "body": "{\"address\":\""+ownerAddr+"\",\"location\":\""+sdoodzorigin+"\",\"txid\":\""+txid+"\"}",
    "method": "POST",
    "mode": "cors"
}).then((res) => { 
	return res.json() 
  }).then((jsonResponse) => {

	W.relayone.send(jsonResponse.data.rawtx).then((res)=>{
		if (res.txid)
		{
			timeout(1).then(()=>{
			alert("Successfully purchased "+ txid + " at " +res.txid)
			setModalOpen(false);
			getListings(sdoodzorigin);
			});
		}
	});
  });
}
async function getListings(ticker){
	//console.log(RANKS.doodz[200]);

	await fetch(`https://staging-backend.relayx.com/api/market/${ticker}/orders`, {
		"credentials": "omit",
		"headers": {
			"Accept": "application/json, text/plain, */*",
			"Accept-Language": "en-US,en;q=0.5",
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
		setOpenOrders(jsonResponse.data);
		setHasListings(true);
		//let collectibles = jsonResponse.data['collectibles'];;
	  })
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
		setOwnerAddr(jsonResponse.data);
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
		let selected = collectibles.filter(c => c.origin === sdoodzorigin);
		//console.log(selected);
		setlinkedRelay(true);
		var nfts = [];
		selected.forEach((element) => {
				nfts.push(element);
			})
		setRelayNFTs(nfts);
		setlinkedRelay(true);
		
		
	  })
	  .catch((err) => {
		console.error(err);
	  });
		
	  })
	  .catch((err) => {
		console.error(err);
	  });
}else{
	console.log("RelayX is Logged In")
}



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

function relayBuilder(){
var JSXtoReturn = [];
if (!linkedRelay){
	JSXtoReturn=(
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

	//console.log(myArray);
	JSXtoReturn=(
		<div key={`relayZone${Math.random}`}>
		<p>Howdy {rpaymail}!</p>
		<Button onClick={() => openBag()}>My Bag</Button>
		{displayBag()}
		</div>
		
	);
	
}
return JSXtoReturn;
}
function setBSort(event){
	setBagSort(event.target.value)
}
function setBOrd(event){
	setBagOrder(event.target.value);
}
function openBag(){
	if(!bagOpen){setBagOpen(true);}else{setBagOpen(false);}
}
function displayBag(){
	var JSXtoReturn = [];
	if(bagOpen){
		JSXtoReturn.push(
			<div key="its my bag">
			<h1>My Bag:</h1>
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
	//console.log(openOrders);
	
	return JSXtoReturn;
	}
}
function bagBottom(){
	var JSXtoReturn = [];
	var junk=[];

	if(bagOpen){

	var myArray = sortBy({items:relayNFTs, type:bagSort, desc:(bagOrder==="desc")});

	
	myArray.forEach(thing=>{

		
		if(thing["origin"]===(sdoodzorigin)){
			junk["name"] = "Stick D00dz";
		}
		JSXtoReturn.push(
			<div key={"galleryimg"+thing["berry"]["txid"]} className="responsive" id={"galleryimg"+thing["berry"]["txid"]}>
			<div className="gallery">
			
			<img src={"https://berry2.relayx.com/"+thing["berry"]["txid"]} alt="NFT" width="400" height="400"onClick={() => galleryModal(junk,thing,"RX")}></img>

			<div className="desc">
			<h2>{RANKS.doodz[thing["props"]["no"]].TIER}</h2>
			<p>{junk["name"]}: {thing["props"]["no"]}<br></br>{"Rank: "+RANKS.doodz[thing["props"]["no"]].RNK}</p>
			
			</div>

		</div>
		</div>
		);
	})
		}
	return JSXtoReturn;
}
function setMSort(event){
	setMarketSort(event.target.value)
}
function setMOrd(event){
	setMarketOrder(event.target.value);
}
function marketBottom(){
	var JSXtoReturn = [];
	let commonname = "Unknown Collection";
		if(openOrders["token"]["origin"]===sdoodzorigin){
			commonname="Stick D00dz";
		}

	var myArray = sortBy({items:openOrders.orders, type:marketSort, desc:(marketOrder==="desc")});
	
	myArray.forEach(thing=>{
		//console.log(thing);
		//console.log(RANKS.doodz[thing["props"]["no"]]);
		JSXtoReturn.push(
			<div key={"galleryimg"+thing["berry"]["txid"]} className="responsive" id={"galleryimg"+thing["berry"]["txid"]}>
			<div className="gallery">

			<img src={"https://berry2.relayx.com/"+thing["berry"]["txid"]} alt="NFT" width="400" height="400" onClick={() => galleryModal(openOrders["token"], thing,"RX")}></img>

			<div className="desc">
			<h2>{RANKS.doodz[thing["props"]["no"]].TIER}</h2>
			<p>{commonname+": "+thing["props"]["no"]}<br></br>{"Rank: "+RANKS.doodz[thing["props"]["no"]].RNK}<br></br></p>
			<h2>{thing["satoshis"]/100000000} BSV</h2>
			</div>

		</div>
		</div>
		);
	});	return JSXtoReturn;
	}

function marketBuilder(){
	var JSXtoReturn = [];
	if(hasListings){
		JSXtoReturn.push(
			<div key="its the market">
			<h1>Current Listings:</h1>
			<label htmlFor="marketsort">Sort By: </label>

			<select name="marketsort" id="marketsort" 
			value = {marketSort}
			onChange = {(setMSort)}
			>

			  <option value="price">Price</option>
			  <option value="numerical">Mint</option>
			  <option value="rarity">Rank</option>
			</select> 

			<label htmlFor="marketorder"> Order: </label>

			<select name="marketorder" id="marketorder" 
			value = {marketOrder} 
			onChange = {(setMOrd)}>
			  <option value="asc">Ascending</option>
			  <option value="desc">Descending</option>
			</select> 
			
			<p></p>
			{marketBottom()}
			</div>
			
		);
	//console.log(openOrders);
	
	return JSXtoReturn;
	}
}


return (
	
	<div className="idkwhat">
	{modalSetup()}
	<div key ="maingrid" className="grid-container" style={{width: 'fit-content'}}>

	<div key = "rxgal" className="grid-item" >

	{relayBuilder()}

	

	</div>
	<div key = "marketgal" className="grid-item" >
    {marketBuilder()}
	</div>

		
	</div>
	

	</div>
);
};

export default Market;

