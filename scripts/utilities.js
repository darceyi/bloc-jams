// Write a function named forEach in the utilities.js file. 

// The goal is to write your own function named forEach. It should:
// 		Use a loop to go through all elements in the points array.
// 		Execute a callback for each element.

// Replace the for loop in the animatePoints function with a forEach 
// block and confirm that the selling points still animate properly.

// non callback way:
var fruits = ["grape", "apple", "orange"];

function forEach() {
 	for(var i = 0; i < fruits.length; i++) {
 		console.log(i);
 	}
}