// This file contains commonly used methods .
import {eT1Contants} from '../common/et1constants'
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