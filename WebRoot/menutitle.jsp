<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<link rel="stylesheet" type="text/css"
			href="display/css/menutitle.css" />
			
</head>

<body>
<center>
<div class="page_banner"></div>
<div class="page_title">
<table>
<tr>
<s:iterator value='nodes' status="st">
<s:if test="#st.index>0"><td class='title_split'></td></s:if>
<s:if test="id==titleId"><td class='title_2'></s:if><s:else><td class='title_1'></s:else><a target="_blank" href="<s:property value='link'/>?titleId=<s:property value='id'/>&language=<s:property value='language'/>" ><s:property value='text'/></a></td>
</s:iterator>
</tr>
</table>
 </div>
</center>
</body>
</html>
