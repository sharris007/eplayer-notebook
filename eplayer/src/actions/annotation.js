import AnnotationApi from '../api/annotationApi';
import { typeConstants } from '../../const/Constants';

// GET Total call for annotations
export const getTotalAnnotationData = json => ({
  type: typeConstants.GET_TOTALANNOTATION,
  data: json,
  loading: true
});

export const getTotalAnnCallService = filterData => dispatch => AnnotationApi.dogetTotalAnnotation(filterData)
    .then(
        response => response.json()
      )
    .then(
        json => dispatch(getTotalAnnotationData(json))
    );




// GET call for annotations
export const getAnnotationData = json => ({
  type: typeConstants.GET_ANNOTATION,
  data: json,
  loading: true
});

export const getAnnCallService = filterData => dispatch => AnnotationApi.doGetAnnotation(filterData)
    .then(
        response => response.json()
      )
    .then(
        json => dispatch(getAnnotationData(json))
    );

 // POST call annotations
export const postAnnotationData = json => ({
  type: typeConstants.POST_ANNOTATION,
  data: json,
  loading: true
});

export const postAnnCallService = data => dispatch => AnnotationApi.doPostAnnotation(data)
   .then(response => response.json())
   .then(json => dispatch(getAnnotationData(json)));

//PUT annotation Call
export const putAnnotationData = json => ({
  type: typeConstants.PUT_ANNOTATION,
  data: json,
  loading: true
});

export const putAnnCallService = data => dispatch => AnnotationApi.doPutAnnotation(data)
   .then(response => response.json())
   .then(json => dispatch(putAnnotationData(json)));


 // DELETE call annotations
export const deleteAnnotationData = json => ({
  type: typeConstants.DELETE_ANNOTATION,
  data: json,
  loading: true
});

export const deleteAnnCallService = data => dispatch => AnnotationApi.doDeleteAnnotation(data)
   .then(response => response.json())
   .then(json => dispatch(deleteAnnotationData(json)));
