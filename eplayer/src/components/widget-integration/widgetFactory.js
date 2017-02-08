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
