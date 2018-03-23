import axios from 'axios';
import { addLocaleData } from 'react-intl';
import { getmd5 } from '../../../../components/Utility/Util';
import { eT1Contants } from '../../../../components/common/et1constants';
import { languages } from '../../../../../locale_config/translations/index';
import languageName from '../../../../../locale_config/configureLanguage';
import { pdfConstants } from '../../../../components/PdfPlayer/constants/pdfConstants';

/* Params required userid, bookid, bookeditionid,sessionKey, serverDetails, roleTypeID, globalbookid*/

export const fetchPageInfo = (currentBook, userid, smsKey) => {
  const bookState = {
    bookPagesInfo: {
      pages: []
    }
  };
  const serviceurl = `${currentBook.serverDetails}/ebook/pdfplayer/getpagedetails?userid=` +
  `${userid}&userroleid=${currentBook.roletypeid}&bookid=${currentBook.bookId}` +
  `&bookeditionid=${currentBook.bookeditionid}&authkey=${smsKey}`;
  // tempurl is starts with http to create hash key for matching with server
  const tempurl = serviceurl.replace('https', 'http');
  const hsid = getmd5(eT1Contants.MD5_SECRET_KEY + tempurl);
  return (dispatch, getState) => {
       // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
    axios.get(`${serviceurl}&hsid=${hsid}`,
      {
        timeout: 20000
      })
      .then((response) => {
        if (response.status >= 400) {
          // console.log(`FetchPage info error: ${response.statusText}`);
        } else if (response.data.length) {
          const locale = languageName(currentBook.languageid);
          const localisedData = locale.split('-')[0];
          addLocaleData((require(`react-intl/locale-data/${localisedData}`)));// eslint-disable-line global-require,import/no-dynamic-require
          const { messages } = languages.translations[locale];
          const Page = messages.page ? messages.page : 'Page';
          const coverPageObj = {
            pdfPath: `${currentBook.serverDetails}/ebookassets`
                  + `/ebook${currentBook.globalBookId}${getState().book.bookinfo.book.pdfCoverArt}`,
            title: 'Cover',
            id: 'cover',
            printDisabled: true,
            isCover: true
          };
            // Temporary condition for supporting multiPage config
          if (!pdfConstants.multipageConfig.isMultiPageSupported) {
            bookState.bookPagesInfo.pages.push(coverPageObj);
          }
          response.data.forEach((jsonData) => {
            const pages = jsonData.pdfPlayerPageInfoTOList;
            pages.forEach((page) => {
              const pageObj = {

              };
              pageObj.pagenumber = page.bookPageNumber;
              pageObj.pdfPath = `${currentBook.serverDetails}/ebookassets`
                  + `/ebook${currentBook.globalBookId}/ipadpdfs/${page.pdfPath}`;
              pageObj.title = `${Page} ${page.bookPageNumber}`;
              pageObj.id = page.pageOrder;
              pageObj.printDisabled = page.printDisabled;
              pageObj.isCover = false;
              bookState.bookPagesInfo.pages.push(pageObj);
            });
          });
        }
        dispatch({ type: 'RECEIVE_PAGE_INFO', bookState });
      });
  };
};

export default fetchPageInfo;
