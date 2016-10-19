var map

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 42.39674, lng:-71.121815}, zoom: 8
	});
}