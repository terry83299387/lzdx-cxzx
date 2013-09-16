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
			href="display/css/shouye.css" />
				<link rel="stylesheet" type="text/css" href="wowgalary/shouye_galary_style.css" />
	<script type="text/javascript" src="display/js/jquery.js"></script>
</head>

<body>
<center>

<div class="title_layout">
<div class="title_content_layout">
<div class="shouye_area">
<s:iterator value='titleMap' status="st">
<div class="shouye_button_<s:property value='#st.index'/>">
<table><tr>
<td class="shouye_button_left"></td>
<td class="shouye_button_center"><nobr><s:property value='value.text'/></nobr></td>
<td class="shouye_button_right"></td>
</tr></table>
</div>
<div class="shouye_<s:property value='#st.index'/>">
<div id="<s:property value='value.id'/>" class="shouye_<s:property value='#st.index'/>_up">
</div>
<div class="shouye_<s:property value='#st.index'/>_more"><a href="<s:property value='value.link'/>?language=<s:property value='language'/>&titleId=<s:property value='value.id'/>">More</a></div>
<div class="shouye_<s:property value='#st.index'/>_bottom"></div>
</div>
</s:iterator>


<div class="shouye_picture">
<div class="shouye_picture_1">
<!-- Start WOWSlider.com BODY section -->
	<div id="wowslider-container1">
	<div class="ws_images"><ul>
	<s:iterator value='newsList' status="st">
	<li><a href="getNewsDetail.action?language=<s:property value='language'/>&titleId=<s:property value='pictureNodeId'/>&newsCode=<s:property value='newsCode'/>" target="_blank"><img src="<s:property value='newsPicture'/>" alt="<s:property value='newsTitle'/>" title="<s:property value='newsTitle'/>" id="wows1_0"/></a></li>
	
	</s:iterator>

</ul></div>
<div class="ws_bullets"><div>
<s:iterator value='newsList' status="st">
<a href="#"><img src="<s:property value='newsPicture'/>" /><s:property value='(#st.index+1)'/></a>
</s:iterator>

</div></div>

	</div>
	<script type="text/javascript" src="wowgalary/wowslider.js"></script>
</div>
<div class="shouye_picture_2"></div>
<div class="shouye_picture_3"></div>
</div>


<div class="shouye_search"><div class="search_title"><s:property value='searchTitle'/></div><form action="globalSearch.jsp" method="get" enctype="multipart/form-data" target="_blank"><input type="hidden" name="language" value="<s:property value='language'/>"/><input class="text_input" name="keyword" type="text"></input><input class="shouye_search_icon" type="submit" value=""/></form></div>

<div id="configList" style="visibility:hidden"><s:property value='titleJson'/></div>
<div id="language" style="visibility:hidden"><s:property value='language'/></div>
</div>
<div class="shouye_bottom"></div>
</div>
<div class="title_menu_layout">
<s:action name="getMenuTitles" executeResult="true"/>
</div>
</div>
<script type="text/javascript" src="display/js/shouye.js"></script>
</center>

</body>
</html>
