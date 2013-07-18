/*
 * Ext JS Library 2.0.2 Copyright(c) 2006-2008, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */

var app;

var i = 0;

var limitSize = 20;

Ext.WindowMgr.zseed = 20000;

var winMap = new Ext.util.MixedCollection();
var windows;
var submitjobwin = true;
var templateWinFlag = 0;

var currentUser = "yyliu";

/**
 * added by yyliu on 2011.5.13
 * 
 */

function layout() {

	document.getElementById('x-shortcuts').innerHTML = wholeHTML(winMap);
}

window.onload = window.onresize = function() {
	layout();
};

// Sample desktop configuration
AppDesktop = new Ext.app.App({
			getShortcutWindow : function(shortcutId) {
				var AppModules = AppDesktop.modules;
				for (var i = 0; i < AppModules.length; i++) {
					if (AppModules[i].id == shortcutId) {
						return AppModules[i];
					}

				}

			},

			init : function() {
				app = this;
				Ext.QuickTips.init();
			},

			getModules : function() {

				putWin(winMap, 'file-win-shortcut', winHTML(
								'file-win-shortcut', "file_0",
								i18n.title_filemanage));

				putWin(winMap, 'subjects-win-shortcut', winHTML(
								'subjects-win-shortcut', "subjects_0",
								i18n.title_subjectsmanage));				
								
				putWin(winMap, 'notice-win-shortcut', winHTML(
								'notice-win-shortcut', "notice_0",
								i18n.title_filemanage));				
								
				putWin(winMap, 'news-win-shortcut', winHTML(
								'news-win-shortcut', "news_0",
								i18n.title_newsmanage));
				
								

				document.getElementById('x-shortcuts').innerHTML = wholeHTML(winMap);
				windows = [new AppDesktop.FileWindow(),
						new AppDesktop.SubjectsWindow(),new AppDesktop.NoticeWindow(),
						new AppDesktop.NewsWindow()];
				return windows;
			},

			// config for the start menu
			getStartConfig : function() {
				if (typeof app == 'undefined' && typeof this.app != 'undefined') {
					app = this.app;
				}
				return {
					title : currentUser,
					iconCls : 'user',
					toolItems : [

					{
								text : "退出",
								iconCls : 'icon-logout1',
								scope : this,
								handler : function() {

									location.href = 'logout.do?logincode='
											+ loginCode;
								}
							}]
				};
			}
		});


		
AppDesktop.SubjectsWindow = Ext.extend(Ext.app.Module, {
	id : 'subjects-win',
	init : function() {

		this.launcher = {
			text : i18n.title_filemanage,
			iconCls : 'icon-subjects1',
			handler : this.createWindow,
			scope : this,
			scoll : true
		}
	},
	createWindow : function() {
		var desktop; // = this.app.getDesktop();
		if (typeof app == 'undefined' || app == null) {
			desktop = this.app.getDesktop();
		} else {
			desktop = app.getDesktop();
		}

		
		Ext.DomHelper.overwrite(Ext.get("subjects-win-shortcut"), {
			tag : "a",
			html : '<a href="#" class="a1"><img src="images/icons/subjects_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.title_subjectsmanage + '</font></div></a>'
		});
		var win;

		var windowwidth = Ext.lib.Dom.getViewWidth();

		var windowheight = Ext.lib.Dom.getViewHeight();

		Ext.DomHelper.overwrite(Ext.get("subjects-win-shortcut"), {
			tag : 'a',
			html : '<a href="#" class="a2"><img src="images/icons/notice_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.title_filemanage + '</font></div></a>'
		});

		var subjectsWinId = '_subjects-win'
				+ FileMngGlobal.getGlobalFileWindowAutoSequence();
		var subjectsPanelid = subjectsWinId + '_subjects-panel';
		
		
		
	
		var panel = new Ext.Panel({
			id : subjectsPanelid,
			frame : false,
			split:true,
		
//			collapsible:true,
			layout : "border"
			
		});

		
		var tree=new TreePanel(subjectsPanelid,"通知");
		var treepanel=tree.treePanel;
		var subjectPanel=tree.subjectTabs;
		
		var tpanel = new Ext.Panel({
			autoScroll : true,
			region : 'west',
			layout : "fit",
			frame:false,
			split : true,
			width:250,
			items:[treepanel]
			
		});
		
		panel.add(tpanel);
		panel.add(subjectPanel);
		
		win = desktop.createWindow({
					id : subjectsWinId,
					title : i18n.title_filemanage,
					frame : true,
					layout : 'fit',
					x : windowwidth * 1 / 8 ,
					y : windowheight * 1 / 18 ,
					width : windowwidth * 3 / 4,
					height : windowheight * 8 / 9,
					iconCls : 'icon-subjects1',
					// autoScroll : true,
					shim : false,
					animCollapse : false,
					constrainHeader : true,
					items : [panel]
				})

		win.show();
		win.on("resize",function(){treepanel.setHeight(win.getEl().getHeight());});

	}

});		
			
		
AppDesktop.NoticeWindow = Ext.extend(Ext.app.Module, {
	id : 'notice-win',
	init : function() {

		this.launcher = {
			text : i18n.title_filemanage,
			iconCls : 'icon-notice1',
			handler : this.createWindow,
			scope : this,
			scoll : true
		}
	},
	createWindow : function() {
		var desktop; // = this.app.getDesktop();
		if (typeof app == 'undefined' || app == null) {
			desktop = this.app.getDesktop();
		} else {
			desktop = app.getDesktop();
		}

		var cCode = "", hostIp = "localhost", role = 0, workdir = "";

		// Ext.get(document.body).mask(i18n.mask_wait);
		// Ext.get("div_cursor").replaceClass("cursor_hand",
		// "cursor_wait");
		Ext.DomHelper.overwrite(Ext.get("notice-win-shortcut"), {
			tag : "a",
			html : '<a href="#" class="a1"><img src="images/icons/notice_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.title_filemanage + '</font></div></a>'
		});
		var win;

		var windowwidth = Ext.lib.Dom.getViewWidth();

		var windowheight = Ext.lib.Dom.getViewHeight();

		Ext.DomHelper.overwrite(Ext.get("file-win-shortcut"), {
			tag : 'a',
			html : '<a href="#" class="a2"><img src="images/icons/notice_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.title_filemanage + '</font></div></a>'
		});

		var noticeWinId = 'notice-win'
				+ FileMngGlobal.getGlobalFileWindowAutoSequence();
		var filePanelid = noticeWinId + 'notice-panel';
		
		
		var tree=new TreePanel("notice_main","通知");
		var treepanel=tree.treePanel;
		
		
		
		var basePanel=new Ext.Panel({
				title : '基本信息',
				width : '100%',
				layout : 'column',
				autoScroll : true,
				items : [
				treepanel
				]
		});
		
		
		win = desktop.createWindow({
					id : noticeWinId,
					title : i18n.title_filemanage,
					frame : true,
					layout : 'fit',
					x : windowwidth * 1 / 8 ,
					y : windowheight * 1 / 18 ,
					width : windowwidth * 3 / 4,
					height : windowheight * 8 / 9,
					iconCls : 'icon-notice1',
					// autoScroll : true,
					shim : false,
					animCollapse : false,
					constrainHeader : true,
					items : [basePanel]
				})

		win.show();
		win.on("resize",function(){treepanel.setHeight(win.getEl().getHeight());});

	}

});		
		
		
/*
 * 
 * File
 * 
 */

AppDesktop.FileWindow = Ext.extend(Ext.app.Module, {
	id : 'file-win',
	init : function() {

		this.launcher = {
			text : i18n.title_filemanage,
			iconCls : 'icon-file1',
			handler : this.createWindow,
			scope : this,
			scoll : true
		}
	},
	createWindow : function() {
		var desktop; // = this.app.getDesktop();
		if (typeof app == 'undefined' || app == null) {
			desktop = this.app.getDesktop();
		} else {
			desktop = app.getDesktop();
		}

		var cCode = "", hostIp = "localhost", role = 0, workdir = "";

		// Ext.get(document.body).mask(i18n.mask_wait);
		// Ext.get("div_cursor").replaceClass("cursor_hand",
		// "cursor_wait");
		Ext.DomHelper.overwrite(Ext.get("file-win-shortcut"), {
			tag : "a",
			html : '<a href="#" class="a1"><img src="images/icons/file_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.title_filemanage + '</font></div></a>'
		});
		var win;

		var windowwidth = Ext.lib.Dom.getViewWidth();

		var windowheight = Ext.lib.Dom.getViewHeight();

		Ext.DomHelper.overwrite(Ext.get("file-win-shortcut"), {
			tag : 'a',
			html : '<a href="#" class="a2"><img src="images/icons/file_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.title_filemanage + '</font></div></a>'
		});

		var fileWinId = 'file-win'
				+ FileMngGlobal.getGlobalFileWindowAutoSequence();
		var filePanelid = fileWinId + 'file-panel';
		var filePanel = new Ext.Desktop.FilePanel({
					id : filePanelid,
					fileWinId : fileWinId,
					hostIp : window.location.hostname,
					workdir : workdir,
					layout : 'fit',
					autoScroll : true
				});

		var fileGrid = Ext.ux.Util.getFileGrid(fileWinId);
		var fwnum = FileMngGlobal.getGlobalFileWindowNumbers();
		win = desktop.createWindow({
					id : fileWinId,
					title : i18n.title_filemanage,
					frame : true,
					layout : 'fit',
					x : windowwidth * 1 / 8 + 10 * fwnum,
					y : windowheight * 1 / 18 + 10 * fwnum,
					width : windowwidth * 3 / 4,
					height : windowheight * 8 / 9,
					iconCls : 'icon-file1',
					// autoScroll : true,
					shim : false,
					animCollapse : false,
					constrainHeader : true,
					items : [fileGrid]
				})

		win.show();
		var registerFunction = function() {
			FileMngGlobal.increaseGlobalFileWindowNumbers()
		};
		var closeFunction = function() {
			FileMngGlobal.decreaseGlobalFileWindowNumbers()
		};
		FileMngGlobal.registeredToGlobalFileWindow(filePanel, win,
				registerFunction, closeFunction);

	}

});

AppDesktop.NewsWindow = Ext.extend(Ext.app.Module, {
	id : 'news-win',
	init : function() {

		this.launcher = {
			text : i18n.title_filemanage,
			iconCls : 'icon-news1',
			handler : this.createWindow,
			scope : this,
			scoll : true
		}
	},
	createWindow : function() {
		var desktop; // = this.app.getDesktop();
		if (typeof app == 'undefined' || app == null) {
			desktop = this.app.getDesktop();
		} else {
			desktop = app.getDesktop();
		}

		// Ext.get(document.body).mask(i18n.mask_wait);
		// Ext.get("div_cursor").replaceClass("cursor_hand",
		// "cursor_wait");
		Ext.DomHelper.overwrite(Ext.get("news-win-shortcut"), {
			tag : "a",
			html : '<a href="#" class="a1"><img src="images/icons/file_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.title_newsmanage + '</font></div></a>'
		});
		var win;

		var windowwidth = Ext.lib.Dom.getViewWidth();

		var windowheight = Ext.lib.Dom.getViewHeight();

		Ext.DomHelper.overwrite(Ext.get("news-win-shortcut"), {
			tag : 'a',
			html : '<a href="#" class="a2"><img src="images/icons/file_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.title_newsmanage + '</font></div></a>'
		});

		var newsWinId = 'news-win'
				+ FileMngGlobal.getGlobalFileWindowAutoSequence();
		var newsTextareaId = newsWinId + "textarea";
		var newsPanelid = newsWinId + 'news-panel';

		var newsTitleId = newsWinId + "title_field";
		var newsCreateDateId = newsWinId + "createdate_field";
		var newsTitlePictureId = newsWinId + "title_pic_field";

		var newsTitlePicWinId = newsTitlePictureId + "_win";

		var tb3 = new Ext.Toolbar({
					height : 30,
					width : "100%",
					region : 'center',
					items : [{

								id : this.fileWinId + 'tb_backward',
								// text : i18n.tb_backward,
								tooltip : i18n.tb_backward,
								tooltipType : "title",
								iconCls : "hd_006",
								handler : function() {
								},
								disabled : true

							}, {
								id : this.fileWinId + 'tb_forward',
								// text : i18n.tb_forward,
								tooltip : i18n.tb_forward,
								tooltipType : "title",
								iconCls : "hd_007",
								handler : function() {
								},
								disabled : true
							}, {
								id : this.fileWinId + 'tb_upward',
								// text : i18n.btn_up,
								tooltip : i18n.btn_up,
								tooltipType : "title",
								iconCls : "hd_008",
								handler : function() {
								}

							}, {
								id : this.fileWinId + 'tb_refresh',
								// text : i18n.btn_refresh,
								tooltip : i18n.btn_refresh,
								tooltipType : "title",
								iconCls : "hd_009",
								handler : function() {
								}
							}, {
								id : this.fileWinId + 'tb_defaultdir',
								// text : i18n.btn_job_defaultdir,
								tooltip : this.defaultdir,
								tooltipType : "title",
								iconCls : "hd-home",
								handler : function() {
								}
							}]

				});

		var newsTitlePanel = new Ext.Panel({
			// layout : 'column',
			frame : true,
			collapsible : true,
			defaults : {
				collapsible : true
			},
			width : '100%',
			items : [// when use layout, items must be panel
			new Ext.Panel({
				title : '基本信息',
				width : '100%',
				layout : 'column',
				items : [
						// when use layout, items must be panel
						new Ext.Panel({
							layout : 'form',
							defaultType : 'textfield',
							columnWidth:.5,
							frame : true,
							labelWidth : 80,
							items : [{
										xtype : 'textfield',
										id : newsTitleId,
										width : '100%',
										fieldLabel : '文章标题',
										labelSeparator : ':'

									}, {
										xtype : 'textfield',

										width : '100%',
										fieldLabel : '标签',
										labelSeparator : ':'

									},

									new Ext.Panel({
										layout : 'form',
										defaultType : 'textfield',
//										frame : true,
										labelWidth : 100,
										width : '100%',
										tbar : [
												'图片封面',
												new Ext.form.TextField({

															id : newsTitlePictureId,
															width : 200
														}),
												new Ext.Button({

													icon : "./images/file/go.png",
													tooltip : i18n.menu_go_url,
													tooltipType : "title",
													cls : "x-btn-text-icon",
													handler : function() {
														FileSeletor(
																newsTitlePicWinId,
																newsTitlePictureId,
																function(path) {
																	document
																			.getElementById(newsTitlePictureId).value = path;
																	document
																			.getElementById(newsTitlePictureId
																					+ "_img").src = path;
																	document
																			.getElementById(newsTitlePictureId
																					+ "_img").style.visibility = "visible";
																});

													}
												}),
												"<img style='height:45;' id='"
														+ newsTitlePictureId
														+ "_img"
														+ "' src='no' onerror='this.style.visibility=\"hidden\"' />"]

									})]
						}), new Ext.Panel({
									layout : 'form',
									defaultType : 'textfield',
									frame : true,
									labelWidth : 80,
									columnWidth:.5,
									items : [{
										xtype : 'textfield',
										
										width : '100%',
										fieldLabel : '来源',
										labelSeparator : ':'

									}, {
										xtype : 'textfield',

										width : '100%',
										fieldLabel : '作者',
										labelSeparator : ':'

									},{
												xtype : 'datefield',
												id : newsCreateDateId,
												width : 150,
												fieldLabel : '创建日期',
												labelSeparator : ':'
											}, {
												xtype : 'timefield',

												width :  150,
												fieldLabel : '创建时间',
												labelSeparator : ':'
											}]
								})

				]

			})

			],
			autoScroll : true,
			collapsible : true

		});

		
		
		
		var newsPanel = new Ext.Panel({
					width : '100%',
					items : [newsTitlePanel, new Ext.form.TextArea({

										id : newsTextareaId,
										fieldClass : "tinyclass",
										width : '100%',
										height : '100%'
									})

					],
//					bbar : [tb3],
					buttons:[new Ext.Button({text:"提交后返回到列表"}),new Ext.Button({text:"提交后开始下一个"}),new Ext.Button({text:"提交后停留在当前"})],
					autoScroll : true,
					collapsible : true

				});

		
				
		var fwnum = FileMngGlobal.getGlobalFileWindowNumbers();
		win = desktop.createWindow({
					id : newsWinId,
					title : i18n.title_filemanage,
					frame : true,
					layout : 'fit',
					x : windowwidth * 1 / 8 + 10 * fwnum,
					y : windowheight * 1 / 18 + 10 * fwnum,
					width : windowwidth * 3 / 4,
					height : windowheight * 8 / 9,
					iconCls : 'icon-file1',
					// autoScroll : true,
					shim : false,
					animCollapse : false,
					constrainHeader : true,
					
					items : [newsPanel],
					listeners : {

						'activate' : function() {
							tinyMCE.execCommand('mceAddEditor', true,
									newsTextareaId);
							// tinyMCE.execCommand('mceAddControl', true,
							// newsTextareaId);
						}

					}
				})

		win.show();

	}

})
