import {observable, action} from 'mobx';

const Media = observable({
  list: [],
  loading: true,
  fetch: action(() => {
    Media.loading = true
    return fetch('/api/instagram/media', {
      credentials: 'same-origin'
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Did not receive OK");
      }
    }).then((response) => {
      return response.map((res) => res[3]); // 3rd element is the image json
    }).then(action((media) => {
      Media.list = media;
      Media.loading = false;
    })).catch(action((err) => {
      console.error(err);
      Media.loading = false;
    }));
  })
});

export default Media;
