/** *****************************************************************************
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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../modules/pdfbook';
import { loadState } from '../../../localStorage';


import { PdfBook } from '../components/PdfBook';

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

const mapStateToProps = state => ({
  book: state.book ? state.book : {},
  currentbook: state.bookshelf ? state.bookshelf : loadState('bookshelf') ? loadState('bookshelf') : {}, // eslint-disable-line no-nested-ternary
  login: state.login ? state.login : loadState('login') ? loadState('login') : {} // eslint-disable-line no-nested-ternary
});

export default connect(mapStateToProps, mapDispatchToProps)(PdfBook);
