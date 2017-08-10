// import { clients } from '../../../components/common/client'; /* Importing the client file for framing the complete url, since baseurls are stored in client file. */
import axios from 'axios'; /* axios is third party library, used to make ajax request. */
import { resources, domain } from '../../../../const/Settings';
import {getSiteId} from '../../../components/Util/Util';

const security = (resources.constants.secureApi === true ? 'eTSecureServiceUrl' : 'etextServiceUrl');
const etextService = resources.links[security];
const envType = domain.getEnvType();
/* Defining the Rest Api url. */
const urlLogin = `${etextService[envType]}/account/login?withIdpResponse=true&chk_old=true&is_stand=true`;
// console.log('urlLogin'+urlLogin);
/* Method for fetcing the login details from Rest Api by passing the data username and password. */
export const fetch = (userName, userPassword) => {
  var siteID =  getSiteId(envType);
  const request = axios({
    method: 'post',
    url: urlLogin,
    header: { 'Content-Type': 'application/json' },
    data: {
      contextId: siteID,
      userName,
      password: userPassword
    }
  });
  return {
    type: 'LOGIN',
    payload: request
  };
};
