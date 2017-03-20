import { injectReducer } from '../../store/reducers';

export default store => ({
  path: '/site/bookshelf',
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Bookshelf = require('./containers/BookshelfContainer').default;
      const reducer = require('./modules/bookshelfReducer').default;

      /*  Add the reducer to the store on key 'bookshelf'  */
      injectReducer(store, { key: 'bookshelf', reducer });

      /*  Return getComponent   */
      cb(null, Bookshelf);

    /* Webpack named bundle   */
    }, 'bookshelf');
  }
});
