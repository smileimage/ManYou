$(document).ready(function(){
	$("#tabs").tabs();
	getChartData();
	makeGraphRadio();
	radioEvent();
	$('#tabs-4').addClass('hide');
	$('#tabs-6').addClass('hide');
	articleAllNumber();
});
//커뮤니티 글 갯수 그래프 그리기

function articleAllNumber(){
	$.ajax({
		url:'countAll.do',
		dataType : 'json',
		data : {fbUid:getCookie('cookieFbUid')},
		success:function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				makeCommuintyGraph(data.result);
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
} 
function makeCommuintyGraph(result){
	var data =google.visualization.
	arrayToDataTable([
	                  ['Year', '나의 글', '전체 글'],
	                  [result[0].interestCommunityName,  result[0].count,      result[0].count]
	                  ]);

	var options = {
			width:525, height:220
	};

	var chart4 = new google.visualization.LineChart(document.getElementById('tabs-7'));
	chart4.draw(data, options);
}
function makeGraphRadio(){
	return $('#tabs1').append('<input type="radio" id="radio1" name="point">지난 6개월')
	.append('<input type="radio" id="radio2" name="point" checked>이번 달')
	.append('<input type="radio" id="radio3" name="point">총계')
	.append('<div id="tabs-4"></div>')
	.append('<div id="tabs-5"></div>')
	.append('<div id="tabs-6"></div>');
}
function radioEvent(){
	$('#radio1').bind('click',function(){
		$('#tabs-5').addClass('hide');
		$('#tabs-6').addClass('hide');
		$('#tabs-4').removeClass('hide');
	});
	$('#radio2').bind('click',function(){
		$('#tabs-4').addClass('hide');
		$('#tabs-6').addClass('hide');
		$('#tabs-5').removeClass('hide');
	});
	$('#radio3').bind('click',function(){
		$('#tabs-4').addClass('hide');
		$('#tabs-5').addClass('hide');
		$('#tabs-6').removeClass('hide');
	});
}

function getChartData(){
	google.load("visualization", "1",{packages:["corechart"]});
	$.ajax({
		url:'totalpoint.do',
		dataType:'json',
		data:{
			fbUid:getCookie('cookieFbUid')
		},
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				sixMonthPoint(data.result);
				thisMonthPoint(data.result);
				totalPoint(data.result);
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}
var now=new Date();
var nowYear=now.getFullYear();

function sixMonthPoint(result) {
	var sum=0;
	var j=0,i=0;
	var sixMonthAgo=now.getMonth()-5;
	var arr=new Array();
	var arr2=new Array();
	for(i=0;i<6;i++){
		if(i==0){
			arr[i]=sixMonthAgo;
		}
		else{
			arr[i]=++sixMonthAgo;	
		}
	}
	sixMonthAgo=now.getMonth()-5;

	for(var i=0 in result){
		if(result[i].pointDate.substring(0,4)==nowYear && result[i].pointDate.substring(5,7)==sixMonthAgo){
			sum+=result[i].point;
			j=i;
			var temp=i;
			break;
		}
		else{
//			arr2.push({
//				point:0, pointDate:nowYear+'-0'+arr[i]
//			});
			j=i;
			break;
		}
	}

	for(i=0;i<6;i++){
		if(result[j]===undefined){
			arr2.push({
				point:0, pointDate:nowYear+'-0'+arr[i]
			});
		}else if(result[j].pointDate.substring(0,4)==nowYear){
			if(result[j].pointDate.substring(5,7) < sixMonthAgo){//최초 달보다 작은경우
				sum+=result[j].point;
				j++;
			}
			if(arr[i]==result[j].pointDate.substring(5,7)){
				arr2[i]=result[j];
				j++;
			}else{
				var emptyMonth=arr[i];
					arr2.push({
					point:0, pointDate:nowYear+'-0'+emptyMonth
				});
			}
		}else{
			sum+=result[j].point;
			j++;
		}
	}
	j=temp;
	j=Number(j);
	var data =google.visualization.
	arrayToDataTable([
	                  ['Year', '획득 공헌도', '누적 공헌도'],
	                  [arr2[0].pointDate.substring(5,7)+'월',  arr2[0].point,   	sum+=arr2[0].point],
	                  [arr2[1].pointDate.substring(5,7)+'월',  arr2[1].point,  	sum+=arr2[1].point],
	                  [arr2[2].pointDate.substring(5,7)+'월',  arr2[2].point,   	sum+=arr2[2].point],
	                  [arr2[3].pointDate.substring(5,7)+'월',  arr2[3].point,   	sum+=arr2[3].point],
	                  [arr2[4].pointDate.substring(5,7)+'월',  arr2[4].point,   	sum+=arr2[4].point],
	                  [arr2[5].pointDate.substring(5,7)+'월',  arr2[5].point,   	sum+=arr2[5].point],
	                  ]);

	var options = {
			title: '지난 6개월간의 기여도 입니다',
			// hAxis: {title: 'Year', titleTextStyle: {color: 'red'}}
			width:525, height:220
	};

	var chart = new google.visualization.LineChart(document.getElementById('tabs-4'));
	chart.draw(data, options);
}

//google.load("visualization", "1", {packages:["corechart"]});
function thisMonthPoint(result) {
	var nowMonth=now.getMonth()+1;
	var date=0;
	var points=0;
	var totalPoint=0;
	for(var i=0; i< result.length; i++){
			if(result[i].pointDate.substring(0,4)== nowYear && result[i].pointDate.substring(5,7) == nowMonth){
				date=result[i].pointDate.substring(5,7);
				points=result[i].point;
			}else{
				date=now.getMonth()+1;
			}
			totalPoint+=result[i].point;
	}
	var data = google.visualization.arrayToDataTable([
	                                                  ['Year', '획득 공헌도', '누적 공헌도'],
	                                                  ['이번 달('+date+'월) 기여도',  points,     totalPoint],
	                                                  ]);

	var options = {
			title: '이번 달의 기여도 입니다',
			hAxis: {title: '※획득 공헌도는 이번달에만 획득한 공헌도만 표시됩니다※', titleTextStyle: {color: 'red'}},
			width:525, height:220
	};

	var chart2 = new google.visualization.ColumnChart(document.getElementById('tabs-5'));
	chart2.draw(data, options);
}

google.load("visualization", "1", {packages:["corechart"]});
function totalPoint(result) {
	var sum=0;
	for(var i=0; i< result.length; i++){
		sum+=result[i].point;
	}
	var data = google.visualization.arrayToDataTable([
	                                                  ['Year', '현재 공헌도', '누적 공헌도'],
	                                                  ['총계',  sum,      sum],
	                                                  ]);

	var options = {
			title: '회원님의 기여도 현황입니다',
			width:525, height:220
			//hAxis: {title: '현재 공헌도는 누적 공헌도에서 뺀 값이다 새귀야', titleTextStyle: {color: 'red'}}
	};

	var chart3 = new google.visualization.ColumnChart(document.getElementById('tabs-6'));
	chart3.draw(data, options);
}