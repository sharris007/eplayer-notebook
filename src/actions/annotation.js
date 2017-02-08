import AnnotationApi from '../api/annotationApi';
import { typeConstants  } from '../../const/Constants';

//GET call for annotations
export const getAnnotationData = (json) => ({
  type: typeConstants.GET_ANNOTATION,
  data: json,
  loading: true
})

export const getAnnCallService = (filterData) => (dispatch, getState) => {
    return AnnotationApi.doGetAnnotation(filterData)
    .then(
        response => response.json()
      )
    .then(
        json => dispatch(getAnnotationData(json))
    )
}
    
 // POST call annotations
export const postAnnotationData = (json) => ({
  type: typeConstants.POST_ANNOTATION,
  data: json,
  loading: true
})

export const postAnnCallService = (data) => (dispatch, getState) => {
  return AnnotationApi.doPostAnnotation(data)
   .then(response => response.json())
   .then(json => dispatch(getAnnotationData(json)))
}

 // DELETE call annotations
export const deleteAnnotationData = (json) => ({
  type: typeConstants.DELETE_ANNOTATION,
  data: json,
  loading: true
})

export const deleteAnnCallService = (data) => (dispatch, getState) => {
  return AnnotationApi.doDeleteAnnotation(data)
   .then(response => response.json())
   .then(json => dispatch(deleteAnnotationData(json)))
}