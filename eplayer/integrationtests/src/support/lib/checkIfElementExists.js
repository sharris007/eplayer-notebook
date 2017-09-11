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
 * Check if the given element exists in the DOM one or more times
 * @param  {String}  element  Element selector
 * @param  {Boolean} falsCase Check if the element (does not) exists
 * @param  {Number}  exactly  Check if the element exists exactly this number
 *                            of times
 */
module.exports = (element, falsCase, exactly) => {
    /**
     * The number of elements found in the DOM
     * @type {Int}
     */
    const nrOfElements = browser.elements(element).value;

    if (falsCase === true) {
        expect(nrOfElements).to.have.lengthOf(
            0,
            `Element with selector "${element}" should not exist on the page`
        );
    } else if (exactly) {
        expect(nrOfElements).to.have.lengthOf(
            exactly,
            `Element with selector "${element}" should exist exactly ` +
            `${exactly} time(s)`
        );
    } else {
        expect(nrOfElements).to.have.length.of.at.least(
            1,
            `Element with selector "${element}" should exist on the page`
        );
    }
};
