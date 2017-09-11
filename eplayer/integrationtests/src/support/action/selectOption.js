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
 * Select an option of a select element
 * @param  {String}   selectionType  Type of method to select by (name, value or
 *                                   text)
 * @param  {String}   selectionValue Value to select by
 * @param  {String}   selectElem     Element selector
 * @param  {Function} done           Function to execute when finished
 */
module.exports = (selectionType, selectionValue, selectElem, done) => {
    /**
     * Arguments to pass to the selection method
     * @type {Array}
     */
    const commandArguments = [
        selectElem,
        selectionValue,
    ];

    /**
     * The select element
     * @type {Object}
     */
    const element = browser.element(selectElem);

    /**
     * The method to use for selecting the option
     * @type {String}
     */
    let command = '';

    switch (selectionType) {
        case 'name' : {
            command = 'selectByAttribute';

            // The selectByAttribute command expects the attribute name as it
            // second argument so let's add it
            commandArguments.splice(1, 0, 'name');

            break;
        }

        case 'value' : {
            command = 'selectByValue';
            break;
        }

        case 'text' : {
            command = 'selectByVisibleText';
            break;
        }

        default: {
            throw new Error(`Unknown selection type "${selectionType}"`);
        }
    }

    element[command].apply(this, commandArguments);

    done();
};
