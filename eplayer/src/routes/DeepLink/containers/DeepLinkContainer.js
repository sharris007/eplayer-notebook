import { connect } from 'react-redux'; /* Importing the react-redux library, connect method for connecting the react and redux-store. */
import { injectIntl } from 'react-intl';

import {doTokenLogin} from '../modules/deepLinkActions';
import DeepLink from '../components/DeepLink';



const mapDispatchToProps = {
  doTokenLogin 
};

/* mapStateToProps method used for connecting the state from the store to corresponding props,
to access your reducer state objects from within your React components. */

const mapStateToProps = state => ({
  DEEPLINK: state
});


export default connect(mapStateToProps, mapDispatchToProps)(DeepLink);