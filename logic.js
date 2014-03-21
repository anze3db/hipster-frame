var instagram = require('instagram-node-lib')
  , conf = require('config-heroku')
  , user_ids = conf.instagram.user_ids

// Load Instagram configuration
instagram.set('client_id', conf.instagram.client_id);
instagram.set('client_secret', conf.instagram.client_secret);

// Fetch recent user images and return the latest one
exports.retrieveLatest = function(resolve){
  var results = []
    , check = function(){
      if(results.length !== user_ids.length){
        return;
      }
      var latest = { created_time : 0 };
      for (var i = results.length - 1; i >= 0; i--) {
        if(parseInt(results[i].created_time) > parseInt(latest.created_time)){
          latest = results[i];
        }
      }
      resolve(latest);
    }

  for (var i = user_ids.length - 1; i >= 0; i--) {
    instagram.users.recent({
      user_id: user_ids[i],
      complete: function(r){
        results.push(r.shift());
        check();
      }
    });
  };  
}