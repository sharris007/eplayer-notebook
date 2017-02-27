export default class MoreInfoApi {
  static getData(url) {
    const request = new Request(url, { headers: new Headers({'Content-Type': 'text/plain'}) });
    return fetch(request, {
      method: 'get'
    });
  }
}
