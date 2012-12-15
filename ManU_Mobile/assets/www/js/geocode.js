var defaultLocation;
var geocoder;
var marker;
var map;
var infoBubble;
var dbLat;
var dbLng;
var geoAddress;
var arrMarker = new Array();
var arrInfoBubble = new Array();

$(document).ready(function(){
	
	initialize();
	getCurrentPOS();
	allMarkerView();
	initSize();


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
		allMarkerView();
	});

//	------------------ Category click / marker Display ---------------------------
	$('#effect img.categoryBtn').live('click', function(event) {
		$.getJSON(surl+'/main/searchCategory.do', {
			investiItemType: $(this).attr('category-pk'),
			interestCommunityNo:0,
		}, 
		function(data, textStatus, jqXHR){
			if (data.status == 200) {
				clearMarkers();
				$.each(data.result, addMarker);
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
		});
	});

	//----------------- accordion set ------------------------//
	var lastEvent = null;
	var slide  = "#detailContent";
	var alink  = "#detailTitleBar";

	function accordion(){
		if (this == lastEvent) return false;
		lastEvent = this;
		setTimeout(function() {lastEvent = null;}, 200);

		if ($(this).attr('class') != 'active') {
			$(slide).slideUp();
			$(this).next(slide).slideDown();
			$(alink).removeClass('active');
			$(this).addClass('active');
		} else if ($(this).next(slide).is(':hidden')) {
			$(slide).slideUp();
			$(this).next(slide).slideDown();
		} else {
			$(this).next(slide).slideUp();
		}
	}
	$(alink).live('click',accordion).focus(accordion);
});

function initialize(){
	defaultLocation = new google.maps.LatLng(37.56648, 126.97796);
	geocoder = new google.maps.Geocoder();

	var mapOptions = {
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: defaultLocation,
	};

	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

	marker = new google.maps.Marker({
		map:map,
		draggable: false,
		animation: google.maps.Animation.DROP,
	});

//	----------------- CategoryList Loading -----------------------------------
	$.ajax({
		url: surl+'/main/categoryList.do',
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				createCategory();
				$.each(data.result,createIconsDiv);
				animate();
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}

var header 		= $("div[data-role='header']");
var footer 		= $("div[data-role='footer']");
var content		= $("div[data-role='content']");

function initSize(){
	var viewport_height = $(window).height();
	var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
	content_height -= (content.outerHeight() - content.height());
	$("#map_canvas").css('height', ( content_height - (content_height*0.2) ) );
}


function getCurrentPOS(){
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
function onSuccess(position){
	var currentLanlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
	map.setCenter(currentLanlng);
}
function onError(positionError){
	var errMsg = "[PoisitionError]"
		+"\n# code: " +positionError.code
		+"\n message: " + positionError.message;
	alert(errMsg);
}


function allMarkerView(){
	$.ajax({
		url: surl+'/main/allMarker.do',
		dataType: 'json',
		data:{interestCommunityNo:0},
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				clearMarkers();
				$.each(data.result,addMarker);
				
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
function addMarker(index, value) {

	var image = './images/icons/'+selectMarker(value)+'.png';

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(value.lat, value.lng),
		map: map,
		icon : image,
		draggable: false, // Bounce
		animation: google.maps.Animation.DROP // Bounce
	});
	arrMarker.push(marker);

	google.maps.event.addListener(marker, "click", function() { 
		$.ajax({
			url: surl+'/main/mainInfoListDetail.do',
			dataType: 'json',
			data: {miNo:value.miNo},
			success: function(data, textStatus, jqXHR) {
				if(data.status == 200) {
					$('#detailTitleView').remove();
					$('.map_content').append($('<div></div>').attr('id','detailTitleView'));
					$('#detailTitleView').append( createDetail() );
					appendTitleBar(data.result,data.resultList);
					appendContent(data.result,data.resultList);
				} else {
					alert("서버에서 데이터를 가져오는데 실패했습니다.");
					debug(data.message);
				}
			}
		});
	});
};

function createDetail() {
	return $('<ul></ul>').attr('id','nav')
						.append($('<li></li>').attr('id','detailTitleBar'))
						.append($('<ul></ul>').attr('id','detailContent'));
}


function appendTitleBar(value,valueList) {
	$('#detailTitleBar').append(createDetailInvestiTypeIcon(valueList[0][1]))
						.append(createDetailFirstRow(value))
						.append(createDetailSecondRow(value))
						.append('<hr color="gray" width="97%" size="2" noshade>');
}
function createDetailInvestiTypeIcon(value){
	return $('<div></div>').attr('id','detailCommunityIcon').append($('<img></img>').attr('src','./images/icons/'+selectMarker(value)+'.png'));
}
function createDetailFirstRow(value){
	return $('<div></div>').attr('id','detailFirstRow').append( $('<div></div>').attr('id','detailTitle').html(value.miTitle) )
														.append( $('<div></div>').attr('id','detailMiDate').html(new Date(value.miDate).format("yyyy.MM.dd") ));
}
function createDetailSecondRow(value){
	return $('<div></div>').attr('id','detailSecondRow').append( $('<div></div>').attr('id','detailCreatorName').html('- '+value.fbName+' -') );
}


function appendContent(value,valueList) {
	$('#detailContent').append(createDetailPhotoDiv(valueList[1]))
						.append(createDetailAddress(value))
						.append(createDetailContext(value))
						.append(createDetailInvestiItems(valueList[0]));
}
function createDetailPhotoDiv(photos){
	if(photos[0]==undefined){
		return $('<img></img>').attr('id','detailPhoto')
		.attr('src',surl+'/images/ManU.png'); 
	}else{
		return $('<img></img>').attr('id','detailPhoto')
		.attr('src','http://14.63.224.161:8080'+photos[0].pathName+photos[0].fileMask);
	}
}
function createDetailAddress(value){
	return $('<li></li>').html('<span class="contentSubTitle">주소</span><br><p class="contentSubContent">'+value.address+'</p><br>');
}
function createDetailContext(value) {
	return $('<li></li>').html('<span class="contentSubTitle">내용</span><br><p class="contentSubContent">'+value.miContext+'</p><br>');
}
function createDetailInvestiItems(investiItems) {
	$('#detailContent').append($('<li></li>').addClass('investiItems').html("<span class='contentSubTitle'>조사항목</span><br>"));
	for(var i in investiItems){
		$('.investiItems').append("<span class='contentSubContent'>"+investiItems[i].investiItemName+"&nbsp;:&nbsp;&nbsp;&nbsp;<span style='font-size:14px; color:Red; weight:bold;'>"+investiItems[i].ansTypeItemName+"</span></span><br>");
	}
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
function clearMarkers() {
	for (var i = 0; i < arrMarker.length; i++) { 
		arrMarker[i].setMap(null); 
		arrMarker[i].setAnimation(null);
	} 
	arrMarker.length = 0;
}
function clearInfoBubble(){
	for (var i = 0; i < arrInfoBubble.length; i++) { 
		arrInfoBubble[i].close();
	}
	arrInfoBubble.length = 0; 
}

//------------------- Category window Create --------------------------------------
function createCategory() {
	return $('#map_canvas').append($('<div></div>').attr('id','effect')
													.addClass('ui-widget-content ui-corner-all')
													.append($('<img></img>').attr('id','togglerBtn')
																			.attr('src','./images/icons/apps_right.png'))
//																			.addClass('ui-widget-header ui-corner-all'))
							.append($('<div></div>').attr('id','categoryIcons')
													.addClass('hide')
													.append($('<img></img>').attr('id','allMarkerBtn')
																			.attr('src','./images/icons/allBtn.png'))));
}
function createIconsDiv(index,value) {
	return $('#categoryIcons').append($('<img></img>').addClass('categoryBtn')
														.attr('category-pk',value.investiItemType)
														.attr('src','./images/icons/'+selectMarker(value)+'.png'));
}
function animate() {
	$( "#togglerBtn" ).toggle(
			function() {
				$( "#effect" ).animate({
					backgroundColor: "#CDCDCD",
					color: "#fff",
					width: 30,
					height : 210,
				}, 500, function(){
					$('#categoryIcons').removeClass('hide');
				} );
			},
			function() {
				$( "#effect" ).animate({
					backgroundColor: "#CDCDCD",
					color: "#fff",
					width: 30,
					height : 30,
				}, 500, function(){
					$('#categoryIcons').addClass('hide');
				} );
			}
	);
}

function selectMarker(value){
	var iconNum = 0;
	for(var i=0;i<investiItemTypeList.length;i++){
		if(investiItemTypeList[i][1] == value.investiItemType){
			iconNum = i;
			break;
		}
	}
	return iconNum;
}
