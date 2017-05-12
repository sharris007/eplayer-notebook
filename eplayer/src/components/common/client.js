import contentful from 'contentful';  // eslint-disable-line import/no-extraneous-dependencies
import axios from 'axios';


export const clients = {

  search: axios.create({
    baseURL: 'https://view.cert1.ebookplus.pearsoncmg.com/ebook/ipad',
    timeout: 20000,
    headers: {
    }
  }),

  fetchBookmarks: axios.create({
    baseURL: 'https://view.cert1.ebookplus.pearsoncmg.com/ebook/ipad',
    timeout: 20000,
    headers: {
    }
  }),

  addBookmarks: axios.create({
    baseURL: 'https://view.cert1.ebookplus.pearsoncmg.com/ebook/ipad',
    timeout: 20000,
    headers: {
    }
  }),

  removeBookmark: axios.create({
    baseURL: 'https://view.cert1.ebookplus.pearsoncmg.com/ebook/ipad',
    timeout: 20000,
    headers: {
    }
  }),

  fetchTocAndViewer: axios.create({
    baseURL: 'https://view.cert1.ebookplus.pearsoncmg.com/ebook/ipad',
    timeout: 20000,
    headers: {
    }
  }),

  fetchBookInfo: axios.create({
    baseURL: 'https://view.cert1.ebookplus.pearsoncmg.com/ebook/ipad',
    timeout: 20000,
    headers: {
    }
  }),

  fetchPageInfo: axios.create({
    baseURL: 'https://view.cert1.ebookplus.pearsoncmg.com/ebook/ipad',
    timeout: 20000,
    headers: {
    }
  }),

  /*getBookShelf: axios.create({
    baseURL: 'http://sms.bookshelf.dev1.ebookplus.pearsoncmg.com/ebook/ipad/getuserbooks?siteid=11444&hsid=a37e42b90f86d8cb700fb8b61555bb22&key=1975822139101138730252017',
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json'
    }
  }),*/

 getBookShelf: axios.create({
    baseURL: 'https://etext-qa-stg.pearson.com/api/nextext-api/v1/api/nextext',
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json'
    }
  }),
 readerApi: axios.create({
    baseURL: 'https://api-sandbox.readerplatform.pearson-intl.com',
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json'
    }
  }),

  /*getLogin: axios.create({
    baseURL: 'https://etext-qa-stg.pearson.com/api/nextext-api/v1/api',
    timeout: 20000
  }),
*/

  scapi: axios.create({
    baseURL: 'https://scapi-dev-use.pearsoncms.net/sc-api/apis',
    timeout: 5000,
    headers: {
    }
  }),
  etext: axios.create({
   // baseURL: 'https://etext-stg.pearson.com/api/nextext-api/api/nextext',
    baseURL: 'https://paperapi-qa.stg-openclass.com/nextext-api/api/nextext',
    timeout: 5000,
    headers: {
    }
  }),

  panera: contentful.createClient({
    space: '415o8j07ef07',
    accessToken: 'f80e9320e96f0eabbb2aac94a71755160a538cb989bdf6a8701cf2c229ce20e6'
  }),
  redlob: contentful.createClient({
    space: '7te8ye58mdt7',
    accessToken: '5d348c4b749eab4dadc7c196bbc48c4095af1686b6a3a545572f25596eba1d76'
  }),
  tokyojoes: contentful.createClient({
    space: 'tbx6i45kvpo5',
    accessToken: 'ddaa1c7c0ebfd27bfacbe8aa5422becf25a444a3bc415cdb0011e06e22f9189a'
  })
};

export default clients.tokyojoes;
