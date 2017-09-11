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
 * Check if the given string is in the URL path
 * @param  {String}   falseCase       Whether to check if the given string is in
 *                                    the URL path or not
 * @param  {String}   expectedUrlPart The string to check for
 * @param  {Function} done            Function to execute when finished
 */
module.exports = (falseCase, expectedUrlPart, done) => {
    /**
     * The URL of the current browser window
     * @type {String}
     */
    const currentUrl = browser.url().value;

    if (falseCase) {
        expect(currentUrl).to.not
            .contain(
                expectedUrlPart,
                `Expected URL "${currentUrl}" not to contain ` +
                `"${expectedUrlPart}"`
            );
    } else {
        expect(currentUrl).to
            .contain(
                expectedUrlPart,
                `Expected URL "${currentUrl}" to contain "${expectedUrlPart}"`
            );
    }

    done();
};
