import contentful from 'contentful';  // eslint-disable-line import/no-extraneous-dependencies
import axios from 'axios';

export const clients = {
  search: axios.create({
    baseURL: 'https://etext-qa-stg.pearson.com/search/pxereader-cm',
    timeout: 5000,
    headers: {
    }
  }),
  scapi: axios.create({
    baseURL: 'https://scapi-dev-use.pearsoncms.net/sc-api/apis',
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
