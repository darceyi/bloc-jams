var animatePoints = function(){
			
	var points = document.getElementsByClassName("point");

	var revealPoint = function(index) {
		points[index].style.opacity = 1;
		points[index].style.transform = "scaleX(1) translateY(0)";
		points[index].style.msTransform = "scaleX(1) translateY(0)";
		points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
	};

	for(var i = 0; i < points.length; i++) {
		revealPoint(i);
	}
};

 // Put any code that is dependent on a completely-loaded web page in a window.onload block, 
 // particularly any code that depends on DOM elements to execute properly.

window.onload = function(){
	window.addEventListener("scroll", function(event){
		console.log(event);
	});
};


animatePoints();