import { apiConstants } from '../../const/Constants';

export const getAnndata = filterData => fetch(`${apiConstants.ANNOTATION}?apiKey=${apiConstants.APIKEY}&q={"playOrder":${filterData}}`);// eslint-disable-line

export const postAnnData = data => fetch(`${apiConstants.ANNOTATION}?apiKey=${apiConstants.APIKEY}`, { // eslint-disable-line no-undef
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

export const putAnnData = data => fetch(`${apiConstants.ANNOTATION}?apiKey=${apiConstants.APIKEY}`, {// eslint-disable-line no-undef
  method: 'PUT',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

export const deleteAnnData = annId => fetch(`${apiConstants.ANNOTATION}/${annId}?apiKey=${apiConstants.APIKEY}`, {// eslint-disable-line no-undef
  method: 'DELETE',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// ----Play list toc
export const getBookDetails = bookId => fetch(`${apiConstants.PAPERBASE}`+'/books/${bookId}/details?platformId=&profile=yes&backlinking=yes&includeEndpoints=true&moduleIds=all&includeRoles=true&userId=xlet2edu&courseInfo=true&includeBookData=true', { // eslint-disable-line no-undef
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export const getPlaylistDetails = (bookId,tocurl) => fetch(`${apiConstants.PAPERBASE}`+'/books/${bookId}/details?platformId=&profile=yes&backlinking=yes&includeEndpoints=true&moduleIds=all&includeRoles=true&userId=xlet2edu&courseInfo=true&includeBookData=true', { // eslint-disable-line no-undef
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});
export const getPlaylistDetails = filterData => fetch(`${apiConstants.PAPERBASE}?apiKey=${apiConstants.APIKEY}&q={"playOrder":${filterData}}`);// eslint-disable-line
