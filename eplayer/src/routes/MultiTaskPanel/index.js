import { injectReducer } from '../../store/reducers';

export default store => ({
  path: '/eplayer/MultiTaskPanel',
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const MultiTaskPanel = require('./components/MultiTaskPanel').default;
      // const reducer = require('../../store/multitaskpanel').default;

      /*  Add the reducer to the store on key 'counter'  */
      // debugger;
      // injectReducer(store, { key: 'multitaskpanel', reducer });

      /*  Return getComponent   */
      cb(null, MultiTaskPanel);

    /* Webpack named bundle   */
    }, 'multiTaskPanel');
  }
});
