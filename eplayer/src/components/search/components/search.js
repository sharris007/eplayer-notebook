import React from 'react';
import { SearchComponent } from '@pearson-incubator/search';
import reducer from '../modules/searchReducer';
import { injectReducer } from '../../../store/reducers';
import '../styles/search.scss';


export class Search extends React.Component {

  componentWillMount() {
    injectReducer(this.props.store, { key: 'search', reducer });
  }

  render() {
    /* eslint-disable */
    return (
      <div>
        <SearchComponent fetch={this.props.fetch} searchData={this.props.search} indexId={this.props.indexId} searchListClick={this.props.goToPage} listClick={this.props.listClick} isET1={this.props.isET1} locale={this.props.locale} />
      </div>
    );
    /* eslint-enable */
  }
}

Search.propTypes = {
  store: React.PropTypes.object,
  fetch: React.PropTypes.func.isRequired,
  search: React.PropTypes.object.isRequired
};
export default Search;
