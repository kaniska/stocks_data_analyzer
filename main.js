
/**
 * Module dependencies.
 */
var express = require('express');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var sy     = require("sys");
var util     = require("util");
require('./server/globals.js');
dbModule = require('./server/db.js');
var queueModule= require('./server/queue.js');
var streamingModule = require('./server/streaming.js');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  //app.use(express.errorHandler());
}

var httpServer = http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});

var io  = require("socket.io").listen(httpServer);
var stocksEventSender;

////////////////////////

queueModule.listenForIncomingMessages(io);

/////////////////////////////////

app.get("/", function(req, resp) {
    resp.render("home", {
       pageTitle: "Stock Market Analytics"
    });
});

/////////////////////////////////////

app.get("/summary/:symbol", function(req, resp) {
	dbModule.findSummary(req.params.symbol, resp);
});

/////////////////////////////////

io.sockets.on('connection', function (socket) {
	if(!stocksEventSender) {
		streamingModule.receiveDataStreams();
	}
    util.debug("connection made..." + httpServer);
});

httpServer.listen(app.get('port'));