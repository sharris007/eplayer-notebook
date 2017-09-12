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
const initialAnnotationData = {
  highlightTotalData: [],
  highlightPageData: [],
  annTotalDataLoaded: false,
  annDataloaded: false
};

export default (state = initialAnnotationData, action) => {
  switch (action.type) {

    case 'GET_TOTALANNOTATION': {
      const ann = [...state.highlightTotalData, ...action.totalAnndata];
      return {
        ...state,
        highlightTotalData: ann,
        annTotalDataLoaded: action.annTotalDataloaded
      };
    }

    case 'GET_ANNOTATION': {
      return {
        ...state,
        highlightPageData: action.pageFilterAnnData,
        annDataloaded: action.annGetDataloaded
      };
    }

    case 'POST_ANNOTATION': {
      return {
        ...state,
        highlightPageData: action.pageFilterAnnPostData,
        annDataloaded: action.annPostDataloaded
      };
    }

    case 'PUT_ANNOTATION': {
      return {
        ...state,
        highlightPageData: action.pageFilterAnnPutData,
        annDataloaded: action.annPutDataloaded
      };
    }
    case 'DELETE_LISTANNOTATION': {
      const annId = action.deleteAnnData.id;
      const totalData = state.highlightTotalData.filter(ann => ann.id !== annId);
      // const  filteredAnn = state.highlightPageData.filter(pageAnn => pageAnn.id !== annId);
      return {
        ...state,
        highlightTotalData: totalData
      };
    }
    case 'CLEAR_ANNOTATIONS': {
      return {
        ...state,
        highlightTotalData: [],
        annTotalDataLoaded: false
      };
    }
    default :
      return state;
  }
};
