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
      <div>
         <SearchComponent fetch={this.props.fetch} searchData={ this.props.search }  indexId = { this.props.indexId } searchListClick = {this.props.goToPage} listClick = {this.props.listClick}/> 
      </div>
    );
  }
}

Search.propTypes = {
  store: React.PropTypes.object,
  fetch: React.PropTypes.func.isRequired,
  search: React.PropTypes.object.isRequired
};
export default Search;
