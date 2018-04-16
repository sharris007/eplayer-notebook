import _ from 'lodash';
import { browserHistory } from 'react-router';

const localStorageKey = 'currentUser';

export default class DeepLinkService {
  
  static getParams() {
    let params = new URL(window.location.href).searchParams;
    return {
			serviceUrl:   params.get("serviceUrl"),
            smsTicket:    params.get("key"),
            rumbaTicket:  params.get("ticket"),
            bookId:       params.get("b"),
            pageNo:       params.get("p"),
            idpName:      params.get("idpName"),
            platforms_id: params.get("platforms_id"),
            contextId:    params.get("contextId"),
            smsUserId:    params.get("smsUserId"),
            courseName:   params.get("courseName"),
            role:         params.get("role")
	  };	
  }

  static getSessionLength(){
    return 1*60*60; // 1 hour
  }

  static checkErrorNavigation(qparams) {
    if (!qparams.idpName || !qparams.platforms_id ) {
      browserHistory.replace('**********************Empty parameter msg********************************'); // error Login
      return true;
    } else if(!qparams.bookId) {
      browserHistory.replace('**********************Empty bookId msg********************************'); // error Login
      return true;
    } else if(!qparams.smsTicket) {
      browserHistory.replace('**********************Empty SMSTkt msg********************************'); // error Login
      return true;
    }
    return false
  }  

  static getUrlString(qparams) { 
    const deleteParams = ['b','p','key','ticket', 'isPrintPage'];
    let redirectUrl = `/eplayer/ETbook/${qparams.bookId}?deeplink=true`;

    const urlQueryParams = _.chain(location.search)
    .replace('?', '') 
    .split('&') 
    .map(_.partial(_.split, _, '=', 2)) 
    .fromPairs() 
    .value();

    let allParams = _.merge({}, urlQueryParams, qparams);
    
    for(let param  in allParams) { 
      if(deleteParams.indexOf(param) >= 0) { 
        delete allParams[param];
      } else {
        redirectUrl += "&" + param + "=" + encodeURIComponent(allParams[param]);
        //redirectUrl += "&" + p + "=" + allParams[p];
      }    
    } 
    console.log("redirectUrl >>>>>>>>>>", redirectUrl);
    return redirectUrl;
  }

  static setCurrentUser(userInfo) {
    localStorage.setItem(localStorageKey, JSON.stringify(userInfo));
  }

  static setLoginCookie(authToken) {
    document.cookie = 'authToken=' + authToken + '; max-age=' + this.getSessionLength();
  }

}