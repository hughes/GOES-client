import fetch from 'isomorphic-unfetch'

const DEFAULT_LAYER = 'geocolor';
const DEFAULT_COLLECTION = 'goes-16---full_disk';
const LAYERS = {
  geocolor: 'Geocolor',
  // white: 'Borders',  # todo: this one is different
  natural_color: 'Natural Color (EUMETSAT)',
  rgb_air_mass: 'RGB Air Mass (EUTMETSAT)',
};

class API {
  constructor() {
    this.host = process.env.API_ENDPOINT;
  }

  get layers() {
    return LAYERS
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

  generatePaths(timestamps, layers) {
    const paths = [];
    timestamps.forEach(timestamp => {
      paths.push(...layers.map(layer => this.imageryPath(timestamp, layer)));
    });
    return paths;
  }
}

const api = new API();
export default api;
