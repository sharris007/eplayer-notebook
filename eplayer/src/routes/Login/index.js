import { injectReducer } from '../../store/reducers';

export default store => ({
  path: '/eplayer/login',
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const LoginPage = require('./containers/LoginContainer').default;
      const reducer = require('./modules/loginReducer').default;

          injectReducer(store, { key: 'login', reducer });


      /*  Return getComponent   */
      cb(null, LoginPage);

    /* Webpack named bundle   */
    }, 'login');
  }
});
