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
 * Compare the contents of two elements with each other
 * @param  {String}   element1  Element selector for the first element
 * @param  {String}   falseCase Whether to check if the contents of both
 *                              elements match or not
 * @param  {String}   element2  Element selector for the second element
 * @param  {Function} done      Function to execute when finished
 */
module.exports = (element1, falseCase, element2, done) => {
    /**
     * The text of the first element
     * @type {String}
     */
    const text1 = browser.getText(element1);

    /**
     * The text of the second element
     * @type {String}
     */
    const text2 = browser.getText(element2);

    if (falseCase) {
        expect(text1).to.not.equal(
            text2,
            `Expected text not to be "${text1}"`
        );
    } else {
        expect(text1).to.equal(
            text2,
            `Expected text to be "${text1}" but found "${text2}"`
        );
    }

    done();
};
