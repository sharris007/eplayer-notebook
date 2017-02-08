class componentParser {

  parse(componentElement) {
    this.data = { type: componentElement.getAttribute('data-type'), src: componentElement.getAttribute('data-uri') };
  }
}

export class AudioParser extends componentParser {
  getData(figure) {
    const title = figure.getElementsByClassName('heading4AudioTitle')[0].textContent || '';
    const action = figure.getElementsByClassName('heading4AudioNumberLabel')[0].textContent || '';
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    const audioElement = componentElement.getElementsByTagName(this.data.type)[0];
    if (audioElement && audioElement.getElementsByTagName('source')[0]) {
      const source = audioElement.getElementsByTagName('source')[0];
      const data = {
        source: source.src,
        title: (title.trim() || 'Audio'),
        action: (action || ''),
        type: componentElement.getAttribute('data-type')
      };
      return data;
    }
    return false;
  }
}

export class FlashcardsParser extends componentParser {
  getData(figure) {
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    this.data.title = figure.getElementsByClassName('heading4WidgetFlashcardsTitle')[0].textContent || '';
    this.data.label = figure.getElementsByClassName('heading4WidgetFlashcardsNumberLabel')[0].textContent || '';
    this.data.displayPreview = true;
    this.data.actionType = 'FLASHCARDS_WIDGET';

    return this.data;
  }
}

export class VideoParser extends componentParser {
  getData(figure) {
    const title = figure.getElementsByClassName('heading4VideoTitle')[0].textContent || '';
    const action = figure.getElementsByClassName('heading4VideoNumberLabel')[0].textContent || '';
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    const videoElement = componentElement.getElementsByTagName(this.data.type)[0];
    if (videoElement) {
      this.data.thumbnail = {};
      this.data.thumbnail.src = videoElement.getAttribute('poster');
      const source = videoElement.getElementsByTagName('source')[0];
      const caption = figure.getElementsByTagName('figcaption')[0].textContent || '';

      this.data.src = source.src;
      this.data.title = title || 'Video';
      this.data.action = action || '';
      this.data.caption = caption || '';
      this.data.alt = '';

      return this.data;
    }
    return false;
  }
}

export class ImageParser extends componentParser {
  getData(figure) {
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    const imageElement = componentElement.getElementsByTagName('img')[0];
    if (imageElement != null) {
      this.data.src = imageElement.getAttribute('src');
      this.data.title = imageElement.getAttribute('title');
      this.data.alt = imageElement.getAttribute('alt');
      this.data.caption = figure.getElementsByTagName('figcaption')[0].textContent || '';
      this.data.width = '100%';

      return this.data;
    }
    return false;
  }
}

export class VideoSlideShowParser extends componentParser {
  getData(figure) {
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    this.data.actionType = 'VIDEOS_WIDGET';
    this.data.displayPreview = true;
    return this.data;
  }
}

export class ImageSlideShowParser extends componentParser {
  getData(figure) {
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    this.data.actionType = 'IMAGES_WIDGET';
    this.data.displayPreview = true;
    return this.data;
  }
}

export class TimelineParser extends componentParser {
  getData(figure) {
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    this.data.displayPreview = true;
    this.data.actionType = 'TIMELINE_WIDGET';
    return this.data;
  }
}

export class TinyQuizParser extends componentParser {
  getData(figure) {
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    this.data.actionType = 'TINYQUIZ_WIDGET';
    this.data.displayPreview = true;
    return this.data;
  }
}

export class ImageIdentifierParser extends componentParser {
  getData(figure) {
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    this.data.actionType = 'IMAGE_IDENTIFIER_WIDGET';
    this.data.displayPreview = true;
    return this.data;
  }
}

export class MCQParser extends componentParser {
  getData(figure) {
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    this.data.actionType = 'MCQ_WIDGET';
    this.data.displayPreview = true;
    return this.data;
  }
}

export class MTIParser extends componentParser {
  getData(figure) {
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    this.data.actionType = 'MTI_WIDGET';
    this.data.displayPreview = true;
    return this.data;
  }
}

export class UCAParser extends componentParser {
  getData(figure) {
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    this.data.actionType = 'UCA_WIDGET';
    this.data.displayPreview = true;
    return this.data;
  }
}

export class TIAParser extends componentParser {
  getData(figure) {
    const componentElement = figure.getElementsByClassName('pearson-component')[0];
    super.parse(componentElement);
    this.data.actionType = 'TIA_WIDGET';
    this.data.displayPreview = true;
    return this.data;
  }
}
