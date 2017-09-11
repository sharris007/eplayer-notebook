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
import english from './en.json';
import french from './fr.json';
import spanish from './es.json';
import italian from './it.json';
import german from './de.json';
import dutch from './nl.json';
import japanese from './ja.json';
import korean from './ko.json';
import swedish from './sv.json';
import chinese from './zh.json';
import portuguese from './pt.json';
import arabic from './ar.json';
import norwegian from './no.json';
import turkish from './tr.json';
import polish from './pl.json';
import traditionalChinese from './zht.json';
import englishUK from './enuk.json';
import russian from './ru.json';
import spanishCastilian from './escs.json';
import canadian from './ca.json'


/* eslint-disable quote-props */
export const languages={
  translations: {
    'en': english,
    'en-US': english,
    'en-US-HE' : english,
	'en-US-CG' : english,
	'en-CA' : canadian,
	'en-CA-PS' : canadian,
	'en-CA-ER' : canadian,	 
	'es-US-CG' : spanish,
    'fr': french,
    'fr-FR': french,
	'fr-FR-HE' : french,
	'fr-FR-CG' : french,
	'fr-FR-C-HE' : french,
	'fr-FR-C-CG' : french,
	'it-IT' : italian,
	'de-DE' : german,
	'nl-NL' : dutch,
	'ja-JP' : japanese,
	'ko-KR' : korean,
	'sv-SE' : swedish,
	'zh-CN' : chinese,
	'pt-PT' : portuguese,
	'ar-AR' : arabic,
	'no-NO' : norwegian,
	'tr-TR' : turkish,
	'pl-PL' : polish,
	'zh-TW' : traditionalChinese,
	'en-GB' : englishUK,
	'ru-RU' : russian,
	'es-ES-CS' : spanishCastilian,
	'es-MX-LA' : spanishCastilian,
	'pt-BR' : portuguese,
	'es-US' : spanish
  }
};