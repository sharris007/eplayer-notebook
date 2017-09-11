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
/*
*This is API level constants file.
*/
export const apiConstants = {
  PXESERVICE: 'https://pxe-sdk-qa.stg-openclass.com/services-api/api/3.1',
  PAPERBASE: 'https://paperapi-qa.stg-openclass.com/nextext-api/api/nextext',
 // PAPERBASE :'https://etext-stg.pearson.com/api/nextext-api/api/nextext',
  BOOK: 'https://api.mongolab.com/api/1/databases/team4/collections/students',
  APIKEY: 'AgffBG36UOuFvRNORM8Y1ACvA1FdJwN8',
  SEARCHURL: 'https://etext-qa-stg.pearson.com/search/pxereader-cm/api/2.1/cm/search?indexId=',
  SEARCHLIMIT: '&s=0&n=100'
};

export const typeConstants = {
  GET_TOTALANNOTATION: 'GET_TOTALANNOTATION',
  GET_ANNOTATION: 'GET_ANNOTATION',
  POST_ANNOTATION: 'POST_ANNOTATION',
  PUT_ANNOTATION: 'PUT_ANNOTATION',
  DELETE_LISTANNOTATION: 'DELETE_LISTANNOTATION',
  GET_PLAYLIST: 'GET_PLAYLIST',
  GET_TOC: 'GET_TOC',
  GET_BOOKMARK: 'GET_BOOKMARK',
  POST_BOOKMARK: 'POST_BOOKMARK',
  DELETE_BOOKMARK: 'DELETE_BOOKMARK',
  GET_TOTALBOOKMARK: 'GET_TOTALBOOKMARK',
  GET_GOTOPAGE: 'GET_GOTOPAGE'
};
export const annotationTypes = {
  ANNOTATION_CREATED: 'ANNOTATION_CREATED',
  ANNOTATION_UPDATED: 'ANNOTATION_UPDATED',
  ANNOTATION_DELETED: 'ANNOTATION_DELETED'
};
