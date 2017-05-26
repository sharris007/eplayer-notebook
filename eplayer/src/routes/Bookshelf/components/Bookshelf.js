import React from 'react';/* Importing the react library, for using the react methods and keywords. */
import { browserHistory } from 'react-router'; /* Importing the react-router for routing the react component. */
import { BookshelfComponent } from '@pearson-incubator/bookshelf';/* Injecting the bookself component from @pearson-incubator. */
import CircularProgress from 'material-ui/CircularProgress';/* Import the CircularProgress for adding the progressBar. */
import isEmpty from 'lodash/isEmpty'; /* loadsh is a JavaScript utility library. And isEmpty method is used for Iterating arrays, objects and testing. */
import errorCard from '../../../components/common/errorCard';
import BookshelfHeader from '../../../components/BookshelfHeader';/* Import the bookshelfHeader for bookshelf. */
import './Bookshelf.scss'; /* Importing the css file. */
import { clients } from '../../../components/common/client';/* Importing the client file for framing the complete url, since baseurls are stored in client file. */
import { intlShape,addLocaleData } from 'react-intl';   
import languageName from '../../../../locale_config/configureLanguage';   
import {languages} from '../../../../locale_config/translations/index';   
var launguageid,locale,langQuery;   
const url=window.location.href;   
var n=url.search("languageid");   
if(n>0)   
{   
  var urlSplit=url.split("languageid=")   
  languageid = Number(urlSplit[1]);   
}   
else    
{   
  var languageid =1;    
}   
langQuery="?languageid=" + String(languageid);    
locale=languageName(languageid);    
let localisedData=locale.split('-')[0];   
addLocaleData((require(`react-intl/locale-data/${localisedData}`)));    
const {messages}=languages.translations[locale];
/* Method for loading the bookshelf component. */
export default class BookshelfPage extends React.Component {
  /* constructor and super have used in class based React component, 
   used to pass props for communication with other components. */
constructor(props) {
    super(props);
    
  }

/* Method for mounting before the page loaded. checking the condition wether the toc data present 
then set content, bookinfo, bookmarks. */

componentWillMount() {

  if(this.props.book.toc!==undefined )
    {
      this.props.book.toc.content={};
    }

    if(this.props.book.bookinfo!==undefined)
    {
      this.props.book.bookinfo=[];
    }

    if(this.props.book.bookmarks!==undefined)
    {
      this.props.book.bookmarks=[];
    }

    

    /* Implementing sessionStorage for accessing data once the page get refresh. */

    var sessionid, piToken;
    if(this.props.login.data === undefined){
      piToken = sessionStorage.getItem('piToken');
      sessionid = sessionStorage.getItem('sessionid');
    }else{
      piToken = this.props.login.data.piToken;
      sessionid=this.props.login.data.token;
    }

    /* Passing the sessionid. Stroing the SsoKey */
    this.props.storeSsoKey(sessionid);
    console.log('sessionid:: '+sessionid);

    

    /* Adding sessionid for creating url for Bookshelf. Dispatcing the action. */
    var urn = 'bookShelf?key='+sessionid+'&bookShelfMode=BOTH'
    this.props.fetch(urn, piToken);
    console.log(urn);
    
  }

/* Created function for handle single book click.*/
  handleBookClick = (bookId,iseT1) => {
    
    if(iseT1)

    /* BrowserHistory used for navigating the next page from current page. */
    {
     browserHistory.push(`/eplayer/pdfbook/${bookId}`);
    }
    else
    {
      browserHistory.push(`/eplayer/ETbook/${bookId}`);
    }
  }
  /* Method used for loading the data. Any change in store data it will reload the view. */
  render() {
    /* Setting the item in sessionStorage */
    sessionStorage.setItem('bookshelfLang',langQuery);
    sessionStorage.setItem('uPdf',this.props.bookshelf.uPdf);
    sessionStorage.setItem('authorName',this.props.bookshelf.authorName);
    sessionStorage.setItem('title',this.props.bookshelf.title);
    sessionStorage.setItem('thumbnail',this.props.bookshelf.thumbnail);
    sessionStorage.setItem('ubd',this.props.bookshelf.ubd);
    sessionStorage.setItem('uid',this.props.bookshelf.uid);
    sessionStorage.setItem('ubsd',this.props.bookshelf.ubsd);
    sessionStorage.setItem('ssoKey',this.props.bookshelf.ssoKey);
    sessionStorage.setItem('serverDetails',this.props.bookshelf.serverDetails);
    sessionStorage.setItem('roleTypeID',this.props.bookshelf.roleTypeID);
    const firstName =  sessionStorage.getItem('firstName');
    const lastName = sessionStorage.getItem('lastName');
    const { books, fetching, fetched, error } = this.props.bookshelf;
    const booksdata = [];
    if (fetched && !isEmpty(books)) {
     
      /* Iterate the data coming from RestApi */

        books.data.entries.forEach((bookData) => {
        const bookRef = bookData;
        if(bookRef.bookId==='3BKZBJB2QB' || bookRef.bookId==='8DJBSW6MHR')
        {
          bookRef.thumbnailImageUrl='http://images.contentful.com/tbx6i45kvpo5/28WYeWCc3aauKkWkiYaua2/489832c2bdb06b7245479e887ccfea06/cite_elements_cover';
        }

        /* Created an object which contains all book properties. which we are passing in bookself component. */

        const book = {
           id: bookRef.bookId,
           author: bookRef.creator || '',
           image: bookRef.thumbnailImageUrl ? bookRef.thumbnailImageUrl : '',
           title: bookRef.title || '',
           description: bookRef.description || '',
           tocId: '',
           updfUrl: bookRef.uPdfUrl,
           globalBookId: bookRef.globalBookId,
           bookeditionid: bookRef.bookeditionid,
           iseT1: bookRef.iseT1,
           bookServerUrl: bookRef.bookServerUrl,
           userInfoLastModifiedDate: bookRef.userInfoLastModifiedDate,
           userBookLastModifiedDate: bookRef.userBookLastModifiedDate,
           userBookScenarioLastModifiedDate: bookRef.userBookScenarioLastModifiedDate,
           roleTypeID: bookRef.roleTypeID
        };
        booksdata.push(book);
        
      });
    }

    if (error) {
      return errorCard('Error', error.message);
    }
    /* Here in return, we are passing firstName and lastName in BookshelfHeader Component and 
    we are passing book Object, methods onBookClick, storeBookDetails, storeSsoKey, 
    in BookshelfComponent inside @Pearson-incubator  */
    return (
      <div id="bookshelf-page">
        <BookshelfHeader locale={locale} messages={messages} firstName={firstName} lastName={lastName}/>
        {fetching ? <CircularProgress style={{ margin: '40px auto', display: 'block' }} /> : null}
        {fetched ? <BookshelfComponent books={booksdata} onBookClick={this.handleBookClick} storeBookDetails={this.props.storeBookDetails} storeSsoKey={this.props.storeSsoKey} locale={locale}/> : null}

      </div>
    );
  }
}

/* propTypes used for communication to child Component that which props are present in Parent Component. */

BookshelfPage.propTypes = {
  bookshelf: React.PropTypes.object.isRequired,
  fetch: React.PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  storeBookDetails: React.PropTypes.func,
  storeSsoKey: React.PropTypes.func,
};
