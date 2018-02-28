import axios from 'axios';
import { getmd5 } from '../../../../components/Utility/Util';
import { eT1Contants } from '../../../../components/common/et1constants';

/*Params required userid, bookid, bookeditionid,sessionKey, serverDetails, roleTypeID, globalbookid*/

export const fetchPageInfo = (authObj,currentBook) => {
  const bookState = {
    bookPagesInfo: {
      pages: []
    }
  };
  let serviceurl = `${currentBook.serverDetails}/ebook/pdfplayer/getpagedetails?userid=${authObj.userid}&userroleid=${currentBook.roletypeid}&bookid=${currentBook.bookId}&bookeditionid=${currentBook.bookeditionid}&authkey=${authObj.smsKey}`;
  // tempurl is starts with http to create hash key for matching with server
  let tempurl = serviceurl.replace("https","http");
  let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
  return (dispatch,getState) =>{
       // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
       axios.get(`${serviceurl}&hsid=${hsid}`,
         {
           timeout: 20000
         })
      .then((response) => {
        if (response.status >= 400) {
          // console.log(`FetchPage info error: ${response.statusText}`);
        } else if (response.data.length) {
           let coverPageObj = {
              pdfPath : `${currentBook.serverDetails}/ebookassets`
                  + `/ebook${currentBook.globalBookId}${getState().book.bookinfo.book.pdfCoverArt}`,
              title : 'Cover',
              id : 'Cover' 
            };
            bookState.bookPagesInfo.pages.push(coverPageObj);
            response.data.forEach((jsonData) => {
            const pages = jsonData.pdfPlayerPageInfoTOList;
            pages.forEach((page) => {
              const pageObj = {
  
              };
              pageObj.pagenumber = page.bookPageNumber;
              pageObj.pdfPath = `${currentBook.serverDetails}/ebookassets`
                  + `/ebook${currentBook.globalBookId}/ipadpdfs/${page.pdfPath}`;
              pageObj.title = 'Page ' + page.bookPageNumber;
              pageObj.id = page.pageOrder;
              bookState.bookPagesInfo.pages.push(pageObj);
            });
          });
        }
        dispatch({ type: 'RECEIVE_PAGE_INFO', bookState });
      });
    }
}