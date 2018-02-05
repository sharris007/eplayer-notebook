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
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { resources , domain , typeConstants } from '../../../../const/Settings';
import { connect } from 'react-redux';

// import LoginHeader from '../../../components/LoginHeader'; /* Adding the LoginHeader for login page header.*/
// import reducer from '../modules/loginReducer';/* Injecting the reducers for login. */

class ErrorPage extends React.Component {
    /* constructor and super have used in class based React component,
   used to pass props for communication with other components. */
  constructor(props) {

    super(props);
    this.state = {
      open: true,
    };
     
  }
  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
    const redirection = resources.links.consoleUrl[domain.getEnvType()];
    window.location = redirection;
  };
  
  render() {
     // CourseSection to Student enrollment is not found <br/><br/>(OR)<br/><br/>
     // Productcode is not found in ETEXT for this CourseSection
     const { bookdetailsdata } = this.props;
   const actions = [
       <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];
    let modalContent;
    if( bookdetailsdata.status === 403 ){
      modalContent = true;
    }
    return (
    <div>
      {(bookdetailsdata.status === 403) ? <div>
            <Dialog
          title="Unauthorized to Access Resources"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
         <div>You are not authorized to request this resource. You may see this message if you try to access a recently created course or follow a link to a course where you are not enrolled. Go to the My Courses list and try again. If this issue persists and you believe you should have access to this resource, please contact support with following information:</div>
         <div className="error-response">{JSON.stringify(bookdetailsdata)}</div>
          </Dialog>
          </div> : <div>
        <Dialog
          title="1001 - Error while processing your request"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
         Please contact support team with this error
          </Dialog>
        </div>
      }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    bookdetailsdata: state.playlistReducer.bookdetailsdata
  }
}; // eslint-disable-line max-len
ErrorPage = connect(mapStateToProps)(ErrorPage);
export default ErrorPage;
