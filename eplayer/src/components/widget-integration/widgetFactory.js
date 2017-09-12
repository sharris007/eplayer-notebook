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
import * as Parser from './componentParser';

const mapper = {
  audio: { parser: new Parser.AudioParser() },
  video: { parser: new Parser.VideoParser() },
  flashcards: { parser: new Parser.FlashcardsParser() },
  image: { parser: new Parser.ImageParser() },
  vidslideshow: { parser: new Parser.VideoSlideShowParser() },
  timeline: { parser: new Parser.TimelineParser() },
  imgslideshow: { parser: new Parser.ImageSlideShowParser() },
  tinyquiz: { parser: new Parser.TinyQuizParser() },
  ImageIdentifier: { parser: new Parser.ImageIdentifierParser() },
  mcq: { parser: new Parser.MCQParser() },
  mti: { parser: new Parser.MTIParser() },
  uca: { parser: new Parser.UCAParser() },
  tia: { parser: new Parser.TIAParser() }
};

export default class WidgetFactory {
  getData(figure) {
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    this.type = componentElement.getAttribute('data-type');
    this.type = this.type.replace(' ', '');
    return mapper[this.type].parser.getData(figure);
  }
}
