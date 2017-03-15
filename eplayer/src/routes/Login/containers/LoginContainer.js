import { connect } from 'react-redux';
import {fetch,storeLoginDetails} from '../modules/loginAction';
import LoginPage from '../components/LoginPage';

const mapDispatchToProps = {
  fetch,
  storeLoginDetails
};

const mapStateToProps = state => ({	
fetching: state.login.fetching ? state.login.fetching : {},
fetched: state.login.fetched ? state.login.fetched : {}, 
error: state.login.error ? state.login.error : {},
data:state.login.data ? state.login.data : {}
});


export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);


