<%@ page language="java" pageEncoding="UTF-8"
	import="java.util.*, cn.edu.lzu.db.beans.User, cn.edu.lzu.common.action.SessionConstants" %>
<%@ page contentType="text/html; charset=UTF-8"%>	
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
	User user = (User) request.getSession().getAttribute(SessionConstants.USER);
	if (user == null) {
		response.sendRedirect("index.action");
	}
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<s:i18n name="globalMessage">
	<head>
		<title>?Title?</title>
		<META http-equiv=Content-Type content="text/html; charset=UTF-8">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="xfinity,ssc,scc">
		<meta http-equiv="description" content="This is Xfinity">

		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" type="text/css"
			href="extjs/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css" href="css/ext-all-patch.css" />
		<link rel="stylesheet" type="text/css" href="css/desktop.css" />
		<link rel="stylesheet" type="text/css" href="css/scc.css" />
		<link rel="stylesheet" type="text/css" href="css/docs.css" />
		<link rel="stylesheet" type="text/css" href="css/style.css" />
		<link rel="stylesheet" type="text/css" href="css/data-view.css" />
		<!-- job detail css -->
		<link rel="stylesheet" type="text/css" href="css/job-detail.css" />
		<!-- job statistics charts css -->
		<link rel="stylesheet" type="text/css" href="css/job-statistics-charts.css" />
		<link rel="stylesheet" type="text/css" href="css/Ext.ux.UploadDialog.css" />
		<style>
			.ext-ie .x-window-bbar .x-toolbar{ position:static; }
			.ext-ie .x-grid-panel .x-panel-bbar {
				position: static;
			}
			.ext-ie .x-grid-panel .x-panel-bbar .x-toolbar {
				position: static;
			}
			.x-grid3-cell-text-visible .x-grid3-cell-inner {
				overflow:visible;padding:3px 3px 3px 5px;white-space:normal;
			}
		</style>

		<script type="text/javascript">
		    var currentUser = {
		    	userName : '<%=user.getUserName()%>',
		    	role : '<%=user.getRole()%>',
		    };
		</script>

		<script type="text/javascript" src="extjs/ext-base.js"></script>
		<script type="text/javascript" src="extjs/ext-all-debug.js"></script>

		<script type="text/javascript" src="javascript/cookieUtil.js"></script>

		<!-- plugin -->
		<script type="text/javascript" src="javascript/plugin.js"></script>

		<!-- DESKTOP -->
		<script type="text/javascript" src="javascript/desktop/StartMenu.js"></script>
		<script type="text/javascript" src="javascript/desktop/TaskBar.js"></script>
		<script type="text/javascript" src="javascript/desktop/Desktop.js"></script>
		<script type="text/javascript" src="javascript/desktop/App.js"></script>
		<script type="text/javascript" src="javascript/desktop/Module.js"></script>
		<script type="text/javascript" src="javascript/desktop/WinMap.js"></script>
		<script type="text/javascript" src="javascript/namespace.js"></script>
		<script type="text/javascript" src="javascript/util.js"></script>
		<script type="text/javascript" src="javascript/desktop.js"></script>

		<!--applet -->
		<script type="text/javascript" src="javascript/appletTransfer.js"></script>
		
		<!--fileMng -->
		<script type="text/javascript" src="javascript/fileMng/TxtEditorUtil.js"></script>
           <script type="text/javascript"
			src="javascript/fileMng/FileMngGlobal.js"></script>
		<script type="text/javascript"
			src="javascript/fileMng/FileSupport.js"></script>
		<script type="text/javascript" src="javascript/FilePanel.js"></script>

		<script type="text/javascript" src="javascript/MngWin.js"></script>
		<script type="text/javascript" src="javascript/pagetrees/treepanel.js"></script>

		<script type="text/javascript" src="javascript/FilePanel.js"></script>
		<script type="text/javascript" src="javascript/fileSelector/fileSelector.js"></script>
		<script type="text/javascript" src="javascript/Ext.ux.UploadDialog.js"></script>
		<script type="text/javascript" src="javascript/news/news.js"></script>

		<script type="text/javascript" src="javascript/user/UserWin.js"></script>
		<script type="text/javascript" src="javascript/user/NewUser.js"></script>
		<script type="text/javascript" src="javascript/user/EditUser.js"></script>

		<script src="tinymce/tinymce.dev.js"></script>

		<script type="text/javascript">
			tinymce.init({
				selector: '.tinyclass',
				theme: "modern",
				plugins: [
					"advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
					"searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
					"table contextmenu directionality emoticons template textcolor paste fullpage textcolor"
				],
				image_advtab: true,
		        toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
		        toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | inserttime preview | forecolor backcolor",
		        toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",
		 		toolbar4: "mybutton",
				setup: function(editor) {
			        editor.addButton('mybutton', {
			            text: 'My button',
			            icon: 'image',
			            onclick: function() {
			           		 var win, data, dom = editor.dom, imgElm = editor.selection.getNode();
			                editor.insertContent("<img src='123.jpg' />");
			            }
			        });
		    	},

		        menubar: false,
		        toolbar_items_size: 'small',

		        style_formats: [
		                {title: 'Bold text', inline: 'b'},
		                {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
		                {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
		                {title: 'Example 1', inline: 'span', classes: 'example1'},
		                {title: 'Example 2', inline: 'span', classes: 'example2'},
		                {title: 'Table styles'},
		                {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
		        ],

		        templates: [
		                {title: 'Test template 1', content: 'Test 1'},
		                {title: 'Test template 2', content: 'Test 2'}
		        ]
	 		});
		</script>
		<script type="text/javascript">
			function _preventIEMouseOut() {
				if(document.addEventListener) {//如果是Firefox
					//document.addEventListener("mousemove",fireFoxHandler, true);
				} else {
					try {
						if(event.clientX && event.clientY) {
							event.clientY=0;
							event.clientX=0;
						}
					} catch(e) {
						// neglect error
					}
				}
			}
		</script>
	</head>
	<body scroll="no">
	<%@ include file="language.jsp"%>
			<div id="x-desktop">
				<dl id="x-shortcuts"></dl>
			</div>

			<div id="x-loading-mask"></div>
			<div id="x-loading">
				<div class="x-loading-indicator">
					Loading....
				</div>
			</div>

			<div onmouseover="_preventIEMouseOut()">
				<div id="meslog"></div>
				<div id="ux-taskbar">
					<div id="ux-taskbar-start"></div>
					<div id="ux-taskbar-panel-wrap">
						<div id="ux-quickstart-panel"></div>
						<div id="ux-taskbuttons-panel"></div>
						<div id="ux-tray-panel"></div>
						<div id="ux-taskbar-desk"></div>
						<div id="ux-taskbar-currentuser"></div>
					</div>
					<div class="x-clear"></div>
				</div>

				<div id="component" style="width:90%;height:100%">
				</div>

			</div>   
		</body>
         
            
	</s:i18n>
</html>
