import fetch from 'isomorphic-unfetch'

const DEFAULT_LAYER = 'geocolor';
const DEFAULT_COLLECTION = 'goes-16---full_disk';

class API {
  constructor() {
    this.host = 'http://localhost:5000';
  }

  url(path) {
    return `${this.host}/${path}`;
  }

  async fetch(path) {
    const response = await fetch(this.url(path));
    const json = await response.json()
    return json;
  }

  async latest() {
    const data = await this.fetch('latest');
    return data.timestamps_int;
  }

  imageryPath(timestamp='', layer=DEFAULT_LAYER, collection=DEFAULT_COLLECTION) {
    const dateStr = timestamp.substr(0, 8);
    const region = '00'
    const filename = '000_000.png'
    return this.url(`imagery/${dateStr}/${collection}/${layer}/${timestamp}/${region}/${filename}`);
  }
}

const api = new API();
export default api;
