<%@ page contentType="text/html; charset=UTF-8"%>	
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
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
						<div id="root_tree_list" class="main"></div>
						<div class="searchBox">
							<input id="searchBox" />
						</div>
					</td>
					<td class="_right">
						<div class="right_top_bg"></div>
						<div id="content" class="right_bg"></div>
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
	// quantity of news listed on one page
	var NEWS_PER_PAGE = 15;
	// quantity of search results listed on one page
	var SEARCH_NEWS_PER_PAGE = 15;
	var root = "root_tree_list";
	// titleId, language
	var titleId = "<%=request.getParameter("titleId")%>";
	var language = "<%=request.getParameter("language")%>";
	var lanType = language;
</script>
<script type="text/javascript" src="display/js/jquery.js" ></script>			
<script type="text/javascript" src="display/js/default.js" ></script>
<script type="text/javascript" src="display/js/jquery-ui-1.10.3.custom.js" ></script>
<script>
	$(function() {
		$("#searchBox").on("keydown", doSearch);

		$.ajax({
			type : "POST",
			url : "showNode.action",
			data : {
				node : titleId,
				language : language
			}
		}).done(function(data, success, orgResponse) {
			if (!success) return;
			addNodes(data.nodes, root);
			accordionNodes();
		});
	});

	function doSearch(event) {
		if (event.which == 13) {
			var keyword = $("#searchBox").val().trim();
			if (keyword != "") {
				$.ajax({
					type : "POST",
					url : "searchNews.action",
					data : {
						titleId : titleId,
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
			html += '<div><a href="newsdetail.jsp?titleId=' + titleId +
				'&language=' + language + '&newsCode=' + newsInfo.newsCode
				+ '" target="_blank">' + newsInfo.newsTitle + "</a></div>";
		}
		$("#content").html(html);
		// addPageNavigating(totalSize, start, nodeId);
	}

	function addNodes(nodes, parent) {
		if (!parent) parent = root;

		var parentNode = $("#"+parent);
		if (!parentNode) return;

		var len = nodes.length;
		if (len == 0) return;

		for (var i=0; i<len; i++) {
			var node = nodes[i];

			var header = document.createElement("div");
			header.id = node.id;
			header.leaf = node.leaf;
			header.innerHTML = node.text;
			header.className = "header";

			var treeList = document.createElement("div");
			treeList.id = node.id + "_tree_list";
			treeList.className = "list";

			parentNode.append(header);
			parentNode.append(treeList);

			$(header).on("click", node, nodeClicked);
			var children = node.nodes;
			if (children.length > 0) {
				addNodes(children, treeList.id);
			}
		}

		/*
		 * parentNode.accordion({collapsible: true});
		 * if (parent != root) {
		 * 	parentNode.accordion({active: false});
		 * }
		 * parentNode.accordion();
		 */
	}

	function accordionNodes() {
		$('.header').click(function() {
			var nextDiv = $(this).next();
			if(nextDiv.attr('class') == 'list'){
				nextDiv.slideToggle();
				$('.header').css({"background-color":"#8ECA37"});
			}
			$('.header').css({"background-color":"#8ECA37"});
			$(this).css({"background-color":"#1A86E1"});
			nextDiv.find('.header').css({"background-color":"#B8CE52"});
		});
		$('.list').toggle();
	}

	function nodeClicked(event) {
		var nodeId = event.data.id;
		// alert(nodeId);
		$.ajax({
			type : "POST",
			url : "showNewsListOrDetail.action",
			data : {
				nodeid : nodeId,
				language : language,
				start : 0,
				limit : NEWS_PER_PAGE
			}
		}).done(function(data, success, orgResponse) {
			if (!success) return;
			setNewsContent(data, 0, nodeId);
		});
	}

	function setNewsContent(data, start, nodeId) {
		var newsNum = data.results;
		var newsList = data.newsList;

		// 
		if (newsNum == 1 && newsInfo != null) {
			$("#content").html(newsInfo.newsContent);
		} else {
			var totalSize = data.totalSize;
			var newsInfo = data.newsInfo;
			var news;
			var html = "";
			for (var i=0; i<newsNum; i++) {
				news = newsList[i];
				html += '<div><a href="newsdetail.jsp?titleId=' + titleId +
					'&language=' + language + '&newsCode=' + news.newsCode
					+ '" target="_blank">' + news.newsTitle + "</a></div>";
			}
			$("#content").html(html);
			addPageNavigating(totalSize, start, nodeId);
		}
	}

	function addPageNavigating(totalSize, start, nodeId) {
		var totalPageNum = Math.ceil(totalSize / NEWS_PER_PAGE);
		if (totalPageNum < 2) {
			return;
		}

		var isEN = (language == "en_name");
		
		var pBar = document.createElement("div");
		pBar.className = "pager_bar";

		// first page and pre page
		if (start > 0) {
			var firstPg = document.createElement("a");
			firstPg.className = "first_page";
			firstPg.href = "#";
			firstPg.innerHTML = (isEN ? "First" : "首页");
			$(firstPg).on("click", {start:0, nodeId: nodeId}, pagerBarClicked);
			$(pBar).append(firstPg);

			var prePg = document.createElement("a");
			prePg.className = "pre_page";
			prePg.href = "#";
			prePg.innerHTML = (isEN ? "&lt;Prev" : "&lt;上一页");
			$(prePg).on("click", {start:start-NEWS_PER_PAGE, nodeId: nodeId}, pagerBarClicked);
			$(pBar).append(prePg);
		}

		var curPgNum = Math.ceil(start / NEWS_PER_PAGE) + 1;

		var pg, i;
		// pages before current page
		for (i=Math.max(1,curPgNum-5); i<curPgNum; ++i) {
			pg = document.createElement("a");
			pg.href = "#";
			pg.innerHTML = i;
			$(pg).on("click", {start: (i-1) * NEWS_PER_PAGE, nodeId: nodeId}, pagerBarClicked);
			$(pBar).append(pg);
		}

		// current page
		var curPg = document.createElement("span");
		curPg.className = "cur_page";
		curPg.innerHTML = curPgNum;
		$(pBar).append(curPg);

		// pages after current page
		for (i=curPgNum+1; i<=totalPageNum && i-curPgNum<=5; ++i) {
			pg = document.createElement("a");
			pg.href = "#";
			pg.innerHTML = i;
			$(pg).on("click", {start:(i-1) * NEWS_PER_PAGE, nodeId: nodeId}, pagerBarClicked);
			$(pBar).append(pg);
		}

		// next page and last page
		if (start + NEWS_PER_PAGE < totalSize) {
			var nextPg = document.createElement("a");
			nextPg.className = "next_page";
			nextPg.href = "#";
			nextPg.innerHTML = (isEN ? "Next&gt;" : "下一页&gt;");
			$(nextPg).on("click", {start:start+NEWS_PER_PAGE, nodeId: nodeId}, pagerBarClicked);
			$(pBar).append(nextPg);

			var lastPg = document.createElement("a");
			lastPg.className = "last_page";
			lastPg.href = "#";
			lastPg.innerHTML = (isEN ? "Last" : "尾页");
			$(lastPg).on("click", {start:totalSize - totalSize % NEWS_PER_PAGE, nodeId: nodeId}, pagerBarClicked);
			$(pBar).append(lastPg);
		}

		$("#content").append(pBar);
	}

	function pagerBarClicked(event) {
		var start = event.data.start;
		var nodeId = event.data.nodeId;
		$.ajax({
			type : "POST",
			url : "showNewsListOrDetail.action",
			data : {
				nodeid : nodeId,
				language : language,
				start : start,
				limit : NEWS_PER_PAGE
			}
		}).done(function(data, success, orgResponse) {
			if (!success) return;
			setNewsContent(data, start, nodeId);
		});

		return false;
	}
</script>
</body>
</html>
