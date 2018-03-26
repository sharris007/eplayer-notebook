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
/* global localStorage, piSession, $*/
import React, { Component } from 'react';/* Importing the react and component from react library. */
import RefreshIndicator from 'material-ui/RefreshIndicator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import Cookies from 'universal-cookie';
import PdfPlayer from '../../../components/PdfPlayer';
import { eT1Contants } from '../../../components/common/et1constants';
import { domain } from '../../../../const/Settings';
import { getmd5 } from '../../../components/Utility/Util';
import { fetchChapterLevelPdf, fetchbookDetails } from '../modules/service';
import PdfViewer from './PdfViewer';
import { search } from '../modules/actions/searchActions';
// import { PdfViewer } from '@pearson-incubator/vega-viewer';

/* Creating PdfBook component. */
export class PdfBook extends Component {
  constructor(props) {
    super(props);
    document.title = 'Pearson eText';
    const cookies = new Cookies();
    if (this.props.location.query.invoketype !== undefined && this.props.location.query.invoketype === 'pi') {
      const bookshelfhsid = this.props.location.query.hsid;
      const bookhsid = getmd5(`bookid=${this.props.location.query.bookid}&invoketype=` +
        `${this.props.location.query.invoketype}${eT1Contants.BOOKSHELF_MD5_SECRET_KEY}`);
      if (bookhsid === bookshelfhsid) {
        // console.log("bookshelf hsid match success. Continue to launch the title");
      } else {
        // console.log("bookshelf hsid match failure. Show the error page");
        browserHistory.push('/eplayer/pdfbookerror?errorcode=2');
      }
      const appPath = window.location.origin;
      let redirectBookUrl = `${appPath}/eplayer/pdfbook?bookid=${this.props.location.query.bookid}&invoketype=pi` +
      `&hsid=${this.props.location.query.hsid}`;
      redirectBookUrl = decodeURIComponent(redirectBookUrl).replace(/\s/g, '+').replace(/%20/g, '+');
      piSession.getToken((result, userToken) => {
        if (result === piSession.Success) {
          localStorage.setItem('secureToken', userToken);
        } else if (result === 'unknown' || result === 'notoken') {
          piSession.login(redirectBookUrl, 10);
        }
      });
    } else if (this.props.location.query.invoketype !== undefined && this.props.location.query.invoketype === 'et1') {
      const cookieValue = cookies.get('ReactPlayerCookie');
      if (cookieValue !== undefined && cookieValue !== 'ReactPlayerCookie') {
        browserHistory.push('/eplayer/login');
      }
    } else {
      browserHistory.push('/eplayer/pdfbookerror?errorcode=2');
    }
    this.currentbook = {};
  }

  async componentDidMount() {
    const envType = domain.getEnvType();
    let identityId;
    let uid;
    let ubd;
    let ubsd;
    let serverDetails;
    let roleTypeID;
    const currentbook = {};
    let firstName;
    let lastName;
    let expirationDate;
    let userEmailId;
    const bookID = this.props.location.query.bookid;
    let bookData = {};
    if ((this.props.location.query.invoketype !== undefined &&
        this.props.location.query.invoketype === 'pi') || (this.props.currentbook.globalUserId !== undefined &&
        this.props.location.query.invoketype !== undefined && this.props.location.query.invoketype === 'et1')) {
      if (this.props.currentbook !== undefined) {
        if (this.props.login.data !== undefined) {
          identityId = this.props.login.data.identityId;
        } else {
          identityId = localStorage.getItem('identityId');
        }
        if (identityId === undefined || identityId === '' || identityId === null) {
          identityId = this.props.currentbook.globalUserId;
        }
        uid = this.props.currentbook.uid;
        ubd = this.props.currentbook.ubd;
        ubsd = this.props.currentbook.ubsd;
        serverDetails = this.props.currentbook.serverDetails;
        roleTypeID = this.props.currentbook.roleTypeID;
        firstName = this.props.currentbook.firstName;
        lastName = this.props.currentbook.lastName;
        expirationDate = this.props.currentbook.expirationDate;
        userEmailId = this.props.currentbook.userEmailId;
      } else {
        piSession.getToken((result, userToken) => {
          if (result === 'success') {
            localStorage.setItem('secureToken', userToken);
          }
        });
        const secureToken = localStorage.getItem('secureToken');
        const urn = 'compositeBookShelf';
        await fetchbookDetails(urn, secureToken, bookID).then((bookDetails) => {
          if (bookDetails) {
            bookData = bookDetails;
          }
        });
        identityId = bookData.globalUserId;
        uid = bookData.userInfoLastModifiedDate;
        ubd = bookData.userBookLastModifiedDate;
        ubsd = bookData.userBookScenarioLastModifiedDate;
        serverDetails = bookData.bookServerUrl;
        roleTypeID = bookData.roleTypeID;
        firstName = bookData.firstName;
        lastName = bookData.lastName;
        expirationDate = bookData.expirationDate;
        userEmailId = bookData.userEmailId;
      }
    } else if (this.props.location.query.invoketype !== undefined && this.props.location.query.invoketype === 'et1') {
      const islocal = this.props.location.query.islocal;
      const ispxedev = this.props.location.query.ispxedev;
      let querystr = window.location.search.substring(1);
      const serverhsid = this.props.location.query.hsid;
      if (islocal !== undefined && islocal !== '' && islocal !== null) {
        querystr = querystr.replace('&islocal=Y', '');
      }
      if (ispxedev !== undefined && ispxedev !== '' && ispxedev !== null) {
        querystr = querystr.replace('&ispxedev=Y', '');
      }
      querystr = querystr.replace(`&hsid=${serverhsid}`, '');
      const clienthsid = getmd5(querystr + eT1Contants.DEEPLINK_MD5_SECRET_KEY);
      if (clienthsid === serverhsid) {
          // console.log("hsid match success. Continue to launch the title")
      } else {
          // console.log("hsid match failure. Show the error page")
        browserHistory.push('/eplayer/pdfbookerror?errorcode=2');
      }
      if (this.props.location.query.bookserver !== undefined) {
        const bookserverno = this.props.location.query.bookserver;
        let bookserver;
        if (envType === 'qa') {
          bookserver = `CERT${bookserverno}`;
        } else if (envType === 'stage') {
          bookserver = `PPE${bookserverno}`;
        } else if (envType === 'prod') {
          bookserver = `PROD${bookserverno}`;
        }
        serverDetails = eT1Contants.ServerUrls[envType][bookserver];
      }
      identityId = this.props.location.query.smsuserid;
      uid = this.props.location.query.uid;
      ubd = this.props.location.query.ubd;
      ubsd = this.props.location.query.ubsd;
      roleTypeID = this.props.location.query.roletypeid;
    }
    currentbook.serverDetails = serverDetails;
    if (this.props.location.query.invoketype !== undefined &&
          this.props.location.query.invoketype === 'pi' && this.props.location.query.userid === undefined) {
      await this.props.actions.getlocaluserID(serverDetails, identityId, 'sms');
    } else {
      await this.props.actions.updateUserID(this.props.location.query.userid);
    }
    if (this.props.location.query.scenario) {
      if (this.props.location.query.scenario === _.toString(eT1Contants.SCENARIOS.S1) ||
          this.props.location.query.scenario === _.toString(eT1Contants.SCENARIOS.S3) ||
          this.props.location.query.scenario === _.toString(eT1Contants.SCENARIOS.S11)) {
        currentbook.pageNoTolaunch = this.props.location.query.pagenumber;
      } else if (this.props.location.query.scenario === _.toString(eT1Contants.SCENARIOS.S6) ||
        this.props.location.query.scenario === _.toString(eT1Contants.SCENARIOS.S88)) {
        currentbook.startpage = this.props.location.query.startpage;
        currentbook.endpage = this.props.location.query.endpage;
      }
      currentbook.scenario = this.props.location.query.scenario;
    }
    if ((this.props.location.query.invoketype !== undefined &&
            this.props.location.query.invoketype === 'pi') || currentbook.scenario === undefined) {
      currentbook.scenario = _.toString(eT1Contants.SCENARIOS.S1);
    }
    let authkey;
    if (this.props.location.query.invoketype && this.props.location.query.invoketype === 'pi') {
      const piToken = localStorage.getItem('secureToken');
      await this.props.actions.validateUser(this.props.book.userInfo.userid, currentbook.scenario,
        this.props.location.query.invoketype, bookID, roleTypeID, piToken, serverDetails);
      authkey = this.props.book.sessionInfo.ssoKey;
    } else {
      authkey = this.props.location.query.sessionid;
    }
    await this.props.actions.fetchBookInfo(bookID, currentbook.scenario,
      this.props.book.userInfo.userid, serverDetails, roleTypeID, uid, ubd, ubsd, identityId, authkey);
    if (!this.props.book.bookinfo.fetched) {
      browserHistory.push('/eplayer/pdfbookerror?errorcode=2');
    }
    currentbook.globaluserid = identityId;
    currentbook.authorName = bookData.author ? bookData.author : this.props.book.bookinfo.book.author;
    let tempThumbnail = bookData.image ? bookData.image : this.props.book.bookinfo.book.thumbnailimg;
    if (tempThumbnail.indexOf('http') !== 0) {
      tempThumbnail = `${serverDetails}/ebookassets/${this.props.book.bookinfo.book.globalbookid}${tempThumbnail}`;
    }
    currentbook.thumbnail = tempThumbnail;
    currentbook.title = bookData.title ? bookData.title : this.props.book.bookinfo.book.title;
    currentbook.globalBookId = bookData.globalBookId ?
      bookData.globalBookId : this.props.book.bookinfo.book.globalbookid;
    currentbook.platform = this.props.location.query.platform ?
                             this.props.location.query.platform : undefined;
    currentbook.languageid = this.props.location.query.languageid ?
                               this.props.location.query.languageid : undefined;
    currentbook.ssoKey = authkey;
    currentbook.firstName = firstName;
    currentbook.lastName = lastName;
    currentbook.expirationDate = expirationDate;
    currentbook.userEmailId = userEmailId;
    currentbook.bookId = bookID;
    currentbook.bookeditionid = this.props.book.bookinfo.book.bookeditionid;
    currentbook.roletypeid = roleTypeID;
    currentbook.userbookid = this.props.book.bookinfo.userbook.userbookid;
    currentbook.version = this.props.book.bookinfo.book.version;
    currentbook.hastocflatten = this.props.book.bookinfo.book.hastocflatten;
    currentbook.languageid = this.props.book.bookinfo.book.languageid;
    currentbook.activeCourseID = this.props.book.bookinfo.book.activeCourseID;
    this.props.actions.fetchBookFeatures(bookID, currentbook.ssoKey, this.props.book.userInfo.userid,
      serverDetails, this.props.book.bookinfo.book.roleTypeID, currentbook.scenario);
    this.props.actions.fetchPageInfo(currentbook, this.props.book.userInfo.userid, authkey);
    let courseId = _.toString(this.props.book.bookinfo.book.activeCourseID);
    if (courseId === undefined || courseId === '' || courseId === null) {
      courseId = -1;
    }
    currentbook.courseId = courseId;
    this.currentbook = currentbook;
  }

  componentWillUnmount() {
    this.props.actions.restoreBookState();
  }

  getPageCount = () => {
    const pagecount = this.props.book.bookinfo.book.numberOfPages;
    return pagecount;
  }

  getpiSessionKey = () => {
    let piSessionKey;
    piSession.getToken((result, userToken) => {
      if (result === 'success') {
        piSessionKey = userToken;
      }
    });
    if (piSessionKey === undefined) {
      piSessionKey = localStorage.getItem('secureToken');
    }
    return piSessionKey;
  }

  handleBookshelfClick = () => {
    this.props.actions.restoreBookState();
    browserHistory.push('/eplayer/bookshelf');
  }

  render() {
    const { bookinfo, bookPagesInfo, bookFeatures, tocData, bookmarkData, annotationData } = this.props.book;
    let pagePlayList = [];
    if (bookinfo.fetched && bookPagesInfo.fetched && bookFeatures.fetched) {
      const auth = {
        userid: this.props.book.userInfo.userid,
        sessionId: this.props.book.sessionInfo.ssoKey ?
          this.props.book.sessionInfo.ssoKey : this.props.location.query.sessionid,
        piToken: this.getpiSessionKey()
      };
      let envType;
      if (domain.getEnvType() === 'qa' || domain.getEnvType() === 'stage') {
        envType = 'nonprod';
      } else if (domain.getEnvType() === 'prod') {
        envType = 'prod';
      } else {
        envType = 'nonprod';
      }
      const preferences = {
            // showHeader holds true if any of header menu item made visible from authoring application for a specific title
        showHeader: !!((bookFeatures.hassearchbutton || bookFeatures.hasbookshelflink ||
              bookFeatures.hasbookmarkpagebutton || bookFeatures.haslogoutlink ||
              bookFeatures.haszoomoutbutton || bookFeatures.haszoominbutton || bookFeatures.hasdrawerbutton)),
            // showFooter holds true if next or previous navigation button made visible from authoring application for a specific title
        showFooter: !!((bookFeatures.hasprevnavpagebutton || bookFeatures.hasnextnavpagebutton)),
            // showDrawer holds true if drawer icon made visible from authoring application for a specific title
        showDrawer: !!bookFeatures.hasdrawerbutton,
            // showAnnotation holds true if highlight or note feature is enabled from authoring application for a specific title
        showAnnotation: !!((bookFeatures.hashighlightingtoolbutton || bookFeatures.hasnotetoolbutton)),
            // showBookmark holds true if bookmark feature is enabled from authoring application for a specific title
        showBookmark: !!bookFeatures.hasbookmarkpagebutton,
            // showHostpot is always true since we do not have any option to disable it from authoring application
        showHostpot: true,
            // Locale of text used in pdfplayer decided by locale value passed here.
        locale: 'en-US',
            // if showBookshelfBack is true then backtobookshelf button will be visible in header component and vice versa.
        showBookshelfBack: true
      };
      // For preference setting for testing
      /* let preferences = {
            showHeader: true,
            showFooter: true,
            showDrawer: false,
            showAnnotation: false,
            showBookmark: false,
            showHostpot: false,
            locale: 'en-US',
            showBookshelfBack: true
      };*/
      const annotations = {
        load: {
          get: this.props.actions.getAnnotations
        },
        data: annotationData,
        operation: {
          post: this.props.actions.postAnnotation,
          put: this.props.actions.putAnnotation,
          delete: this.props.actions.deleteAnnotation
        }
      };
      const bookmarks = {
        load: {
          get: this.props.actions.getBookmarks
        },
        data: bookmarkData,
        operation: {
          post: this.props.actions.postBookmark,
          delete: this.props.actions.deleteBookmark
        }
      };
      const bookCallbacks = {};
      bookCallbacks.handleBookshelfClick = this.handleBookshelfClick;
      bookCallbacks.fetchChapterLevelPdf = fetchChapterLevelPdf;
      this.currentbook.bookFeatures = bookFeatures;

      const tocCompData = {
        separateToggleIcon: true,
        data: tocData || {},
        depth: 5,
        childField: 'children',
        isTocWrapperRequired: false
      };

      const toc = {
        load: {
          get: this.props.actions.fetchToc
        },
        data: tocCompData
      };

      const hotspots = {
        load: {
          get: this.props.actions.fetchRegionsInfo
        },
        data: this.props.book.regionsData
      };

      const searchBook = {
        load: {
          get: search
        }
      };

      const basepaths = {
        load: {
          get: this.props.actions.fetchBasepaths
        },
        data: this.props.book.basepaths
      };
      const glossary = {
        load: {
          get: this.props.actions.fetchGlossaryItems
        },
        data: this.props.book.glossaryInfoList
      };
      if (this.currentbook.pageNoTolaunch) {
        const page = _.find(bookPagesInfo.pages, page => page.pagenumber === this.currentbook.pageNoTolaunch);
        this.currentbook.pageIndexTolaunch = page ? page.id : 1;
      }
      if (this.props.location.query.scenario === _.toString(eT1Contants.SCENARIOS.S6) ||
        this.props.location.query.scenario === _.toString(eT1Contants.SCENARIOS.S88)) {
        const startPageIndex = _.findIndex(this.props.book.bookPagesInfo.pages,
          page => page.pagenumber === this.props.location.query.startpage);
        const endPageIndex = _.findIndex(this.props.book.bookPagesInfo.pages,
          page => page.pagenumber === this.props.location.query.endpage);
        pagePlayList = this.props.book.bookPagesInfo.pages.slice(startPageIndex, endPageIndex + 1);
        if (bookPagesInfo.pages.length === this.props.book.bookinfo.book.numberOfPages + 1) {
          this.currentbook.startPageNo = startPageIndex;
          this.currentbook.lastPage = endPageIndex;
        } else {
          this.currentbook.startPageNo = startPageIndex + 1;
          this.currentbook.lastPage = endPageIndex + 1;
        }
        this.currentbook.totalpages = pagePlayList.length;
        preferences.showDrawer = false;
      } else {
        pagePlayList = bookPagesInfo.pages;
        this.currentbook.totalpages = this.props.book.bookinfo.book.numberOfPages;
        this.currentbook.lastPage = bookPagesInfo.pages[this.props.book.bookinfo.book.numberOfPages - 1].id;
      }
      const parentType = 'eT1';
      return (
        <PdfViewer
          pdfplayercomp={<PdfPlayer
            pagePlayList={pagePlayList}
            annotations={annotations}
            auth={auth}
            bookmarks={bookmarks}
            toc={toc}
            metaData={this.currentbook}
            bookCallbacks={bookCallbacks}
            parentType={parentType}
            hotspots={hotspots}
            search={searchBook}
            basepaths={basepaths}
            preferences={preferences}
            glossary={glossary}
            envType={envType}
            logoutUserSession={this.props.actions.logoutUserSession}
          />}
        />);
    }
    return (
      <div className="centerCircularBar">
        <RefreshIndicator size={50} left={0.48 * $(window).width()} top={200} status="loading" />
      </div>);
  }
}

PdfBook.propTypes = {
  location: PropTypes.object,
  book: PropTypes.object,
  actions: PropTypes.object
};

PdfBook.defaultProps = {

};
export default PdfBook;
