import React from 'react';
import './profgrid.css';
const About = () => {
return (
	<div
	style={{
		display: 'flex',
		justifyContent: 'Left',
		//alignItems: 'Left',
		//height: '100vh',
		margin: '1vh'
	}}
	>
	<div className="grid-container" style={{width: 'fit-content'}}>
	<div className="grid-item">
	<h1>About Stick D00dz:</h1>
	<p>Stick D00dz is a set of 1999 generative stick figures.<br></br>
	Created by Katie G. (@HondaKat24) out of love for the BitcoinSV community.</p>
	
	<p>
		Holders of Stick D00dz are a part of the family. 
		This project is for you, the Bitcoiner that just wants to have fun with the tech. 
		We support each other in furthering the development of BitcoinSV projects, to spread awareness, 
		and to share the love.<br></br>
		Stick D00dz strives to become a positive feedback loop, where we bring one another up.
	<br></br>
	We support the community that helped us grow, so we work hard to bring value to our friends.</p>

	</div>
	</div>
	
	</div>
);
};

export default About;
