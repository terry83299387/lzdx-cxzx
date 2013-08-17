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
						'subjects-win-shortcut', "dynamic_0",
						i18n.news_management));				
						
		putWin(winMap, 'page-win-shortcut', winHTML(
						'page-win-shortcut', "sysconfig_0",
						i18n.page_management));				
						
		putWin(winMap, 'user-win-shortcut', winHTML(
						'user-win-shortcut', "user_0",
						i18n.user_management));

		document.getElementById('x-shortcuts').innerHTML = wholeHTML(winMap);
		windows = [new AppDesktop.FileWindow(),
				new AppDesktop.SubjectsWindow(),new AppDesktop.PageWindow(),
				new AppDesktop.UserWindow()];
		return windows;
	},

	// config for the start menu
	getStartConfig : function() {
		if (typeof app == 'undefined' && typeof this.app != 'undefined') {
			app = this.app;
		}
		return {
			title : currentUser.userName,
			iconCls : 'user',
			toolItems : [{
				text : i18n.logout,
				iconCls : 'icon-logout1',
				scope : this,
				handler : function() {
					location.href = 'logout.do';
				}
			}]
		};
	}
});

AppDesktop.SubjectsWindow = Ext.extend(Ext.app.Module, {
	id : 'subjects-win',
	init : function() {
		this.launcher = {
			text : i18n.news_management,
			iconCls : 'icon-dynamic1',
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
			html : '<a href="#" class="a1"><img src="images/icons/dynamic_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.news_management + '</font></div></a>'
		});

		var win;
		var windowwidth = Ext.lib.Dom.getViewWidth();
		var windowheight = Ext.lib.Dom.getViewHeight();

		Ext.DomHelper.overwrite(Ext.get("subjects-win-shortcut"), {
			tag : 'a',
			html : '<a href="#" class="a2"><img src="images/icons/dynamic_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.news_management + '</font></div></a>'
		});

		var subjectsWinId = '_subjects-win';
		var subjectsPanelid = subjectsWinId + '_subjects-panel';

		if (Ext.getCmp(subjectsWinId)) {

			Ext.getCmp(subjectsWinId).show();
			return;
		}

		var panel = new Ext.Panel({
			id : subjectsPanelid,
			frame : false,
			split : true,
			layout : "border"
		});

		var tree = new TreePanel(subjectsPanelid, i18n.configroot);
		var treepanel = tree.treePanel;
		var subjectPanel = tree.subjectTabs;

		var tpanel = new Ext.Panel({
			autoScroll : true,
			region : 'west',
			layout : "fit",
			frame : false,
			split : true,
			width : 250,
			items : [treepanel]
		});

		panel.add(tpanel);
		panel.add(subjectPanel);

		win = desktop.createWindow({
			id : subjectsWinId,
			title : i18n.news_management,
			frame : true,
			layout : 'fit',
			x : windowwidth * 1 / 8,
			y : windowheight * 1 / 18,
			width : windowwidth * 3 / 4,
			height : windowheight * 8 / 9,
			iconCls : 'icon-dynamic1',
			shim : false,
			animCollapse : false,
			constrainHeader : true,
			items : [panel]
		})

		win.show();
		win.on("resize", function() {
					treepanel.setHeight(win.getEl().getHeight());
				});

	}
});		

AppDesktop.PageWindow = Ext.extend(Ext.app.Module, {
	id : 'page-win',
	init : function() {
		this.launcher = {
			text : i18n.page_management,
			iconCls : 'icon-sysconfig1',
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

		Ext.DomHelper.overwrite(Ext.get("page-win-shortcut"), {
			tag : "a",
			html : '<a href="#" class="a1"><img src="images/icons/sysconfig_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.page_management + '</font></div></a>'
		});
		var win;
		var windowwidth = Ext.lib.Dom.getViewWidth();
		var windowheight = Ext.lib.Dom.getViewHeight();

		Ext.DomHelper.overwrite(Ext.get("page-win-shortcut"), {
			tag : 'a',
			html : '<a href="#" class="a2"><img src="images/icons/sysconfig_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.page_management + '</font></div></a>'
		});
	}
});		

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

AppDesktop.UserWindow = Ext.extend(Ext.app.Module, {
	id : 'user-win',
	init : function() {
		this.launcher = {
			text : i18n.user_management,
			iconCls : 'icon-user1',
			handler : this.createWindow,
			scope : this,
			scoll : true
		}
	},
	createWindow : function() {
		var desktop;
		if (app == null) {
			desktop = this.app.getDesktop();
		} else {
			desktop = app.getDesktop();
		}

		Ext.DomHelper.overwrite(Ext.get("user-win-shortcut"), {
			tag : "a",
			html : '<a href="#" class="a1"><img src="images/icons/user_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.user_management + '</font></div></a>'
		});

		var win = desktop.getWindow('user-win');
		var winWidth = Ext.lib.Dom.getViewWidth();
		var winHeight = Ext.lib.Dom.getViewHeight();

		Ext.DomHelper.overwrite(Ext.get("user-win-shortcut"), {
			tag : 'a',
			html : '<a href="#" class="a2"><img src="images/icons/user_0.png"/><div><font style="FONT-FAMILY: Microsoft Yahei">'
					+ i18n.user_management + '</font></div></a>'
		});

        if (!win) {
			var grid = new Ext.Desktop.UserWin().grid;
            win = desktop.createWindow({
                id : 'user-win',
                title : i18n.user_management,
				x : winWidth * 1 / 8,
				y : winHeight * 1 / 18,
				width : winWidth * 3 / 4,
				height : winHeight * 8 / 9,
                iconCls : 'user',
                shim : false,
                animCollapse : true,
                constrainHeader : true,
                layout : 'fit',
                items : grid
            });

			grid.getStore().load({
	            params : {
	                start : 0,
	                limit : 18
	            }
    		});
        }
        win.show();
	}
})
