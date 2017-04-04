import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
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

  render() {
    return (
      <div className="bookshelfHeader">
        <div>
          <div className="logo" />
          <span className="rightComp">
            <span className="label">{this.props.userName ? this.props.userName : 'Addie Learnerbee'}</span>
            <span className="dropdown"><Icon name="dropdown-open-18" /></span>
          </span>
        </div>
        <div className="signoutBtn">
          <RaisedButton
            label="Sign out"
            buttonStyle={style.raisedButton}
            labelStyle={style.raisedButton.label}
          />
        </div>
        <div className="title">My Bookshelf</div>
      </div>
    );
  }
}

export default BookshelfHeader;
