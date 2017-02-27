import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { darkBlack, fullBlack } from 'material-ui/styles/colors';

import Bookshelf from './Bookshelf';

const muiTheme = getMuiTheme({
  palette: {    
    textColor: darkBlack,    
    shadowColor: fullBlack
  }
});

class ComponentOwner extends React.Component {
  constructor(props) {
    super(props);
  }

  getChildContext() {
    return {
      muiTheme: muiTheme
    };
  }

  render() {    
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Bookshelf
          books={this.props.books}
          onBookClick={this.props.onBookClick} />
      </MuiThemeProvider>
    )
  }
}

ComponentOwner.childContextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context
