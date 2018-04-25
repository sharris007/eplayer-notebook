/** *****************************************************************************
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
// We only need to import the modules necessary for initial render
import { CoreLayout } from '../layouts/CoreLayout/CoreLayout';
import loginRoute from './Login';
import piLoginRoute from './Pilogin';
import bookshelfRoute from './Bookshelf';
import eTbookshelfRoute from './ETBookshelf';
import eTbookRoute from './ETBook';
import print from './Print';
import course from './Course';
import errorRoute from './Error';
import validateUserRoute from './ValidateUser';
import pdfbookErrorRoute from './PdfBookError';
import notebookRoute from './NoteBook';
import pdfbookRoute from './PdfBookRoute';
import deepLink from './DeepLink';
import dashboardRoute from './Dashboard';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = store => ({
  path: '/eplayer',
  component: CoreLayout,
  indexRoute: { onEnter: (nextState, replace) => replace('/eplayer/pilogin') },
  childRoutes: [
    loginRoute(store),
    bookshelfRoute(store),
    eTbookshelfRoute(store),
    dashboardRoute(store),
   
    print(store),
    course(store),
    piLoginRoute(store),
    errorRoute(store),
    validateUserRoute(store),
    pdfbookErrorRoute(store),
    notebookRoute(store),
    pdfbookRoute(store),    
	  deepLink(store)
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
