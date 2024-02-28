import React from 'react';
import logo from '../../logo trans.png';
import hcimg from '../../hc.png';
import {
Nav,
NavLink,
HomeLink,
Bars,
NavMenu,
NavBtn,
NavBtnLink,
NavBtnLink2,
Head,
} from './NavbarElements';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
var hasFlipped = "False";

function openNav(){
	if (hasFlipped === "True") {
		document.getElementById("nav").style.display = "none";
		hasFlipped = "False";
	}
	else if(hasFlipped === "False"){
		document.getElementById("nav").style.display = "inline-block";
		hasFlipped = "True";
	}
}
function closeNav(){
	if (hasFlipped === "True") {
		document.getElementById("nav").style.display = "none";
		hasFlipped = "False";
	}else{
        document.getElementById("nav").style.display = "flex";
		hasFlipped = "False";
    }


}


const Navbar = () => {
if (cookies.get('authToken')){
    return (
        <>
        <Nav >
            <Head><HomeLink to='/'><img id="logoimage" src={logo} className="logo" alt="" /></HomeLink></Head>
            <Bars id={"hamburger"} onClick={openNav}/> 
            <NavMenu id={"nav"}>
            <NavLink to='/' onClick={closeNav}> 
                Home
            </NavLink>

            
            <NavLink to='/profile' onClick={closeNav}>
                Profile
            </NavLink>
            
            <NavLink to='/chat' onClick={closeNav}>
                Chat
            </NavLink>


            <NavLink to='/market' onClick={closeNav}>
                Market
            </NavLink>
            <NavLink to='/about' onClick={closeNav}>
                About
            </NavLink>
            <NavBtn>
            <NavBtnLink2 to='/sign-out' onClick={closeNav}>Log Out</NavBtnLink2>
            </NavBtn>
            


            </NavMenu>
            

        </Nav>
        </>
    );
}else{
    return (
        <>
        <Nav > 
        <Head><HomeLink to='/'><img id="logoimage" src={logo} className="logo" alt="" /></HomeLink></Head>
            <Bars id={"hamburger"} onClick={openNav}/>
            <NavMenu id={"nav"}>
            <NavLink to='/' onClick={closeNav}>
                Home
            </NavLink>
            <NavLink to='/market' onClick={closeNav}>
                Market
            </NavLink>
            <NavLink to='/about' onClick={closeNav}>
                About
            </NavLink>
            {/* Second Nav */}
            {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
            <NavBtn>
            <NavBtnLink to='/sign-in' onClick={closeNav}><img id="hcimage" className="hcimg" src={hcimg}  alt="" /></NavBtnLink>
            </NavBtn>
            </NavMenu>
            
        </Nav>
        </>
    );
}

};

export default Navbar;
