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
import clearInputField from '../support/action/clearInputField';
import clickElement from '../support/action/clickElement';
import closeLastOpenedWindow from '../support/action/closeLastOpenedWindow';
import deleteCookie from '../support/action/deleteCookie';
import dragElement from '../support/action/dragElement';
import focusLastOpenedWindow from '../support/action/focusLastOpenedWindow';
import handleModal from '../support/action/handleModal';
import moveToElement from '../support/action/moveToElement';
import pause from '../support/action/pause';
import pressButton from '../support/action/pressButton';
import scroll from '../support/action/scroll';
import selectOption from '../support/action/selectOption';
import selectOptionByIndex from '../support/action/selectOptionByIndex';
import setCookie from '../support/action/setCookie';
import setInputField from '../support/action/setInputField';
import setPromptText from '../support/action/setPromptText';
import submitForm from '../support/action/submitForm';
import browserRefresh from '../support/action/browserRefresh';
import addBookmark from '../support/action/addBookmark';
import textSelection from '../support/action/textSelection';
import buttonDown from '../support/action/buttonDown';
import buttonUp from '../support/action/buttonUp';
import escapeKey from '../support/action/escapeKey';
import closeAllButFirstTab from '../support/action/closeAllButFirstTab';
import appLogin from '../support/action/appLogin';
import search from '../support/action/search';
import delNoteHighlight from '../support/action/delNoteHighlight';
import addHighlight from '../support/action/addHighlight';
import addNote from '../support/action/addNote';


module.exports = function when() {
    this.When(
        /^I (click|doubleclick ) on the (link|button|element) "([^"]*)?"$/,
        clickElement
    );

    this.When(
        /^I (add|set) "([^"]*)?" to the inputfield "([^"]*)?"$/,
        setInputField
    );

    this.When(
        /^I clear the inputfield "([^"]*)?"$/,
        clearInputField
    );

    this.When(
        /^I drag element "([^"]*)?" to element "([^"]*)?"$/,
        dragElement
    );

    this.When(
        /^I submit the form "([^"]*)?"$/,
        submitForm
    );

    this.When(
        /^I pause for (\d+)ms$/,
        pause
    );

    this.When(
        /^I set a cookie "([^"]*)?" with the content "([^"]*)?"$/,
        setCookie
    );

    this.When(
        /^I delete the cookie "([^"]*)?"$/,
        deleteCookie
    );

    this.When(
        /^I press "([^"]*)?"$/,
        pressButton
    );

    this.When(
        /^I (accept|dismiss) the (alertbox|confirmbox|prompt)$/,
        handleModal
    );

    this.When(
        /^I enter "([^"]*)?" into the prompt$/,
        setPromptText
    );

    this.When(
        /^I scroll to element "([^"]*)?"$/,
        scroll
    );

    this.When(
        /^I close the last opened (window|tab)$/,
        closeLastOpenedWindow
    );

    this.When(
        /^I focus the last opened (window|tab)$/,
        focusLastOpenedWindow
    );

    this.When(
        /^I select the (\d+)(st|nd|rd|th) option for element "([^"]*)?"$/,
        selectOptionByIndex
    );

    this.When(
        /^I select the option with the (name|value|text) "([^"]*)?" for element "([^"]*)?"$/,
        selectOption
    );

    this.When(
        /^I move to element "([^"]*)?"( with an offset of (\d+),(\d+))*$/,
        moveToElement
    );

    this.When(
        /^I refresh the browser window*$/,
        browserRefresh
    );

    this.When(
        /^I create a new bookmark*$/,
        addBookmark
    );

    this.When(
        /^I select the text area of element "([^"]*)?"*$/,
        textSelection
    );

    this.When(
        /^I pressed the left mouse button*$/,
        buttonDown
    );

    this.When(
        /^I released the left mouse button*$/,
        buttonUp
    );

    this.When(
        /^I press esc key*$/,
        escapeKey
    );
    this.When(
        /^I set "([^"]*)?" value in element "([^"]*)?" and "([^"]*)?" value in element "([^"]*)?" and click on "([^"]*)?" button*$/,
        appLogin
    );
    this.When(
        /^I click on search icon "([^"]*)?" and in element "([^"]*)?" set page as "([^"]*)?" and click on the searched term*$/,
        search
    );
    this.When(
        /^I delete the (Note|Highlight)*$/,
        delNoteHighlight
    );
    this.When(
        /^I create highlight on element "([^"]*)?" of "([^"]*)?" color*$/,
        addHighlight
    );
    this.When(
        /^I create a Note on element "([^"]*)?" of "([^"]*)?" color and with "([^"]*)?" text*$/,
        addNote
    );
};
