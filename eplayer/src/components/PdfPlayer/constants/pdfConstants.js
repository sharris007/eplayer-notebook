export const pdfConstants = {
  RegionType: {
    AUDIO: 1,
    CROSS_REFERENCE: 2,
    EMAIL: 3,
    FLASH: 4,
    GLOSSARY_TERM: 5,
    IMAGE: 6,
    INDEX_LINK: 7,
    MEDIA: 8,
    POWERPOINT: 9,
    TOC_LINK: 10,
    URL: 11,
    VIDEO: 12,
    EXCEL: 13,
    PDF: 14,
    WORD_DOC: 15,
    LTILINK: 16,
    IPADAPP: 17,
    JAZZASSET: 18
  },
  LinkType: {
    IMAGE: 1,
    FLV: 2,
    GLOSSARY_TERM: 3,
    MP3: 4,
    PAGE_NUMBER: 5,
    SWF: 6,
    URL: 7,
    EMAIL: 8,
    VIRTUAL_LEARNING_ASSET: 9,
    AUDIO_TEXT_SYNCH: 10,
    LTILINK: 11,
    FACELESSAUDIO: 12,
    H264: 13,
    IPADAPP: 14,
    CHROMELESS_URL: 15,
    JAZZASSET: 16
  },
  multipageConfig: {
    isMultiPageSupported: false,
    pagesToDownload: 20,
    pagesToNavigate: 5
  },
  foxitBaseUrl: {
    nonprod: 'https://foxit-aws.gls.pearson-intl.com/',
    prod: 'https://foxit-aws.gls.pearson-intl.com/'
  },
  printCopyrightInfo: 'Copyright &copy; 2018 Pearson Education'
};

export default pdfConstants;
