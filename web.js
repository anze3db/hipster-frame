var express = require("express"),
    logfmt = require("logfmt"),
    http = require('http'),
    app = express(),
    logic = require('./logic.js'),
    WebSocketServer = require('ws').Server,
    port = process.env.PORT || 5000;

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

var server = http.createServer(app);
server.listen(port);

// Set up the websocket server
var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {

  var last_created_time = 0,
      id;
  id = setInterval(function() {
    logic.retrieveLatest(function(latest){
      if(!last_created_time){
        last_created_time = parseInt(latest.created_time);
      }
      if(last_created_time < parseInt(latest.created_time)){
        ws.send(JSON.stringify(latest), function() {  });
        last_created_time = parseInt(latest.created_time);
      }
    });
  }, 60000);

  ws.on('close', function() {
      clearInterval(id);
  });
});
