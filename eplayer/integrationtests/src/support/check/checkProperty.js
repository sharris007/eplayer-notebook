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
 * Check the given property of the given element
 * @param  {String}   isCSS         Whether to check for a CSS property or an
 *                                  attribute
 * @param  {String}   attrName      The name of the attribute to check
 * @param  {String}   elem          Element selector
 * @param  {String}   falseCase     Whether to check if the value of the
 *                                  attribute matches or not
 * @param  {String}   expectedValue The value to match against
 * @param  {Function} done          Function to execute when finished
 */
module.exports = (isCSS, attrName, elem, falseCase, expectedValue, done) => {
    /**
     * The command to use for fetching the expected value
     * @type {String}
     */
    const command = isCSS ? 'getCssProperty' : 'getAttribute';

    /**
     * Te label to identify the attribute by
     * @type {String}
     */
    const attrType = (isCSS ? 'CSS attribute' : 'Attribute');

    /**
     * The actual attribute value
     * @type {Mixed}
     */
    let attributeValue = browser[command](elem, attrName);

    /**
     * when getting something with a color WebdriverIO returns a color
     * object but we want to assert against a string
     */
    if (attrName.indexOf('color') > -1) {
        attributeValue = attributeValue.value;
    }

    if (falseCase) {
        expect(attributeValue).to.not
            .equal(
                expectedValue,
                `${attrType} of element "${elem}" should not contain ` +
                `"${attributeValue}"`
            );
    } else {
        expect(attributeValue).to
            .equal(
                expectedValue,
                `${attrType} of element "${elem}" should not contain ` +
                `"${attributeValue}", but "${expectedValue}"`
            );
    }

    done();
};
