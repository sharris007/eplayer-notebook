import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Icon from '../Icon';
import './BookshelfHeader.scss';
import { browserHistory } from 'react-router';

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
    var langQuery=sessionStorage.getItem('bookshelfLang');
    var i = sessionStorage.length;
    while(i--) {
      var key = sessionStorage.key(i);
      if((key)) {
        sessionStorage.removeItem(key);
      }  
    }
    const storagAarr = [];
    const localStorageLength = localStorage.length;
    for (let i = 0; i < localStorage.length; i++){
        if (localStorage.key(i).indexOf('bookId') == 0 ) {
            storagAarr.push(localStorage.key(i));
        }
    }
    for (let i = 0; i < storagAarr.length; i++) {
      localStorage.removeItem(storagAarr[i]);
    }
    if(langQuery != "?languageid=1")
    {
      browserHistory.push(`/eplayer/login` + langQuery);  
    }
    else
    {
      browserHistory.push(`/eplayer/login`);
    }
    //this.props.logout();
  }

  render() {
    return (
      <div className="bookshelfHeader">
        <div>
          <div className="logo" />
          <span className="rightComp">
            <span className="label">{this.props.firstName&&this.props.lastName ? this.props.firstName+' '+this.props.lastName : 'Addie Learnerbee'}</span>
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
    );
  }
}

export default BookshelfHeader;
