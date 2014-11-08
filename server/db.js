/**
 * New node file
 */
var util     = require("util");
var datasourceModule= require('./datasource.js');

//MongoDB
var mongoose = require("mongoose"),
    Schema   = mongoose.Schema;

//Mongoose Models --> 
var safe_params = { j: 1, w: 1, wtimeout: 10000 };

var StocksEventSchema = new Schema({
	symbol: { type: String },
	 price: { type: Number },
	volume: { type: Number }
},{safe:safe_params});
mongoose.model('StocksEventSchema2', StocksEventSchema);


var StocksSummarySchema = new Schema({
	   symbol: { type: String },
	timestamp: { type: Number },
	      max: { type: Number },
	      min: { type: Number },
	  average: { type: Number },
	   volume: { type: Number }
},{safe:safe_params});
mongoose.model('StocksSummarySchema2', StocksSummarySchema);

///////////////////////////////////////////////////

var mongoConfig = config.properties.mongo;
var db = mongoose.createConnection("mongodb://" + mongoConfig.username + ":" + mongoConfig.password + "@" + mongoConfig.hostname + ":" + mongoConfig.port + "/" + mongoConfig.db);
var mongooseTypes = require("mongoose-types")
, useTimestamps = mongooseTypes.useTimestamps;
StocksEventSchema.plugin(useTimestamps);

////////////////////////////////

exports.persistStocksEvent = function persistStocksEvent(json){
	var Summary = db.model('StocksSummarySchema2','stockssummaryinfo');
	var TickerEvent = db.model('StocksEventSchema2', 'stocksdata');
	
	util.debug("<================ START ===============>");
	util.debug("Incoming data ... " + json );
	var data = JSON.parse(json);
	util.debug("Parsed data ... " + data );
	
	TickerEvent.count({}, function( err, count) {   
		util.debug( "Records Count:", count ); 

		if(count < datasourceModule.getSampleData().length) {
			var te = new TickerEvent({
				symbol: data.symbol,
				price: data.price,
				volume: data.volume
			});	
			
		   te.save(function(err) {
			if(err) {
				throw(err);
			}
			util.debug("Step 1 : Got a Stock Symbol.."+JSON.stringify(data));
			util.debug(te.createdAt); // Should be approximately now
			var v_max = 0;
			var v_min = 0;
					
		////////////// Step 1 - calculate Max
		TickerEvent.find({ symbol : data.symbol }).sort({price: -1}).limit(1).exec( function(err, doc1) {			
		  if(doc1) {
		    util.debug(" Got Document1 "+doc1[0]+" for symbol "+data.symbol);
		    v_max = doc1[0].price;
		    util.debug(" Got Max Val : "+v_max);
							 
		/////////// Step 3 - calculate Min
		TickerEvent.find({ symbol : data.symbol }).sort({price: -1}).limit(1).exec( function(err, doc2) {
		   if(doc2) {
		     util.debug(" Got Document2 "+doc2[0]+" for symbol "+data.symbol);
		     v_min = doc2[0].price;
		     util.debug("Got Min Val : "+v_min);
					 
		//////// Step 4 - calculate Summary			
		Summary.find({ symbol : data.symbol }).limit(1).exec(function (err, doc3){
		    if(!err) {
			 util.debug("Found Summary " + doc3[0]);
			}else {
		 	 util.debug("Error: could not find Summary for " + data.symbol);
			}
			if(!doc3 || doc3.length == 0) {
			  util.debug("Event : Create new Summary document ");
			  var summaryDoc = new Summary();
			  summaryDoc.symbol = data.symbol;		
			  summaryDoc.timestamp = 1234;
			  summaryDoc.max = v_max;
			  summaryDoc.min = v_min;
			  summaryDoc.volume = data.volume;

			  summaryDoc.save(function(err) {
		            if(err) {
			         throw(err);
			        }
			  });							 			
			}else {
			  doc3[0].symbol = data.symbol;		
			  doc3[0].timestamp = 1234;
			  doc3[0].max = v_max;
			  doc3[0].min = v_min;
			  doc3[0].volume = doc3[0].volume + data.volume;
		          doc3[0].save();
			
		          util.debug("Step 4 : Saved the summary.."+JSON.stringify(doc3[0]));
			}
			util.debug("<================ END ===============>");
		   
	      }); // End of Summary Calculation 
	     }
	    }); // End of Min Calculation
	   }				 
	  });	// End of Max Calculation
	 });// End of Save Operation
	} 
  });// End of Count Operation
};

//////////

exports.findSummary = function findStocksEventSummary(symbol, resp) {

/*mongoose.connection.on("open", function(){
util.debug("mongodb is connected!!");
});*/
util.debug("<<======  SUMMARY  ======>>");	
util.debug("found symbol ..." + symbol);

var StocksSummary2 = db.model('StocksSummarySchema2','stockssummaryinfo');
util.debug("Found TickerSummary");
var StocksEvent2 = db.model('StocksEventSchema2', 'stocksdata');
util.debug("Found TickerEvent");
StocksSummary2.findOne({ "symbol" : symbol}, function(err, summarydata) {		
	if(err) {
		throw(err);
	}else{
		util.debug("Good data >> "+summarydata);
	}
	if(!summarydata) {
	    util.debug("Data undefined " + summarydata);
	}else {		
		util.debug("Found it!! "+summarydata);
		var summaryDataJson = JSON.stringify(summarydata);
		util.debug("Event 3 : Got the Summary "+ summaryDataJson);
		StocksEvent2.find({ "symbol" : symbol }, 
				function (err, chartdata){
				if(err) {
					throw(err);
				}
				//var chartDataJson = JSON.stringify(chartdata);
				
				//util.debug("Complete data set ..."+ JSON.stringify({summary: summaryDataJson, chartdata: chartDataJson}));
							
				summaryDataJson = JSON.stringify({summary: summarydata, chartData: chartdata});
				util.debug(" Complete data set ..."+summaryDataJson);
				
		resp.send(summaryDataJson);
		});	
    }			
});
};
////////////////////////