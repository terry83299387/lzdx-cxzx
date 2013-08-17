<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ page language="java" import="java.util.*" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
	<HEAD>
		<TITLE><s:property
					value="%{getText('lzdx.page.title')}" /></TITLE>
		<META http-equiv=Content-Type content="text/html; charset=UTF-8">
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
		<LINK href="shared/login/global.css" type=text/css rel=STYLESHEET>

		<style type="text/css">
			<!--
			.STYLE1 {
				color: #000000;
				font-weight: bold;
			}
			-->
		</style>
		<script type="text/javascript" src="javascript/cookieUtil.js"></script>

		<script type="text/javascript" >
			function _key() {
				if (document.addEventListener) { // Firefox
					document.addEventListener("keypress", fireFoxHandler, true);
				} else {
					if (event.keyCode == 13) {
						check();
					}
				}
			}

			function fireFoxHandler(event) {
				if (event.keyCode == 13)
					check();
			}

			function check() {
				var frm = document.loginForm;

				if (frm.userName.value == "") {
					alert('<s:text name="scc.src.portal.user.nameisnull"/>');
					document.loginForm.userName.focus();
					return false;
				} else if (frm.password.value == "") {
					alert('<s:text name="scc.src.portal.password.notnull"/>');
				    frm.password.focus(); 
				     return false;
				} else if (frm.rand.value=="") {
					alert('<s:text name="scc.src.portal.rand.notnull"/>');
				    frm.rand.focus();
				    return false;
				} else {
					document.loginForm.submit();
					return true;
				}
			}
		</script>
	</HEAD>
	<BODY bgColor=#ffffff leftMargin=0 topMargin=0 rightMargin=0
			marginheight="0" marginwidth="0"
			onload="javascript:document.loginForm.userName.focus();"
			onkeydown="_key()">
		<table>
			<table>
				<s:i18n name="globalMessage">
					<CENTER>
						<DIV style="WIDTH: 100%; BACKGROUND-COLOR: #ffffff">
						
							<TABLE cellSpacing=0 cellPadding=0 width="100%" border=0>
								<TBODY>
									<TR>
										<TD vAlign=top align=middle>
											<TABLE id=mouseovers cellSpacing=0 cellPadding=0 width="776"
												border=0>
												<TBODY>
													<TR>
														<TD vAlign=top noWrap align=center height=60></TD>
													</TR>
												</TBODY>
											</TABLE>
										</TD>
									</TR>
									<TR>
										<TD align=middle bgColor=#ffffff colSpan=4 height=3>
											<IMG height=10 src="shared/login/spacer.gif" width=1>
										</TD>
									</TR>
								</TBODY>
							</TABLE>
						</DIV>
						<DIV id=content>
							<DIV class=module_darkgray>
								<DIV class=bottomedge_darkgray>
									<DIV class=topleft_darkgray></DIV>
									<DIV class=topright_darkgray></DIV>
									<DIV class=moduleborder>
										<DIV class=module_inset_darkgray>
											<DIV class=bottomedge_inset_darkgray>
												<DIV class=topleft_inset_darkgray></DIV>
												<DIV class=topright_inset_darkgray></DIV>
											
										
												<DIV style="PADDING-RIGHT: 15px; PADDING-LEFT: 35px">
													<TABLE cellSpacing=0 cellPadding=0 width=689 border=0 >
														<TBODY>
															<TR>
																<TD style="PADDING-RIGHT: 20px;" width=318>
																	<TABLE cellSpacing=0 cellPadding=0 border=0>
																		<TBODY>
																			<TR>
																				<br>																			
																				<TD style="MARGIN-BOTTOM: 10px" vAlign=top>
																					<font style='FONT-FAMILY: "Microsoft Yahei"'>
																						<strong><s:property
																								value="%{getText('scc.form.label.common.login')}" />
																					</strong> </font>
																				</TD>
																			</TR>
																			<TR>
																				<TD class=content_gray_bold>
																					<div class="yahei-font">
																						<%--<font style='FONT-FAMILY: "Microsoft Yahei"'>
																							<s:property
																								value="%{getText('scc.form.label.common.login.prompt')}" />
																								--%><input type='hidden' id="exception" value='<s:property value="#session.exception" />' />
																							<font color="red"><s:property
																									value="#session.exception" /></font>
																						<%--</font>--%>
																					</div>
																				</TD>
																			</TR>
																		</TBODY>
																	</TABLE>
																	<!-- Begin Form -->
																	<s:form id="loginForm" name="loginForm" theme="simple" method="post"
																		action="login.action">
																		<TABLE cellSpacing=0 cellPadding=0 width=318 border=0>
																			<TBODY>
																				<TR>
																					<TD align=left>
																						<SPAN class=content_black_bold><font
																							style='FONT-FAMILY: "Microsoft Yahei"'><s:property
																									value="%{getText('scc.form.label.common.user.name')}" />
																						</font> </SPAN>
																						<BR>
																						<font style='FONT-FAMILY: "Microsoft Yahei"'><INPUT
																								class=form value=""
																								autocomplete="off" style="WIDTH: 250px"
																								maxLength=28 id="userName" name=userName>
																						</font>
																						<font color="red"
																							style='FONT-FAMILY: "Microsoft Yahei"'><s:property
																								value="tip" /> </font>
																					</TD>
																				</TR>
																				<TR>
																					<TD height=8>
																					</TD>
																				</TR>
																				<TR>
																					<TD align=left>
																						<SPAN class=content_black_bold><font
																							style='FONT-FAMILY: "Microsoft Yahei"'><s:property
																									value="%{getText('scc.form.label.common.pwd')}" />
																						</font> </SPAN>
																						<BR>
																						<font style='FONT-FAMILY: "Microsoft Yahei"'><INPUT
																								class=form
																								value="<s:property value="password" />"
																								style="WIDTH: 250px" type="password"
																								id="password" maxLength=32 name="password"
																								minlength="6" "> </font>
																					</TD>
																				</TR>
																				<TR>
																					<TD height=8>
																					</TD>
																				</TR>
																				<tr>
																					<td>
																						<SPAN class=content_black_bold><font
																							style='FONT-FAMILY: "Microsoft Yahei"'><s:property
																									value="%{getText('scc.form.label.common.rand')}" />
																						</font> </SPAN>
																					</td>
																				</tr>
																				<TR>
																					<TD align=left>
																						<font style='FONT-FAMILY: "Microsoft Yahei"'><INPUT
																								class=form style="WIDTH: 250px" id="rand"
																								name="rand" maxlength="4"> </font>
																					</TD>
																					<TD>
																						<SPAN class=content_black_bold><font
																							style='FONT-FAMILY: "Microsoft Yahei"'> </font> </SPAN>
																						<img border=0 src="image.jsp">
																					</TD>
																				</TR>
																				<TR>
																					<TD height=8>
																					</TD>
																				</TR>
																				<TR>
																					<TD height=8>
																					</TD>
																				</TR>
																				<%--<TR>
																					<TD align=left>
																						
																						<font style='FONT-FAMILY: "Microsoft Yahei"'>
																					
																							<input type="checkbox" id="ck-remember"> <s:property
																								value="%{getText('scc.form.label.common.cookie.remember')}" />
																						</font>
																					</TD>
																				</TR>
																				--%><TR>
																					<BR>
																					<TD height=10>
																						<IMG height=10 alt=""
																							src="shared/login/spacer.gif" width=1 border=0>
																					</TD>
																				</TR>
																				<TR>
																					<TD class=content_gray vAlign=top align=left>
																						<span style="padding-right: 20px;"><input
																								type="button"
																								style="FONT-FAMILY: Microsoft Yahei"
																								value='<s:property value="%{getText('scc.form.button.common.login')}"/>'
																								 onclick="return check() "/> </span>
																						</TD>
																				</TR>
																				
																			</TBODY>
																		</TABLE>
																	</s:form>
																</TD>
																
															
															
															</TR>
															
														</TBODY>
													</TABLE>
												</DIV>
											</DIV>
										</DIV>
									</DIV>
								</DIV>
							</DIV>
						</DIV>
						
						
						
					</CENTER>
				</s:i18n>
				<iframe src="loadjs.htm" height="0px" style=" border:0px"></iframe>
	</BODY>
</HTML>
<%
	// clean exception in session
	request.getSession().setAttribute("exception", "");
%>
