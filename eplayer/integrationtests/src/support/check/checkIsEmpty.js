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
import checkContainsAnyText from './checkContainsAnyText';

module.exports = (element, falseCase, done) => {
    let newFalseCase = true;
    let newDone = done;

    if (typeof falseCase === 'function') {
        newDone = falseCase;
        newFalseCase = false;
    } else if (falseCase === ' not') {
        newFalseCase = false;
    }

    return checkContainsAnyText(element, newFalseCase, newDone);
};
