import { connect } from 'react-redux';/* Importing react-redux library for connect method which is used for connecting the react with redux store. */
import {fetch,storeLoginDetails} from '../modules/loginAction';/* Importing the action creator from reducer to container. */
import LoginPage from '../components/LoginPage';/* Importing LoginPage component for connecting purpose. */

/* Method  from react-redux library provides a convenient way to dispatch function of your store. */
const mapDispatchToProps = {
  fetch,
  storeLoginDetails
};

/* Method from react-redux library provides a convenient way to access your redux-state. */
const mapStateToProps = state => ({	
fetching: state.login.fetching ? state.login.fetching : {},
fetched: state.login.fetched ? state.login.fetched : {}, 
error: state.login.error ? state.login.error : {},
data:state.login.data ? state.login.data : {},
errorMessage: state.login.errorMessage ? state.login.errorMessage : {},
});

/* Connent Method used for connecting the component with redux-store. */
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);


