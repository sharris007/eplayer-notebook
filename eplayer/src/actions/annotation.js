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
import AnnotationApi from '../api/annotationApi';
import { typeConstants } from '../../const/Settings';

// GET Total call for annotations
export const getTotalAnnotationData = json => ({
  type: typeConstants.GET_TOTALANNOTATION,
  totalAnndata: json,
  annTotalDataloaded: true
});

export const annStructureChange = (annTotalList) => {
  const colorArr = {
    '#55DF49': 'Green',
    '#FC92CF': 'Pink',
    '#FFD232': 'Yellow',
    '#ccf5fd': 'Instructor'
  };
  const annListArray = [];
  if (annTotalList && annTotalList.length > 0) {
    for (let i = 0; i < annTotalList.length; i++) {
      const setArray = {
        pageId: annTotalList[i].data.source.id,
        id: annTotalList[i].id,
        author: annTotalList[i].data.user,
        time: annTotalList[i].createdTime,
        text: annTotalList[i].data.quote,
        comment: annTotalList[i].data.text || '',
        color: colorArr[annTotalList[i].data.colorCode] || 'Green'
      };
      annListArray.push(setArray);
    }
  }
  return annListArray;
};

export const getTotalAnnCallService = filterData => dispatch => AnnotationApi.dogetTotalAnnotation(filterData)
    .then(response => response.json())
    .then((json) => {
      if (json.response && json.response.length > 0) {
        const annTotalList = json.response;
        const annListArray = annStructureChange(annTotalList);
        dispatch(getTotalAnnotationData(annListArray));
      }
    });


// GET call for annotations
export const getAnnotationData = json => ({
  type: typeConstants.GET_ANNOTATION,
  pageFilterAnnData: json,
  annGetDataloaded: true
});

export const getAnnCallService = filterData => dispatch => AnnotationApi.doGetAnnotation(filterData)
    .then(response => response.json())
    .then((json) => {
      dispatch(getAnnotationData(json));
    });

 // POST call annotations
export const postAnnotationData = json => ({
  type: typeConstants.POST_ANNOTATION,
  pageFilterAnnPostData: json,
  annPostDataloaded: true
});

export const postAnnCallService = data => dispatch => AnnotationApi.doPostAnnotation(data)
   .then(response => response.json())
   .then((json) => {
     const postData = [];
     postData.push(json);
     const postModifiedData = {
       rows: postData
     };
     const annListArray = annStructureChange(postModifiedData.rows);
     dispatch(getTotalAnnotationData(annListArray));
     dispatch(postAnnotationData(postModifiedData));
   });


// PUT annotation Call
export const putAnnotationData = json => ({
  type: typeConstants.PUT_ANNOTATION,
  pageFilterAnnPutData: json,
  annPutDataloaded: true
});

 // DELETE call annotations
export const deleteAnnotationData = json => ({
  type: typeConstants.DELETE_LISTANNOTATION,
  deleteAnnData: json
});

export const putAnnCallService = data => dispatch => AnnotationApi.doPutAnnotation(data)
   .then(response => response.json())
   .then((json) => {
     const putData = [];
     putData.push(json);
     const annListArray = annStructureChange(putData);
     dispatch(deleteAnnotationData(json));
     dispatch(getTotalAnnotationData(annListArray));
     dispatch(putAnnotationData(json));
   });


export const deleteAnnCallService = data => dispatch => AnnotationApi.doDeleteAnnotation(data)
   .then(response => response.json())
   .then((json) => {
     dispatch(deleteAnnotationData(json));
   });
