import styled from 'styled-components';

export const buttonTheme = {
	purple: {
		default: "#8624bf",
		hover: "#691699"
	},
	red: {
		default: "#fc1b1b",
		hover: "#cc1818"
	},
	blue: {
	  default: "#3f51b5",
	  hover: "#283593"
	},
	pink: {
	  default: "#e91e63",
	  hover: "#ad1457"
	}
  };
  
 export const Button = styled.button`
	background-color: ${(props) => buttonTheme[props.theme].default};
	color: white;
	padding: 5px 15px;
	border-radius: 5px;
	border-color: black;
	outline: 0;
	text-transform: uppercase;
	margin: 10px 0px;
	cursor: pointer;
	box-shadow: 0px 2px 2px darkviolet;
	transition: ease background-color 250ms;
	&:hover {
	  background-color: ${(props) => buttonTheme[props.theme].hover};
	}
	&:disabled {
	  cursor: default;
	  opacity: 0.7;
	}
  `;

  export const ScrollButton = styled.button`
  background-color: ${(props) => buttonTheme[props.theme].default};
  top:0;
  right: 0;
  color: white;
  border-color: black;
  border-radius: 50px;
  outline: 0;
  text-transform: uppercase;
  margin: 0px 0px;
  z-index:5;
  display:flex;
  position:absolute;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;

	@media screen and (min-width: 800px){ 
		line-height: 0px;
		text-align:center;
		vertical-align:middle;
		font-size:3rem;
		width:75px;
		height: 75px;
		padding: 15px;
		padding-top: 35px;
		transform: translate(-100%, 275%);
		
	}
	@media screen and (max-width: 800px){ 
		text-align:center;
		vertical-align:middle;
		line-height: 0px;
		width:50px;
		height: 50px;
		font-size:1.75rem;
		padding: 1.4rem 0.5rem;
		transform: translate(-25%, 315%);
	}
  &:hover {
	background-color: ${(props) => buttonTheme[props.theme].hover};
  }
  &:disabled {
	cursor: default;
	opacity: 0.7;
  }
`;
export const HeaderButton = styled.button`
  background-color: ${(props) => buttonTheme[props.theme].default};
  top:0;
  right: 0;
  color: white;
  border-color: black;
  border-radius: 50px;
  outline: 0;
  text-transform: uppercase;
  margin: 0px 0px;
  z-index:5;
  display:flex;
  position:absolute;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;

	@media screen and (min-width: 800px){ 
		line-height: 0px;
		text-align:center;
		vertical-align:middle;
		font-size:2.5rem;
		width:75px;
		height: 75px;
		padding: 15px;
		padding-top: 30px;
		transform: translate(-100%, 150%);
		
	}
	@media screen and (max-width: 800px){ 
		text-align:center;
		vertical-align:middle;
		line-height: 0px;
		width:50px;
		height: 50px;
		font-size:1.75rem;
		padding: 1.4rem 0.5rem;
		transform: translate(-25%, 195%);
	}
  &:hover {
	background-color: ${(props) => buttonTheme[props.theme].hover};
  }
  &:disabled {
	cursor: default;
	opacity: 0.7;
  }
`;
/*
  z-index:5;
  display:flex;
  top:0;
  right: 0;
  position:absolute;
  padding: 5px 10px;
  line-height: 0px;
  padding: 0px 0px;
  padding-top: 0.5rem;
  padding-bottom: 1.2rem;
*/
export const SendButton = styled.button`
  background-color: ${(props) => buttonTheme[props.theme].default};
  
 
  color: white;
  
  text-align:center;
 
  border-radius: 50px;
  border-color: black;
  outline: 0;
  text-transform: uppercase;
  margin: 0px 5px;
  
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
	@media screen and (min-width: 800px){ 
		
		font-size:2.5rem;
		width:100px;
		height:50px;
		line-height: 0px;
	
		
		vertical-align:0px;
		

		transform: translate(-0%, 0%);
	}
	@media screen and (max-width: 800px){ 
		font-size:2rem;
		transform: translate(-0%, 0%);
		width:50px;
		padding-left:5px;
	}
  &:hover {
	background-color: ${(props) => buttonTheme[props.theme].hover};
  }
  &:disabled {
	cursor: default;
	opacity: 0.7;
  }
`;

export const EmoButton = styled.button`
  background-color: ${(props) => buttonTheme[props.theme].default};
  
 
  color: white;
  
  text-align:center;
 
  border-radius: 50px;
  border-color: black;
  outline: 0;
  text-transform: uppercase;
  margin: 0px 5px;
  
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
	@media screen and (min-width: 800px){ 
		
		font-size:2.3rem;
		width:100px;
		height:50px;
		line-height: 0px;

		vertical-align:0px;
		

		transform: translate(-0%, 0%);
	}
	@media screen and (max-width: 800px){ 
		font-size:2rem;
		transform: translate(-0%, 0%);
		width:50px;
		padding-left:5px;
	}
  &:hover {
	background-color: ${(props) => buttonTheme[props.theme].hover};
  }
  &:disabled {
	cursor: default;
	opacity: 0.7;
  }
`;
  
  Button.defaultProps = {
	theme: "purple"
  };

  ScrollButton.defaultProps = {
	theme: "purple"
  };
  SendButton.defaultProps = {
	theme: "purple"
  };
EmoButton.defaultProps = {
	theme: "purple"
  };
  HeaderButton.defaultProps = {
	theme: "purple"
  };