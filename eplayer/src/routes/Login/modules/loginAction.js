import { clients } from '../../../components/common/client';
import axios from 'axios';


const urlLogin = "https://etext-qa-stg.pearson.com:443/api/nextext-api/v1/api/account/login?chk_old=true&withIdpResponse=true";

 

export const fetch = (userName,userPassword) => {
	//alert(userName);
	const request = axios({
			  method: 'post',
			  url: urlLogin,
			  header:{'Content-Type':'application/json'},
			  data: {
			    "contextId": "11444",
			    "userName": userName,
			    "password": userPassword
			  }
      });
      return{
      	type: 'LOGIN',
		payload: request
      }			  
	
};

export const storeLoginDetails = (data) => {
  return {
    type: 'LOGIN_DETAILS',
    data: data
  }
};
