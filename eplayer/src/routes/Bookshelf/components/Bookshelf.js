/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *   
 *  *  Copyright © 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  * 
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software 
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
/* global piSession ,localStorage */
import React from 'react';/* Importing the react library, for using the react methods and keywords. */
import { browserHistory } from 'react-router'; /* Importing the react-router for routing the react component. */
import { BookshelfComponent } from '@pearson-incubator/bookshelf';/* Injecting the bookself component from @pearson-incubator. */
import CircularProgress from 'material-ui/CircularProgress';/* Import the CircularProgress for adding the progressBar. */
import isEmpty from 'lodash/isEmpty'; /* loadsh is a JavaScript utility library. And isEmpty method is used for Iterating arrays, objects and testing. */
import Cookies from 'universal-cookie';
import { addLocaleData } from 'react-intl';
import _ from 'lodash';
import errorCard from '../../../components/common/errorCard';
import BookshelfHeader from '../../../components/BookshelfHeader';/* Import the bookshelfHeader for bookshelf. */
import './Bookshelf.scss'; /* Importing the css file. */
// import { clients } from '../../../components/common/client';/* Importing the client file for framing the complete url, since baseurls are stored in client file. */
import languageName from '../../../../locale_config/configureLanguage';
import { languages } from '../../../../locale_config/translations/index';

import { resources, domain } from '../../../../const/Settings';
import { getmd5 } from '../../../components/Utility/Util';
import { eT1Contants } from '../../../components/common/et1constants';

const envType = domain.getEnvType();
let languageid;
const url = window.location.href;
const n = url.search('languageid');
if (n > 0) {
  const urlSplit = url.split('languageid=');
  languageid = Number(urlSplit[1]);
} else {
  languageid = 1;
}
const langQuery = `?languageid=${String(languageid)}`;
const locale = languageName(languageid);
const localisedData = locale.split('-')[0];
addLocaleData((require(`react-intl/locale-data/${localisedData}`)));  // eslint-disable-line import/no-dynamic-require
const { messages } = languages.translations[locale];
/* Method for loading the bookshelf component. */
export default class BookshelfPage extends React.Component {
  /* constructor and super have used in class based React component,
   used to pass props for communication with other components. */
  constructor(props) {
    super(props);
    document.title = 'Bookshelf';
    this.cookies = new Cookies();
    if(this.props.location.query.bookshelftype !== 'et1')
    {
      let appPath             = window.location.origin;
      let redirectCourseUrl   = appPath+'/eplayer/bookshelf';
      redirectCourseUrl       = decodeURIComponent(redirectCourseUrl).replace(/\s/g, "+").replace(/%20/g, "+");
      setTimeout(()=>{
        piSession.getToken((result, userToken) => {
        if (result === piSession.Success) {
          localStorage.setItem('secureToken',userToken);
        }
        else if(result === 'unknown' || result === 'notoken' ){
             piSession.login(redirectCourseUrl, 10);
          }
        });
      },2000)
   }
  }

  /* Method for mounting before the page loaded. checking the condition wether the toc data present
  then set content, bookinfo, bookmarks. */

  componentWillMount() {
    if (this.props.book.toc !== undefined) {
      this.props.book.toc.content = {};
    }

    if (this.props.book.bookinfo !== undefined) {
      this.props.book.bookinfo = [];
    }

    if (this.props.book.bookmarks !== undefined) {
      this.props.book.bookmarks = [];
    }

    let sessionid;
    let piToken;
    if (this.props.login.data === undefined) {
      sessionid = localStorage.getItem('sessionid');
    } else {
      // piToken = this.props.login.data.piToken;
      sessionid = this.props.login.data.token;
    }
    // Added eT1StandaloneBkshf flag based flow to use eT1 getuserbookshelf
    // service if paperApi login or bookshelf service is down or some other related issues.
    if (this.props.location.query.bookshelftype === 'et1') {
      sessionid = this.props.location.query.authkey;
      piToken = 'getuserbookshelf';
      localStorage.setItem('identityId', this.props.location.query.globaluserid);
    }
    /* Passing the sessionid. Stroing the SsoKey */
    if (sessionid === undefined || sessionid === '' || sessionid === null)
    {
      sessionid = piSession.userId();
    }
    this.props.storeSsoKey(sessionid);
    // console.log(`sessionid:: ${sessionid}`);
    // Get Eps Auth Token to fetch eps book images

    /* Adding sessionid for creating url for Bookshelf. Dispatcing the action. */
     let isSessionLoaded = false;
     const IntervalCheck = setInterval(()=>{
      if(!isSessionLoaded) {
        const secureToken  = localStorage.getItem('secureToken');
        if(secureToken || this.props.location.query.bookshelftype === 'et1') {
          const cdnToken = this.cookies.get('etext-cdn-token');
          if(!cdnToken){
             this.props.getAuthToken(secureToken);
           }
          //let urn = `bookShelf?key=${sessionid}&bookShelfMode=BOTH`;
          let urn = 'compositeBookShelf';
          if (this.props.location.query.bookshelftype === 'et1') {
            // This bookshelf temp mentioned as constant
            urn = 'https://sms.bookshelf.cert1.ebookplus.pearsoncmg.com/ebook/ipad/getuserbookshelf?'
                + `siteid=11444&smsuserid=${this.props.location.query.globaluserid}`;
            var hsid = getmd5('siteid=11444'+'printbanana');
            urn = ''+urn+'&hsid='+hsid;
          }
          // const secureToken = this.cookies.get('secureToken');
          if (this.props.location.query.bookshelftype === 'et1') {
            this.props.fetch(urn, piToken);
          } else {
            this.props.fetch(urn, secureToken);
          }
          isSessionLoaded = true;
          clearInterval(IntervalCheck);
        }
      }
     },200);
   }
  getCookie = (name) => {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
  }
  componentWillReceiveProps = (nextProps) =>{
    const cdnToken = this.cookies.get('etext-cdn-token');
    if(cdnToken && nextProps.bookshelf.authFetched){
      const frameSrc = resources.links.authDomainUrl[envType]+'/setEtextCDN.html';
       $('body').append('<iframe src="'+frameSrc+'" name="cdnIframe" id="cdnIframe" width=0 height=0></iframe>');
      this.props.gotAuthToken(false);
    }
  }
  /* Created function for handle single book click.*/
  handleBookClick = (bookId, type) => {
    if ( type === 'et1') {
       /* BrowserHistory used for navigating the next page from current page. */
       var entries;
       var ispilogin;
       if (this.props.location.query.bookshelftype === 'et1')
       {
          entries = this.props.bookshelf.books.data[0].entries;
          ispilogin = "N";
       }
       else
       {
          entries = this.props.bookshelf.books.data.entries;
          ispilogin = "Y";
       }
       const bookObj = _.find(entries, bookData => bookData.bookId == bookId);
       if(!bookObj.expired) {

      browserHistory.push(`/eplayer/pdfbook?bookid=${bookId}&invoketype=standalone&ispilogin=${ispilogin}`);
    }

    }  else if( type === 'et2'){
      browserHistory.push(`/eplayer/ETbook/${bookId}`);
    }
    else if( type === 'course') {
      localStorage.setItem('sourceUrl', window.location.origin);
      browserHistory.push(`/eplayer/Course/${bookId}`);
      localStorage.setItem('sourceUrl', window.location.origin);
    }
  }
  /* Method used for loading the data. Any change in store data it will reload the view. */
  render() {
    /* Setting the bookshelfLang in localStorage */
    localStorage.setItem('bookshelfLang', langQuery);
    let firstName,lastName;
    if(this.props.login.data !== undefined){
      firstName = this.props.login.data.firstName;
      lastName = this.props.login.data.lastName;
    }
    const { books, fetching, fetched, error } = this.props.bookshelf;
    const booksdata = [];
    if (fetched && !isEmpty(books)) {
      /* Iterate the data coming from RestApi */
      let booksArray = [];
      let courseBookArray = [];
      /* Assigning list of books into booksArray from eT1 bookshelf response
      if eT1StandaloneBkshf query param value is 'Y' or 'y'*/
      if (this.props.location.query.bookshelftype === 'et1') { // eslint-disable-line
        booksArray = books.data[0].entries;
      } else {
        booksArray = books.data.entries;
        courseBookArray = books.data.userCourseSectionEntries || [];
      }
      if(booksArray.length !== 0 && (firstName === undefined || lastName === undefined))
      {
        for(var i=0; i<booksArray.length; i++)
        {
          if(booksArray[i].iseT1)
          {
           if (booksArray[i].firstName !== undefined && booksArray[i].firstName !== ''
                  && booksArray[i].firstName !== null  )
            {
              firstName = booksArray[i].firstName;
              lastName = booksArray[i].lastName;
            }
            // this else block added for temp purpose and will removed once firstname & lastname is available in composite bookshelf response

          }
        }
      }
      booksArray.forEach((bookData) => {
        const bookRef = bookData;
        if (bookRef.bookId === '3BKZBJB2QB' || bookRef.bookId === '8DJBSW6MHR') {
          bookRef.thumbnailImageUrl = 'http://images.contentful.com/tbx6i45kvpo5/28WYeWCc3aauKkWkiYaua2/489832c2bdb06b7245479e887ccfea06/cite_elements_cover';  // eslint-disable-line
        }

        /* Created an object which contains all book properties. which we are passing in bookself component. */
        /* Book thumbnail Image change*/
        let bookThumbnail = bookRef.thumbnailImageUrl;
        bookThumbnail = bookThumbnail ? bookThumbnail.replace('http:', 'https:'):'';
        if(envType=='qa' && bookThumbnail){
          if(bookThumbnail.match("etext-dev.pearson.com") ) {
            bookThumbnail = bookThumbnail.replace("etext-dev.pearson.com", "etext-qa-stg.pearson.com");
          }else if(bookThumbnail.match("etext-stg.pearson.com") ){
            bookThumbnail = bookThumbnail.replace("etext-stg.pearson.com", "etext-qa-stg.pearson.com");
          }
        }
        const book = {
          id: bookRef.bookId,
          author: bookRef.creator || '',
          image: bookThumbnail ? bookThumbnail : '',
          title: bookRef.title || '',
          description: bookRef.description || '',
          tocId: '',
          updfUrl: bookRef.uPdfUrl,
          globalBookId: bookRef.globalBookId,
          globalUserId: bookRef.globalUserId,
          bookeditionid: bookRef.bookeditionid,
          type: bookRef.iseT1 ? 'et1':'et2',
          bookServerUrl: bookRef.bookServerUrl,
          userInfoLastModifiedDate: bookRef.userInfoLastModifiedDate,
          userBookLastModifiedDate: bookRef.userBookLastModifiedDate,
          userBookScenarioLastModifiedDate: bookRef.userBookScenarioLastModifiedDate,
          roleTypeID: bookRef.roleTypeID,
          active: bookRef.active,
          expired: bookRef.expired
        };
        booksdata.push(book);
      });
      courseBookArray.forEach((CourseBookData) => {
        const book = {
          id: CourseBookData.section.sectionId,
          author: CourseBookData.id || '',
          image: CourseBookData.section.avatarUrl ? CourseBookData.section.avatarUrl : '',
          title: CourseBookData.section.sectionTitle || '',
          description: '',
          tocId: '',
          updfUrl: '',
          globalBookId: '',
          bookeditionid: '',
          type: 'course',
          bookServerUrl: '',
          userInfoLastModifiedDate: null ,
          userBookLastModifiedDate: null,
          userBookScenarioLastModifiedDate: null,
          roleTypeID: ''
        };
        booksdata.push(book);
      });
    }

    if (error) {
      return errorCard('Error', error.message);
    }
    // this block added for temp purpose and will removed once firstname & lastname is available in composite bookshelf response

    /* Here in return, we are passing firstName and lastName in BookshelfHeader Component and
    we are passing book Object, methods onBookClick, storeBookDetails, storeSsoKey,
    in BookshelfComponent inside @Pearson-incubator  */
    return (
      /* eslint-disable */
      <div id="bookshelf-page">
        <BookshelfHeader locale={locale} messages={messages} firstName={firstName} lastName={lastName} />
        {fetching ? <CircularProgress style={{ margin: '40px auto', display: 'block' }} /> : null}
        {fetched ? <BookshelfComponent books={booksdata} onBookClick={this.handleBookClick} storeBookDetails={this.props.storeBookDetails} storeSsoKey={this.props.storeSsoKey} locale={locale} /> : null}
      </div>
       /* eslint-enable */
    );
  }
}

/* propTypes used for communication to child Component that which props are present in Parent Component. */

BookshelfPage.propTypes = {
  bookshelf: React.PropTypes.object.isRequired,
  fetch: React.PropTypes.func.isRequired,
  storeBookDetails: React.PropTypes.func,
  storeSsoKey: React.PropTypes.func,
  book: React.PropTypes.object,
  login: React.PropTypes.object,
  location: React.PropTypes.object
};
