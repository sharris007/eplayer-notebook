import { resources, domain } from '../../const/Settings';

const messagingUrl = resources.links.messagingUrl;
const envType = domain.getEnvType();

export const loadPageEvent = (piToken, loadData) => {
  console.log("load$$$$$" , loadData);
  const header = {
     'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Authorization': piToken
  }
  fetch(`${messagingUrl[envType]}/messaging/activities`, {  
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': piToken
    },
    body: JSON.stringify(loadData)

  }).then((response) => {
    return response.json();
  }).then((json) => {
    console.log("loadjson", json);
  });
}

export const unLoadPageEvent = (piToken, UnLoadData) => {
  console.log("UNLOAD$$$$$" , UnLoadData);
  const header = {
     'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Authorization': piToken
  }
  //${messagingUrl[envType]}/messaging/activities
  fetch(`${messagingUrl[envType]}/messaging/activities`, {  
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': piToken
    },
    body: JSON.stringify(UnLoadData)

  }).then((response) => {
    return response.json();
  }).then((json) => {
    console.log("unloadjson", json);
  });
}