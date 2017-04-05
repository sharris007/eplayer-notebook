  /* eslint-disable */
import React, { Component } from 'react';
import { PrintPage } from 'pxe-printpage';


export default class Print extends Component {
  constructor(props) {
      super(props);
  }
  render() {
    return(
      <PrintPage />
      )
  }
}