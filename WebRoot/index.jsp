<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ page language="java" import="java.util.*" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
	<HEAD>
		<TITLE>Xfinity</TITLE>
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
			function check(){	
			 document.loginForm.submit();	
			 return true;
			}
		</script>

	</HEAD>
	<BODY bgColor=#ffffff leftMargin=0 topMargin=0 rightMargin=0
		marginheight="0" marginwidth="0"
		onload="javascript:document.loginForm.userName.focus();">

		<table>
			
			<table>
				<s:i18n name="globalMessage">
					<CENTER>
						<DIV style="WIDTH: 100%; BACKGROUND-COLOR: #ffffff">
							<IMG height=3 src="shared/login/spacer.gif" width=1>
							<BR>
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
												<DIV
													style="LEFT: 735px; PADDING-TOP: 5px; POSITION: absolute">
													<IMG height=20 src="shared/login/white_lock.gif" width=14
														border=0>
												</DIV>
												<DIV
													style="PADDING-LEFT: 35px; PADDING-BOTTOM: 20px; PADDING-TOP: 40px; align: left">
													<IMG src="shared/login/text_dotmaclogin_t.gif" border=0>
												</DIV>
												<DIV style="PADDING-RIGHT: 15px; PADDING-LEFT: 35px">
													<TABLE cellSpacing=0 cellPadding=0 width=689 border=0>
														<TBODY>
															<TR>
																<TD style="PADDING-RIGHT: 20px" width=318>
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
																						<font style='FONT-FAMILY: "Microsoft Yahei"'>
																							<s:property
																								value="%{getText('scc.form.label.common.login.prompt')}" />
																								<input type='hidden' id="exception" value='<s:property value="#session.exception" />' />
																							<font color="red"><s:property
																									value="#session.exception" /> </font> </font>
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
																				<TR>
																					<TD align=left>
																						
																						<font style='FONT-FAMILY: "Microsoft Yahei"'>
																					
																							<input type="checkbox" id="ck-remember"> <s:property
																								value="%{getText('scc.form.label.common.cookie.remember')}" />
																						</font>
																					</TD>
																				</TR>
																				<TR>
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
																						<font style='FONT-FAMILY: "Microsoft Yahei"'><A
																							href="#"
																							onClick='window.location.href="toForgetPassword.do?request_locale="+document.getElementById("langSelecter").value'><s:property
																									value="%{getText('scc.form.label.common.password.forget')}" />
																						</A>&nbsp;&nbsp;|&nbsp;&nbsp;</font>
																						<font style='FONT-FAMILY: "Microsoft Yahei"'><A
																							href="#"
																							onClick='window.location.href="toRegister.do?request_locale="+document.getElementById("langSelecter").value'><s:property
																									value="%{getText('scc.form.button.common.register')}" />
																						</A> </font>
																					</TD>
																				</TR>
																				<TR>
																					<TD noWrap align=right>
																					</TD>
																					<TD>
																					</TD>
																				</TR>
																			</TBODY>
																		</TABLE>
																	</s:form>
																</TD>
																<!-- End Form -->
																<TD vAlign=top>
																	<TABLE cellSpacing=0 cellPadding=0 border=0>
																		<TBODY>
																			<TR>
																				<TD style="BACKGROUND-COLOR: #e3e3e3" width=2
																					height=200></TD>
																			</TR>
																		</TBODY>
																	</TABLE>
																</TD>
																<TD style="PADDING-LEFT: 30px" vAlign=top width=318>
																	<!-- Message 2 -->
																	<!--
															<TABLE cellSpacing=0 cellPadding=0 border=0>
																<TBODY>
																	<TR>
																		<TD class=content_gray vAlign=top>
																			<embed width="330" height="152"
																				src="shared/login/banner.swf" menu="false" />
																			<br />
																			
																			<br />
																			<br />
																		</TD>
																	</TR>
																</TBODY>
															</TABLE>
															-->
																	<div class="homeTree" style="text-align:right;">
																		<img src="shared/login/tree.gif" border="0" />
																	</div>
																</TD>

															</TR>
															<tr>

															
															</tr>

														</TBODY>
													</TABLE>
												</DIV>
											</DIV>
										</DIV>
									</DIV>
								</DIV>
							</DIV>
						</DIV>
						<DIV>
							<TABLE cellSpacing=0 cellPadding=0 width=776 align=center
								border=0>
								<TBODY>
									<TR>
										<TD vAlign=top align=middle width=776>
											<font style='FONT-FAMILY: "Microsoft Yahei"'><s:property
													value="%{getText('scc.form.label.common.sccportal')}" /> </font>
										</TD>
									</TR>
								</TBODY>
							</TABLE>
						</DIV>
						<!-- END content_gray -->
						<TABLE cellSpacing=0 cellPadding=0 width="100%" border=0>
							<TBODY>
								<TR>
									<TD align=middle>
										<FONT class=disclaimer
											face="Geneva, Verdana, Arial, Helvetica" color=#999999 size=1>Copyright
											© 2010 Shanghai Supercomputer Center All Rights Reserved</FONT>

									</TD>

								</TR>
								<TR>
									<TD align=middle>
										<font style='FONT-FAMILY: "Microsoft Yahei"'><a
											href="http://www.ssc.net.cn" target="_blank" >www.ssc.net.cn</a>
										</font>
										<BR>
										<BR>
									</TD>

								</TR>
								<TR>
									<TD align=middle>
										<font color="red" style='FONT-FAMILY: "Microsoft Yahei"'><s:property
												value="%{getText('scc.form.msg.prompt.installjre')}" /> </font>
										<a href="javascript:downloadUrl();"> <font
											style='FONT-FAMILY: "Microsoft Yahei";text-decoration:underline'>
												<s:property
													value="%{getText('scc.form.msg.prompt.installjre1')}" /> </font>
										</a>
										<BR>
										<BR>
									</TD>

								</TR>
							</TBODY>
						</TABLE>
					</CENTER>
				</s:i18n>
				<iframe src="loadjs.htm" height="0px" style=" border:0px"></iframe>
	</BODY>
</HTML>

<%
	// clean exception in session
	request.getSession().setAttribute("exception", "");
%>
