/**
 * New node file
 */
var util     = require("util");
var queueModule= require('./queue.js');
var datasourceModule= require('./datasource.js');


       ////////
             
             var index = 0;
                          
exports.receiveDataStreams =  function receiveDataStreams(stocksEventSender) {
                var symbolInfo = {
                   symbol: datasourceModule.getSymbol(index), 
                   price: datasourceModule.getPrice(index),
                   volume: datasourceModule.getVolume(index)
                };
                util.debug("sending ticker event: " + JSON.stringify(symbolInfo));
                if(typeof symbolInfo.symbol != 'undefined') {
                    // Publish message to Redis Client
                	queueModule.publishMessage(symbolInfo);     		
               }

               var timeout = Math.round(Math.random() * 12000);
               if(timeout < 3000) {
                  timeout += 10000;
               }
                  index++;
               if(index == datasourceModule.getSampleData().length) {		
                  index = 0;
               }
               util.debug("Got an event");
               stocksEventSender = setTimeout(receiveDataStreams, timeout);	
                          	//}else {
                          	//    stocksEventSender = null;
                          	//}
               };
                   