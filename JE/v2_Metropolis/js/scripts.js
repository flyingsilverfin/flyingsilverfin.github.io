

var petalTypes = [
"petal1.png", 
"petal2.png",
"petal3.png",
"petal4.png",
"petal5.png",
"petal6.png",
"flower1.png",
"flower2.png",
"flower3.png",
"flower4.png",
"flower5.png"
]

HIT_COUNTER_URL = "../hit_counter/hitcounter.cgi";
STAY_TIME_URL = "../hit_counter/stayTime.cgi?length=";	//length in ms
ARRIVAL_TIME = Date.now();

var petals = [];
var counter = 0;

//array will contain all requird sin and cos values in [[sin(t), cos(t)],[...]...] format
//could do some tricks to only store sin or cos and mess with indexing cleverly
var precomputed = [];

var yScale = 3;	//stretch vertical Path -- 3 WORKS BEST!!
var xScale = 1;	//stretch horizontal Path
var variability = 28;


var secondsPerFigure = 30.0;	//seconds to complete full figure 8
var interval = 25.0;	//ms
var dt = 2.0*Math.PI*interval/1000/secondsPerFigure;	//do not touch!
var maxStep = secondsPerFigure/(interval/1000);


function httpGet(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function ready() {
//	generatePetals(0);	
	
	//set global for later
	var img = document.getElementById("logo-img");
	logoRatio = img.height/img.width;
	
	if(window.attachEvent) {
		window.attachEvent('onresize', set_logo_size);
	}
	else if(window.addEventListener) {
		window.addEventListener('resize', set_logo_size, true);
	}
	set_logo_size();
	
	//send hit counter update!
	httpGet(HIT_COUNTER_URL, function (v) {});
	
	//track how long been on page
	window.onbeforeunload = function (e) {
		console.log("sending HTTP GET");
		httpGet(STAY_TIME_URL + (Date.now() - ARRIVAL_TIME), function(v) {});
	};
	
}

function set_logo_size() { 

	//set offset to compensate for possible navbar height change
	//want to keep logo visible
	var offset = document.getElementById("offset");
	var navbar = document.getElementById("nav-bar");
	offset.style.height = navbar.clientHeight;
	
	//set logo size
	var height = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;
	height = height - navbar.clientHeight;
	var width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;
	
	var img = document.getElementById("logo-img");
	
	var screenRatio = height/width;

	console.log("logo ratio" + logoRatio);
	if (screenRatio < logoRatio) {
		console.log("Screen Ratio: " + screenRatio);
		img.height = height*1.05;
		img.width = img.height/logoRatio;
	} else {
		img.width = width;
		img.height = logoRatio * img.width;
	}
}


//setup sin and cos precomputed values to save CPU resources/battery
function precompute() {
	for (var i = 0; i < maxStep; i++) {
		precomputed.push([Math.sin(dt*i), Math.cos(dt*i)]);
	}
}

precompute();

//console.log(secondsPerFigure);
//console.log(interval);
//console.log(Math.PI);
console.log("Number of steps: " + maxStep);
console.log("precompute completed");
console.log("Last element: " + precomputed[maxStep-1]);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function Petal(id, htmlElem, properties) {

	this.id = id;
	this.htmlElement = htmlElem;
	this.leftPercent = 0;
	this.topPercent = 0;
	//console.log(properties);
	this.step = properties.step;
	
	if (properties.hasOwnProperty("left")) {
		this.leftPercent = properties.left;
		this.origLeftPercent = this.leftPercent;
	} else {
		this.leftPercent = 100 - properties.right;
		this.origLeftPercent = this.leftPercent;
	}
	if (properties.hasOwnProperty("top")) {
		this.topPercent = properties.top;
		this.origTopPercent = this.topPercent;
	} else {
		this.topPercent = 100 - properties.bottom;
		this.origTopPercent = this.topPercent;
	}
	
	this.htmlElement.style.left = this.leftPercent + "%";
	this.htmlElement.style.top = this.topPercent + "%";

	//pick a random petal/flower
	var i = getRandomInt(0,petalTypes.length);
	this.htmlElement.src = "images/cherry_tree/"+petalTypes[i];
	
	this.move = function(right, down) {
		this.leftPercent += right;
		this.topPercent += down;
/*		
		var parent_height = this.htmlElement.parentElement.clientHeight;
		var parent_width = this.htmlElement.parentElement.clientWidth;
		
		this.htmlElement.style.transform = 
			"translate(" + (this.leftPercent - this.origLeftPercent)/this.origLeftPercent *parent_width
				+ "px," + (this.topPercent - this.origTopPercent)/this.origTopPercent *parent_height
				+ "px)";
*/		
		this.htmlElement.style.left = this.leftPercent + "%";
		this.htmlElement.style.top = this.topPercent + "%";
		
	};
	
	this.moveAlongPath = function() {
		this.step = (this.step + 1)%(maxStep);
		//NOT 100% SURE WHY THE 40* needs to be there... it works!
				
		dx = -xScale* precomputed[this.step][0]*40*dt;
		dy = 0.5*yScale * precomputed[(2*this.step)%maxStep][1]* 40 * dt;
		this.move(dx, dy);
	}
		
	this.getPosition = function() {
		return {left : this.leftPercent, top : this.topPercent};
	};
	
	this.attachTo = function(parent) {

		try {
			parent.appendChild(this.htmlElement);
		} catch (TypeError) {
		}
	};
}



function generatePetals(n) {
	var parent = x = document.getElementById("ticketing").getElementsByClassName("content-container-row")[0];

	for (var i = 0; i < n; i++) {
		
		var t = Math.random() * 2*Math.PI;
		var step = Math.round(t/dt);
		console.log("step: " + step);
		var x = 49 + 40*Math.cos(t) + variability*(Math.random()-0.5);
		var y = 50 + 60*Math.sin(t)*Math.cos(t) + variability*(Math.random()-0.5);
	
		var leftPercent = x;
		var topPercent = y;
		
		
		var petalId = "petal" + counter;
		counter++;
		
		var elem = document.createElement("img");
		elem.className = "small-image";
		elem.id = petalId;
		
		var newPetal = new Petal( petalId, elem, { left : leftPercent, top : topPercent, step : step})
		newPetal.attachTo(parent);
		petals.push(newPetal);	
	}
	
	requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	if (window.requestAnimationFrame) {
		window.requestAnimationFrame(animate);
	} else {
		setInterval(animate, interval);
	}
}



var now, then = 0;

function animate(timestamp) {

	//trick to reduce framerate/recalcs
	now = Date.now();
	var elapsed = now-then;
		if (elapsed > interval) {

		for (var p in petals) {
			petals[p].moveAlongPath();
		}
		then = now;
	}
	if (window.requestAnimationFrame) {
		requestAnimationFrame(animate);
	}
}