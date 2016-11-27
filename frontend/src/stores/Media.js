import {observable, action} from 'mobx';

const Media = observable({
  list: [],
  loading: true,
  fetch: action(() => {
    Media.loading = true;

    fetch('/api/instagram/media', {
      credentials: 'same-origin'
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.error("/api/instagram/media is not OK");
      }
    }).then((response) => {
      return response.map((res) => res[3]); // 3rd element is the image json
    }).then(action((media) => {
      Media.list = media;
      Media.loading = false;
    }));
  })
});

export default Media;
