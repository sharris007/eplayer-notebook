import { apiConstants } from '../../const/Constants';
import { getAnndata, postAnnData, putAnnData, deleteAnnData } from './genericApi';

class AnnotationApi {
static doGetAnnotation = (filterData) => {
       return getAnndata(filterData);
   }
   static doPostAnnotation = (data) => {
      return postAnnData(data);
   }
   static doPutAnnotation = (data) => {
       return putAnnData(data);
   }
   static doDeleteAnnotation = (data) => {
       return deleteAnnData(data._id.$oid);
   }
}

export default AnnotationApi;