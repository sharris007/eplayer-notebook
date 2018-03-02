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
/* global localStorage */
import React, { Component } from 'react';/* Importing the react and component from react library. */
import CircularProgress from 'material-ui/CircularProgress';/* Import the CircularProgress for adding the progressBar. */
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { addLocaleData } from 'react-intl';
import PdfPlayer from '../../../components/PdfPlayer';
import { languages } from '../../../../locale_config/translations/index';
import languageName from '../../../../locale_config/configureLanguage';
import { eT1Contants } from '../../../components/common/et1constants';
import { resources, domain } from '../../../../const/Settings';
import { getmd5 } from '../../../components/Utility/Util';
import { browserHistory } from 'react-router'; 
import Cookies from 'universal-cookie';
import { fetchChapterLevelPdf } from '../modules/service';

/* Creating PdfBook component. */
export class PdfBook extends Component {
  constructor(props) {
    super(props);
    document.title = 'Pearson eText';
    const cookies = new Cookies();
    if(this.props.location.query.invoketype !== undefined && this.props.location.query.invoketype === 'pi') {
      var bookshelfhsid = this.props.location.query.hsid;
      let bookhsid = getmd5('bookid='+this.props.location.query.bookid+'&invoketype='+this.props.location.query.invoketype+eT1Contants.BOOKSHELF_MD5_SECRET_KEY);
      if(bookhsid == bookshelfhsid) {   
        // console.log("bookshelf hsid match success. Continue to launch the title");
      }   
      else {   
        // console.log("bookshelf hsid match failure. Show the error page");
        browserHistory.push('/eplayer/pdfbookerror?errorcode=2');
      } 
      let appPath             = window.location.origin;
      let redirectBookUrl   = appPath+'/eplayer/pdfbook?bookid='+this.props.location.query.bookid+'&invoketype=pi'+'&hsid='+this.props.location.query.hsid;
      redirectBookUrl       = decodeURIComponent(redirectBookUrl).replace(/\s/g, "+").replace(/%20/g, "+");
      piSession.getToken((result, userToken) => {
      if (result === piSession.Success) {
        localStorage.setItem('secureToken',userToken);
      }
      else if(result === 'unknown' || result === 'notoken' ){
        piSession.login(redirectBookUrl, 10);
      }});
    }
    else if(this.props.location.query.invoketype !== undefined && this.props.location.query.invoketype === 'et1') {
      const cookieValue = cookies.get('ReactPlayerCookie');
      if(cookieValue !== undefined && cookieValue != 'ReactPlayerCookie') {
        browserHistory.push('/eplayer/login');
      }
    }
    else {
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
    let ssoKey;
    let serverDetails;
    let langID;
    let roleTypeID;
    let currentbook = {};
    let firstName;
    let lastName;
    let expirationDate;
    let userEmailId;
    let bookID = this.props.location.query.bookid;
    let bookData = {};
    if ((this.props.location.query.invoketype !== undefined && 
            this.props.location.query.invoketype === 'pi') || (this.props.currentbook.globalUserId !== undefined && this.props.location.query.invoketype !== undefined && 
            this.props.location.query.invoketype === 'et1')) {
        if(this.props.currentbook !== undefined) {
          if(this.props.login.data !== undefined) {
              identityId = this.props.login.data.identityId;            
          } else {
              identityId = localStorage.getItem('identityId');
          }
          if(identityId === undefined || identityId === '' || identityId === null) {
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
        }
        else {
          piSession.getToken(function(result, userToken) {
            if(result === 'success') {
              localStorage.setItem('secureToken',userToken);
            }
          }); 
          const secureToken  = localStorage.getItem('secureToken');
          let urn = 'compositeBookShelf';
          await this.props.actions.fetchbookDetails(urn, secureToken,bookID).then((bookDetails) => {
            if(bookDetails) {
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
      }
      else if (this.props.location.query.invoketype != undefined && this.props.location.query.invoketype == 'et1') { 
        const islocal = this.props.location.query.islocal;
        const ispxedev = this.props.location.query.ispxedev; 
        let querystr = window.location.search.substring(1);
        let serverhsid = this.props.location.query.hsid; 
        if(islocal !== undefined && islocal !== '' && islocal !== null) {
          querystr = querystr.replace("&islocal=Y","");
        }
        if(ispxedev !== undefined && ispxedev !== '' && ispxedev !== null) {
          querystr = querystr.replace("&ispxedev=Y","");
        }   
        querystr = querystr.replace("&hsid="+serverhsid,"");  
        let clienthsid = getmd5(querystr+eT1Contants.DEEPLINK_MD5_SECRET_KEY);   
        if(clienthsid == serverhsid) {   
          // console.log("hsid match success. Continue to launch the title")   
        }   
        else { 
          // console.log("hsid match failure. Show the error page")  
          browserHistory.push('/eplayer/pdfbookerror?errorcode=2');
        }  
        if(this.props.location.query.bookserver !== undefined) {
          const bookserverno = this.props.location.query.bookserver;
          let bookserver;
          if (envType == 'qa') {
            bookserver = 'CERT'+bookserverno;
          }
          else if(envType == 'stage') {
            bookserver = 'PPE'+bookserverno;
          }
          else if(envType == 'prod') {
            bookserver = 'PROD'+bookserverno;
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
        await this.props.actions.getlocaluserID(serverDetails,identityId,'sms');
      }
      else {
        this.props.actions.updateUserID(this.props.location.query.userid);
      }
      if(this.props.location.query.scenario) {
        if(this.props.location.query.scenario == eT1Contants.SCENARIOS.S1 || this.props.location.query.scenario == eT1Contants.SCENARIOS.S3
              || this.props.location.query.scenario == eT1Contants.SCENARIOS.S11) {   
          currentbook.pageNoTolaunch = this.props.location.query.pagenumber;    
        }   
        else if(this.props.location.query.scenario == eT1Contants.SCENARIOS.S6 || this.props.location.query.scenario == eT1Contants.SCENARIOS.S88) {  
          currentbook.startpage = this.props.location.query.startpage;    
          currentbook.endpage = this.props.location.query.endpage;    
        }   
        currentbook.scenario = this.props.location.query.scenario;    
      }
      if((this.props.location.query.invoketype !== undefined && 
            this.props.location.query.invoketype === 'pi') || currentbook.scenario == undefined) {
        currentbook.scenario = eT1Contants.SCENARIOS.S1;
      }
      let authkey;
      if(this.props.location.query.invoketype && this.props.location.query.invoketype === 'pi') {
          const piToken  = localStorage.getItem('secureToken');
          await this.props.actions.validateUser(this.props.book.userInfo.userid,currentbook.scenario,this.props.location.query.invoketype,
                    bookID,roleTypeID,piToken,serverDetails);
          authkey = this.props.book.sessionInfo.ssoKey;
      }
      else {
        authkey = this.props.location.query.sessionid;
      }
      await this.props.actions.fetchBookInfo(bookID, currentbook.scenario,
                this.props.book.userInfo.userid, serverDetails, roleTypeID,uid,ubd,ubsd,identityId,authkey);
      if(!this.props.book.bookinfo.fetched) {
        browserHistory.push('/eplayer/pdfbookerror?errorcode=2');
      }
      currentbook.globaluserid = identityId;
      currentbook.authorName = bookData.author ? bookData.author : this.props.book.bookinfo.book.author;
      let tempThumbnail = bookData.image ? bookData.image : this.props.book.bookinfo.book.thumbnailimg;
      if(tempThumbnail.indexOf("http") !== 0) {
        tempThumbnail = serverDetails+'/ebookassets/'+this.props.book.bookinfo.book.globalbookid+tempThumbnail;
      }
      currentbook.thumbnail = tempThumbnail;
      currentbook.title = bookData.title ? bookData.title : this.props.book.bookinfo.book.title;
      currentbook.globalBookId = bookData.globalBookId ? bookData.globalBookId : this.props.book.bookinfo.book.globalbookid;
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
      currentbook.hastocflatten = this.props.book.bookinfo.book.hastocflatten
      await this.props.actions.fetchBookFeatures(bookID,currentbook.ssoKey, this.props.book.userInfo.userid, serverDetails, this.props.book.bookinfo.book.roleTypeID,currentbook.scenario); 
      this.props.actions.fetchPageInfo(this.getAuthDetails(),currentbook);
      // this.props.actions.fetchTocAndViewer(
      //   bookID, currentbook.authorName, currentbook.title, currentbook.thumbnail,
      //   this.props.book.bookinfo.book.bookeditionid, currentbook.ssoKey, serverDetails,
      //   this.props.book.bookinfo.book.hastocflatten, this.props.book.bookinfo.book.roleTypeID);
      const locale = languageName(this.props.book.bookinfo.book.languageid);
      const localisedData = locale.split('-')[0];
      addLocaleData((require(`react-intl/locale-data/${localisedData}`)));
      const { messages } = languages.translations[locale];
      const PdfbookMessages = {
        PageMsg: messages.page
      };
      let courseId = _.toString(this.props.book.bookinfo.book.activeCourseID);
      if (courseId === undefined || courseId === '' || courseId === null) {
        courseId = -1;
      }
      currentbook.courseId = courseId;
      currentbook.totalpages = this.props.book.bookinfo.book.numberOfPages;
      this.currentbook = currentbook;
  }

  getPageCount = () => {
    const pagecount = this.props.book.bookinfo.book.numberOfPages;
    return pagecount;
  }

  getAuthDetails = () => {
    let piSessionKey, sessionId, userId;
    piSession.getToken(function(result, userToken){
          if(result === 'success'){
            piSessionKey = userToken;
          }
    });
    if(piSessionKey === undefined)
    {
      piSessionKey = localStorage.getItem('secureToken');
    }
    sessionId = this.props.book.sessionInfo.ssoKey;
    userId = this.props.book.userInfo.userid;
    return {
      userid:userId,
      piToken:piSessionKey,
      smsKey:sessionId
    }
  }

  getpiSessionKey = () => {
    let piSessionKey;
    piSession.getToken(function(result, userToken){
          if(result === 'success'){
            piSessionKey = userToken;
          }
    });
    if(piSessionKey === undefined)
    {
      piSessionKey = localStorage.getItem('secureToken');
    }
    return piSessionKey;
  }

  handleBookshelfClick = () => {
    this.props.actions.restoreBookState();
    browserHistory.push('/eplayer/bookshelf');
  }

  render() {
    const {bookinfo, bookPagesInfo, bookFeatures, tocData, bookmarkData, annotationData} = this.props.book;
    if (bookinfo.fetched && bookPagesInfo.fetched && bookFeatures.fetched) {
      // Sample preference. Not used currently
      let bookPreference = {
        headerBar: {
          isVisible: true,
          isDrawerVisible: true,
          drawerProperties: {
            isTocListVisible: true,
            isBookmarksListVisible: true,
            isNotesListVisible: true
          },
          isBackButtonVisible: true,
          isBookmarkIconVisible: true,
          isZoomButtomVisible: true,
          isSearchOptionVisible: true,
          isMoremenuItemsVisible: true
        },
        footerNavigationBar: {
          isVisible: true
        },
        pageLoading: 'singlepage',
        isAnnotationsSupported: true,
        isRegionsSupported: true
      }
      let annotations = {
        load : {
          get : this.props.actions.getAnnotations
        },
        data : annotationData,
        operation : {
          post : this.props.actions.postAnnotation,
          put : this.props.actions.putAnnotation,
          delete : this.props.actions.deleteAnnotation
        }
      }
      let bookCallbacks = {};
      bookCallbacks.handleBookshelfClick = this.handleBookshelfClick;
      bookCallbacks.fetchChapterLevelPdf = fetchChapterLevelPdf;

      const tocCompData = {
        separateToggleIcon: true,
        data: tocData ?  tocData : {},
        depth: 5,
        childField: 'children',
        isTocWrapperRequired: false
      };

      let toc = {
        load : {
          get : this.props.actions.fetchToc
        },
        data : tocCompData
      };

      let hotspot = {
        load : {
          get : this.props.actions.fetchRegionsInfo
        },
        data : this.props.book.regions ? this.props.book.regions : [] 
      };

      let search = {
        load : {
          get : this.props.actions.search
        }
      };
      
      let basepaths = {
        load : {
          get : this.props.actions.fetchBasepaths
        },
        data : this.props.book.basepaths ? this.props.book.basepaths : {}
      };
      let glossary = {
        load : {
          get : this.props.actions.fetchGlossaryItems
        },
        data : this.props.book.glossaryInfoList ? this.props.book.glossaryInfoList : []
      }
      return (
        <PdfPlayer
          pageList={bookPagesInfo.pages}
          annotations={annotations}
          auth={this.getAuthDetails}
          bookmarkList={bookmarkData.bookmarkList}
          tocData={toc}
          metaData={this.currentbook}
          bookCallbacks={bookCallbacks}
          goToPageNo = {this.props.actions.fetchPagebyPageNumber}
          isPdfPlayer={"Y"}
          hotspot={hotspot}
          search={search}
          basepaths={basepaths}
          bookFeatures={bookFeatures}
          glossary={glossary}
          location={this.props.location}
        />);
    }
    return (
      <div className="centerCircularBar">
        <RefreshIndicator size={50} left={0.48*$(window).width()} top={200} status="loading" />
      </div>);
  }
}

PdfBook.defaultProps = {
  
}
export default PdfBook;