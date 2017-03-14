import React from 'react';
import { browserHistory } from 'react-router';
import { Bookshelf } from '@pearson-incubator/bookshelf';
import CircularProgress from 'material-ui/CircularProgress';
import isEmpty from 'lodash/isEmpty';
import errorCard from '../../../components/common/errorCard';
import BookshelfHeader from '../../../components/BookshelfHeader';
import './Bookshelf.scss';


export default class BookshelfPage extends React.Component {

componentWillMount() {
    const sessionid=this.props.location.query.key;
    const urn = 'http://sms.bookshelf.dev1.ebookplus.pearsoncmg.com/ebook/ipad/getuserbooks?siteid=11444&hsid=a37e42b90f86d8cb700fb8b61555bb22&key=807027958946346552142017';
    this.props.storeSsoKey(sessionid);
    //const urn ='http://10.102.88.150:8080/JavaSampleWebApp/TestServlet';
    this.props.fetch(urn);

  }


  handleBookClick = (bookId,iseT1) => {
    /*browserHistory.push(`/book/${bookId}?bookid=${bookId}&updfUrl=${updfUrl}`);*/
    if(iseT1)
    {
     browserHistory.push(`/eplayer/pdfbook/${bookId}`);
    }
    else
    {
      browserHistory.push(`/eplayer/book/${bookId}`);
    }
  }

  render() {
    const { books, fetching, fetched, error } = this.props.bookshelf;
    const booksdata = [];
    if (fetched && !isEmpty(books)) {
      books.data.forEach((allBooks) => {
      allBooks.entries.forEach((bookData) => {
        const bookRef = bookData;
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
           bookeditionid: bookRef.bookeditionid,
           iseT1 : bookRef.iseT1
        };
        booksdata.push(book);
      });
    });
    }

    if (error) {
      return errorCard('Error', error.message);
    }

    return (
      <div id="bookshelf-page">
        <BookshelfHeader />
        {fetching ? <CircularProgress style={{ margin: '40px auto', display: 'block' }} /> : null}
        {fetched ? <Bookshelf books={booksdata} onBookClick={this.handleBookClick} storeUPdfUrl={this.props.storeUPdfUrl} storeBookDetails={this.props.storeBookDetails} storeSsoKey={this.props.storeSsoKey}/> : null}

      </div>
    );
  }
}

BookshelfPage.propTypes = {
  bookshelf: React.PropTypes.object.isRequired,
  fetch: React.PropTypes.func.isRequired,
  storeUPdfUrl: React.PropTypes.func,
  storeBookDetails: React.PropTypes.func,
  storeSsoKey: React.PropTypes.func
};