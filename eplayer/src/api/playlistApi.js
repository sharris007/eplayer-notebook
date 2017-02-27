// import { apiConstants } from '../../const/Constants';
import { getAnndata, postAnnData, putAnnData, deleteAnnData } from './genericApi';

class PlaylistApi {
  static doGetAnnotation = filterData => get(filterData)
  static doPostAnnotation = data => postAnnData(data)
  static doPutAnnotation = data => putAnnData(data)
  static doDeleteAnnotation = data => deleteAnnData(data._id.$oid)// eslint-disable-line no-underscore-dangle
}

export default AnnotationApi;
