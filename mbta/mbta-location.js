var map;
var marker;
var myLat = 0;
var myLng = 0;
var myLocation;
var myOptions;
var tStops = [
	['Alewife', 42.395428, -71.142483],	
	['Davis', 42.39674, -71.121815],	
	['Porter Square', 42.3884, -71.11914899999999],	
	['Harvard Square', 42.373362, -71.118956],	
	['Central Square', 42.365486, -71.103802],	
	['Kendall/MIT', 42.36249079, -71.08617653],
	['Charles/MGH', 42.361166, -71.070628],	
	['Park Street', 42.35639457, -71.0624242],	
	['Downtown Crossing', 42.355518, -71.060225],	
	['South Station', 42.352271, -71.05524200000001],
	['Broadway', 42.342622, -71.056967],	
	['Andrew', 42.330154, -71.057655],
	['JFK/UMass', 42.320685, -71.052391],
	['North Quincy', 42.275275, -71.029583],	
	['Wollaston', 42.2665139, -71.0203369],	
	['Quincy Center', 42.251809, -71.005409],
	['Quincy Adams', 42.233391, -71.007153],	
	['Braintree', 42.2078543, -71.0011385],	
	['Savin Hill', 42.31129, -71.053331],
	['Fields Corner', 42.300093, -71.061667],
	['Shawmut', 42.29312583, -71.06573796000001],
	['Ashmont', 42.284652, -71.06448899999999]
];
var redLine1 = [];
var redLine2 = [{lat: tStops[12][1], lng: tStops[12][2]}]
var minDist = null;	
var loc;
var request;	
var tMarker;
var schedule;
var InfoWindow;

function init() {
	myLocation = new google.maps.LatLng(myLat, myLng);
	myOptions = {
		zoom: 12,
		center:{lat: 42.39674, lng: -71.121815},
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	map = new google.maps.Map(document.getElementById('map'), myOptions);
	InfoWindow = new google.maps.InfoWindow();
	getLocation();
	displayTStops();
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			displayLocation();
		});
	} else {
		alert("Browser does not support geolocation");
	}	
}

function displayLocation() {
	myLocation = new google.maps.LatLng(myLat, myLng);
	map.panTo(myLocation);
	marker = new google.maps.Marker({
		position: myLocation,
		title: "My Location",
		icon: {
			url: "pin.png",
			scaledSize: new google.maps.Size(25,25)
		}
	});

	marker.setMap(map);
	calcDistance();
}

function calcDistance() {
	var temp;
	for (var i = 0; i < tStops.length; i++) {
		var curMarker = new google.maps.LatLng(tStops[i][1], tStops[i][2]);
		temp = 
			google.maps.geometry.spherical.computeDistanceBetween(myLocation, curMarker);
		if (temp <= minDist || minDist == null) {
			minDist = temp;
			loc = i;
		}		
	}
	minDist *= .0006214;
	var closestLine = new google.maps.Polyline({
		path: [{lat: myLat, lng: myLng}, 
				{lat: tStops[loc][1], lng: tStops[loc][2]}],
		geodesic: true,
		strokeColor: '#0033CC',
		strokeCapacity: 1.0,
		strokeWeight: 3		
	});
	closestLine.setMap(map);
	marker.addListener('click', function() {
		InfoWindow.setContent('Distance to ' + tStops[loc][0] + ' is: '
							+ Math.round(minDist*100)/100 + ' mi');		
		InfoWindow.open(map, marker);
	});	
}

function displayTStops() {
	for (var i = 0; i < tStops.length; i++) {
		var stop = tStops[i];
		var stopLocation = new google.maps.LatLng(stop[1], stop[2]);
		tMarker = new google.maps.Marker({
			position: stopLocation,
			title: stop[0],
			icon: {
				url: "mbta.png",
				scaledSize: new google.maps.Size(25,25)
			}
		});
		tMarker.setMap(map);
		tMarker.addListener('click', function() {
			console.log(this);
			console.log(tMarker);
			getSchedule();
			InfoWindow.setContent(
				"Destination is: " + schedule.TripList.Trips[0].Destination +
					", Time to next train is: " + 	
					Math.round(schedule.TripList.Trips[0].Predictions[0].Seconds/60)
					+ " min and " +
					Math.round(schedule.TripList.Trips[0].Predictions[0].Seconds%60)
					+ " sec." 
			);
			InfoWindow.open(map, this);
		});
	}
	setPolyline();

}

function getSchedule() {
	request = new XMLHttpRequest();
	request.open("get", "https://rocky-taiga-26352.herokuapp.com/redline.json", true);
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			schedule = JSON.parse(request.responseText);
		} else if (request.status == 404) { 
			window.alert("Could not get data at this time. Please try again.");
		}
	};
	request.send();
}	

function setPolyline() {
	var j = 1;
	for (var i = 0; i <= 17; i++) {
		redLine1[i] = {lat: tStops[i][1], lng: tStops[i][2]};
	}
	for (var i = 18; i <= 21; i++) {
		redLine2[j] = {lat: tStops[i][1], lng: tStops[i][2]};
		j++;
	}
	var redBraintree = new google.maps.Polyline({
		path: redLine1,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeCapacity: 1.0,
		strokeWeight: 3
	});
	var redAshmont = new google.maps.Polyline({
		path: redLine2,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeCapacity: 1.0,
		strokeWeight: 3
	});	
	redBraintree.setMap(map);
	redAshmont.setMap(map);
}