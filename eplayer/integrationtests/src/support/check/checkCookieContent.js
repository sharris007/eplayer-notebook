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
 * Check the content of a cookie against a given value
 * @param  {String}   name          The name of the cookie
 * @param  {String}   falseCase     Whether or not to check if the value matches
 *                                  or not
 * @param  {String}   expectedValue The value to check against
 * @param  {Function} done          Function to execute when finished
 */
module.exports = (name, falseCase, expectedValue, done) => {
    /**
     * The cookie retrieved from the browser object
     * @type {Object}
     */
    const cookie = browser.getCookie(name);

    expect(cookie.name).to.equal(
        name,
        `no cookie found with the name "${name}"`
    );

    if (falseCase) {
        expect(cookie.value).to.not
            .equal(
                expectedValue,
                `expected cookie "${name}" not to have value "${expectedValue}"`
            );
    } else {
        expect(cookie.value).to
            .equal(
                expectedValue,
                `expected cookie "${name}" to have value "${expectedValue}"` +
                ` but got "${cookie.value}"`
            );
    }

    done();
};
