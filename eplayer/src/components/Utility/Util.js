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