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
 * Check if the given element is visible inside the current viewport
 * @param  {String}   element   Element selector
 * @param  {String}   falseCase Whether to check if the element is visible
 *                              within the current viewport or not
 * @param  {Function} done      Function to execute when finished
 */
module.exports = (element, falseCase, done) => {
    /**
     * The state of visibility of the given element inside the viewport
     * @type {Boolean}
     */
    const isVisible = browser.isVisibleWithinViewport(element);

    if (falseCase) {
        expect(isVisible).to.not
            .equal(
                true,
                `Expected element "${element}" to be outside the viewport`
            );
    } else {
        expect(isVisible).to
            .equal(
                true,
                `Expected element "${element}" to be inside the viewport`
            );
    }

    done();
};
