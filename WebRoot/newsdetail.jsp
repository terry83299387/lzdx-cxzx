<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="stylesheet" type="text/css"
			href="display/css/menutitle.css" />
<link rel="stylesheet" type="text/css"
			href="display/css/news.css" />
</head>

<body>
<center>
<div class="title_layout">
<div class="title_content_layout">
<div class="news_content_topmargin"></div>
<div class="news_top_bg"><div></div></div>
<div class="news_content_bg">
<div class="news_content_title"><s:property value='newsInfo.newsTitle' /></div>
<div class="news_content_title_otherinfo">
<s:property value='newsName.sourceName'/>:<s:property value='newsInfo.newsSource'/>
&nbsp;&nbsp;<s:property value='newsName.authorName'/>:<s:property value='newsInfo.author'/>
&nbsp;&nbsp;<s:property value='newsName.dateName'/>:<s:property value='newsInfo.createDate'/>
</div>
<div class="news_content_place_holder"></div>
<div class="news_content_main">
<s:property value='newsInfo.newsContent' escape='false'/>
</div>
</div>
<div class="news_content_bottom"></div>
</div>
<div class="title_menu_layout">
<s:action name="getMenuTitles" executeResult="true"/>
</div>
</div>
</center>
</body>
</html>
