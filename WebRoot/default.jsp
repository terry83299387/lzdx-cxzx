<%@ page contentType="text/html; charset=UTF-8"%>	
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>welcome</title>

<link rel="stylesheet" type="text/css"
			href="display/css/default.css" />
<script type="text/javascript" src="display/js/jquery.js" ></script>			

</head>

<body>
<center>
<div class="default_banner">
  <div class="default_language"><a href="defaultAction.action?language=cn_name">中&nbsp;&nbsp;文</a>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="defaultAction.action?language=en_name">English</a></div>
</div>
<div><iframe class="default_iframe" src="default_galary.html" scrolling="no" frameborder="0" marginheight="0" marginwidth="0"></iframe></div>
<div class="default_content">
<div class="default_content_left">
<div class="default_content_left_more"><a href="">More</a></div>
<div class="default_content_left_news" id="xinwendongtai"></div>
</div>
<div class="default_content_right">
<div class="default_content_right_more"><a href="">More</a></div>
<div class="default_content_right_news" id="tongzhigonggao"></div>
</div>
</div>
<div class="default_bottom"></div>
</center>
<script>lanType="<s:property value='language'/>"</script>
<script type="text/javascript" src="display/js/default.js" ></script>
</body>
</html>
