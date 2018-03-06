import axios from 'axios';

export default class PopupApi {
  static getData(url) {
     return axios.get(url, { headers: { 'Content-Type': 'text/plain'} });
  }
}
