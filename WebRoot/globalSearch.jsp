<%@ page contentType="text/html; charset=UTF-8"%>	
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	String lan = request.getParameter("language");
	String searchTxt = "Site Search";
	if ("cn_name".equals(lan)) {
		searchTxt = "站内搜索";
	}
%>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>secondary</title>
	
	<link rel="stylesheet" type="text/css"
				href="display/css/default.css" />
	<link rel="stylesheet" type="text/css"
				href="display/css/jquery-ui-1.10.3.custom.css" />
	<link rel="stylesheet" type="text/css"
				href="display/css/menutitle.css" />
	<link rel="stylesheet" type="text/css"
				href="display/css/subtitle.css" />
	<link rel="stylesheet" type="text/css"
				href="display/css/pager.css" />
</head>

<body>
<center>
<div class="title_layout">
	<div class="title_content_layout">
		<div class="second_area">
			<table>
				<tr>
					<td class="_left">
						<div id="root_tree_list" class="main">
							<div id="search_item" class="header">
								<div class="search">
									<div class="search_title"><%=searchTxt%></div>
									<input id="searchBox" class="search_input_text" type="text" />
									<div id="searchButton" class="search_icon"></div>
								</div>
							</div>
						</div>
						<div class="left_bottome_bg"></div>
					</td>
					<td class="_right">
						<div class="right_top_bg"></div>
						<div id="content" class="right_bg"></div>
						<div class="right_bottome_bg"></div>
					</td>
				</tr>
			</table>
		</div>
		<div class="subtitle_bottom"></div>
	</div>
	<div class="title_menu_layout">
		<s:action name="getMenuTitles" executeResult="true"/>
	</div>
</div>
</center>

<script type="text/javascript">
	// quantity of search results listed on one page
	var SEARCH_NEWS_PER_PAGE = 15;
	// titleId, language
	var titleId = "<%=request.getParameter("titleId")%>";
	var language = "<%=request.getParameter("language")%>";
	var lanType = language;
	var keyword = "<%=request.getParameter("keyword")%>";
</script>
<script type="text/javascript" src="display/js/jquery.js" ></script>			
<script type="text/javascript" src="display/js/default.js" ></script>
<script type="text/javascript" src="display/js/jquery-ui-1.10.3.custom.js" ></script>
<script>
	$(function() {
		$("#searchBox").val(keyword);
		$("#searchBox").on("keydown", searchBoxKeyDown);
		$("#searchButton").on("click", doSearch);
		doSearch();
	});

	function searchBoxKeyDown(event) {
		if (event.which == 13) {
			doSearch();
		}
	}

	function doSearch(event) {
		var keyword = $("#searchBox").val().trim();
		if (keyword != "") {
			$.ajax({
				type : "POST",
				url : "searchNews.action",
				data : {
//					titleId : titleId,
					language : language,
					keyword : keyword,
					start : 0,
					limit : SEARCH_NEWS_PER_PAGE
				}
			}).done(function(data, success, orgResponse) {
				if (!success) return;
				setSearchResult(data, 0, keyword);
			});
		}
	}

	function setSearchResult(data, start, keyword) {
		var resultNum = data.results;
		var newsList = data.newsList;

		// 
		var totalSize = data.totalSize;
		var newsInfo;
		var html = "";
		for (var i=0; i<resultNum; i++) {
			newsInfo = newsList[i];
			html += '<div class="record"><div class="news_title"><li><a href="getNewsDetail.action?titleId='
				+ titleId + '&language=' + language + '&newsCode=' + newsInfo.newsCode
				+ '" target="_blank">' + newsInfo.newsTitle + '</a> ' + newsInfo.createDate + '</li></div>';

			html += '<div class="news_abstract">' + newsInfo.briefContent + '</div>';

			html += '</div>';
		}
		$("#content").html(html);
		// addPageNavigating(totalSize, start, nodeId);
	}
</script>
</body>
</html>
