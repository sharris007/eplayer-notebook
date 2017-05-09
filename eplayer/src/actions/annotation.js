import AnnotationApi from '../api/annotationApi';
import { typeConstants } from '../../const/Settings';

// GET Total call for annotations
export const getTotalAnnotationData = json => ({
  type: typeConstants.GET_TOTALANNOTATION,
  totalAnndata: json,
  annTotalDataloaded: true
});

export const getTotalAnnCallService = filterData => dispatch => AnnotationApi.dogetTotalAnnotation(filterData)
    .then(response => response.json())
    .then(json => {
      if(json.rows &&json.rows.length>0){
          const annTotalList = json.rows;
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
    .then(json =>{   
        dispatch(getAnnotationData(json))
    });

 // POST call annotations
export const postAnnotationData = json => ({
  type: typeConstants.POST_ANNOTATION,
  pageFilterAnnPostData: json,
  annPostDataloaded: true
});

export const postAnnCallService = data => dispatch => AnnotationApi.doPostAnnotation(data)
   .then(response => response.json())
   .then(json => {
    const postData = [];
    postData.push(json);
    const postModifiedData = {
      rows :postData
    }
    const annListArray = annStructureChange(postModifiedData.rows);
    dispatch(getTotalAnnotationData(annListArray));
    dispatch(postAnnotationData(postModifiedData));
     
   });
    

//PUT annotation Call
export const putAnnotationData = json => ({
  type: typeConstants.PUT_ANNOTATION,
  pageFilterAnnPutData: json,
  annPutDataloaded: true
});

export const putAnnCallService = data => dispatch => AnnotationApi.doPutAnnotation(data)
   .then(response => response.json())
   .then(json => {
        const putData = [];
        putData.push(json);
        const annListArray = annStructureChange(putData);
        dispatch(deleteAnnotationData(json));
        dispatch(getTotalAnnotationData(annListArray));
        dispatch(putAnnotationData(json));
    });
    


 // DELETE call annotations
export const deleteAnnotationData = json => ({
  type: typeConstants.DELETE_LISTANNOTATION,
  deleteAnnData: json,
});

export const deleteAnnCallService = data => dispatch => AnnotationApi.doDeleteAnnotation(data)
   .then(response => response.json())
   .then(json => {
      dispatch(deleteAnnotationData(json));
   });
   

function annStructureChange(annTotalList){
  const colorArr = {
            '#55DF49':"Green",
            '#FC92CF':"Pink",
            '#FFD232':"Yellow"
  },annListArray = [];
  if(annTotalList && annTotalList.length>0){
      for(let i=0;i<annTotalList.length;i++){
        const setArray = {
          pageId: annTotalList[i].source.id,
          id: annTotalList[i].id,
          author: annTotalList[i].user,
          time: annTotalList[i].createdTimestamp,
          text: annTotalList[i].quote,
          comment: annTotalList[i].text||'',
          color: colorArr[annTotalList[i].color]||"Green"
        }
        annListArray.push(setArray);
      }
    }
    return annListArray;
}
