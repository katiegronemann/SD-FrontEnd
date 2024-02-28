import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Head = styled.h1`
@media screen and (max-width:800px){ 
	display: block;
	position: absolute;

	top: 0;
	left: 0;
	transform: translate(20%, -5%);
	margin-top: 1.2rem;
	
	cursor: pointer;
}
@media screen and (min-width:800px){ 
	display: flex;
	margin-left: 1rem;
	margin-top: 1rem;
	font-size: 1.8rem;
	cursor: pointer;
}
`;

export const Nav = styled.nav`
background: #9013FE;
height: 85px;
transition: all 0.2s ease-in-out;
display: flex;
justify-content: space-between;
padding: 0.2rem calc((100vw - 1000px) / 2);
z-index: 12;
/* Third Nav */
/* justify-content: flex-start; */
`;
//
export const NavLink = styled(Link)`
color: #A0A0A0;
font-weight: bold;
transition: all 0.2s ease-in-out;
display: flex;
align-items: center;
text-decoration: none;
padding: 0 1rem;
height: 100%;
cursor: pointer;
@media screen and (min-width: 800px){ 
	font-size: 1.8rem;
}
@media screen and (max-width: 800px){ 
	font-size: 1rem;
	background: #9013FE;
	border-width:0.2rem;
	border-bottom-style: dashed;
	border-right-style: dashed;
	border-color: #5C0EA0;
}
&.active {
	
	color: #FFFFFF;
}
`;
export const HomeLink = styled(Link)`

transition: all 0.2s ease-in-out;

cursor: pointer;
@media screen and (min-width: 800px){ 

}
@media screen and (max-width: 800px){ 

	background: #9013FE;


}
&.active {
	
	color: #FFFFFF;
}
`;

export const Bars = styled(FaBars)`
display: none;
color: #A0A0A0;
@media screen and (max-width:800px){ 
	display: block;
	position: absolute;
	top: 0;
	right: 0;
	transform: translate(-50%, 50%);
	font-size: 2.5rem;
	cursor: pointer;
}
`;

export const NavMenu = styled.div`
display: flex;
align-items: center;
margin-right: 24px;
transition: all 0.2s ease-in-out;
/* Second Nav */
/* margin-right: 24px; */

white-space: nowrap; */
@media screen and (min-width: 800px){ 
	font-size: 1.8rem;
	position: absolute;
	display: flex;
}
@media screen and (max-width: 800px){ 
	font-size: 1rem;
	display: none;
	position: relative;
	max-width: 10rem;
	z-index:5;
	transform: translate(0%, 100%);

}
`;

export const NavBtn = styled.nav`
display: flex;
align-items: center;
margin-right: 24px;
transition: all 0.2s ease-in-out;
/* Third Nav */
/* justify-content: flex-end;
width: 100vw; */
@media screen and (min-width: 800px){ 
	font-size: 1.8rem;
}
@media screen and (max-width: 800px){ 
	font-size: 1rem;
	
	
}
`;

export const NavBtnLink = styled(Link)`
border-radius: 4px;
background: #1cf567;
padding: 10px 22px;
color: #FFFFFF;
outline: none;
border: none;
cursor: pointer;
transition: all 0.2s ease-in-out;
text-decoration: none;
font-weight: bold;

/* Second Nav */
margin-left: 24px;
@media screen and (min-width: 800px){ 
	font-size: 1.8rem;
}
@media screen and (max-width: 800px){ 
	font-size: 1rem;
	translate: -5% 10%;
	
}
&:hover {
	transition: all 0.2s ease-in-out;
	background: #71ffa3;
	color: #808080;
}
`;

export const NavBtnLink2 = styled(Link)`
border-radius: 4px;
background: #FF0500;
padding: 10px 22px;
color: #FFFFFF;
outline: none;
border: none;
cursor: pointer;
transition: all 0.2s ease-in-out;
text-decoration: none;
font-weight: bold;
font-size: 1.8rem;
/* Second Nav */
margin-left: 24px;
@media screen and (min-width: 0px){ 
	font-size: 1.8rem;
}
@media screen and (max-width: 800px){ 
	font-size: 1rem;
}
&:hover {
	transition: all 0.2s ease-in-out;
	background: #fff;
	color: #808080;
}
`;
