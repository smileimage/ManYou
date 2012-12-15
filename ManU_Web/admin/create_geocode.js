var geocoder;
var marker;
var map;
var infowindow;

window.onload = function(){

	var seoul = new google.maps.LatLng(37.56648, 126.97796);

	geocoder = new google.maps.Geocoder();
	infowindow = new google.maps.InfoWindow();

	var mapOptions = {
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: seoul
	};

	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

	marker = new google.maps.Marker({
		map:map,
		draggable: true,
		animation: google.maps.Animation.DROP,
		position: seoul
	});
	
	var map_options = document.getElementById("map_options");
	var mapUl = document.getElementById("mapUl");
	google.maps.event.addListener(map, 'click', function(event){
		marker.setPosition(event.latLng);
		
		geocoder.geocode({'latLng':event.latLng}, function(results, status){
			if(status == google.maps.GeocoderStatus.OK){
				
				if(results[0]){
					$('#mapUl').removeClass("hidden");
					console.log(results[0].formatted_address);
					document.getElementById('location_lng').value=event.latLng.lng();
					document.getElementById("location_lat").value=event.latLng.lat();
					
					infowindow.setContent(map_options);
					
					infowindow.open(map, marker);
				}
			}
		});
	}); 

};

function codeAddress() {
	var address = document.getElementById("address").value;
	geocoder.geocode({'address' : address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			marker.setPosition(results[0].geometry.location);
			if(results[0]){
				infowindow.setContent(results[0].formatted_address);
				infowindow.open(map, marker);
			}
		} else {
			alert("Geocode was not successful for the following reason: "+ status);
		}
	});
}