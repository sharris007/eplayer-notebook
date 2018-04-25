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
import { getTotalAnndata, getAnndata, postAnnData, putAnnData, deleteAnnData, tagObjCall } from './genericApi';

class AnnotationApi {
  static doGetAnnotation = filterData => getAnndata(filterData)
  static dogetTotalAnnotation = data => getTotalAnndata(data)
  static doPostAnnotation = data => postAnnData(data)
  static doPutAnnotation = data => putAnnData(data)
  static doDeleteAnnotation = data => deleteAnnData(data)// eslint-disable-line no-underscore-dangle
  static doTagObjCall = data =>  tagObjCall(data)
}

export default AnnotationApi;
