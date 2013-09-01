var lanType = "1";
var limit = 12;
var newsDynamics = {
	nodeid : "xinwendongtai",
	type : lanType,
	range:'all',
	start : 0,
	limit : limit

}
var noticePublic = {
	nodeid : "tongzhigonggao",
	type : lanType,
	range:'all',
	start : 0,
	limit : limit
}

var newsDynamicsId = "xinwendongtai";
var noticePublicId = "tongzhigonggao";
var newsTotable = function(titleId,newslist) {
	if(newslist.length<=0)
	{
	return "";
	}
	var tablehtml = "<table>";
	var row = "";
	for (var i = 0; i < newslist.length; i++) {
		
		var newsTitle = newslist[i].newsTitle;
		var newsCode=newslist[i].newsCode;
		var createDate = newslist[i].createDate;
		row += "<tr><td class='title_td'><a target='_black' href='getNewsDetail.action?titleId="+titleId+"&&newsCode="+newsCode+"'>" + newsTitle
				+ "</a></td><td class='date_td'>" + createDate + "</td></tr>";
	}

	tablehtml += row + "</table>";
	return tablehtml;
}

var callNewsList = function(id,data) {
	$.ajax({
				type : "POST",
				url : "showDisplayNewsList.action",
				data : data
			}).done(function(msg) {
				var table = "";
				var newslist = msg.newsList;
				var tablehtml = newsTotable(id,newslist);
				$("#"+id).html(tablehtml);

			});
}



$(document).ready(function() {
			callNewsList(newsDynamicsId,newsDynamics);
			callNewsList(noticePublicId,noticePublic);
		});