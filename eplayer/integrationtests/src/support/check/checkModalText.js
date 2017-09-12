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
 * Check the text of a modal
 * @param  {String}   modalType     The type of modal that is expected
 *                                  (alertbox, confirmbox or prompt)
 * @param  {String}   falseState    Whether to check if the text matches or not
 * @param  {String}   expectedText  The text to check against
 * @param  {Function} done          Function to execute when finished
 */
module.exports = (modalType, falseState, expectedText, done) => {
    try {
        /**
         * The text of the current modal
         * @type {String}
         */
        const text = browser.alertText();

        if (falseState) {
            expect(text).to.not.equal(
                expectedText,
                `Expected the text of ${modalType} not to equal ` +
                `"${expectedText}"`
            );
        } else {
            expect(text).to.equal(
                expectedText,
                `Expected the text of ${modalType} not to equal ` +
                `"${expectedText}", instead found "${text}"`
            );
        }
    } catch (e) {
        assert(
            e,
            `A ${modalType} was not opened when it should have been opened`
        );
    }

    done();
};
