/* global localStorage */
import React, { Component } from 'react';/* Importing the react and component from react library. */
import CircularProgress from 'material-ui/CircularProgress';/* Import the CircularProgress for adding the progressBar. */
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { addLocaleData } from 'react-intl';
import { PdfBookReader } from './PdfBookReader';
import { languages } from '../../../../locale_config/translations/index';
import languageName from '../../../../locale_config/configureLanguage';
import Cookies from 'universal-cookie';
/* Defining the variables for localStorage. */
let identityId;
let ubd;
let ubsd;
let ssoKey;
let serverDetails;
let langID;
let roleTypeID;
var currentbook = {};
/* Creating PdfBook component. */
export class PdfBook extends Component {
  constructor(props){
    super(props);
    if(this.props.location.query.invoketype === undefined || this.props.location.query.invoketype === ''
      && this.props.location.query.invoketype === null)
    {
      this.cookies = new Cookies();
      let appPath             = window.location.origin;
      let redirectBookUrl   = appPath+'/eplayer/pdfbook?bookid='+this.props.location.query.bookid;
      redirectBookUrl       = decodeURIComponent(redirectBookUrl).replace(/\s/g, "+").replace(/%20/g, "+");
      setTimeout(()=>{
        piSession.getToken((result, userToken) => {
        if (result === piSession.Success) {
          localStorage.setItem('secureToken',userToken);
        }
        else if(result === 'unknown' || result === 'notoken' ){
             piSession.login(redirectBookUrl, 10);
          }
        });
      },2000)
    }
  }
/* Async keyword used for independent calling the method, componentWillMount is lifecycle method,
used for before mounting occurs. */
  async componentWillMount() {
  var bookID = this.props.location.query.bookid;
  if (this.props.location.query.invoketype !== undefined && 
          this.props.location.query.invoketype === 'standalone')
    {
      if(this.props.login.data !== undefined)
      {
          identityId = this.props.login.data.identityId;
                   
      }else{
          identityId = localStorage.getItem('identityId');
      }
      if(identityId === undefined || identityId === '' || identityId === null)
      {
        identityId = this.props.currentbook.globalUserId;
      }
      ubd = this.props.currentbook.ubd;
      ubsd = this.props.currentbook.ubsd;
      ssoKey = this.props.currentbook.ssoKey;
      serverDetails = this.props.currentbook.serverDetails;
      roleTypeID = this.props.currentbook.roleTypeID;
    }
    else
    {
      piSession.getToken(function(result, userToken){
        if(result === 'success'){
          localStorage.setItem('secureToken',userToken);
        }
      }); 
      var bookData;
      var booksArray;
      const secureToken  = localStorage.getItem('secureToken');
      let urn = 'compositeBookShelf';
      await this.props.fetchbookDetails(urn, secureToken,this.props.location.query.bookid).then((book) =>{
        if(book)
        {
          bookData = book;
        }
      });
      identityId = bookData.globalUserId;
      ubd = bookData.userBookLastModifiedDate;
      ubsd = bookData.userBookScenarioLastModifiedDate;
      ssoKey = piSession.userId();
      serverDetails = bookData.bookServerUrl;
      roleTypeID = bookData.roleTypeID;
      currentbook.ssoKey = ssoKey;
      currentbook.authorName = bookData.author;
      currentbook.thumbnail = bookData.image;
      currentbook.title = bookData.title;
      currentbook.globalBookId = bookData.globalBookId;
      currentbook.globalUserId = bookData.globalUserId;
      currentbook.bookeditionid = bookData.bookeditionid;
      currentbook.uPdf = bookData.updfUrl;
      currentbook.serverDetails = bookData.bookServerUrl;
      currentbook.bookId = bookData.bookId;
      currentbook.uid = bookData.userInfoLastModifiedDate;
      currentbook.ubd = bookData.userBookLastModifiedDate;
      currentbook.ubsd = bookData.userBookScenarioLastModifiedDate;
      currentbook.roleTypeID = bookData.roleTypeID;
    }
        /* Await operator is used to wait for a Promise returned by an async function. */
       /* Method used for fetching the user details and book details. */
    await this.props.fetchUserInfo(identityId, bookID, ubd, ubd, ubsd, ssoKey, serverDetails);
    await this.props.fetchBookInfo(bookID, ssoKey,
              this.props.book.userInfo.userid, serverDetails, roleTypeID);
    await this.props.fetchBookFeatures(bookID,ssoKey, this.props.book.userInfo.userid, serverDetails, this.props.book.bookinfo.book.roleTypeID);
  }

 /* Multiple methods we have paased in PdfBookReader inside return, fetchTocViewer fot fetching the value of TOC,
   fetchBookmarksUsingReaderApi for fetching the bookmark details, addBookmarkUsingReaderApi is used for adding the bookmark details,
   and so on as methods names are very specific. */
  render() {
    if (this.props.book.bookinfo.fetched) {
      langID = this.props.book.bookinfo.book.languageid;
      const locale = languageName(langID);
      const localisedData = locale.split('-')[0];
      addLocaleData((require(`react-intl/locale-data/${localisedData}`))); // eslint-disable-line global-require,import/no-dynamic-require
      const { messages } = languages.translations[locale];
      const PdfbookMessages = {
        PageMsg: messages.page
      };
      return (
        <PdfBookReader
          locale={locale}
          fetchTocAndViewer={this.props.fetchTocAndViewer}
          fetchBookmarksUsingReaderApi={this.props.fetchBookmarksUsingReaderApi}
          addBookmarkUsingReaderApi={this.props.addBookmarkUsingReaderApi}
          removeBookmarkUsingReaderApi={this.props.removeBookmarkUsingReaderApi}
          fetchBookInfo={this.props.fetchBookInfo}
          fetchPageInfo={this.props.fetchPageInfo}
          goToPage={this.props.goToPage}
          book={this.props.book}
          currentbook={currentbook.ssoKey ? currentbook : this.props.currentbook}
          login={this.props.login}
          params={this.props.params}
          location={this.props.location}
          fetchHighlightUsingReaderApi={this.props.fetchHighlightUsingReaderApi}
          saveHighlightUsingReaderApi={this.props.saveHighlightUsingReaderApi}
          removeHighlightUsingReaderApi={this.props.removeHighlightUsingReaderApi}
          PdfbookMessages={PdfbookMessages}
          loadAssertUrl={this.props.loadAssertUrl}
          editHighlightUsingReaderApi={this.props.editHighlightUsingReaderApi}
          fetchRegionsInfo={this.props.fetchRegionsInfo}
          fetchPagebyPageNumber={this.props.fetchPagebyPageNumber}
          fetchUserIcons={this.props.fetchUserIcons}
          fetchBookFeatures={this.props.fetchBookFeatures}
          fetchGlossaryItems={this.props.fetchGlossaryItems}
          fetchBasepaths={this.props.fetchBasepaths}
        />);
    }

    return (
      <div className="centerCircularBar">
        <RefreshIndicator size={50} left={650} top={200} status="loading" />
      </div>);
  }

}
PdfBook.propTypes = {
  fetchTocAndViewer: React.PropTypes.func,
  fetchBookmarksUsingReaderApi: React.PropTypes.func,
  addBookmarkUsingReaderApi: React.PropTypes.func,
  removeBookmarkUsingReaderApi: React.PropTypes.func,
  fetchBookInfo: React.PropTypes.func,
  fetchPageInfo: React.PropTypes.func,
  goToPage: React.PropTypes.func,
  book: React.PropTypes.object,
  bookshelf: React.PropTypes.object,
  login: React.PropTypes.object,
  params: React.PropTypes.object,
  fetchHighlightUsingReaderApi: React.PropTypes.func,
  saveHighlightUsingReaderApi: React.PropTypes.func,
  removeHighlightUsingReaderApi: React.PropTypes.func,
  loadAssertUrl: React.PropTypes.func,
  editHighlightUsingReaderApi: React.PropTypes.func
};
export default PdfBook;

