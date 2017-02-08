export default class Utilities {

  /**
   * Formats the time in 00:00 format from time in seconds,
   *
   * @param time the time in seconds
   * @returns {string} formatted time
   */
  static parseFlashcardData(payload) {
    if (payload) {
      return payload.data;
    }
    return '';
  }

  static parseVideoSlideShowData(payload) {
    if (payload) {
      return payload.data;
    }
    return '';
  }

  static parseTimelineData(payload) {
    if (payload) {
      return payload.data;
    }
    return '';
  }

  static parseImageSlideShow(payload) {
    if (payload) {
      return payload.data;
    }
    return '';
  }

  static parseTinyQuizData(payload) {
    if (payload) {
      return payload.data;
    }
    return '';
  }

  static parseImageIdentifierData(payload) {
    if (payload) {
      return payload.data;
    }
    return '';
  }

  static parseMCQData(payload) {
    if (payload) {
      return payload.data;
    }
    return '';
  }

  static parseMTIData(payload) {
    if (payload) {
      return payload.data;
    }
    return '';
  }

  static parseUCAData(payload) {
    if (payload) {
      return payload.data;
    }
    return '';
  }

  static parseTIAData(payload) {
    if (payload) {
      return payload.data;
    }
    return '';
  }

}
