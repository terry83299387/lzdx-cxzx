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
			href="display/css/subtitle.css" />
	<script type="text/javascript" src="display/js/jquery.js"></script>
</head>

<body>
<center>

<div class="title_layout">
<div class="title_content_layout">
<div class="second_area">
<table><tr><td class="_left">


<div class="main">
<!-- header start  -->
<div class="header">标题1</div>
<div class="list">
	<div class="header">标题1.1</div>
	<div class="list">
		<div class="header">标题1.1.1</div>
		<div class="list">
			<div class="header">标题1.1.1.1 test test test test test test test test test test</div>
			<div class="header">标题1.1.1.2</div>
		</div>
		<div class="header">标题1.1.2</div>
		<div class="list">
			<div class="header">标题1.1.2.1</div>
			<div class="header">标题1.1.2.2</div>
		</div>
	</div>
	<div class="header">标题1.2</div>
	<div class="list">
		<div class="header">标题1.2.1</div>
		<div class="list">
			<div class="header">标题1.2.1.1</div>
			<div class="header">标题1.2.1.2</div>
		</div>
		<div class="header">标题1.2.2</div>
		<div class="list">
			<div class="header">标题1.2.2.1</div>
			<div class="header">标题1.2.2.2</div>
		</div>
	</div>
</div>

<div class="header"><div class="search"><div class="search_title">Search</div><input class="search_input_text" type="text" /><div class="search_icon"></div></div></div>
<!-- header end  -->
</div>
<div class="left_bottome_bg"></div>



</td>
<td class="_right">
<div class="right_top_bg"></div>
<div class="right_bg">
<div class="record">
<div class="news_title"><li>newstitle 2013-11-13</li></div>
</div>
<div class="record">
<div class="news_title"><li>newstitletest 2013-11-13</li></div>
</div>
<div class="record">
<div class="news_title"><li>newstitletestnewstitletest 2013-11-13</li></div>
<div class="news_abstract">news <span class="keyword">test</span>news</div>
</div>

</div>
<div class="right_bottome_bg"></div>
</td>
</tr></table>







</div>
<div class="subtitle_bottom"></div>
</div>
<div class="title_menu_layout">
<s:action name="getMenuTitles" executeResult="true"/>
</div>
</div>
<script type="text/javascript">
$('.header').click(function(){
var nextDiv=$(this).next();
if(nextDiv.attr('class')=='list'){
nextDiv.slideToggle();
$('.header').css({"background-color":"#8ECA37"});

}
$('.header').css({"background-color":"#8ECA37"});
$(this).css({"background-color":"#1A86E1"});
nextDiv.find('.header').css({"background-color":"#B8CE52"});
});
$('.list').toggle();
$('.main').children('.list').slideDown();
</script>
</center>



</body>
</html>
