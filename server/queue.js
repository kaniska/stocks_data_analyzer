/**
 * New node file
 */
var util     = require("util");
dbModule = require('./db.js');
var redis    = require("redis");


// util.debug("mongo connection: "+"mongodb://" + mongoConfig.username + ":" + mongoConfig.password + "@" + mongoConfig.hostname + ":" + mongoConfig.port + "/" + mongoConfig.db);
///////////////////////
var redisConfig = config.properties.redis;
//util.debug("redis config: "+JSON.stringify(redisConfig));
var redisClient = redis.createClient(redisConfig.port, redisConfig.hostname);
var redisPublisher = redis.createClient(redisConfig.port, redisConfig.hostname);
if(redisConfig.password) {
	redisClient.auth(redisConfig.password);
	redisPublisher.auth(redisConfig.password);
}

/////////////////////////////
var watchers = {};
/// Consume
exports.listenForIncomingMessages = function consumeMessage(ioChannel) {
redisClient.subscribe("redis-connector");
redisClient.on("message", function(channel, json) {
	//////////////////
	
	dbModule.persistStocksEvent(json);
	
	util.debug( "Abbout to send data to Browser.."); 
	ioChannel.sockets.send(json);
	util.debug( "Sent data to Browser:", json ); 
});
};

/// Publish
exports.publishMessage = function publishMessage(symbolInfo) {
redisPublisher.publish("redis-connector", JSON.stringify(symbolInfo));
};
