import React from 'react';
import { SearchComponent } from '@pearson-incubator/search';
import reducer from '../modules/searchReducer';
import { injectReducer } from '../../../store/reducers';


export class Search extends React.Component {

  componentWillMount() {
    injectReducer(this.props.store, { key: 'search', reducer });
  }

  render() {
    //const indexId = '90104c7ed4e49497887808b3e8cb7f8c';
    const indexId={
      ssoKey:this.props.ssoKey,
      bookId:this.props.bookId,
      globalBookId:this.props.globalBookId,
      serverDetails:this.props.serverDetails
    };
    return (
      <SearchComponent fetch={this.props.fetch} indexId={indexId} searchData={this.props.search} searchListClick={this.props.goToPage} isET1='Y'/>
    );
  }
}

Search.propTypes = {
  store: React.PropTypes.object,
  fetch: React.PropTypes.func.isRequired,
  search: React.PropTypes.object.isRequired
};
export default Search;
