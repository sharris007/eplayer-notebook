import { connect } from 'react-redux'; /* Importing the react-redux library, connect method for connecting the react and redux-store. */
import { injectIntl } from 'react-intl';

import { fetch, storeBookDetails, storeSsoKey } from '../modules/bookshelfActions'; /* Importing the defined method from reducers. */


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
  storeSsoKey

};

/* mapStateToProps method used for connecting the state from the store to corresponding props,
to access your reducer state objects from within your React components. */

const mapStateToProps = state => ({
  bookshelf: state.bookshelf ? state.bookshelf : {},
  login: state.login ? state.login : {},
  book: state.book ? state.book : {}
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
