import {observable, action} from 'mobx';

function _parse_response(url) {
  return fetch(url, {
    credentials: 'same-origin'
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Did not receive OK");
    }
  }).then((response) => {
    return response.map((res) => res[3]); // 3rd element is the image json
  });
}

const Media = observable({
  list: [],
  loading: true,
  fetch: action(() => {
    Media.loading = true
    return _parse_response('/api/instagram/media').then(action((media) => {
      Media.list = media;
      Media.loading = false;
    })).catch(action((err) => {
      console.error(err);
      Media.loading = false;
    }));
  }),
  more: action(() => {
    Media.loading = true;
    return _parse_response('/api/instagram/more').then(action((media) => {
      console.log(Media.list.concat(media))
      Media.list = media;
      Media.loading = false;
    })).catch(action((err) => {
      console.error(err);
      Media.loading = false;
    }));
  })
});

export default Media;
