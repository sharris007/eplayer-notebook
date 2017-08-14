import { connect } from 'react-redux';/* Importing react-redux library for connect method which is used for connecting the react with redux store. */
import { fetchBookmarksUsingReaderApi, addBookmarkUsingReaderApi, removeBookmarkUsingReaderApi,
         fetchTocAndViewer, goToPage, fetchBookInfo, fetchPageInfo, fetchUserInfo,
         fetchHighlightUsingReaderApi, saveHighlightUsingReaderApi, removeHighlightUsingReaderApi,
         loadAssertUrl, editHighlightUsingReaderApi, fetchRegionsInfo, fetchUserIcons,fetchPagebyPageNumber, fetchBookFeatures, fetchGlossaryItems, fetchBasepaths } from '../modules/pdfbook';/* Importing the action creator from reducer to container. */
import { loadState } from '../../../localStorage'; 
/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the bookshelf:   */

import { PdfBook } from '../components/PdfBook';

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

/* Method used for connecting the store methods with component. when any action dispatched by component. */

const mapDispatchToProps = {
  fetchTocAndViewer,
  fetchBookmarksUsingReaderApi,
  addBookmarkUsingReaderApi,
  removeBookmarkUsingReaderApi,
  goToPage,
  fetchBookInfo,
  fetchPageInfo,
  fetchUserInfo,
  fetchHighlightUsingReaderApi,
  saveHighlightUsingReaderApi,
  removeHighlightUsingReaderApi,
  loadAssertUrl,
  editHighlightUsingReaderApi,
  fetchRegionsInfo,
  fetchPagebyPageNumber,
  fetchUserIcons,
  fetchBookFeatures,
  fetchGlossaryItems,
  fetchBasepaths
};

/* Method used for connecting and accessing the state data in component via props. */
const mapStateToProps = state => ({
  book: state.book ? state.book : {},
  bookshelf:state.bookshelf ? state.bookshelf : loadState('bookshelf') ? loadState('bookshelf') : {},
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

/* Method used for connecting the component with redux store. */
export default connect(mapStateToProps, mapDispatchToProps)(PdfBook);
