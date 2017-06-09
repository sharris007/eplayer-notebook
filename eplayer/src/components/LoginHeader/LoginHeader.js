import React from 'react';
// import ReactDOM from 'react-dom';
import './LoginHeader.css';


class LoginHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    /* eslint-disable */
    return (
      <div className="App">
        <div className="App-header">
          <img src={require('./images/pearson-logo.png')} className="pearson" alt="pearson logo" /> 
          <img src={require('./images/Always-learning.png')} className="tagline" alt="pearson tagline" />
        </div>
      </div>
    );
    /* eslint-enable */
  }
}
export default LoginHeader;
