var map;
var marker;
var myLat = 0;
var myLng = 0;
var myLocation;

var myOptions;

function init() {
	myLocation = new google.maps.LatLng(myLat, myLng);
	myOptions = {
		zoom: 10,
		center:{lat: 42.39674, lng: -71.121815},
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	map = new google.maps.Map(document.getElementById('map'), myOptions);
	getLocation();
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
		position: myLocation
	});
	marker.setMap(map);
}

