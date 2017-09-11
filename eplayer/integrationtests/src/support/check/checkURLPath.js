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
 * Check if the current URL path matches the given path
 * @param  {String}   falseCase    Whether to check if the path matches the
 *                                 expected value or not
 * @param  {String}   expectedPath The expected path to match against
 * @param  {Function} done         Function to execute when finished
 */
module.exports = (falseCase, expectedPath, done) => {
    /**
     * The URL of the current browser window
     * @type {String}
     */
    let currentUrl = browser.url().value.replace(/http(s?):\/\//, '');

    /**
     * The base URL of the current browser window
     * @type {Object}
     */
    const domain = `${currentUrl.split('/')[0]}`;

    currentUrl = currentUrl.replace(domain, '');

    if (falseCase) {
        expect(currentUrl).to.not
            .equal(expectedPath, `expected path not to be "${currentUrl}"`);
    } else {
        expect(currentUrl).to
            .equal(
                expectedPath,
                `expected path to be "${expectedPath}" but found ` +
                `"${currentUrl}"`
            );
    }

    done();
};
