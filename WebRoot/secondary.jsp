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
	<style type="text/css">
		#root_tree_list {
			width : 351px;
		}
		#content {
			width : 594px;
		}
		.bottom {
			background-image: url(display/images/page/news_bottom_bg.png);
			height: 174px;
			width: 1024px;
		}
	</style>

	<script type="text/javascript" src="display/js/jquery.js" ></script>			
	<script type="text/javascript" src="display/js/default.js" ></script>
	<script type="text/javascript" src="display/js/jquery-ui-1.10.3.custom.js" ></script>
	<script>
		var root = "root_tree_list";
		// titleId, language
		var titleId = "<%=request.getParameter("titleId")%>";
		var language = "<%=request.getParameter("language")%>";
		// var language = "";

		function addNodes(nodes, parent) {
			if (!parent) parent = root;

			var parentNode = $("#"+parent);
			if (!parentNode) return;

			var len = nodes.length;
			if (len == 0) return;
			for (var i=0; i<len; i++) {
				var node = nodes[i];

				var header = document.createElement("span");
				header.id = node.id;
				header.leaf = node.leaf;
				header.innerHTML = node.text;

				var treeList = document.createElement("div");
				treeList.id = node.id + "_tree_list";

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

		function nodeClicked(event) {
			var nodeId = event.data.id;
			// alert(nodeId);
			$.ajax({
				type : "POST",
				url : "showNewsListOrDetail.action",
				data : {
					nodeid : nodeId,
					type : language
				}
			}).done(function(data, success, orgResponse) {
				var newsNum = data.results;
				var newsInfo = data.newsInfo;
				var newsList = data.newsList;
				if (newsNum == 1 && newsInfo != null) {
					$("#content").html(newsInfo.newsContent);
				} else {
					var news;
					var html = "";
					for (var i=0; i<newsNum; i++) {
						news = newsList[i];
						html += '<p><a href="newsdetail.jsp?titleId=' + titleId +
							'&language=' + language + '&newsCode=' + news.newsCode
							+ '" target="_blank">' + news.newsTitle + "</a></p>";
					}
					$("#content").html(html);
				}
			});
		}

		$(function() {
			//var nodeId = "tuanduijianshe";
			$.ajax({
				type : "POST",
				url : "showNode.action",
				data : {
					node : titleId
				}
			}).done(function(data, success, orgResponse) {
				addNodes(data.nodes, root);
			});
		});
	</script>
</head>

<body>
<center>

<div class="title_layout">
	<div class="title_content_layout">
		<div class="news_content_topmargin"></div>
		<div id="root_tree_list">
		</div>
		<div id="content"></div>
		<div class="bottom"></div>
	</div>
	<div class="title_menu_layout">
		<s:action name="getMenuTitles" executeResult="true"/>
	</div>
</div>

</center>
</body>
</html>
