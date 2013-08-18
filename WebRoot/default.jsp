<%@ page contentType="text/html; charset=UTF-8"%>	
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>

<style>
html,body{height:100%;width:100%}

body{padding: 0; margin: 0;}

.default_banner{
position:relative;
background-image: url(display/images/default/banner.png) ;
height:115px;
width:1024px;
text-align:center;
}
.default_banner a {
color:#1289A9;
text-decoration:none;

}

.default_banner a:hover{
color:black;
}
.default_iframe
{
width:1024px;
height:330px;
}
.default_content
{
position:relative;
background-color:#95D3FA;
width:1024px;
height:320px;
}
.default_bottom
{
width:1024px;
height:15px;
background-image:url(display/images/default/bottom.png)
}
.default_language
{
font-family:Arial, Helvetica, sans-serif;
font-weight:bold;
	position:absolute;
	width:132px;
	height:26px;
	left: 825px;
	top: 54px;
}
.default_content_left
{
	position:absolute;
	background-image:url(display/images/default/content_left.png);
	background-repeat:no-repeat;
	height: 296px;
	width: 461px;
	left: 48px;
	top: 18px;
}
.default_content_left_more
{
	position:absolute;
	font-family:Arial, Helvetica, sans-serif;
	font-size:12px;
	left: 372px;
	width: 33px;
	top: 34px;
}
.default_content_right
{
	position:absolute;
	background-image:url(display/images/default/content_right.png);
	background-repeat:no-repeat;
	height: 296px;
	width: 461px;
	left: 528px;
	top: 18px;
}
.default_content_right_more
{
	position:absolute;
	font-family:Arial, Helvetica, sans-serif;
	font-size:12px;
	left: 32px;
	width: 33px;
	top: 34px;
}
.default_content_right_more a,.default_content_left_more a
{
font-weight:bold;
color:#5A3523;
text-decoration:none;
}
.default_content_right_more a:hover,.default_content_left_more a:hover
{
color:#5A3523;
text-decoration:underline
}
</style>

</head>

<body>
<center>
<div class="default_banner">
  <div class="default_language"><a href="">中&nbsp;&nbsp;文</a>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="">English</a></div>
</div>
<div><iframe class="default_iframe" src="default_galary.html" scrolling="no" frameborder="0" marginheight="0" marginwidth="0"></iframe></div>
<div class="default_content">
<div class="default_content_left">
<div class="default_content_left_more"><a href="">More</a></div>
<div class="default_content_left_news"></div>
</div>
<div class="default_content_right">
<div class="default_content_right_more"><a href="">More</a></div>
<div class="default_content_right_news"></div>
</div>
</div>
<div class="default_bottom"></div>
</center>
</body>
</html>
