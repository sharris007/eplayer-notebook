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
//.import textSelection from '../action/textSelection';

/**
* Set the value of the given input field to a new value or add a value to the
* current element value
* @param  {String}   pageElement  The method to use (add or set)
* @param  {String}   highlightColor   The value to set the element to
* @param  {Function} done    Function to execute when finished
*/
module.exports = (element, highlightColor) => {
  /**
  * The command to perform on the browser object (addValue or setValue)
  * @type {String}
  */
  //textSelection(element);
  browser.pause(10000);
  browser.moveToObject(element,100,200);
  browser.buttonDown();
  browser.moveToObject(element,500,400);
  browser.buttonUp();

  browser.pause(5000);
  browser.click(highlightColor);
  browser.pause(3000);

  //  done();
};