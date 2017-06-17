// import { clients } from '../../../components/common/client'; /* Importing the client file for framing the complete url, since baseurls are stored in client file. */
import axios from 'axios'; /* axios is third party library, used to make ajax request. */
import { resources, domain } from '../../../../const/Settings';

const security = (resources.constants.secureApi === true ? 'eTSecureServiceUrl' : 'etextServiceUrl');
const etextService = resources.links[security];
const envType = domain.getEnvType();
/* Defining the Rest Api url. */
const urlLogin = `${etextService[envType]}/account/login?withIdpResponse=true&chk_old=true&is_stand=true`;
// console.log('urlLogin'+urlLogin);
/* Method for fetcing the login details from Rest Api by passing the data username and password. */
export const fetch = (userName, userPassword) => {
  const request = axios({
    method: 'post',
    url: urlLogin,
    header: { 'Content-Type': 'application/json' },
    data: {
      contextId: '11444',
      userName,
      password: userPassword
    }
  });
  return {
    type: 'LOGIN',
    payload: request
  };
};

/* Method for storing the Login Details. */
export const storeLoginDetails = data => ({
  type: 'LOGIN_DETAILS',
  data
});
