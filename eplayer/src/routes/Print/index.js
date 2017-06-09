// import { injectReducer } from '../../store/reducers';

export default () => ({
  path: '/eplayer/Print',
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Print = require('./components/Print').default;
      /*  Return getComponent   */
      cb(null, Print);

    /* Webpack named bundle   */
    }, 'print');
  }
});
