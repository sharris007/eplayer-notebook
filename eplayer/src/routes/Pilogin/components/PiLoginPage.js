/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *   
 *  *  Copyright © 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  * 
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software 
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
/* global sessionStorage ,piSession */
import React from 'react'; /* Importing the react library, for using the react methods and keywords.*/
// import ReactDOM from 'react-dom';/* Importing the reactDom library for rendering the react element. */
import { browserHistory } from 'react-router';/* Import the react-router for routing the react component. */
import CircularProgress from 'material-ui/CircularProgress';/* Import the CircularProgress for adding the progressBar. */
import { addLocaleData } from 'react-intl';

// import LoginHeader from '../../../components/LoginHeader'; /* Adding the LoginHeader for login page header.*/
import './PiLoginPage.css'; /* Adding the login css. */
// import reducer from '../modules/loginReducer';/* Injecting the reducers for login. */

class PiLoginPage extends React.Component {
    /* constructor and super have used in class based React component,
   used to pass props for communication with other components. */
  constructor(props) {
    super(props);
    this.state = { 
      loginname: '',
      password: '' 
    };
    if(piSession){
      let appPath             = window.location.origin;
      let redirectCourseUrl   = appPath+'/eplayer/bookshelf';
      redirectCourseUrl       = decodeURIComponent(redirectCourseUrl).replace(/\s/g, "+").replace(/%20/g, "+");
      piSession.getToken(function(result, userToken){
        if(result === 'success'){
          localStorage.setItem('secureToken',userToken);
          browserHistory.push('/eplayer/bookshelf');
        }else if(result === 'unknown' || result === 'notoken' ){
           piSession.login(redirectCourseUrl, 10);
        }
      }); 
    }
  }
  render() {
    return (<div></div>);
  }
}
/* propTypes used for communication to child Component that which props are present in Parent Component*/
/* eslint-disable */
PiLoginPage.propTypes = {
  fetch: React.PropTypes.func,
  fetched: React.PropTypes.any,
  data: React.PropTypes.object,
  error: React.PropTypes.any,
  fetching: React.PropTypes.any
};
/* eslint-enable */
export default PiLoginPage;
