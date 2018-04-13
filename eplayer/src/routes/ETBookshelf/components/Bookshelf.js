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
    const urn = 'urn:pearson:manifestation:16b1c52c-dbe7-486c-9103-5837b241ee61';
    this.props.fetch(urn);
  }

  handleBookClick = (bookId) => {
    // browserHistory.push(`/eplayer/ETbook/${bookId}`);
    browserHistory.push(`/eplayer/ISEdashboard/${bookId}`);
  }

  render() {
    const { books, fetching, fetched, error } = this.props.bookshelf;
    const booksdata = [];
    if (fetched && !isEmpty(books)) {
      books.data.entries.forEach((bookData) => {
        const bookRef = bookData;
        const book = {
          id: bookRef.bookId || '',
          author: bookRef.creator || '',
          image: bookRef.thumbnailImageUrl,
          title: bookRef.title || '',
          description: bookRef.description || '',
          tocId: ''
        };
        booksdata.push(book);
      });
    }

    if (error) {
      return errorCard('Error', error.message);
    }

    return (
      <div id="bookshelf-page">
        <BookshelfHeader />
        {fetching ? <CircularProgress style={{ margin: '40px auto', display: 'block' }} /> : null}
        {fetched ? <Bookshelf books={booksdata} onBookClick={this.handleBookClick} /> : null}
      </div>
    );
  }
}

BookshelfPage.propTypes = {
  bookshelf: React.PropTypes.object.isRequired,
  fetch: React.PropTypes.func.isRequired
};
