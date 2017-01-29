// Write a function named forEach in the utilities.js file. 

// The goal is to write your own function named forEach. It should:
// 		Use a loop to go through all elements in the points array.
// 		Execute a callback for each element.

// Replace the for loop in the animatePoints function with a forEach 
// block and confirm that the selling points still animate properly.

// non callback way:
var forEach = function(points) {
 	for(var i = 0; i < points.length; i++) {
 		return i;
 	}
};

var getItemsInPoints = function(points, forEach) {
  return forEach(points);
};



// function forEach(points, callback) {
//  	for(var i = 0; i < points.length; i++) {
//  		callback(i);
//  	}
// }