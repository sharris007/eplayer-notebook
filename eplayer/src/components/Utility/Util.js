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
// This file contains commonly used methods .
import {eT1Contants} from '../common/et1constants'
var md5 = require('js-md5');
export function getSiteId(env)
{
 if (env === 'qa' || env === 'dev' )
 {
   return eT1Contants.CERT_SITE_ID;
 }
 else if (env === 'prod' || env === 'stage')
 {
   return eT1Contants.PROD_SITE_ID;
 }
 else
 {
   return eT1Contants.CERT_SITE_ID;
 }
}
/*Function to get RGBA Color Values from HEX Color Code*/
export function convertHexToRgba(hex,opacity)
{
	var r,g,b,a;
	hex = hex.replace('#','');
	r = parseInt(hex.substring(0,2), 16);
	g = parseInt(hex.substring(2,4), 16);
	b = parseInt(hex.substring(4,6), 16);
	if(opacity == 0)
	{
	  a=0;
	}
	else
	{
	  a= opacity/100;
	}
	rgba = 'rgba('+r+','+g+','+b+','+a+')';
	return rgba;
}
// Function to generate md5 
export function getmd5(hash)
{
  if (hash !== undefined && hash !== null && hash !== '')
  {
  	return md5.hex(hash);
  }
  else
  {
  	return '';
  }
}