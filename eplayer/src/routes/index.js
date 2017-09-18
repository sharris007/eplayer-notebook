// We only need to import the modules necessary for initial render
import { CoreLayout } from '../layouts/CoreLayout/CoreLayout';
import loginRoute from './Login';
import piLoginRoute from './Pilogin';
import bookshelfRoute from './Bookshelf';
import eTbookshelfRoute from './ETBookshelf';
import eTbookRoute from './ETBook';
import pdfbookRoute from './PdfBook';
import print from './Print';
import course from './Course';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = store => ({
  path: '/eplayer',
  component: CoreLayout,
  indexRoute: { onEnter: (nextState, replace) => replace('/eplayer/pilogin') },
  childRoutes: [
    loginRoute(store),
    bookshelfRoute(store),
    pdfbookRoute(store),
    eTbookshelfRoute(store),
    eTbookRoute(store),
    print(store),
    course(store),
    piLoginRoute(store)
  ]
});

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes;
