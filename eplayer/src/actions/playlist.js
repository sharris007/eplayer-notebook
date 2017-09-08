/* global $ */
import PlaylistApi from '../api/playlistApi';
import { resources , domain , typeConstants } from '../../const/Settings';
// GET Book Details
export const getPlaylistCompleteDetails = json => ({
  type: typeConstants.GET_PLAYLIST,
  data: json,
  playlistReceived: true
});

export const getTocCompleteDetails = json => ({
  type: typeConstants.GET_TOC,
  data: json,
  tocReceived: true
});

export const getBookDetails = json => ({
  type: typeConstants.BOOK_DETAILS,
  data: json,
  bookDetailsRecived: true
});

 var tocUrl = '';
 var piToken = '';
 var bookId='';
 var bookDetails ='';

function getTocUrlOnResp(resp) {
  let tocUrl;
  if (resp) {
    const tocArr = resp;
    $.each(tocArr, (key, value) => {
      const ext = value.substr(value.lastIndexOf('.') + 1);
      if (ext === 'xhtml') { tocUrl = value; }
    });
    if (!tocUrl) { tocUrl = resp[0]; }
  }
  return tocUrl ? tocUrl.replace('http:', 'https:') : null;
}
export const getBookPlayListCallService = data => dispatch => 
  PlaylistApi.doGetPiUserDetails(data).then(response => response.json())
  .then((response)=>{
      data.userName  = response.UserName;
      PlaylistApi.doGetBookDetails(data)
        .then(response => response.json())
        .then((response) => {
         dispatch(getBookDetails(response));
         bookId = response.bookDetail.bookId;

     tocUrl = getTocUrlOnResp(response.bookDetail.metadata.toc);
     bookDetails = response.bookDetail.metadata;
     piToken = data.piToken;
     PlaylistApi.doGetPlaylistDetails(bookId, tocUrl, piToken).then(response => response.json())
      .then(response => dispatch(getPlaylistCompleteDetails(response)));
   }
);
 
});

export const getBookTocCallService  = data => dispatch => 
  PlaylistApi.doGetTocDetails(bookId, tocUrl, piToken).then(response => response.json())
      .then((response) => {
        const tocResponse = response.content;
        tocResponse.mainTitle = bookDetails.title;
        tocResponse.author = bookDetails.creator;
        tocResponse.thumbnail = bookDetails.thumbnailImageUrl;


        tocResponse.list = [];
        const tocItems = tocResponse.items;
        let subItems = [];
        const listData = tocItems.map((itemObj) => {
          if (itemObj.items) {
            subItems = itemObj.items.map(n => ({
                urn: n.id,
              href: n.href,
              id: n.id,
              playorder: n.playorder,
              title: n.title
            }));
          }
          return {
            id: itemObj.id,
            urn: itemObj.id,
            title: itemObj.title,
            coPage: itemObj.coPage,
            playOrder: itemObj.playOrder,
            children: subItems
          };
        });
        tocResponse.list = listData;
        delete tocResponse.items;
        const tocFinalModifiedData = { content: tocResponse, bookDetails };
        dispatch(getTocCompleteDetails(tocFinalModifiedData));
      });


export const getCourseCallService = data => dispatch => PlaylistApi.doGetCourseDetails(data)
   .then(response => response.json())
   .then((response) => {
     
     dispatch(getBookDetails(response));
     const baseUrl      = response.userCourseSectionDetail.baseUrl;
     tocUrl       = getTocUrlOnResp(response.userCourseSectionDetail.toc);
     bookDetails  = response.userCourseSectionDetail;
     piToken      = data.piToken;
     bookId       = bookDetails.section.sectionId;
     const bookDetailsSection = bookDetails.section;
     const passportDetails = response.passportPermissionDetail;
     const url = window.location.href;
     const n = url.search('prdType');
     let prdType  ='';
      if (n > 0) {
        const urlSplit = url.split('prdType=');
        prdType = urlSplit[1];
      }  
      if(bookDetails.authgrouptype=='student' && passportDetails && !passportDetails.access){
        redirectToZeppelin(bookDetails,passportDetails);
        return false;
      }
      else if(bookDetails.authgrouptype=='instructor' && !prdType ){
        const prodType='PXE', courseId=bookId;
        redirectToIDCDashboard(prodType,courseId);
        return false;
      }

     PlaylistApi.doGetPlaylistDetails(bookId, tocUrl, piToken).then(response => response.json())
      .then(response => {
        const securl      = baseUrl.replace(/^http:\/\//i, 'https://');
        response.baseUrl  = securl ;
        dispatch(getPlaylistCompleteDetails(response))
      });
   }
);
function redirectToIDCDashboard(prodType,courseId){
  const redirectIdcURL = resources.links.idcUrl[domain.getEnvType()]+'/idc?product_type='+prodType+'&courseId='+courseId;
  window.location = redirectIdcURL;
} 

function redirectToZeppelin(bookDetails,passportDetails){
    let userAccess = {
          userType      : bookDetails.authgrouptype,
          institutionId : bookDetails.section.extras.organizationId,
          productId     : passportDetails.productId,
          appAccess     : passportDetails.access,
          launchUrl     : bookDetails.section.extras.metadata.launchUrl
    }
    
    const productId     = userAccess.productId ,
          institutionId = userAccess.institutionId ,
          courseAccess  = userAccess.appAccess,
          failureUrl    = encodeURIComponent(resources.links.consoleUrl[domain.getEnvType()]),
          cancelUrl     = encodeURIComponent(resources.links.consoleUrl[domain.getEnvType()]),
          successUrl    = encodeURIComponent(userAccess.launchUrl),
          zeppelinAccessBassUrl  = resources.links.zeppelinUrl[domain.getEnvType()],
          zeppelinRelativeurl =productId+'?institutionId='+institutionId+
          '&failureUrl='+failureUrl+'&cancelUrl='+cancelUrl+'&successUrl='+successUrl;
    const zeppelinRedirect  = zeppelinAccessBassUrl+'/'+zeppelinRelativeurl;
    window.location = zeppelinRedirect;
    
}