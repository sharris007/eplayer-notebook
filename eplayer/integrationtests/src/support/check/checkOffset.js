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
 * Check the offset of the given element
 * @param  {String}   elem              Element selector
 * @param  {String}   falseCase         Whether to check if the offset matches
 *                                      or not
 * @param  {String}   expectedPosition  The position to check against
 * @param  {String}   axis              The axis to check on (x or y)
 * @param  {Function} done              Function to execute when finished
 */
module.exports = (elem, falseCase, expectedPosition, axis, done) => {
    /**
     * Get the location of the element on the given axis
     * @type {[type]}
     */
    const location = browser.getLocation(elem, axis);

    /**
     * Parsed expected position
     * @type {Int}
     */
    const intExpectedPosition = parseInt(expectedPosition, 10);

    if (falseCase) {
        expect(location).to.not
            .equal(
                intExpectedPosition,
                `Element "${elem}" should not be positioned at ` +
                `${intExpectedPosition}px on the ${axis} axis`
            );
    } else {
        expect(location).to
            .equal(
                intExpectedPosition,
                `Element "${elem}" should be positioned at ` +
                `${intExpectedPosition}px on the ${axis} axis, but was found ` +
                `at ${location}px`
            );
    }

    done();
};
