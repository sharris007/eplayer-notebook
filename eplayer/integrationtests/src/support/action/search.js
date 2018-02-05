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
import checkIfElementExists from '../lib/checkIfElementExists';

/**
 * Search for a specific criteira
 * @param  {String}   elemSearchIcon  search selector
 * @param  {String}   elemInputField  input field selector
 * @param  {String}   valPageNum      page number to be selected
 * @param  {Function} done     Function to execute when finished
 */

module.exports = (elemSearchIcon, elemInputField, valPageNum, done) => {
    browser.click(elemSearchIcon);
    checkIfElementExists(elemInputField, false, 1);
    browser.setValue(elemInputField, valPageNum);
    browser.waitForVisible("span*=Page "+valPageNum, 10000);
    browser.click("span*=Page "+valPageNum);
    browser.pause(3000);
    done();
};
