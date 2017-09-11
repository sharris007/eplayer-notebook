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
 * Parse the tags from the CLI to pass to Cucumber
 * @param  {Object} consoleArguments The arguments to parse from the console
 * @return {Array}                   The tags to process
 */
module.exports = (consoleArguments) => {
    // This is required since this file is not parsed with Babel

    'use strict';

    /**
     * The tags to pass to the cucumber options
     * @type {Array}
     */
    let tags = ['~@Pending']; // Always ignore @Pending tags

    consoleArguments.forEach((val) => {
        if (val.indexOf('--tags=') === 0) {
            /**
             * The collected tags from the CLI param
             * @type {String}
             */
            const collectedTags = val.replace('--tags=', '');

            tags = tags.concat(collectedTags);
        }
    });

    return tags;
};
