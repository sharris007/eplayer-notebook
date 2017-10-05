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
import React from 'react'; /* Importing the react library, for using the react methods and keywords.*/
// import ReactDOM from 'react-dom';/* Importing the reactDom library for rendering the react element. */
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Cookies from 'universal-cookie';
import { browserHistory } from 'react-router';
import { eT1Contants } from '../../../components/common/et1constants';

class PdfBookErrorPage extends React.Component {
    /* constructor and super have used in class based React component,
   used to pass props for communication with other components. */
  constructor(props) {
    super(props);
    const cookies = new Cookies();
    let i = localStorage.length;
    while (i--) {
      const key = localStorage.key(i);
      if ((key)) {
        localStorage.removeItem(key);
      }
    }
    try
    {
        piSession.logout();  
    }
    catch(e)
    {}
    cookies.remove('ReactPlayerCookie',{ path: '/' });
    this.state = {
      open: true,
    };
  }
  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
    browserHistory.push('/eplayer/');
  };
  
  render() {
   const actions = [
       <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];
   const errorCode = this.props.location.query.errorcode;
   const errorMessage = eT1Contants.ErrorCodeMessages['Error_'+errorCode];
    return (
      <div>
        <Dialog
          title="Error!"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
        {errorMessage}
        </Dialog>
      </div>
    );
  }
}

export default PdfBookErrorPage;
