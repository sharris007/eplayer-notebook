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
 * Check if the given elements text is the same as the given text
 * @param  {String}   element       Element selector
 * @param  {String}   falseCase     Whether to check if the content equals the
 *                                  given text or not
 * @param  {String}   expectedText  The text to validate against
 * @param  {Function} done          Function to execute when finished
 */
module.exports = (element, falseCase, expectedText, done) => {
    /**
     * The command to execute on the browser object
     * @type {String}
     */
    let command = 'getValue';

    if (browser.getAttribute(element, 'value') === null) {
        command = 'getText';
    }

    /**
     * Function to execute when finished
     * @type {Function}
     */
    let doneCallback = done;

    /**
     * The expected text to validate against
     * @type {String}
     */
    let parsedExpectedText = expectedText;

    /**
     * Whether to check if the content equals the given text or not
     * @type {Boolean}
     */
    let boolFalseCase = !!falseCase;

    // Check for empty element
    if (!doneCallback && typeof parsedExpectedText === 'function') {
        doneCallback = parsedExpectedText;
        parsedExpectedText = '';

        boolFalseCase = !boolFalseCase;
    }

    if (parsedExpectedText === undefined && falseCase === undefined) {
        parsedExpectedText = '';
        boolFalseCase = true;
    }

    const text = browser[command](element);

    if (boolFalseCase) {
        parsedExpectedText.should.not.equal(text);
    } else {
        parsedExpectedText.should.equal(text);
    }

    doneCallback();
};
