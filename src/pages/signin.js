import React, { useEffect } from 'react';

const SignIn = () => {
    useEffect(() => {
        window.location.href = "https://app.handcash.io/#/authorizeApp?appId=6375871c75b8310213222515";  
    }, []);
return (
	<div
	style={{
		display: 'grid',
        direction: 'row',
		justifyContent: 'Center',
		alignItems: 'Center',
		height: '20vh'
	}}
	>
	<h1>Please Wait</h1><br></br>
    <p>We are redirecting you to HandCash for authentication :3c</p>
	</div>
);
};

export default SignIn;
