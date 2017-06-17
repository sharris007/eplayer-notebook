/* global sessionStorage localStorage */
import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { browserHistory } from 'react-router';

import Icon from '../Icon';
import './BookshelfHeader.scss';

const style = {
  raisedButton: {
    width: '130px',
    height: '36px',
    textAlign: 'left',
    label: {
      height: '18px',
      fontFamily: 'Open Sans',
      fontSize: '13px',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      color: '#252525',
      textTransform: 'none'
    }
  }
};


export class BookshelfHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueSingle: 1
    };
  }

  handleChangeSingle = (event, value) => {
    this.setState({
      valueSingle: value
    });
  };
  onClick = () => {
    const langQuery = sessionStorage.getItem('bookshelfLang');
    let i = sessionStorage.length;
    while (i--) {
      const key = sessionStorage.key(i);
      if ((key)) {
        sessionStorage.removeItem(key);
      }
    }
    const storagAarr = [];
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).indexOf('bookId') === 0) {
        storagAarr.push(localStorage.key(i));
      }
    }
    for (let i = 0; i < storagAarr.length; i++) {
      localStorage.removeItem(storagAarr[i]);
    }
    if (langQuery && langQuery !== '?languageid=1') {
      browserHistory.push(`/eplayer/login${langQuery}`);
    } else {
      piSession.logout();
      let appPath             = window.location.origin;
      let redirectCourseUrl   = appPath+'/eplayer/bookshelf';
      redirectCourseUrl       = decodeURIComponent(redirectCourseUrl).replace(/\s/g, "+").replace(/%20/g, "+");
      localStorage.removeItem('secureToken');
      piSession.login(redirectCourseUrl);
      //browserHistory.push('/eplayer/login');
    }
    // this.props.logout();
  }

  render() {
    return (
       /* eslint-disable */
      <div className="bookshelfHeader">
        <div>
          <div className="logo" />
          <span className="rightComp">
            <span className="label">
              {this.props.firstName && this.props.lastName ? `${this.props.firstName} ${this.props.lastName}` : 'Addie Learnerbee'}
            </span>
            <span className="dropdown"><Icon name="dropdown-open-18" /></span>
          </span>
        </div>
        <div className="signoutBtn">
          <RaisedButton
            label={this.props.messages.signOutBtn}
            buttonStyle={style.raisedButton}
            labelStyle={style.raisedButton.label}
            onClick={this.onClick}
          />
        </div>
        <div className="title">{this.props.messages.myBookshelf}</div>
      </div>
      /* eslint-enable */
    );
  }
}
BookshelfHeader.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  messages: PropTypes.object
};
export default BookshelfHeader;
