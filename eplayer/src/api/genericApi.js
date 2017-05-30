import { resources , domain } from '../../const/Settings';
const etextService = resources.links.etextServiceUrl;
const pxeService   = resources.links.pxeServiceUrl;
const envType      = domain.getEnvType();

export const getTotalAnndata = data => fetch(pxeService[envType]+'/context/'+data.context+'/annotations',{
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  }
});

export const getAnndata = data => fetch(pxeService[envType]+'/context/'+data.context+'/annotations?uri='+data.uri,{
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  }
});// eslint-disable-line

export const postAnnData = data => fetch(pxeService[envType]+'/context/'+data.context+'/annotations', { // eslint-disable-line no-undef
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  },
  body: JSON.stringify(data)
});

export const putAnnData = data => fetch(pxeService[envType]+'/context/'+data.context+'/annotations/'+data.id, {// eslint-disable-line no-undef
  method: 'PUT',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  },
  body: JSON.stringify(data)
});

export const deleteAnnData = data =>
 fetch(pxeService[envType]+'/context/'+data.context+'/annotations/'+data.annId, {// eslint-disable-line no-undef
  method: 'DELETE',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  }
});

// ----Play list toc----------------------------------

export const getBookDetails = bookDetails => 
 fetch(etextService[envType]+'/books/'+bookDetails.context+'/details?platformId=&profile=yes&backlinking=yes&includeEndpoints=true&moduleIds=all&includeRoles=true&userId=nextext_smsedupi&courseInfo=true&includeBookData=true',
 {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': bookDetails.piToken
    }
});

export const getTocDetails = (bookId,tocurl,piToken) => fetch(etextService[envType]+'/custom/toc/contextId/'+bookId+'?provider='+tocurl, { // eslint-disable-line no-undef
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Authorization': piToken
  }
});

export const getPlaylistDetails = (bookId,tocurl,piToken) => fetch(etextService[envType]+'/custom/playlist/contextId/'+bookId+'?provider='+tocurl+'&removeDuplicates=false', { // eslint-disable-line no-undef
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Authorization': piToken
  }
});

const servicePXE = 'http://10.25.228.142/etext/standalone/courses/58edecc2e4b01da81434fc2d/sectionDetails';
const authToken = 'eyJhbGciOiJSUzUxMiIsImtpZCI6ImsxMDY5NDgxOTAifQ.eyJleHAiOjE0OTU4MTk5NDcsInN1YiI6ImZmZmZmZmZmNThmZGQ2NTZlNGIwZjRhMzJkM2FhYmNjIiwic2Vzc2lkIjoiMWVlNDFjMjc3MTgxNDYwZmJhZDMxMjkxMGMwMWYzNmUiLCJoY2MiOiJVUyIsInR5cGUiOiJhdCIsImlhdCI6MTQ5NTgwOTE0N30.DJmu5EFqu-FtBfdu4vfd9LkZMcjlEyjknN5p9AF-CN72k_9n-V01YvgWhuCh4j-okFQQlVByEm3s2AoqNP9O2gb7EGggiWiXfuwjAuRpBkGe1Y7EzYLFXgprNyX3t1FncVgs4yB5dLO18au5LtImZ582WaWJSP52HiQzfmNCQ18';
export const getCourseDetails = bookDetails => 
 fetch(servicePXE,
 {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': authToken
    }
});

// Bookmark Api Total GET Call,
export const getTotalBookmarkData = data => fetch(pxeService[envType]+'/context/'+data.context+'/identities/'+data.user+'/bookmarks',{
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  }
});

// Bookmark Api GET Call,
export const getBookmarkData = data => fetch(pxeService[envType]+'/context/'+data.context+'/identities/'+data.user+'/bookmarks?uri='+data.id,{
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':data.user
  }
});
// Bookmark Api Post Call,

export const postBookmarkData = postData => fetch(pxeService[envType]+'/context/'+postData.context+'/identities/'+postData.user+'/bookmarks',{
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Identity-Id':postData.user
  },
  body:JSON.stringify(postData)
});

// Bookmark Api Delete Call,

export const deleteBookmarkData = deleteData => fetch(pxeService[envType]+'/context/'+deleteData.context+'/identities/'+deleteData.user+'/bookmarks?uri='+deleteData.uri,{
  method: 'DELETE',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// Go to page Get call
export const getGotoPage = data => fetch(pxeService[envType]+'/context/'+data.context+'/navigation/?pageNumber='+data.pagenumber+'&provider='+data.baseurl,{
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});
