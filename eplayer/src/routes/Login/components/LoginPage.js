import React from 'react'; /* Importing the react library, for using the react methods and keywords.*/
import ReactDOM from 'react-dom';/* Importing the reactDom library for rendering the react element. */
import { browserHistory } from 'react-router';/* Import the react-router for routing the react component. */
import CircularProgress from 'material-ui/CircularProgress';/* Import the CircularProgress for adding the progressBar. */
import LoginHeader  from '../../../components/LoginHeader'; /* Adding the LoginHeader for login page header.*/
import './LoginPage.css'; /*Adding the login css. */
import reducer from '../modules/loginReducer';/* Injecting the reducers for login. */
import { intlShape,addLocaleData } from 'react-intl';   
import languageName from '../../../../locale_config/configureLanguage';   
import {languages} from '../../../../locale_config/translations/index';   
var launguageid,locale,langQuery;   
const url=window.location.href;   
var n=url.search("languageid");   
if(n>0)   
{   
  var urlSplit=url.split("languageid=")   
  languageid = Number(urlSplit[1]);   
}   
else    
{   
  var languageid =1;    
}   
langQuery="?languageid=" + String(languageid);    
locale=languageName(languageid);    
let localisedData=locale.split('-')[0];   
addLocaleData((require(`react-intl/locale-data/${localisedData}`)));    
const {messages}=languages.translations[locale];

class LoginPage extends React.Component{
    /* constructor and super have used in class based React component, 
   used to pass props for communication with other components. */
    constructor(props) {
    super(props);
    this.state = {loginname: '',
     password: ''};
    this.handleChange = this.handleChange.bind(this); /* We have bind handleChange method with react component, without binding event handler will not be called. */
    this.handleSubmit = this.handleSubmit.bind(this); /* We have bind handleSubmit method with react component, without binding event handler will not be called. */
  }
   
   //Craeted a handleChange method with event argument.
   handleChange(event) {
    /* Any change in the store 'setState' method reload the changes by calling the render() method agian. */
    this.setState({[event.target.name]: event.target.value}); 

   }
  
  /* When user click for submitting the Login form. */
  handleSubmit(event) {
     this.setState({className: 'formClass'});
    event.preventDefault();
    console.log(this.state.loginname +" "+this.state.password);
    /* Method for calling the Rest Api for login with passing credientails. */
    this.props.fetch(this.state.loginname, this.state.password)
    .then(() => {
      const LoginToken = [];
      const loginPiToken = [];
      const firstName = [];
      const lastName = [];
      if (this.props.fetched){
        LoginToken.push(this.props.data.token);
        /* SessionStorage used for storing the data in session. */
        sessionStorage.setItem('identityId',this.props.data.identityId);
        sessionStorage.setItem('sessionid', this.props.data.token);
        loginPiToken.push(this.props.data.piToken);
        sessionStorage.setItem('piToken',this.props.data.piToken);
        firstName.push(this.props.data.firstName);
        sessionStorage.setItem('firstName',this.props.data.firstName);
        lastName.push(this.props.data.lastName);
        sessionStorage.setItem('lastName',this.props.data.lastName);
        /* BrowserHistory used for navigating the user to bookself page. */
        browserHistory.push(`/eplayer/bookshelf${this.props.location.search}`);
          }
    })
    
  }
  /* Method used for defining any method or variable before mounting. */
  componentWillMount() { 

  }
   /* Method used for defining any method or variable after mounting. */
  componentDidMount() {};
    /* render() method used for changing the view and whenever store gets update it will also update the view. */ 
     render() {
      if(this.props.error== true)
        {
            this.state.className = '';
        }
        /* In return, we have called multiple methods with event handlers, like onChange, onSubmit. 
        Also we have written JSX code inside return which will be responsible for view layer.*/
       return (<div className="login-wrapper">
        <LoginHeader/>
        <div className="form-container">
          <form onSubmit={this.handleSubmit} className={this.state.className}>
            <div className="form-group">
              <label>{messages.Username}</label>
              <input type="text" name='loginname' value={this.state.value} onChange={this.handleChange} required />
            </div>
            <div className="form-group">
              <label>{messages.Password}</label>
              <input type="password" name='password' onChange={this.handleChange}  required />
              {this.props.error == true ? <p className="errorClass">{messages.errorMessage}</p> : null}
            </div>
            <button type="submit"  className="form_button">{messages.SignIn}</button>
          </form>          
          {this.props.fetching == true ? <CircularProgress style={{ margin: '40px auto', display: 'block' }} /> : null}
          
        </div>
        </div>);
     }
}
/* propTypes used for communication to child Component that which props are present in Parent Component*/
LoginPage.propTypes = {
 
}
export default LoginPage
