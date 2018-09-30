const ExecutionEnvironment = require('exenv');

const got = {};

const preloadImage = (url) => {
  // do nothing for server side rendering
  if(!ExecutionEnvironment.canUseDOM) {
    return Promise.resolve();
  }

  // use local cache
  if(got[url]) {
    return got[url];
  }

  // cache miss - make a new image
  let resolve;
  const promise = new Promise((_resolve, reject) => {
    resolve = _resolve;
  });
  got[url] = promise;

  const img = new Image();
  img.onload = () => {
    resolve(img);
  }
  img.src = url;

  return promise;
}

export default preloadImage;
