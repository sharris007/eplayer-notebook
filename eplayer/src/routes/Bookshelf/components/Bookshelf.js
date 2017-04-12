import React from 'react';
import { browserHistory } from 'react-router';
import { BookshelfComponent } from '@pearson-incubator/bookshelf';
import CircularProgress from 'material-ui/CircularProgress';
import isEmpty from 'lodash/isEmpty';
import errorCard from '../../../components/common/errorCard';
import BookshelfHeader from '../../../components/BookshelfHeader';
import './Bookshelf.scss';
import { clients } from '../../../components/common/client';


export default class BookshelfPage extends React.Component {
constructor(props) {
    super(props);
    this.props.fetchcdnToken()
    .then((data) => {})
  }
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

    const sessionid=this.props.login.data.token;
    const piToken = this.props.login.data.piToken;
    
    //const urn = 'http://sms.bookshelf.dev1.ebookplus.pearsoncmg.com/ebook/ipad/getuserbooks?siteid=11444&hsid=a37e42b90f86d8cb700fb8b61555bb22&key='+sessionid;
    this.props.storeSsoKey(sessionid);
    console.log('sessionid:: '+sessionid);

    //const urn ='http://10.102.88.150:8080/JavaSampleWebApp/TestServlet';
    var userlogin = this.props.login.data.userName;
    var password = this.props.login.data.password;
    
    //var urn = 'https://etext-qa-stg.pearson.com/api/nextext-api/v1/api/nextext/bookShelf?key='+sessionid+'&bookShelfMode=BOTH'
    var urn = 'bookShelf?key='+sessionid+'&bookShelfMode=BOTH'
    
    /*var postData = {
      chk_old: 'true',
      password: 'a17a41337551d6542fd005e18b43afd4',
      languageId: '1',
      piToken: piToken
    }*/
    this.props.fetch(urn, piToken);
    console.log(urn);
    
  }


  handleBookClick = (bookId,iseT1) => {
    /*browserHistory.push(`/book/${bookId}?bookid=${bookId}&updfUrl=${updfUrl}`);*/
    if(iseT1)
    {
     browserHistory.push(`/eplayer/pdfbook/${bookId}`);
    }
    else
    {
      browserHistory.push(`/eplayer/ETbook/${bookId}`);
    }
  }

  render() {
    console.log(this.props.bookshelf.cdnToken);
    const { books, fetching, fetched, error } = this.props.bookshelf;
    const booksdata = [];
    if (fetched && !isEmpty(books)) {
     //books.data.forEach((allBooks) => {
      books.data.entries.forEach((bookData) => {
        const bookRef = bookData;
        if(bookRef.bookId==='3BKZBJB2QB' || bookRef.bookId==='8DJBSW6MHR')
        {
          bookRef.thumbnailImageUrl='http://images.contentful.com/tbx6i45kvpo5/28WYeWCc3aauKkWkiYaua2/489832c2bdb06b7245479e887ccfea06/cite_elements_cover';
        }
        const book = {
          //id: 'urn:pearson:context:f3c7a5d0-7f38-4166-ac42-1a516b907760'/* bookRef.manifestId || ''*/,
          //author: bookRef.author || '',
          //image: bookRef.thumbnail ? bookRef.thumbnail.src : '',
          //title: bookRef.title || '',
          //description: bookRef.description || '',
          //tocId: ''
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
           userBookScenarioLastModifiedDate: bookRef.userBookScenarioLastModifiedDate
        };
        booksdata.push(book);
        //console.log("globalBookId :: "+book.globalBookId);
      });
    }

    if (error) {
      return errorCard('Error', error.message);
    }

    return (
      <div id="bookshelf-page">
        <BookshelfHeader firstName={this.props.login.data.firstName} lastName={this.props.login.data.lastName}/>
        {fetching ? <CircularProgress style={{ margin: '40px auto', display: 'block' }} /> : null}
        {fetched ? <BookshelfComponent books={booksdata} onBookClick={this.handleBookClick} storeBookDetails={this.props.storeBookDetails} storeSsoKey={this.props.storeSsoKey}/> : null}

      </div>
    );
  }
}

BookshelfPage.propTypes = {
  bookshelf: React.PropTypes.object.isRequired,
  fetch: React.PropTypes.func.isRequired,
  //storeUPdfUrl: React.PropTypes.func,
  //storeBookServerDetails: React.PropTypes.func,
  storeBookDetails: React.PropTypes.func,
  storeSsoKey: React.PropTypes.func,
   fetchcdnToken:React.PropTypes.func
};
