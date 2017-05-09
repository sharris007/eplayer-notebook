const initialAnnotationData = {
    highlightTotalData: [],
    highlightPageData: [],
    annTotalDataLoaded: false,
    annDataloaded: false,
}

export default (state = initialAnnotationData , action) => {

  switch (action.type) {

    case 'GET_TOTALANNOTATION': {
      return {
        ...state,
        highlightTotalData: state.highlightTotalData.concat(action.totalAnndata),
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
      const  totalData = state.highlightTotalData.filter(ann => ann.id !== annId);
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
