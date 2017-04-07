// import { apiConstants } from '../../const/Constants';
import { getTotalAnndata, getAnndata, postAnnData, putAnnData, deleteAnnData } from './genericApi';

class AnnotationApi {
  static doGetAnnotation = filterData => getAnndata(filterData)
  static dogetTotalAnnotation = data => getTotalAnndata(data)
  static doPostAnnotation = data => postAnnData(data)
  static doPutAnnotation = data => putAnnData(data)
  static doDeleteAnnotation = data => deleteAnnData(data)// eslint-disable-line no-underscore-dangle
}

export default AnnotationApi;
