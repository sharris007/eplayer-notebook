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
/**
 * Select the text area of the given element
 * @param  {String}   element  Element selector
 * @param  {String}   startOffsetX        X coordinate to move to
 * @param  {String}   startOffsetY        Y coordinate to move to
 * @param  {String}   endOffsetX          X coordinate to move to
 * @param  {String}   endOffsetY          Y coordinate to move to
 * @param  {Function} done     Function to execute when finished
 */
module.exports = (element, done) => {
	/**
     * X coordinate
     * @type {Int}
     */
    const startX =  100;
    const endX = 500;
	/**
     * Y coordinate
     * @type {Int}
     */
    const startY = 200;
    const endY =  400;

    browser.moveToObject(element,startX,startY);
    browser.buttonDown();
    browser.moveToObject(element,endX,endY);
    browser.buttonUp();

    done();
};