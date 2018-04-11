import { connect } from 'react-redux'; /* Importing the react-redux library, connect method for connecting the react and redux-store. */
import { injectIntl } from 'react-intl';


import { loadState } from '../../../localStorage';


import {doTokenLogin} from '../modules/bookshelfActions';
import BookshelfPage from '../components/Bookshelf';



const mapDispatchToProps = {
  doTokenLogin 
};

/* mapStateToProps method used for connecting the state from the store to corresponding props,
to access your reducer state objects from within your React components. */

const mapStateToProps = state => ({
  DEEPLINK: state
});


export default connect(mapStateToProps, mapDispatchToProps)(BookshelfPage);