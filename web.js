var express = require("express")
  , logfmt = require("logfmt")
  , app = express()
  , logic = require('./logic.js')
  ;

// Set up the server
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(logfmt.requestLogger());
app.use(express.static(__dirname + '/static'));

// Render main page
app.get('/', function(req, res) {
  logic.retrieveLatest(function(latest){
    res.render('index', latest);
  });
});

// Used for checking when to refresh the page
app.get('/check', function(req, res){
  logic.retrieveLatest(function(latest){
    res.send(latest.created_time);
  });
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
