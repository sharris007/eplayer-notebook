import BookmarkApi from '../api/gotopageApi';
import { typeConstants } from '../../const/Constants';

// GET call for Go to page
export const getGoToPage = json => ({
  type: typeConstants.GET_GOTOPAGE,
  data: json,
  loading: true
});

export const getGotoPageCall = filterData => dispatch => BookmarkApi.doGetGotoPage(filterData)
    .then(
        response => response.json()
      )
    .then(
        json => dispatch(getGoToPage(json))
);