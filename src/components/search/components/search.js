import React from 'react';
import { SearchComponent } from '@pearson-incubator/search';
import reducer from '../modules/searchReducer';
import { injectReducer } from '../../../store/reducers';


export class Search extends React.Component {

  componentWillMount() {
    injectReducer(this.props.store, { key: 'search', reducer });
  }

  render() {
    const indexId = '90104c7ed4e49497887808b3e8cb7f8c';

    return (
      <SearchComponent
        fetch={this.props.fetch} searchData={this.props.search}
        indexId={indexId} searchListClick={this.props.clickSearchListHandler}
        listClick={this.props.listClick} searchKeySelect={this.props.searchKeySelect}
      />
    );
  }
}

Search.propTypes = {
  store: React.PropTypes.object,
  fetch: React.PropTypes.func.isRequired,
  search: React.PropTypes.object.isRequired,
  clickSearchListHandler: React.PropTypes.func,
  listClick: React.PropTypes.func,
  searchKeySelect: React.PropTypes.func
};
export default Search;
