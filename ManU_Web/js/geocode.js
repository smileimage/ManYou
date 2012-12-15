var defaultLocation;
var geocoder;
var marker;
var map= null;
var infoBubble;
var dbLat;
var dbLng;
var geoAddress;
var arrMarker = new Array();
var arrInfoBubble = new Array();
var markerOnDialog;
var mapDialog;
var mapLoad;
var markerOnLoad;
var i=0;
var markerClusterer;

$(document).ready(function(){
	var href = location.href;
	href = href.substring(href.lastIndexOf("/"));
	if(href != "/board.html" && href != "/mypage.html" && href != "/communityManager.html" && href != "/intro.html"){
		initialize('map_canvas');
	}
	
	initDialogMap();
//------------------ Category click / marker Display ---------------------------
	$('#effect img.categoryBtn').live('click', function(event) {
		sessionStorage.setItem('categoryPk', $(this).attr('category-pk'));
		chooseCateroyList();
	});
});

function chooseCateroyList(){
	$('#' + localStorage.getItem('divId') + ' div').remove();
	
	if (currPage <= 1) {
		currPage = 1;
		$('#hideBtn').css('display', 'none');

	} else{ 
		$('#hideBtn').css('display', '');
	}
	$.getJSON('searchCategory.do', {
			investiItemType: sessionStorage.getItem('categoryPk'),
			interestCommunityNo:localStorage.getItem("communityNumber"),
			page:currPage
		}, 
		function(data, textStatus, jqXHR){
			if (data.status == 200) {
				if(data.result.length > 0){
					for(var i=0; i< data.result.length; i++){
					}
					if(i < 5 && i != 0){
						$('#moreBtn').css('display','none');
					}else if(i==0){
						currPage--;
						$('#moreBtn').css('display','none');
					}
					
					$.each( data.resultList, addMappingInfoList );
					
					allMarkersClear();
					$.each(data.result, putMarkerOnMap);
					
					markerClusterer.clearMarkers();
					markerClusterer = new MarkerClusterer(map, arrMarker, {
						gridSize: 70, 
						maxZoom: 15,
						styles: null
					});
				}
				else{
					markerClusterer.clearMarkers();
					generateCustomAlert('error','등록된 글이 없습니다.');
				}
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		});
}
function initmainMapSetting(mapDivId){
	
	if(mapDivId == 'map_canvas' || mapDivId == 'map_canvas_Load'){
		attachCategoryListonMap(mapDivId);
		google.maps.event.addListener(map, 'click', function(event){
			mapClick(event);
		});//map Click Event 끝
		
		$('#codeSearch').click(function(){
			codeAddress();
		});//주소 검색 클릭 이벤트
	
		$('#searchAddress').keypress( function(e) {
			if(e.keyCode==13){
				codeAddress();
			}
		});//주소 검색 enter 이벤트
		
		$('#allMarkerBtn').live('click',function(){
			allMarkerView(localStorage.getItem("communityNumber"));
			map.setCenter(defaultLocation);
		});
//----------------- CategoryList Loading -----------------------------------
		var autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchAddress'));
		autocomplete.setTypes(new Array());
		autocomplete.bindTo('bounds', map);

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			var place = autocomplete.getPlace();
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(15);  // Why 17? Because it looks good.
			}

			var image = new google.maps.MarkerImage(
					place.icon,
					new google.maps.Size(71, 71),
					new google.maps.Point(0, 0),
					new google.maps.Point(17, 34),
					new google.maps.Size(35, 35));
			marker.setIcon(image);
			marker.setPosition(place.geometry.location);

			var placeAddress = '';
			if (place.address_components) {
				placeAddress = [
				           (place.address_components[0] && place.address_components[0].short_name || ''),
				           (place.address_components[1] && place.address_components[1].short_name || ''),
				           (place.address_components[2] && place.address_components[2].short_name || '')
				           ].join(' ');
			}
		});
	}
}

function initDialogMap(){
	defaultLocation = new google.maps.LatLng(37.56648, 126.97796);
	
	geocoder = new google.maps.Geocoder();
	
	var mapOptions = {
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: defaultLocation,
			mapTypeControl:false
	};

	mapDialog = new google.maps.Map(document.getElementById("map_canvasOnDialog"), mapOptions);
	
	markerOnDialog = new google.maps.Marker({
		map:mapDialog,
		draggable: false,
		animation: google.maps.Animation.DROP
	});
	
	google.maps.event.trigger(mapDialog, 'resize');
	
	google.maps.event.addListener(mapDialog, 'click', function(event){
		mapClickOnDialogMap(event);
	});
};

function initialize(mapDivId){
	defaultLocation = new google.maps.LatLng(37.56648, 126.97796);
	geocoder = new google.maps.Geocoder();
	
	var mapOptions = {
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: defaultLocation
	};
	
	map = new google.maps.Map(document.getElementById(mapDivId), mapOptions);
	
	marker = new google.maps.Marker({
		map:map,
		draggable: false,
		animation: google.maps.Animation.DROP,
	});
	
	initmainMapSetting(mapDivId);
}	

function attachCategoryListonMap(mapDivId){
	$.ajax({
		url: '../main/categoryList.do',
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				createCategory(mapDivId);
				$.each(data.result,createIconsDiv);
				animate();
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		},async:false
	});
}

function allMarkerView(communityNo){
	sessionStorage.setItem('categoryPk', 0);
	
	if (currPage <= 1) {
		currPage = 1;
		$('#hideBtn').css('display', 'none');

	} else{
		$('#hideBtn').css('display', '');
	}
	$.ajax({
		url: '../main/allMarker.do',
		data:{
			interestCommunityNo:communityNo,
			data: {page:currPage}
		},
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				allMarkersClear();
				
				$.each(data.result,putMarkerOnMap);
				
				if(markerClusterer != undefined){
					markerClusterer.clearMarkers();
				}
				markerClusterer = new MarkerClusterer(map, arrMarker, {
					gridSize: 70, 
					maxZoom: 15,
					styles: null
				});
				for(var i=0; i< data.result.length; i++){
				}
				if(i < 5 && i != 0){
					$('#moreBtn').css('display','none');
				}else if(i==0){
					currPage--;
					$('#moreBtn').css('display','none');
				}

				$('#' + localStorage.getItem('divId') + ' div').remove();
				$.each( data.resultList, addMappingInfoList );
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}

function refreshAllMarkerView(communityNo){
	$.ajax({
		url: '../main/allMarker.do',
		data:{
			interestCommunityNo:communityNo,
		},
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				allMarkersClear();
				$.each(data.result,putMarkerOnMap);
				
				markerClusterer.clearMarkers();
				markerClusterer = new MarkerClusterer(map, arrMarker, {
					gridSize: 70, 
					maxZoom: 15,
					styles: null
				});
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}

function putMarkerOnMap(index, value) {
		var marker = new google.maps.Marker({
			map:map,
			draggable: false,
			title: value.miTitle + '\r\n' + value.address,
			animation: google.maps.Animation.DROP,
			icon : '../images/icons/'+selectMarker(value.investiItemType)+'.png',
			position: new google.maps.LatLng(value.lat, value.lng)
		});
		
		arrMarker.push(marker);
		
		google.maps.event.addListener(marker, "click", function() {
			$.ajax({
				url: '../main/mainInfoListDetail.do',
				dataType: 'json',
				data: {miNo:value.miNo},
				success: function(data, textStatus, jqXHR) {
					if(data.status == 200) {
						data.result.investiItemType=data.resultList[0][0].investiItemType;
						data.result.pathName=data.resultList[1][0].pathName;
						data.result.fileMask=data.resultList[1][0].fileMask;
						$('#' + localStorage.getItem('divId') + ' div').remove();
						addMappingInfoList(0, data.result);
					} else {
						alert("서버에서 데이터를 가져오는데 실패했습니다.");
						debug(data.message);
					}
				}
			});
		});
}	

function addMarkerOnTab(markerData) { 
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(markerData.lat, markerData.lng),
		map: map,
		icon : '../images/icons/'+selectMarker(markerData.investiItemType)+'.png',
		title: markerData.address,
		draggable: false, // Bounce
		animation: google.maps.Animation.DROP // Bounce
	});
	arrMarker.push(marker);
	
	var infoBubble = new InfoBubble({
		content: markerData.info,
		borderRadius: 10,
		arrowStyle:1,
		borderWidth:2
	});
	
	google.maps.event.addListener(marker, "click", function() {
		if (marker.getAnimation() != null) { // Bounce
			marker.setAnimation(null);
			infoBubble.close();
		} else { 
			marker.setAnimation(google.maps.Animation.BOUNCE);
			infoBubble.open(map,marker);
		}
		arrInfoBubble.push(infoBubble);
	});
	
	google.maps.event.addListener(map, 'click', function(event){
		clearInfoBubble();
	});
}

function addMarkerOnDialog(value) {
	var location = new google.maps.LatLng(value.lat, value.lng);
	
	mapDialog.setCenter(location);
	markerOnDialog.setPosition(location);
};

function mapClickOnDialogMap(event) {
	markerOnDialog.setPosition(event.latLng);
	
    dbLat = parseFloat(event.latLng.Xa);
    dbLng = parseFloat(event.latLng.Ya);
    
	geocoder.geocode({'latLng':event.latLng}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			if(results[0]){
				geoAddress = results[0].formatted_address;
				$('#address').val(geoAddress);
			}
		}
	});
}


function mapClick(event) {
	
	marker.setMap(map);
	marker.setPosition(event.latLng);
	arrMarker.push(marker);
	
	dbLat = parseFloat(event.latLng.Xa);
	dbLng = parseFloat(event.latLng.Ya);

	geocoder.geocode({'latLng':event.latLng}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			if(results[0]){
				geoAddress = results[0].formatted_address;
				$('#address').val(geoAddress);
			}
		}
	});
}


//-----------------------------address/geocode Conversion-------------------------------
function codeAddress() {
	geocoder.geocode({'address' : $('#searchAddress').val()}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			marker.setPosition(results[0].geometry.location);
		} else {
			alert("Geocode was not successful for the following reason: "+ status);
		}
	});
}

//------------------ marker & InfoBubble Clear ----------------------------------
function allMarkersClear() {
    for (var i = 0; i < arrMarker.length; i++) { 
    	arrMarker[i].setMap(null); 
    	arrMarker[i].setAnimation(null);
    } 
    arrMarker.length = 0;
};
function clearInfoBubble(){
    for (var i = 0; i < arrInfoBubble.length; i++) { 
    	arrInfoBubble[i].close();
    }
    arrInfoBubble.length = 0; 
};

//------------------- Category window Create --------------------------------------
function createCategory(mapDivId) {
	return $('#'+mapDivId).append($('<div></div>')
									.attr('id','effect')
									.addClass('redefinedUiCss ui-corner-all')
									.append($('<img></img>').attr('id','category')
															.attr('src','../images/icons/apps_right.png')
															.addClass('ui-widget-header ui-corner-all'))
									.append($('<div></div>').attr('id','icons')
															.addClass('hide')
															.append($('<img></img>').attr('id','allMarkerBtn')
																					.attr('src','../images/icons/allBtn.png'))));
}

function createIconsDiv(index,value) {
	return $('#icons').append($('<img></img>').addClass('categoryBtn')
												.attr('category-pk',value.investiItemType)
												.attr('src','../images/icons/'+selectMarker(value.investiItemType)+'.png'));
}

function animate() {
	$( "#category" ).toggle(
			function() {
				$( "#effect" ).animate({
					backgroundColor: "#CDCDCD",
					color: "#fff",
					width: 30,
					height : 225,
				}, 500, function(){
					$('#icons').removeClass('hide');
				} );
			},
			function() {
				$( "#effect" ).animate({
					backgroundColor: "#CDCDCD",
					color: "#fff",
					width: 20,
					height : 50,
				}, 500, function(){
					$('#icons').addClass('hide');
				} );
			}
	);
}

function selectMarker(value){
	var iconNum = 0;
		for(var i=0;i<investiItemTypeList.length;i++){
			if(investiItemTypeList[i][1] == value){
				iconNum = i;
				break;
			}
		}
		return iconNum;
}