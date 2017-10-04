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
 import React from 'react';
 import { browserHistory } from 'react-router';
 import { eT1Contants } from '../../../components/common/et1constants';
 import { resources, domain } from '../../../../const/Settings';
 import { getmd5 } from '../../../components/Utility/Util';
 import Cookies from 'universal-cookie';
 const envType = domain.getEnvType();


 class ValidateUser extends React.Component {
 	componentDidMount() {
 			const cookies = new Cookies();
	 		var querystr = window.location.search.substring(1);   
	        var serverhsid = this.props.location.query.hsid;   
	        const islocal = this.props.location.query.islocal;
 			const ispxedev = this.props.location.query.ispxedev; 
	        // For testing purpose we added islocal & ispxedev fields. Should be removed once testing is done
	        if(islocal !== undefined && islocal !== '' && islocal !== null)
			{
				querystr = querystr.replace("&islocal=Y","");
			}
			if(ispxedev !== undefined && ispxedev !== '' && ispxedev !== null)
			{
				querystr = querystr.replace("&ispxedev=Y","");
			}   
			querystr = querystr.replace("&hsid="+serverhsid,"");  
	        var clienthsid = getmd5(querystr+eT1Contants.DEEPLINK_MD5_SECRET_KEY);   
	        if(clienthsid == serverhsid)    
	        {   
	          console.log("hsid match success. Continue to launch the title")   
	        }   
	        else    
	        {   
	          console.log("hsid match failure. Show the error page")  
	          browserHistory.push('/eplayer/login');
	        }  
 			var okurl = '';
 			var okurlValuesParam = 'values=';
 			var serverDetails;
 			const bookid = this.props.location.query.bookid;
 			const platform = this.props.location.query.platform;
 			const userid = this.props.location.query.userid;
 			const smsuserid = this.props.location.query.smsuserid;
 			const languageid = this.props.location.query.languageid;
 			const roletypeid = this.props.location.query.roletypeid;
 			const scenario = this.props.location.query.scenario;
 			const invoketype = this.props.location.query.invoketype;
 			var bookserver = this.props.location.query.bookserver;
 			const pagenumber = this.props.location.query.pagenumber;
 			const hsid = this.props.location.query.hsid;
 			const startpage = this.props.location.query.startpage;
 			const endpage = this.props.location.query.endpage;
 			const xValue = this.props.location.query.x;
 			const yValue = this.props.location.query.y;
			if(bookid !== undefined && bookid !== '' && bookid !== null)
			{
				okurlValuesParam = okurlValuesParam+'bookid::'+bookid;
			}
			if(platform !== undefined && platform !== '' && platform !== null)
			{
				okurlValuesParam = okurlValuesParam+'::platform::'+platform;
			}
			if(userid !== undefined && userid !== '' && userid !== null)
			{
				okurlValuesParam = okurlValuesParam+'::userid::'+userid;
			}
			if(smsuserid !== undefined && smsuserid !== '' && smsuserid !== null)
			{
				okurlValuesParam = okurlValuesParam+'::smsuserid::'+smsuserid;
			}
			if(languageid !== undefined && languageid !== '' && languageid !== null)
			{
				okurlValuesParam = okurlValuesParam+'::languageid::'+languageid;
			}
			if(roletypeid !== undefined && roletypeid !== '' && roletypeid !== null)
			{
				okurlValuesParam = okurlValuesParam+'::roletypeid::'+roletypeid;
			}
			if(scenario !== undefined && scenario !== '' && scenario !== null)
			{
				okurlValuesParam = okurlValuesParam+'::scenario::'+scenario;
			}
			if(invoketype !== undefined && invoketype !== '' && invoketype !== null)
			{
				okurlValuesParam = okurlValuesParam+'::invoketype::'+invoketype;
			}
			if(bookserver !== undefined && bookserver !== '' && bookserver !== null)
			{
				okurlValuesParam = okurlValuesParam+'::bookserver::'+bookserver;
			}
			if(pagenumber !== undefined && pagenumber !== '' && pagenumber !== null)
			{
				okurlValuesParam = okurlValuesParam+'::pagenumber::'+pagenumber;
			}
 			if(hsid !== undefined && hsid !== '' && hsid !== null)
			{
				okurlValuesParam = okurlValuesParam+'::hsid::'+hsid;
			}
			if(startpage !== undefined && startpage !== '' && startpage !== null)
			{
				okurlValuesParam = okurlValuesParam+'::startpage::'+startpage;
			}
			if(endpage !== undefined && endpage !== '' && endpage !== null)
			{
				okurlValuesParam = okurlValuesParam+'::endpage::'+endpage;
			}
			if(xValue !== undefined && xValue !== '' && xValue !== null)
			{
				okurlValuesParam = okurlValuesParam+'::xValue::'+xValue;
			}
			if(yValue !== undefined && yValue !== '' && yValue !== null)
			{
				okurlValuesParam = okurlValuesParam+'::yValue::'+yValue;
			}
			if(islocal !== undefined && islocal !== '' && islocal !== null)
			{
				okurlValuesParam = okurlValuesParam+'::islocal::'+islocal;
			}
			if(ispxedev !== undefined && ispxedev !== '' && ispxedev !== null)
			{
				okurlValuesParam = okurlValuesParam+'::ispxedev::'+ispxedev;
			}
			var smsbaseurl;
			if(bookserver !== undefined)
	        {
	          var bookserverurl;
	          if (envType == 'qa' || envType == 'stage')
	          {
	            bookserverurl = 'CERT'+bookserver;
	            smsbaseurl = eT1Contants.SMSBaseUrls['CERT'];
	          }
	          else if(envType == 'prod')
	          {
	            bookserverurl = 'PROD'+bookserver;
	            smsbaseurl = eT1Contants.SMSBaseUrls['PROD'];
	          }
	          serverDetails = eT1Contants.ServerUrls[envType][bookserverurl];
	        }
			okurl = serverDetails+'/ebook/pdfplayer/validateuser?'+okurlValuesParam;
			var serviceurl;
			serviceurl = smsbaseurl+'?cmd=chk_login&okurl='+okurl+'&errurl=https://www.google.com&loginurl=https://www.google.com&siteid=11444&isCourseAware=N';
			cookies.set('ReactPlayerCookie', 'ReactPlayerCookie', { path: '/' });
			window.location.replace(serviceurl);
 	}
 	render()
 	{
 		return (<div></div>);
 	}
 }

 export default ValidateUser;