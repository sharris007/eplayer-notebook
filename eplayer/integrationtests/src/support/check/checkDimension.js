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
 * Check the dimensions of the given element
 * @param  {String}   elem         Element selector
 * @param  {String}   falseCase    Whether to check if the dimensions match or
 *                                 not
 * @param  {String}   expectedSize Expected size
 * @param  {String}   dimension    Dimension to check (broad or tall)
 * @param  {Function} done         Function to execute when finished
 */
module.exports = (elem, falseCase, expectedSize, dimension, done) => {
    /**
     * The size of the given element
     * @type {Object}
     */
    const elementSize = browser.getElementSize(elem);

    /**
     * Parsed size to check for
     * @type {Int}
     */
    const intExpectedSize = parseInt(expectedSize, 10);

    /**
     * The size property to check against
     * @type {Int}
     */
    let origionalSize = elementSize.height;

    /**
     * The label of the checked property
     * @type {String}
     */
    let label = 'height';

    if (dimension === 'broad') {
        origionalSize = elementSize.width;
        label = 'width';
    }

    if (falseCase) {
        expect(origionalSize).to.not
            .equal(
                intExpectedSize,
                `Element "${elem}" should not have a ${label} of ` +
                `${intExpectedSize}px`
            );
    } else {
        expect(origionalSize).to
            .equal(
                intExpectedSize,
                `Element "${elem}" should have a ${label} of ` +
                `${intExpectedSize}px, but is ${origionalSize}px`
            );
    }

    done();
};
