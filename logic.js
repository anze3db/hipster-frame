var instagram = require('instagram-node-lib'),
    conf = require('config-heroku'),
    user_ids = conf.instagram.user_ids;

// Load Instagram configuration
instagram.set('client_id', conf.instagram.client_id);
instagram.set('client_secret', conf.instagram.client_secret);

// Fetch recent user images and return the latest one
exports.retrieveLatest = function(resolve){

  var results = [],
      returned_results = 0;

  function check(){
    if(returned_results !== user_ids.length){
      return;
    }
    results.sort(function(a,b){
      return parseInt(b.created_time) - parseInt(a.created_time);
    });
    resolve(results);
  }
  function complete(r) {
    results = results.concat(r);
    returned_results++;
    check();
  }
  for (var i = user_ids.length - 1; i >= 0; i--) {
    instagram.users.recent({
      user_id: user_ids[i],
      complete: complete
    });
  }
};
