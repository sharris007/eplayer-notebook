import GotopageApi from '../api/gotopageApi';
import { typeConstants } from '../../const/Settings';

// GET call for Go to page
export const getGoToPage = json => ({
  type: typeConstants.GET_GOTOPAGE,
  data: json,
  isGoToPageRecived: true
});

export const getGotoPageCall = goToPageObj => dispatch => GotopageApi.doGetGotoPage(goToPageObj)
    .then(
        response => response.json()
      )
    .then(
        json => dispatch(getGoToPage(json))
);