/**
 * New node file
 */

var STOCKS_INFO = [
                   ["RIL",20,100],
             	  ["RIL",10,100],
             	  ["RIL",40,100],
                   ["TCS",10,100],
                   ["TCS",30,100],
                   ["INFY",10,100],
                   ["INFY",8,100],
                   ["INFY",28,100],
                   ["RIL",20,100],
             	  ["RIL",10,100],
             	  ["RIL",40,100],
                   ["TCS",10,100],
                   ["TCS",30,100],
                   ["INFY",10,100],
                   ["INFY",8,100],
                   ["INFY",28,100],
             	  ["RIL7",20,100],
             	  ["RIL7",10,100],
             	  ["RIL7",40,100],
                   ["TCS7",10,100],
                   ["TCS7",30,100],
                   ["INFY7",10,100],
                   ["INFY7",8,100],
                   ["INFY7",28,100],
             	  ["WIPRO1",30,100],
             	  ["WIPRO1",40,100],
             	  ["WIPRO1",60,100]
             	  ];
exports.getSampleData = function getSampleData() {
	 return STOCKS_INFO;
};

exports.getSymbol = function getSymbol(index) {
             	if(typeof STOCKS_INFO[index] == 'undefined') {
             		return undefined;
             	}
             	
             	return STOCKS_INFO[index][0];
             };

 exports.getPrice = function getPrice(index) {
             	if(typeof STOCKS_INFO[index] == 'undefined') {
             		return undefined;
             	}
             	return STOCKS_INFO[index][1];
             };

 exports.getVolume = function getVolume(index) {
             	if(typeof STOCKS_INFO[index] == 'undefined') {
             		return undefined;
             	}
             	return STOCKS_INFO[index][2];
             };

