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
 * Check if a new window or tab is opened
 * @param  {String}   obsolete  The type of opened object (window or tab)
 * @param  {String}   falseCase Whether to check if a new window/tab was opened
 *                              or not
 * @param  {Function} done      Function to execute when finished
 */
module.exports = (obsolete, falseCase, done) => {
    /**
     * The handles of all open windows/tabs
     * @type {Object}
     */
    const windowHandles = browser.windowHandles().value;

    if (falseCase) {
        expect(windowHandles.length).to
            .equal(1, 'A new window should not have been opened');
    } else {
        expect(windowHandles.length).to.not
            .equal(1, 'A new window has been opened');
    }

    done();
};
