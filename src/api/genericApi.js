import { apiConstants  } from '../../const/Constants';

export const getAnndata = (filterData) => {
    return fetch(apiConstants.ANNOTATION+'?apiKey='+apiConstants.APIKEY+'&q={"playOrder":'+filterData+'}')
};

export const postAnnData = (data) => {
    return fetch(apiConstants.ANNOTATION+'?apiKey='+apiConstants.APIKEY, {  
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
};

export const putAnnData =  (data) => {
    return fetch(apiConstants.ANNOTATION+'?apiKey='+apiConstants.APIKEY, {  
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
};

export const deleteAnnData = (annId) => {
  return fetch(apiConstants.ANNOTATION+'/'+annId+'?apiKey='+apiConstants.APIKEY, {  
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
};