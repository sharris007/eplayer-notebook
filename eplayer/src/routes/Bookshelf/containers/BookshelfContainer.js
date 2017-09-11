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
import { connect } from 'react-redux'; /* Importing the react-redux library, connect method for connecting the react and redux-store. */
import { injectIntl } from 'react-intl';

import { fetch, storeBookDetails, storeSsoKey , getAuthToken , gotAuthToken } from '../modules/bookshelfActions'; /* Importing the defined method from reducers. */
import { getPiUserProfileService} from '../../../actions/playlist';
import { loadState } from '../../../localStorage';

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the bookshelf:   */

import BookshelfPage from '../components/Bookshelf';

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */


/* mapDispatchToProps method used for dispatcing the method from component to store. */

const mapDispatchToProps = {
  fetch,
  storeBookDetails,
  storeSsoKey,
  getAuthToken,
  gotAuthToken
 
};

/* mapStateToProps method used for connecting the state from the store to corresponding props,
to access your reducer state objects from within your React components. */

const mapStateToProps = state => ({
  bookshelf:state.bookshelf ? state.bookshelf : loadState('bookshelf') ? loadState('bookshelf') : {},
  book: state.book ? state.book : {},
  login: state.login ? state.login : loadState('login') ? loadState('login') : {}

});

/*  Note: mapStateToProps is where you should use `reselect` to create selectors, ie:

    import { createSelector } from 'reselect'
    const counter = (state) => state.counter
    const tripleCount = createSelector(counter, (count) => count * 3)
    const mapStateToProps = (state) => ({
      counter: tripleCount(state)
    })

    Selectors can compute derived data, allowing Redux to store the minimal possible state.
    Selectors are efficient. A selector is not recomputed unless one of its arguments change.
    Selectors are composable. They can be used as input to other selectors.
    https://github.com/reactjs/reselect    */

/* Connent used to connectivity between react and redux store. */
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BookshelfPage));
