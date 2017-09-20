/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *   
 *  *  Copyright © 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  * 
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software 
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
import React from 'react';
import { SearchComponent } from '@pearson-incubator/search';
import reducer from '../modules/searchReducer';
import { injectReducer } from '../../../store/reducers';
import '../styles/search.scss';


export class Search extends React.Component {

  componentWillMount() {
    injectReducer(this.props.store, { key: 'search', reducer });
    //this.props.clearSearchResults();    
  }

  render() {
    /* eslint-disable */
    return (
      <div>
         <SearchComponent fetch={this.props.fetch} searchData={this.props.search} indexId={this.props.indexId} searchListClick={this.props.goToPage} listClick={this.props.listClick} isET1={this.props.isET1} locale={this.props.locale} searchKeySelect={this.props.searchKeySelect}/>
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
