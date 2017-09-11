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
 * Check if a cookie with the given name exists
 * @param  {[type]}   name      The name of the cookie
 * @param  {[type]}   falseCase Whether or not to check if the cookie exists or
 *                              not
 * @param  {Function} done      Function to execute when finished
 */
module.exports = (name, falseCase, done) => {
    /**
     * The cookie as retrieved from the browser
     * @type {Object}
     */
    const cookie = browser.getCookie(name);

    if (falseCase) {
        expect(cookie).to.equal(
            null,
            `Expected cookie "${name}" not to exists but it does`
        );
    } else {
        expect(cookie).to.not.equal(
            null,
            `Expected cookie "${name}" to exists but it does not`
        );
    }

    done();
};
