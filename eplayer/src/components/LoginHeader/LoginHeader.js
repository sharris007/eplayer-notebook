import React from 'react';
import ReactDOM from 'react-dom';
import './LoginHeader.css'


class LoginHeader extends React.Component{
	render(){
		
		return(
   <div className="App">

        <div className="App-header">
          <img src={require("./images/pearson-logo.png")} className="pearson"  />
          <img src={require("./images/Always-learning.png")} className="tagline" />

       </div>
       </div>
			);
 

	}
}
export default LoginHeader
