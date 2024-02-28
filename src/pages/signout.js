import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const SignOut = () => {
	useEffect(() => {
		cookies.remove('authToken');
        window.location.href = "/";  
    }, []);
return (
	<div
	style={{
		display: 'flex',
		justifyContent: 'Center',
		alignItems: 'Center',
		height: '100vh'
	}}
	>
	<h1>Signing Out! Seeya!</h1>
	</div>
);
};

export default SignOut;
