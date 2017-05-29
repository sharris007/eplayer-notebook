import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import LoginHeader  from '../../../components/LoginHeader';
import './LoginPage.css';
import reducer from '../modules/loginReducer';


class LoginPage extends React.Component{
    constructor(props) {
    super(props);
    this.state = {loginname: '',
     password: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

   handleChange(event) {
    this.setState({[event.target.name]: event.target.value});

   }
  
 
  handleSubmit(event) {
     this.setState({className: 'formClass'});
    //alert('A name was submitted: ' + this.state.value);
    //alert('A password was submitted: ' + this.input.value);
    event.preventDefault();
    console.log(this.state.loginname +" "+this.state.password);
    this.props.fetch(this.state.loginname, this.state.password)
    .then(() => {
      const LoginToken = [];
      const loginPiToken = [];
      const firstName = [];
      const lastName = [];
      if (this.props.fetched){
        LoginToken.push(this.props.data.token);
        sessionStorage.setItem('identityId',this.props.data.identityId);
        sessionStorage.setItem('sessionid', this.props.data.token);
        loginPiToken.push(this.props.data.piToken);
        sessionStorage.setItem('piToken',this.props.data.piToken);
        firstName.push(this.props.data.firstName);
        sessionStorage.setItem('firstName',this.props.data.firstName);
        lastName.push(this.props.data.lastName);
        sessionStorage.setItem('lastName',this.props.data.lastName);
        piSession.autologin(this.state.loginname, this.state.password,'vGZ2o5WhK7XTy9ovNwtj1aBZhnOAASYb',window.location.origin+"/eplayer/bookshelf");
        // browserHistory.push(`/eplayer/bookshelf`);
          }
    })
    
  }
  componentWillMount() { 

  }
  componentDidMount() {};
  
     render() {
      if(this.props.error== true)
        {
            this.state.className = '';
        }
       return (<div className="login-wrapper">
        <LoginHeader/>
        <div className="form-container">
          <form onSubmit={this.handleSubmit} className={this.state.className}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" name='loginname' value={this.state.value} onChange={this.handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name='password' onChange={this.handleChange}  required />
              {this.props.error == true ? <p className="errorClass">{this.props.errorMessage}</p> : null}
            </div>
            <button type="submit"  className="form_button">Sign In</button>
          </form>          
          {this.props.fetching == true ? <CircularProgress style={{ margin: '40px auto', display: 'block' }} /> : null}
          
        </div>
        </div>);
     }
}
LoginPage.propTypes = {
 // loginState: React.PropTypes.object,
 // fetching: React.PropTypes.object, 
 // fetched: React.PropTypes.object, 
 // error: React.PropTypes.object,
 // data:React.PropTypes.object
 //storeLoginToken:React.PropTypes.func 
}
export default LoginPage