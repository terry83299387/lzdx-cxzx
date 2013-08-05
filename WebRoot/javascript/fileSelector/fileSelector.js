var FileSeletor = function(fileWinId,sourceId,fileSelectedFunc) {

//	var fileWinId = sourceId + "-file-win"
	var filePanelid = sourceId + '-file-panel';
	
	if(Ext.getCmp(fileWinId))
	{
		Ext.getCmp(fileWinId).show();
		return ;
	}
	
	var picDefaultPath=document.getElementById(sourceId);
	
	
	var filePanel = new Ext.Template.TemplateRemoteFilePanel({

				remoteFileId : sourceId,
				clusterIp : window.location.hostname,
				currentPath : "/homefiles",
				workdir : "/homefiles",
				defaultdir : "/homefiles",
				fileSelectedFunc: fileSelectedFunc,
				id : filePanelid,
				fileWinId : fileWinId,

				// id : 'FormPanel',

				layout : 'fit',
				autoScroll : true,
				selectionMode : false,
				beforeClosedFunction : null

			});

	var fileGrid = Ext.ux.Util.getFileGrid(fileWinId);
	var windowwidth = Ext.lib.Dom.getViewWidth();

	var windowheight = Ext.lib.Dom.getViewHeight();

	var desktop = app.getDesktop();
	var win = desktop.createWindow({
		id : fileWinId,
		title : i18n.title_filemanage,
		frame : true,
		layout : 'fit',
		width : windowwidth * 3 / 5,
		height : windowheight * 3 / 4,
		iconCls : 'icon-grid',
		// autoScroll : true,
		shim : false,
		animCollapse : false,
		constrainHeader : true,
		items : [fileGrid],
		listeners : {

			'activate' : function() {
//				document.getElementById('mce-modal-block').style.visibility = "hidden";
//				 document.getElementById(fileWinId).style.zIndex='65537';
			},
			'close' : function() {
//				if (document.getElementById('mce-modal-block')) {
//					document.getElementById('mce-modal-block').style.visibility = "visible";
//				}
			}

		}
	})
	// }
	// win.maximize();
	win.show();

	FileMngGlobal.registeredToGlobalFileWindow(filePanel, win, null, null);
	filePanel.firstLoad();
}


var TinymceFileSeletor = function(editor,path,defaultEditorHandler,defaultInsertContent) {
	var sourceId=editor.id;
	var fileWinId = sourceId + "-file-win";
	var filePanelid = sourceId + '-file-panel';
	
	if(Ext.getCmp(fileWinId))
	{
		Ext.getCmp(fileWinId).show();
		return ;
	}
	
	var filePanel = new Ext.Template.TinymceRemoteFilePanel({

				editor : editor,
				defaultEditorHandler:defaultEditorHandler,
				fileSelectedFunc:defaultInsertContent,
				clusterIp : window.location.hostname,
				currentPath : "/homefiles",
				workdir : "/homefiles",
				defaultdir : "/homefiles",
				id : filePanelid,
				fileWinId : fileWinId,

				// id : 'FormPanel',
				layout : 'fit',
				autoScroll : true,
				selectionMode : true,
				beforeClosedFunction : null

			});

	var fileGrid = Ext.ux.Util.getFileGrid(fileWinId);
	var windowwidth = Ext.lib.Dom.getViewWidth();

	var windowheight = Ext.lib.Dom.getViewHeight();

	var desktop = app.getDesktop();
	var win = desktop.createWindow({
		id : fileWinId,
		title : i18n.title_filemanage,
		frame : true,
		layout : 'fit',
		width : windowwidth * 3 / 5,
		height : windowheight * 3 / 4,
		iconCls : 'icon-grid',
		// autoScroll : true,
		shim : false,
		animCollapse : false,
		constrainHeader : true,
		items : [fileGrid],
		listeners : {
	
			'activate' : function() {
//				document.getElementById('mce-modal-block').style.visibility = "hidden";
//				 document.getElementById(fileWinId).style.zIndex='65537';
			},
			'close' : function() {
//				if (document.getElementById('mce-modal-block')) {
//					document.getElementById('mce-modal-block').style.visibility = "visible";
//				}
			}

		}
	})
	// }
	// win.maximize();
	win.show();

	FileMngGlobal.registeredToGlobalFileWindow(filePanel, win, null, null);
	filePanel.firstLoad(path);
}