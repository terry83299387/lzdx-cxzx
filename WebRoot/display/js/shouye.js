var limit = 15;

var callNewsList = function(id, data) {
	$.ajax({
				type : "POST",
				url : "showDisplayNewsList.action",
				data : data
			}).done(function(msg) {
				var table = "";
				var newslist = msg.newsList;
				var html = toNewsHtml(id, newslist);
				$("#" + id).html(html);

			});
}

var toNewsHtml = function(id, newslist) {
	var language = $("#language").html();
	var html = "";
	for (var i = 0; i < newslist.length; i++) {
		var newsTitle = newslist[i].newsTitle;
		var newsCode = newslist[i].newsCode;
		var createDate = newslist[i].createDate;
		html += "<li><a target='_blank' href='getNewsDetail.action?language="
				+ language + "&titleId=" + id + "&newsCode=" + newsCode + "'>"
				+ newsTitle +"</a></li>";
	}
	return html;
}

$(document).ready(function() {
			var language = $("#language").html();
			var configList = jQuery.parseJSON($("#configList").html());
			for (var i = 0; i < configList.length; i++) {
				var data = {
					nodeid : configList[i].id,
					range : 'all',
					language : language,
					start : 0,
					limit : limit
				};
				callNewsList(configList[i].id, data);
			}

		});