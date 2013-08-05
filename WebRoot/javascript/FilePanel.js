/*******************************************************************************
 * added by yyliu on 2010-3-3
 * 
 * @function Ext.Desktop.FilePanel :
 * @description file management module.
 * 
 * added by yyliu on 2010-3-25
 * @function JobDetailFilePanel :
 * @description job file management module
 * 
 * added by yyliu on 2010-4-20
 * @function TemplateWorkingDirFilePanel :
 * @description template work dir file management module
 */

Ext.Desktop.FilePanel = function(config) {

	this.defaultdir = config.workdir;

	Ext.Desktop.FilePanel.superclass.constructor.call(this, config);
	Ext.QuickTips.init();

}

Ext.Template.TemplateRemoteFilePanel = function(config) {

	// TODO by qiaomingkui 20130327
	// this.beforeClosedFunction = config.beforeClosedFunction;
	this.fileSelectedFunc = config.fileSelectedFunc;
	this.workDirSelectedFun = config.workDirSelectedFun;

	this.selectionMode = config.selectionMode;
	this.remoteTextFieldId = config.remoteFileId;

	this.host = config.clusterIp;

	this.currentdir = config.currentPath;

	this.workdir = config.workdir;
	this.defaultdir = config.defaultdir;

	this.fileWinId = config.fileWinId;
	this.defaultfile = '';
	var remoteFilePath = Ext.get(this.remoteTextFieldId);
	if (remoteFilePath && remoteFilePath.dom.value != '') {
		this.currentdir = this.getFilePath(remoteFilePath.dom.value);
		this.defaultdir = this.currentdir;
		this.defaultfile = this.getFileName(remoteFilePath.dom.value);
		config.currentdir = this.currentdir;
		config.defaultdir = this.defaultdir;
		config.defaultfile = this.defaultfile;
	}
	Ext.Template.TemplateRemoteFilePanel.superclass.constructor.call(this,
			config);
	Ext.QuickTips.init();

};

Ext.Template.TinymceRemoteFilePanel = function(config) {

	// TODO by qiaomingkui 20130327
	// this.beforeClosedFunction = config.beforeClosedFunction;

	Ext.Template.TemplateRemoteFilePanel.superclass.constructor.call(this,
			config);
	Ext.QuickTips.init();

};

var filePanel_1 = {};
Ext.apply(filePanel_1, fileSupport, {
	initComponent : function() {
		// Ext.Desktop.FilePanel.superclass.initComponent.call(this);
		this.limited = FileMngGlobal.pagesLimited;

		this.host = this.hostIp;
		// this.currentdir = this.workdir;

		this.backwardrecords = [];
		this.forwardrecords = [];
		Ext.Ajax.timeout = 900000;

		this.rightClick = new Ext.menu.Menu({
					id : this.fileWinId + 'rightClickCont',
					items : [{
								id : this.fileWinId + 'menu_open',
								handler : this.open,
								scope : this,
								text : i18n.menu_open
							}, {
								id : this.fileWinId + 'menu_refresh',
								handler : this.refresh.createDelegate(this, [{
													focus : true
												}]),
								text : i18n.btn_refresh
							},  '-', {
								text : i18n.menu_new,
								id : this.fileWinId + 'menu_new',
								menu : [{
									id : this.fileWinId + 'menu_newfolder',
									text : i18n.menu_newfolder,
									handler : this.newfolder
											.createDelegate(this)

								}, {
									id : this.fileWinId + 'menu_newfile',
									text : i18n.menu_newfile,
									handler : this.newfile.createDelegate(this)
								}],
								listeners : {
									click : function(e) {
										Ext.ux.Util
												.fixExtBugOfPreventDefaultWithIE(e)
									}
								}
							},

							'-', {
								id : this.fileWinId + 'menu_copy',
								handler : this.copy.createDelegate(this),
								text : i18n.menu_copy
							}, {
								id : this.fileWinId + 'menu_cut',
								handler : this.cut.createDelegate(this),
								text : i18n.menu_cut
							}, {
								id : this.fileWinId + 'menu_paste',
								handler : this.paste.createDelegate(this),
								text : i18n.menu_paste
							}, '-', {
								id : this.fileWinId + 'menu_zip',
								handler : this.zip.createDelegate(this),
								text : i18n.menu_zip
							}, {
								id : this.fileWinId + 'menu_unzip',
								handler : this.unzip.createDelegate(this),
								text : i18n.menu_unzip
							}, '-', {
								id : this.fileWinId + 'menu_upload',
								handler : this.upload.createDelegate(this),
								text : i18n.menu_upload
							}, {
								id : this.fileWinId + 'menu_download',
								handler : this.download.createDelegate(this),
								text : i18n.menu_download
							}, '-', {
								id : this.fileWinId + 'menu_delete',
								handler : this.del.createDelegate(this),
								text : i18n.menu_delete
							}, {
								id : this.fileWinId + 'menu_rename',
								handler : this.rename.createDelegate(this),
								text : i18n.menu_rename
							}, '-', {
								id : this.fileWinId + 'tb_properties',
								text : i18n.menu_properties,
								handler : this.properties.createDelegate(this)
							}]
				});
		var rightClick = this.rightClick;
		var newworkdir = "";
		var scope = this;

		// this.backwardrecords.push(this.workdir);
		var currentdir = this.currentdir;

		var filename = null;

		var filepath = null;

		var rIndex = 0;
		var spath = null;
		var ctpath = "", newname = "";

		// toolbar
		var tb_newfile = new Ext.menu.Menu({

					items : [{
								id : this.fileWinId + 'tb_newfile',
								text : i18n.menu_newfile,
								icon : "images/Menus/09.gif",
								handler : this.newfile.createDelegate(this)
							}, {
								id : this.fileWinId + 'tb_newfolder',
								text : i18n.menu_newfolder,
								icon : "images/Menus/29.gif",
								handler : this.newfolder.createDelegate(this)
							}]
				});
		var tb1 = new Ext.Toolbar({
			height : 30,
			width : "100%",
			region : 'center',
			autoScroll : true,
			items : [{
				text : i18n.tb_file,
				id : this.fileWinId + 'tb_file',
				iconCls : "hd_001",
				menu : new Ext.menu.Menu({
					items : [{
								id : this.fileWinId + 'tb_open',
								text : i18n.menu_open,
								icon : "images/Menus/02.gif",
								handler : this.open.createDelegate(this)
							}, {
								text : i18n.menu_new,
								icon : "images/Menus/04.gif",
								menu : tb_newfile,
								listeners : {
									click : function(e) {
										Ext.ux.Util
												.fixExtBugOfPreventDefaultWithIE(e)
									}
								}

							}, '-', {
								id : this.fileWinId + 'tb_delete',
								text : i18n.menu_delete,
								handler : this.del.createDelegate(this)
							}, {
								id : this.fileWinId + 'tb_properties',
								text : i18n.menu_properties,
								handler : this.properties.createDelegate(this)
							}]
				})
			}, {
				text : i18n.tb_edit,
				id : this.fileWinId + 'tb_edit',
				iconCls : "hd_002",
				menu : new Ext.menu.Menu({
							items : [{
										id : this.fileWinId + 'tb_copy',
										text : i18n.menu_copy,
										icon : "images/Menus/09.gif",
										handler : this.copy
												.createDelegate(this)
									}, {
										id : this.fileWinId + 'tb_paste{1}',
										text : i18n.menu_paste,
										icon : "images/Menus/10.gif",
										handler : this.paste
												.createDelegate(this)

									}, {
										id : this.fileWinId + 'tb_cut',
										text : i18n.menu_cut,
										handler : this.cut.createDelegate(this)
									}, '-', {
										id : this.fileWinId + 'tb_allselect',
										text : i18n.menu_selectall,
										handler : this.allselect
												.createDelegate(this)
									}]
						})
			}, {
				text : i18n.tb_transfer,
				id : this.fileWinId + 'tb_transfer',
				iconCls : "hd_003",
				menu : new Ext.menu.Menu({
							items : [{
										id : this.fileWinId + 'tb_upload{1}',
										text : i18n.menu_upload,
										icon : "images/Menus/11.gif",
										handler : this.upload
												.createDelegate(this)
									}, {
										id : this.fileWinId + 'tb_download{1}',
										text : i18n.menu_download,
										icon : "images/Menus/12.gif",
										handler : this.download
												.createDelegate(this)
									}]
						})
			}, {
				text : i18n.tb_tool,
				id : this.fileWinId + 'tb_tool',
				iconCls : "hd_004",
				menu : new Ext.menu.Menu({
							items : [{
										id : this.fileWinId + 'tb_zip',
										text : i18n.menu_zip,
										icon : "images/Menus/13.gif",
										handler : this.zip.createDelegate(this)
									}, {
										id : this.fileWinId + 'tb_unzip',
										text : i18n.menu_unzip,
										icon : "images/Menus/14.gif",
										handler : this.unzip
												.createDelegate(this)
									}]
						})
			}, {
				text : i18n.tb_keyhelp,
				iconCls : "hd_005",
				// menu : new Ext.menu.Menu({
				// items : [{
				// id : this.fileWinId
				// + 'tb_about',
				// text : i18n.menu_about,
				// icon : "images/Menus/15.gif",
				// handler : this.about,
				// scope : this
				// }, {
				// id : this.fileWinId + 'tb_help',
				// text : i18n.menu_help,
				// icon : "images/Menus/16.gif",
				// handler : this.help,
				// scope : this
				// }]
				// }),
				handler : this.help,
				scope : this

			}]
		});

		var tb2 = new Ext.Toolbar({
					height : 30,
					width : "100%",
					region : 'center',
					autoScroll : true,
					items : [{

								id : this.fileWinId + 'tb_backward',
								text : i18n.tb_backward,
								iconCls : "hd_006",
								handler : this.backward.createDelegate(this),
								disabled : true

							}, {
								id : this.fileWinId + 'tb_forward',
								text : i18n.tb_forward,
								iconCls : "hd_007",
								handler : this.forward.createDelegate(this),
								disabled : true
							}, {
								id : this.fileWinId + 'tb_upward',
								text : i18n.btn_up,
								iconCls : "hd_008",
								handler : this.upward.createDelegate(this)

							}, {
								id : this.fileWinId + 'tb_refresh',
								text : i18n.btn_refresh,
								iconCls : "hd_009",
								handler : this.refresh.createDelegate(this, [{
													focus : true
												}])
							}, {
								id : this.fileWinId + 'tb_new',
								text : i18n.menu_new,
								iconCls : "hd_021",
								menu : tb_newfile
							}, {
								id : this.fileWinId + 'tb_paste',
								text : i18n.menu_paste,
								iconCls : "hd_022",
								handler : this.paste.createDelegate(this)
							}, {
								id : this.fileWinId + 'tb_upload',
								text : i18n.menu_upload,
								tooltip : i18n.menu_upload,
								// tooltipType : "title",
								iconCls : "hd_upload",
								handler : this.upload.createDelegate(this)
							}, {
								id : this.fileWinId + 'tb_download',
								text : i18n.menu_download,
								// tooltip : i18n.menu_download,
								// tooltipType : "title",
								iconCls : "hd_download",
								handler : this.download.createDelegate(this)
							}]
				});
		var tb3 = new Ext.Toolbar({
			height : 30,
			region : 'center',
			width : '100%',
			items : [i18n.lab_url, new Ext.form.TextField({
								id : this.fileWinId + 'txt_url',
								width : '100%',
								value : this.workdir,
								listeners : {
									specialkey : function(field, e) {
										if (e.getKey() == Ext.EventObject.ENTER) {

											// this.grid.getSelectionModel().clearSelections(true);
											this.showUrl();
										}
									}.createDelegate(this)
								}
							}), new Ext.Button({
								id : this.fileWinId + 'btn_url',
								icon : "./images/file/go.png",
								tooltip : i18n.menu_go_url,
								tooltipType : "title",
								cls : "x-btn-text-icon",
								handler : this.showUrl.createDelegate(this)
							})],
			afterRender : function() {
				Ext.Toolbar.prototype.afterRender.apply(this, arguments);
				var pn = Ext.getCmp(scope.fileWinId + 'txt_url').getEl();
				pn.dom.parentNode.style.width = '100%';

			}
		});

		// init the toolbar
		var key = this.host + "," + this.currentdir;
		var ds = this.getMyStore(key, null, 0);
		this.ds = ds;

		// init the toolbar

		var cm = new Ext.grid.ColumnModel({

			columns : [{
				header : i18n.col_filename,
				dataIndex : 'name',
				id : this.fileWinId + 'column_name',
				hideable : false,
				width : 150,
				sortable : true,
				editable : false,
				renderer : Ext.ux.Util.renderFileNameColor,
				editor : new Ext.form.TextField({
							id : this.fileWinId + 'txtFileName',
							allowBlank : false,
							blankText : i18n.val_filenamenotnull,
							invalidText : i18n.val_filenamenotnull,
							regex : this.regex,
							regexText : i18n.val_fileformaterror,
							maxLength : 100,
							validator : function(text) {
								if (this.allowBlank == false
										&& Ext.util.Format.trim(text).length == 0)
									return false;
								else
									return true;
							}

						})
			}, {
				header : i18n.col_filetype,
				dataIndex : 'type',
				sortable : true,
				renderer : Ext.ux.Util.formatType

			}, {
				header : i18n.col_filesize,
				// width : 100,
				dataIndex : 'size',
				sortable : true,
				renderer : Ext.ux.Util.formatSize
			}, {
				header : i18n.col_filelastmodified,
				sortable : true,
				// width : 200,
				dataIndex : 'lastModified'
			}, {
				header : i18n.file_title_preview,
				sortable : true,
				dataIndex : 'currentPath',
				renderer : Ext.ux.Util.formatReview
			}]
		});

		var taskbarEl = Ext.get('ux-taskbar');

		/* ================ definde grid ================= */
		var grid = new Ext.grid.EditorGridPanel({
					// bodyStyle : 'width:100%',
					filePanelId : this.id,
					id : this.fileWinId + 'FileGrid',
					// clicksToEdit : 5,
					editable : false,
					// region : 'center',
					autoHeight : false,
					autoWidth : true,
					// width : Ext.lib.Dom.getViewWidth() * 3 / 4,
					// height : Ext.lib.Dom.getViewHeight() -
					// taskbarEl.getHeight(),
					autoScroll : true,
					// frame : true,
					// viewConfig : {
					// forceFit : true
					// },
					enableDragDrop : true,
					ddGroup : 'mygrid',
					dropConfig : {
						appendOnly : true
					},
					// ddText : "{0} selected row{1} to move",

					viewConfig : {
						forceFit : true
						// ,
						// /**
						// * words can be select on grid cell just for Firefox
						// */
						// templates : {
						// cell : new Ext.Template(
						// '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id}
						// x-selectable {css}" style="{style}" tabIndex="0"
						// {cellAttr}>',
						// '<div class="x-grid3-cell-inner x-grid3-col-{id}"
						// {attr}>{value}</div>',
						// '</td>')
						// }
					},
					region : 'center',
					cm : cm,
					store : ds,
					loadMask : {
						msg : i18n.mask_wait
					},
					sm : new Ext.grid.RowSelectionModel(),
					// monitorResize : true,
					tbar : [],
					listeners : {
						// click : function(e) {
						// var sels = grid.getSelectionModel().getSelections();
						// if (sels.length == 1 && this.editing) {
						// /** don't prevent browser default right click menu */
						// return;
						// } else {
						// scope.getWinCmp().focus(true);
						// }
						// // scope.click(e);
						// },
						//				
						// rowmousedown:function(e)
						// {
						// alert('1');
						// scope.getWinCmp().focus(true);
						// },
						// contextmenu : function(e) {
						// // scope.contextMenu(e);
						// // return;
						// var sels = grid.getSelectionModel().getSelections();
						//
						// if (sels.length == 1 && this.editing) {
						// // don't prevent browser default right click menu
						// return;
						// }
						//
						// e.preventDefault();
						// rightClick.showAt(e.getXY());
						//
						// if (scope.errormark == true) {
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', false);
						// scope.setComponetStatus('menu_newfolder', false);
						// scope.setComponetStatus('menu_newfile', false);
						// scope.setComponetStatus('menu_copy', false);
						// scope.setComponetStatus('menu_cut', false);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', false);
						// scope.setComponetStatus('menu_unzip', false);
						// scope.setComponetStatus('menu_upload', false);
						// scope.setComponetStatus('menu_download', false);
						// scope.setComponetStatus('menu_delete', false);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						// scope.setComponetStatus('menu_md5', false);
						// return;
						//
						// }
						//
						// if (sels.length == 0) {
						//
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', true);
						// scope.setComponetStatus('menu_newfolder', true);
						// scope.setComponetStatus('menu_newfile', true);
						// scope.setComponetStatus('menu_copy', false);
						// scope.setComponetStatus('menu_cut', false);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', false);
						// scope.setComponetStatus('menu_unzip', false);
						// scope.setComponetStatus('menu_upload', true);
						// scope.setComponetStatus('menu_download', false);
						// scope.setComponetStatus('menu_delete', false);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						// scope.setComponetStatus('menu_md5', false);
						//						
						//
						// }
						// if (FileMngGlobal.filePasteShares.pasteflag == "cut"
						// || FileMngGlobal.filePasteShares.pasteflag == "copy")
						// {
						//						
						// scope.setComponetStatus('menu_paste', true);
						//						
						// } else {
						// scope.setComponetStatus('menu_paste', false);
						//						
						// }
						//
						// },
						// rowdblclick : function(grid, rowindex, e) {
						// scope.resetCellClick();
						// grid.getColumnModel().setEditable(0, false);
						// this.open();
						// // scope.rowdblclick(grid, rowindex, e);
						// }.createDelegate(this),
						// rowcontextmenu : function(grid, rowIndex, e) {
						//
						// // scope.rowContextMenu(grid, rowIndex, e);
						// // return;
						// var sels = grid.getSelectionModel().getSelections();
						//
						// if (sels.length == 1 && this.editing) {
						//
						// return;
						// }
						//
						// // testRightClick.items.items[0].disable();
						//
						// e.preventDefault();
						// rightClick.showAt(e.getXY());
						//
						// if (scope.errormark == true) {
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', false);
						// scope.setComponetStatus('menu_newfolder', false);
						// scope.setComponetStatus('menu_newfile', false);
						// scope.setComponetStatus('menu_copy', false);
						// scope.setComponetStatus('menu_cut', false);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', false);
						// scope.setComponetStatus('menu_unzip', false);
						// scope.setComponetStatus('menu_upload', false);
						// scope.setComponetStatus('menu_download', false);
						// scope.setComponetStatus('menu_delete', false);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						// scope.setComponetStatus('menu_md5', false);
						//
						// return;
						//
						// }
						//
						// // check whether to select new row
						// var isnewrow = true;
						// for (var i = 0; i < sels.length; i++) {
						// if (sels[i] == this.store.getAt(rowIndex)) {
						// isnewrow = false;
						// break;
						// }
						// }
						// if (isnewrow) {
						// grid.getSelectionModel().selectRow(rowIndex);
						// }
						// sels = grid.getSelectionModel().getSelections();
						//				
						// if (sels.length > 1) {
						//
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', true);
						// scope.setComponetStatus('menu_newfolder', true);
						// scope.setComponetStatus('menu_newfile', true);
						// scope.setComponetStatus('menu_copy', true);
						// scope.setComponetStatus('menu_cut', true);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', true);
						// scope.setComponetStatus('menu_unzip', true);
						// scope.setComponetStatus('menu_upload', true);
						// scope.setComponetStatus('menu_download', true);
						// scope.setComponetStatus('menu_delete', true);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						// scope.setComponetStatus('menu_md5', false);
						//
						// for (var i = 0; i < sels.length; i++) {
						// var type = sels[i].get('type');
						// var name = sels[i].get('name');
						// if (type != 0
						// || (name.toLowerCase().lastIndexOf('.rar') == -1
						// && name.toLowerCase()
						// .lastIndexOf('.tar') == -1
						// && name.toLowerCase()
						// .lastIndexOf('.tar.gz') == -1 && name
						// .toLowerCase().lastIndexOf('.zip') == -1)) {
						//							
						// scope.setComponetStatus('menu_unzip', false);
						//								
						// break;
						// }
						// }
						//
						//
						//
						// } else if (sels.length == 1) {
						// scope.setComponetStatus('menu_open', true);
						// scope.setComponetStatus('menu_tail', true);
						// scope.setComponetStatus('menu_new', true);
						// scope.setComponetStatus('menu_newfolder', true);
						// scope.setComponetStatus('menu_newfile', true);
						// scope.setComponetStatus('menu_copy', true);
						// scope.setComponetStatus('menu_cut', true);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', true);
						// scope.setComponetStatus('menu_unzip', true);
						// scope.setComponetStatus('menu_upload', true);
						// scope.setComponetStatus('menu_download', true);
						// scope.setComponetStatus('menu_delete', true);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', true);
						// scope.setComponetStatus('menu_rename', true);
						// scope.setComponetStatus('menu_md5', true);
						// scope.setComponetStatus('menu_unzip', true);
						// scope.setComponetStatus('menu_md5', true);
						//
						// filename = grid.getSelections()[0].get('name');
						//						
						// var type = grid.getSelections()[0].get('type');
						//
						//						
						// if(type != 0)
						// {
						// scope.setComponetStatus('menu_md5', false);
						// }
						// else
						// {
						// if (filename.toLowerCase().lastIndexOf('.rar') == -1
						// && filename.toLowerCase()
						// .lastIndexOf('.tar') == -1
						// && filename.toLowerCase()
						// .lastIndexOf('.tar.gz') == -1 && filename
						// .toLowerCase().lastIndexOf('.zip') == -1) {
						//
						// scope.setComponetStatus('menu_unzip', false);
						// }
						//						
						// }
						//						
						// } else if (sels.length == 0) {
						//
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', true);
						// scope.setComponetStatus('menu_newfolder', true);
						// scope.setComponetStatus('menu_newfile', true);
						// scope.setComponetStatus('menu_copy', false);
						// scope.setComponetStatus('menu_cut', false);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', false);
						// scope.setComponetStatus('menu_unzip', false);
						// scope.setComponetStatus('menu_upload', true);
						// scope.setComponetStatus('menu_download', false);
						// scope.setComponetStatus('menu_delete', false);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						// scope.setComponetStatus('menu_md5', false);
						// }
						//
						// if (FileMngGlobal.filePasteShares.pasteflag == "cut"
						// || FileMngGlobal.filePasteShares.pasteflag == "copy")
						// {
						// scope.setComponetStatus('menu_paste', true);
						//						
						// } else {
						// scope.setComponetStatus('menu_paste', false);
						//						
						// }
						//
						// },
						//				
						// // rowclick: function(grid, rowIndex, columnIndex, e)
						// // {
						// // scope.rowClick(grid, rowIndex, columnIndex, e);
						// // }
						// // ,
						'render' : function() {
							tb1.render(grid.tbar);
							tb2.render(grid.tbar);
							tb3.render(grid.tbar);
							scope.gridDragDrop();
						}
					},

					bbar : scope.getPagingToolBarInstance(ds, true)
				});

		this.grid = grid;

		// grid.on('validateedit', validateedit, grid);
		// function validateedit(e) {
		// alert('validateedit')
		// }
		// grid.on('beforeEdit', beforeEdit, grid);
		// function beforeEdit(e) {
		// alert('beforeEdit')
		// }
		//	
		grid.on('click', this.click.createDelegate(this), grid);
		grid.on('rowdblclick', this.rowdblclick.createDelegate(this), grid);
		grid.on('contextmenu', this.contextmenu.createDelegate(this), grid);
		grid.on('rowcontextmenu', this.rowcontextmenu.createDelegate(this),
				grid);
		grid.on('cellclick', this.cellclick.createDelegate(this), grid);// ==
		grid.on('afteredit', this.afteredit.createDelegate(this), grid);
		grid.addListener('rowclick', this.rowclick.createDelegate(this));

		// grid.addListener('cellclick',
		// cellclick);

		// scope.click(e);
		// Click

		// grid.addListener('click', this.click.createDelegate(this));

		this.add(grid);
		// alert(this.grid.id);

		grid.store.on("load", function() {

					var key = scope.packetKey(scope.host, scope.currentdir);
					var existedValue = scope.getData(key);
					if (existedValue) {
						if (!this.init) {
							// alert(1008);
							this.init = true;
							scope.firePagingToolBar(0, 1, existedValue.length);

						}
					}
					existedValue = null;
					scope.initStatus(scope.currentdir);
				});

	}

});

Ext.extend(Ext.Desktop.FilePanel, Ext.Panel, filePanel_1);
/*******************************************************************************
 * 
 * 
 * 
 * 
 */

/*******************************************************************************
 * 
 * 
 * TemplateRemoteFilePanel
 * 
 */
var templateRemoteFilePanel_1 = {};
Ext.apply(templateRemoteFilePanel_1, fileSupport, {
	initComponent : function() {
		this.limited = FileMngGlobal.pagesLimited;
		// Ext.Desktop.jobdetailfilePanel_1.superclass.initComponent.call(this);
		this.backwardrecords = [];
		this.forwardrecords = [];
		Ext.Ajax.timeout = 900000;

		this.rightClick = new Ext.menu.Menu({
					id : this.fileWinId + 'rightClickCont',
					items : [{
								id : this.fileWinId + 'menu_confirm',
								handler : this.setSelectedFile,
								scope : this,
								text : i18n.confirm
							}, '-', {
								id : this.fileWinId + 'menu_open',
								handler : this.open,
								scope : this,
								text : i18n.menu_open
							}, {
								id : this.fileWinId + 'menu_refresh',
								handler : this.refresh.createDelegate(this, [{
													focus : true
												}]),
								text : i18n.btn_refresh
							}, '-', {
								id : this.fileWinId + 'menu_new',
								text : i18n.menu_new,
								menu : [{
									id : this.fileWinId + 'menu_newfolder',
									text : i18n.menu_newfolder,
									handler : this.newfolder
											.createDelegate(this)

								}, {
									id : this.fileWinId + 'menu_newfile',
									text : i18n.menu_newfile,
									handler : this.newfile.createDelegate(this)
								}],
								listeners : {
									click : function(e) {
										Ext.ux.Util
												.fixExtBugOfPreventDefaultWithIE(e)
									}
								}
							},

							'-', {
								id : this.fileWinId + 'menu_copy',
								handler : this.copy.createDelegate(this),
								text : i18n.menu_copy
							}, {
								id : this.fileWinId + 'menu_cut',
								handler : this.cut.createDelegate(this),
								text : i18n.menu_cut
							}, {
								id : this.fileWinId + 'menu_paste',
								handler : this.paste.createDelegate(this),
								text : i18n.menu_paste
							}, '-', {
								id : this.fileWinId + 'menu_zip',
								handler : this.zip.createDelegate(this),
								text : i18n.menu_zip
							}, {
								id : this.fileWinId + 'menu_unzip',
								handler : this.unzip.createDelegate(this),
								text : i18n.menu_unzip
							}, '-', {
								id : this.fileWinId + 'menu_upload',
								handler : this.upload.createDelegate(this),
								text : i18n.menu_upload
							}, {
								id : this.fileWinId + 'menu_download',
								handler : this.download.createDelegate(this),
								text : i18n.menu_download
							}, '-', {
								id : this.fileWinId + 'menu_delete',
								handler : this.del.createDelegate(this),
								text : i18n.menu_delete
							}, {
								id : this.fileWinId + 'menu_rename',
								handler : this.rename.createDelegate(this),
								text : i18n.menu_rename
							}, '-', {
								id : this.fileWinId + 'menu_properties',
								handler : this.properties.createDelegate(this),
								text : i18n.menu_properties
							}]
				});
		var rightClick = this.rightClick;
		var newworkdir = "";
		var scope = this;

		// this.backwardrecords.push(this.workdir);
		var currentdir = this.currentdir;

		// var upcount = 0;
		var filename = null;

		var filepath = null;
		// var backwardcount = 0, forwardcount = 0;

		// FileMngGlobal.filePasteShares.pasteflag = null;
		// var wardflag = 0;
		var rIndex = 0;
		var spath = null;
		var ctpath = "", newname = "";

		// toolbar
		var tb_newfile = new Ext.menu.Menu({

					items : [{
								id : this.fileWinId + 'tb_newfile',
								text : i18n.menu_newfile,
								icon : "images/Menus/09.gif",
								handler : this.newfile.createDelegate(this)
							}, {
								id : this.fileWinId + 'tb_newfolder',
								text : i18n.menu_newfolder,
								icon : "images/Menus/29.gif",
								handler : this.newfolder.createDelegate(this)
							}]
				});

		// var btnSure = new Ext.Panel({
		// id : this.fileWinId +'btnField' ,
		// layout : "column",
		// autoScroll : false,
		// width : 500,
		// bodyStyle : " background-color:
		// transparent;border:none;margin:0,0,0,0;padding:0,0,0,0;",
		// border : false,
		// defaults : {
		// layout : 'form'
		// },
		// items : [{
		//					
		// bodyStyle : " background-color: transparent;",
		// border : false,
		// items : new Ext.form.TextField({
		// //fieldLabel : i18n.lab_filename,
		// id : ID_SELECTED_WORKDIR,
		// value:this.defaultdir,
		// // labelStyle : "width:60;",
		// maxLength : 100,
		// labelWidth : 100,
		// width : 300
		//							
		// })
		// }, {
		// //width : '50',
		// border : false,
		// bodyStyle : " background-color: transparent;",
		// items : new Ext.Button({
		// id : 'btnSel',
		// width : 50,
		// text : i18n.btn_select,
		// handler : function() {
		//
		// this.setWorkDirValue();
		// Ext.getCmp(this.fileWinId).close();
		// },
		// scope : this
		// })
		// }]
		// });
		var tb1 = new Ext.Toolbar({
					height : 30,
					width : "100%",
					region : 'center',
					autoScroll : true,
					items : [

					{
								id : this.fileWinId + 'tb_new',
								text : i18n.menu_new,
								tooltip : i18n.menu_new,
								tooltipType : "title",
								iconCls : "hd_021",
								menu : tb_newfile
							}, {
								id : this.fileWinId + 'tb_paste',
								text : i18n.menu_paste,
								tooltip : i18n.menu_paste,
								tooltipType : "title",
								iconCls : "hd_022",
								handler : this.paste.createDelegate(this)
							}, {
								id : this.fileWinId + 'tb_upload',
								text : i18n.menu_upload,
								tooltip : i18n.menu_upload,
								// tooltipType : "title",
								iconCls : "hd_upload",
								handler : this.upload.createDelegate(this)
							}, {
								id : this.fileWinId + 'tb_download',
								text : i18n.menu_download,
								// tooltip : i18n.menu_download,
								// tooltipType : "title",
								iconCls : "hd_download",
								handler : this.download.createDelegate(this)
							}]
				});
		var tb2 = new Ext.Toolbar({
					height : 30,
					width : "100%",
					autoScroll : true,
					items : [' ', this.labelMame,
							// i18n.btn_job_defaultdir,
							// new Ext.form.TextField({
							// // fieldLabel : i18n.lab_filename,
							// id : this.fileWinId + 'workdir',
							// value : this.defaultdir,
							// readOnly : true,
							// // labelStyle : "width:60;",
							// maxLength : 100,
							// labelWidth : 100,
							// width : 250
							//
							// }), new Ext.Button({
							// id : this.fileWinId + 'btn_url',
							// icon :
							// "./images/file/go.png",
							// cls : "x-btn-text-icon",
							// handler : this.showWorkDir.createDelegate(this)
							// }),

							// i18n.lab_filename,

							new Ext.form.TextField({
										// fieldLabel : i18n.lab_filename,
										id : this.fileWinId + 'filename',
										value : this.defaultfile,
										readOnly : true,
										// allowBlank: false,
										// labelStyle : "width:60;",
										// maxLength : 100,
										width : '100%'

									}), ' ', new Ext.Button({
										id : this.fileWinId + 'btnSel',
										width : 50,
										icon : "images/icons/ok.png",
										cls : "x-btn-text-icon",
										text : i18n.template_file_select,
										disabled : true,
										// hidden:true,
										// visible:false,
										handler : function() {

											this.setSelectedFile();
										},
										scope : this
									}),

							// new Ext.Button({
							// id : 'btnSel',
							// width : 80,
							// text : i18n.btn_saveandexit,
							// handler : function() {
							//
							// //this.setWorkDirValue();
							//									
							// if(Ext.get(this.fileWinId +
							// 'filename').dom.value!='')
							// {
							// Ext.get(this.remoteTextFieldId).dom.value=(Ext.get(this.fileWinId
							// + 'workdir').dom.value+'/'+
							// Ext.get(this.fileWinId +
							// 'filename').dom.value);
							// }
							//									
							// Ext.getCmp(this.fileWinId).close();
							// },
							// scope : this
							// }),
							'  '

					],
					afterRender : function() {
						Ext.Toolbar.prototype.afterRender
								.apply(this, arguments);
						var pn = Ext.getCmp(scope.fileWinId + 'filename')
								.getEl();
						pn.dom.parentNode.style.width = '100%';

					}
				});
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
						handler : this.backward.createDelegate(this),
						disabled : true

					}, {
						id : this.fileWinId + 'tb_forward',
						// text : i18n.tb_forward,
						tooltip : i18n.tb_forward,
						tooltipType : "title",
						iconCls : "hd_007",
						handler : this.forward.createDelegate(this),
						disabled : true
					}, {
						id : this.fileWinId + 'tb_upward',
						// text : i18n.btn_up,
						tooltip : i18n.btn_up,
						tooltipType : "title",
						iconCls : "hd_008",
						handler : this.upward.createDelegate(this)

					}, {
						id : this.fileWinId + 'tb_refresh',
						// text : i18n.btn_refresh,
						tooltip : i18n.btn_refresh,
						tooltipType : "title",
						iconCls : "hd_009",
						handler : this.refresh.createDelegate(this, [{
											focus : true
										}])
					}, i18n.lab_url, new Ext.form.TextField({
								id : this.fileWinId + 'txt_url',
								width : '100%',
								value : this.defaultdir,
								listeners : {
									specialkey : function(field, e) {
										if (e.getKey() == Ext.EventObject.ENTER) {
											this.showUrl();
										}
									}.createDelegate(this)
								}
							}), new Ext.Button({
								id : this.fileWinId + 'btn_url',
								icon : "./images/file/go.png",
								tooltip : i18n.menu_go_url,
								tooltipType : "title",
								cls : "x-btn-text-icon",
								handler : this.showUrl.createDelegate(this)
							}), new Ext.Button({
								id : this.fileWinId + 'btnWorkdirSel',
								width : 50,
								icon : "images/icons/ok.png",
								cls : "x-btn-text-icon",
								text : i18n.btn_changewd,
								// hidden:true,
								disabled : true,
								handler : function() {

									this.setWorkDirValue();
								},
								scope : this
							}), ' '],
			afterRender : function() {
				Ext.Toolbar.prototype.afterRender.apply(this, arguments);
				var pn = Ext.getCmp(scope.fileWinId + 'txt_url').getEl();
				pn.dom.parentNode.style.width = '100%';

			}
		});

		// init the toolbar

		var ds = this.getEmptyStore();
		this.ds = ds;

		// init the toolbar

		var cm = new Ext.grid.ColumnModel({

			columns : [{
				header : i18n.col_filename,
				dataIndex : 'name',
				id : this.fileWinId + 'column_name',
				hideable : false,
				width : 150,
				sortable : true,
				editable : false,
				renderer : Ext.ux.Util.renderFileNameColor,
				editor : new Ext.form.TextField({
							id : this.fileWinId + 'txtFileName',
							allowBlank : false,
							blankText : i18n.val_filenamenotnull,
							invalidText : i18n.val_filenamenotnull,
							regex : this.regex,
							regexText : i18n.val_fileformaterror,
							maxLength : 100,
							validator : function(text) {
								if (this.allowBlank == false
										&& Ext.util.Format.trim(text).length == 0)
									return false;
								else
									return true;
							}

						})
			}, {
				header : i18n.col_filetype,
				dataIndex : 'type',
				sortable : true,
				renderer : Ext.ux.Util.formatType

			}, {
				header : i18n.col_filesize,
				// width : 100,
				dataIndex : 'size',
				sortable : true,
				renderer : Ext.ux.Util.formatSize
			}, {
				header : i18n.col_filelastmodified,
				sortable : true,
				// width : 200,
				dataIndex : 'lastModified'
			}, {
				header : i18n.file_title_preview,
				sortable : true,
				dataIndex : 'currentPath',
				renderer : Ext.ux.Util.formatReview
			}]
		});

		var taskbarEl = Ext.get('ux-taskbar');

		/* ================ definde grid ================= */
		var grid = new Ext.grid.EditorGridPanel({
					// bodyStyle : 'width:100%',
					filePanelId : this.id,
					id : this.fileWinId + 'FileGrid',
					// clicksToEdit : 5,
					editable : false,
					// region : 'center',
					autoHeight : false,
					autoWidth : true,
					// width : Ext.lib.Dom.getViewWidth() * 3 / 4,
					// height : Ext.lib.Dom.getViewHeight() -
					// taskbarEl.getHeight(),
					autoScroll : true,
					// frame : true,
					// viewConfig : {
					// forceFit : true
					// },
					enableDragDrop : true,
					ddGroup : 'mygrid',
					dropConfig : {
						appendOnly : true
					},
					// ddText : "{0} selected row{1} to move",

					viewConfig : {
						forceFit : true
						// ,
						// /**
						// * words can be select on grid cell just for Firefox
						// */
						// templates : {
						// cell : new Ext.Template(
						// '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id}
						// x-selectable {css}" style="{style}" tabIndex="0"
						// {cellAttr}>',
						// '<div class="x-grid3-cell-inner x-grid3-col-{id}"
						// {attr}>{value}</div>',
						// '</td>')
						// }
					},
					region : 'center',
					cm : cm,
					store : ds,
					loadMask : {
						msg : i18n.mask_wait
					},
					sm : new Ext.grid.RowSelectionModel(),
					// monitorResize : true,
					tbar : [],
					listeners : {
						// click : function(e) {
						// var sels = grid.getSelectionModel().getSelections();
						// if (sels.length == 1 && this.editing) {
						// /** don't prevent browser default right click menu */
						// return;
						// } else {
						// scope.getWinCmp().focus(true);
						// }
						//
						// },
						// // rowmousedown:function(e)
						// // {
						// // alert('2');
						// // scope.getWinCmp().focus(true);
						// // },
						// contextmenu : function(e) {
						//
						// var sels = grid.getSelectionModel().getSelections();
						//
						// if (sels.length == 1 && this.editing) {
						// // don't prevent browser default right click menu
						// return;
						// }
						//
						// e.preventDefault();
						// rightClick.showAt(e.getXY());
						// if (scope.errormark == true) {
						// scope.setComponetStatus('menu_confirm', false);
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', false);
						// scope.setComponetStatus('menu_newfolder', false);
						// scope.setComponetStatus('menu_newfile', false);
						// scope.setComponetStatus('menu_copy', false);
						// scope.setComponetStatus('menu_cut', false);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', false);
						// scope.setComponetStatus('menu_unzip', false);
						// scope.setComponetStatus('menu_upload', false);
						// scope.setComponetStatus('menu_download', false);
						// scope.setComponetStatus('menu_delete', false);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						//
						// return;
						//
						// }
						// if (sels.length == 0) {
						// scope.setComponetStatus('menu_confirm', false);
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', true);
						// scope.setComponetStatus('menu_newfolder', true);
						// scope.setComponetStatus('menu_newfile', true);
						// scope.setComponetStatus('menu_copy', false);
						// scope.setComponetStatus('menu_cut', false);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', false);
						// scope.setComponetStatus('menu_unzip', false);
						// scope.setComponetStatus('menu_upload', true);
						// scope.setComponetStatus('menu_download', false);
						// scope.setComponetStatus('menu_delete', false);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						//
						// }
						// if (FileMngGlobal.filePasteShares.pasteflag == "cut"
						// || FileMngGlobal.filePasteShares.pasteflag == "copy")
						// {
						//
						// scope.setComponetStatus('menu_paste', true);
						//
						// } else {
						// scope.setComponetStatus('menu_paste', false);
						//
						// }
						//
						// },
						rowdblclick : function(grid, rowindex, e) {
							scope.resetCellClick();
							grid.getColumnModel().setEditable(0, false);

							var isFile = this.setSelectedFile();
							if (!isFile)
								this.open();
						}.createDelegate(this),
						// rowcontextmenu : function(grid, rowIndex, e) {
						//
						// var sels = grid.getSelectionModel().getSelections();
						//
						// if (sels.length == 1 && this.editing) {
						//
						// return;
						// }
						//
						// // testRightClick.items.items[0].disable();
						//
						// e.preventDefault();
						// rightClick.showAt(e.getXY());
						//
						// if (scope.errormark == true) {
						// scope.setComponetStatus('menu_confirm', false);
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', false);
						// scope.setComponetStatus('menu_newfolder', false);
						// scope.setComponetStatus('menu_newfile', false);
						// scope.setComponetStatus('menu_copy', false);
						// scope.setComponetStatus('menu_cut', false);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', false);
						// scope.setComponetStatus('menu_unzip', false);
						// scope.setComponetStatus('menu_upload', false);
						// scope.setComponetStatus('menu_download', false);
						// scope.setComponetStatus('menu_delete', false);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						//
						// return;
						//
						// }
						//
						// // check whether to select new row
						// var isnewrow = true;
						// for (var i = 0; i < sels.length; i++) {
						// if (sels[i] == this.store.getAt(rowIndex)) {
						// isnewrow = false;
						// break;
						// }
						// }
						// if (isnewrow) {
						// grid.getSelectionModel().selectRow(rowIndex);
						// }
						// sels = grid.getSelectionModel().getSelections();
						//
						// if (sels.length > 1) {
						// scope.setComponetStatus('menu_confirm', true);
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', true);
						// scope.setComponetStatus('menu_newfolder', true);
						// scope.setComponetStatus('menu_newfile', true);
						// scope.setComponetStatus('menu_copy', true);
						// scope.setComponetStatus('menu_cut', true);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', true);
						// scope.setComponetStatus('menu_unzip', true);
						// scope.setComponetStatus('menu_upload', true);
						// scope.setComponetStatus('menu_download', true);
						// scope.setComponetStatus('menu_delete', true);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						//
						// for (var i = 0; i < sels.length; i++) {
						// var type = sels[i].get('type');
						// var name = sels[i].get('name');
						//
						// if (type != 0) {
						// scope.setComponetStatus('menu_confirm', false);
						//
						// } else {
						// if (!scope.selectionMode) {
						// scope.setComponetStatus('menu_confirm',
						// false);
						// }
						//
						// if ((name.toLowerCase().lastIndexOf('.rar') == -1
						// && name.toLowerCase()
						// .lastIndexOf('.tar') == -1
						// && name.toLowerCase()
						// .lastIndexOf('.tar.gz') == -1 && name
						// .toLowerCase().lastIndexOf('.zip') == -1)) {
						//
						// scope
						// .setComponetStatus('menu_unzip',
						// false);
						//
						// }
						//
						// }
						// }
						//
						// } else if (sels.length == 1) {
						//
						// scope.setComponetStatus('menu_open', true);
						// scope.setComponetStatus('menu_tail', true);
						// scope.setComponetStatus('menu_new', true);
						// scope.setComponetStatus('menu_newfolder', true);
						// scope.setComponetStatus('menu_newfile', true);
						// scope.setComponetStatus('menu_copy', true);
						// scope.setComponetStatus('menu_cut', true);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', true);
						// scope.setComponetStatus('menu_unzip', true);
						// scope.setComponetStatus('menu_upload', true);
						// scope.setComponetStatus('menu_download', true);
						// scope.setComponetStatus('menu_delete', true);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', true);
						// scope.setComponetStatus('menu_rename', true);
						//
						// var filename = grid.getSelections()[0].get('name');
						// var type = grid.getSelections()[0].get('type');
						//
						// if (type == 0)
						// scope.setComponetStatus('menu_confirm', true);
						// else
						// scope.setComponetStatus('menu_confirm', false);
						//
						// if (type != 0
						// || (filename.toLowerCase().lastIndexOf('.rar') == -1
						// && filename.toLowerCase()
						// .lastIndexOf('.tar') == -1
						// && filename.toLowerCase()
						// .lastIndexOf('.tar.gz') == -1 && filename
						// .toLowerCase().lastIndexOf('.zip') == -1)) {
						//
						// scope.setComponetStatus('menu_unzip', false);
						//
						// } else {
						// scope.setComponetStatus('menu_unzip', true);
						//
						// }
						//
						// } else if (sels.length == 0) {
						// scope.setComponetStatus('menu_confirm', false);
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', true);
						// scope.setComponetStatus('menu_newfolder', true);
						// scope.setComponetStatus('menu_newfile', true);
						// scope.setComponetStatus('menu_copy', false);
						// scope.setComponetStatus('menu_cut', false);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', false);
						// scope.setComponetStatus('menu_unzip', false);
						// scope.setComponetStatus('menu_upload', true);
						// scope.setComponetStatus('menu_download', false);
						// scope.setComponetStatus('menu_delete', false);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						//
						// }
						//
						// if (FileMngGlobal.filePasteShares.pasteflag == "cut"
						// || FileMngGlobal.filePasteShares.pasteflag == "copy")
						// {
						// scope.setComponetStatus('menu_paste', true);
						//
						// } else {
						// scope.setComponetStatus('menu_paste', false);
						//
						// }
						//
						// },
						'render' : function() {

							tb2.render(grid.bbar);
							tb1.render(grid.tbar);
							tb3.render(grid.tbar);

							scope.gridDragDrop();
						}
					},

					// grid.addListener('afterRender',afterrender);
					// function afterrender(){
					// var ddrow = new
					// Ext.dd.DropTarget(grid.getView().mainBody, {
					// ddGroup : 'mygrid',
					// notifyDrop : function(dd, e, data){
					// var sm = grid.getSelectionModel();
					// var rows = sm.getSelections();
					// var cindex = dd.getDragData(e).rowIndex;
					// if (sm.hasSelection()) {
					// for (i = 0; i < rows.length; i++) {
					// store.remove(store.getById(rows[i].id));
					// store.insert(cindex,rows[i]);
					// }
					// sm.selectRecords(rows);
					// }
					// }
					// });
					// }
					bbar : scope.getPagingToolBarInstance(ds, true)
				});

		this.grid = grid;

		// grid.on('validateedit', validateedit, grid);
		// function validateedit(e) {
		// alert('validateedit')
		// }
		// grid.on('beforeEdit', beforeEdit, grid);
		// function beforeEdit(e) {
		// alert('beforeEdit')
		// }
		//	

		function checkConfirm() {
			var sels = grid.getSelectionModel().getSelections();
			var length = sels.length;
			if (length == 0) {
				scope.setComponetStatus('menu_confirm', false);
			} else {
				scope.setComponetStatus('menu_confirm', true);
				for (var i = 0; i < sels.length; i++) {
					var type = sels[i].get('type');
					var name = sels[i].get('name');

					if (type != 0) {
						scope.setComponetStatus('menu_confirm', false);
						break;
					} else {
						if (length > 1 && !scope.selectionMode) {
							scope.setComponetStatus('menu_confirm', false);
							break;
						}
					}
				}

			}
		}

		grid.on('click', this.click.createDelegate(this), grid);

		grid.on('contextmenu', function(e) {
					scope.contextmenu(e);
					checkConfirm();
					scope.checkCurrentFile();
				}, grid);
		grid.on('rowcontextmenu', function(grid, rowIndex, columnIndex, e) {
					scope.rowcontextmenu(grid, rowIndex, columnIndex, e);
					checkConfirm();
					scope.checkCurrentFile();
				}, grid);

		grid.on('afteredit', this.afteredit.createDelegate(this), grid);
		grid.on('cellclick', function(grid, rowIndex, columnIndex, e) {
					scope.checkCurrentFile();
					scope.cellclick(grid, rowIndex, columnIndex, e)
				}, grid);
		grid.addListener('rowclick', function(grid, rowIndex, columnIndex, e) {

					scope.rowclick(grid, rowIndex, columnIndex, e);

					scope.checkCurrentFile();
				});

		this.add(grid);

		this.beforeRefresh = function() {

		};

		this.execeptionRefresh = function() {
			var msg = i18n.template_create_workdir;
			Ext.MessageBox.show({
						title : i18n.prompt,
						msg : msg,
						buttons : Ext.Msg.YESNO,
						icon : Ext.Msg.WARNIN,
						scope : scope,
						fn : function(btn) {
							this.getWinCmp().focus(true);
							if (btn == 'yes') {
								// this.createDefaultFolder();
								this.createUrlPathFolder();
							}
						}
					});

		}

	},
	saveTemplateWorkFile : function(filePath) {
		if (Ext.get(this.fileWinId + 'filename').dom.value != '') {
			var remoteTextField = document
					.getElementById(this.remoteTextFieldId);
			remoteTextField.value = filePath;
			Ext.ux.Util.setCursorLast(remoteTextField);
			
		}
	},
	saveTemplateWorkDir : function() {
		// TODO by qiaomingkui 20130327
		// var templateWorkDirId = this.workingDirTextId;
		// var templateWorkDir = document.getElementById(templateWorkDirId);
		// templateWorkDir.value = Ext.get(this.fileWinId +
		// 'workdir').getValue();
		// Ext.ux.Util.setCursorLast(templateWorkDir);

		var workdir = Ext.get(this.fileWinId + 'workdir').getValue();
		this.workDirSelectedFun(workdir);
	},
	setWorkDirValue : function() {
		// var workDirSelected = Ext.getCmp(ID_SELECTED_WORKDIR).getValue();
		// Ext.getCmp(this.fileWinId + 'btnSel').setVisible(false);
		Ext.getCmp(this.fileWinId + 'btnWorkdirSel').disable();

		var value = this.currentdir;
		Ext.getCmp(this.fileWinId + 'workdir').setValue(value);

		Ext.get(this.fileWinId + "workdir").setStyle({
					background : 'white'
				});
		this.saveTemplateWorkDir();
	},

	getSelectedFile : function() {
		var sels = this.grid.getSelectionModel().getSelections();
		var selFileNames = '';
		var selFilePath = '';
		var value = this.currentdir;
		if (value.indexOf("/") == 0) {
			value = value.substring(1, value.length);
		}
		var count = 0;
		for (var i = 0; i < sels.length; i++) {

			if (sels[i].get('type') == 0) {
				if (count != 0) {
					selFileNames = selFileNames + ' ';
					selFilePath = selFilePath + '|';
				}
				selFileNames += '"' + sels[i].get('name') + '"';
				selFilePath += value + '/' + sels[i].get('name');
				count++;
			}

		}

		return {
			selFileNames : selFileNames,
			selFilePath : selFilePath,
			count : count
		}

	},
	showWorkDir : function() {
		var value = Ext.getCmp(this.fileWinId + "workdir").getValue();
		Ext.getCmp(this.fileWinId + 'txt_url').setValue(value);
		this.refresh({
					filepath : value
				});
	},
	setSelectedFile : function() {
		// var workDirSelected = Ext.getCmp(ID_SELECTED_WORKDIR).getValue();

		var fileSels = this.getSelectedFile();
		var selFileNames = fileSels.selFileNames;
		var selFilePath = fileSels.selFilePath;
//		if (selFilePath.indexOf("/") == 0) {
//			selFilePath = selFilePath.substring(1, selFilePath.length);
//		}
		var value = this.currentdir;

		if (selFileNames != '') {
			Ext.getCmp(this.fileWinId + 'filename').setValue(selFileNames);

			Ext.getCmp(this.fileWinId + "txt_url").setValue(value);
			Ext.getCmp(this.fileWinId + 'btnSel').disable();
			// Ext.getCmp(this.fileWinId + 'workdir').setValue(value);
			Ext.get(this.fileWinId + "txt_url").setStyle({
						background : 'white'
					});
		} else {
			return;
		}

		if (this.fileSelectedFunc) {
			this.fileSelectedFunc(selFilePath);
		} else {
			this.saveTemplateWorkFile(selFilePath);
		}

		Ext.getCmp(this.fileWinId).close();
		return true;
		// if(sels.length==1&&sels[0].get('type')==0)
		// {
		// var value=this.currentdir;
		// Ext.getCmp(this.fileWinId + "txt_url").setValue(this.currentdir);
		// Ext.getCmp(this.fileWinId +
		// 'filename').setValue(sels[0].get('name'));
		// Ext.getCmp(this.fileWinId + 'workdir').setValue(value);
		//	
		// Ext.get(this.fileWinId + "txt_url").setStyle({background: 'white'});
		// // Ext.getCmp(this.fileWinId + 'btnSel').setVisible(false);
		// Ext.getCmp(this.fileWinId + 'btnSel').disable();
		// this.saveTemplateWorkFile();
		// return true;
		// }
		// else
		// {
		// return false;
		// }

	},
	firstLoad : function() {
		
		var firstPath = this.defaultdir;

		var path = document.getElementById(this.remoteFileId).value;

		if (path != null) {
			path="/"+path;
			if (path.indexOf(this.workdir) == 0) {
				firstPath =  this.getFilePath(path);
			}

		}
			this.refresh({
						filepath : firstPath
					});
		
	},
	// showWorkDir : function() {
	// var value = Ext.getCmp(this.fileWinId + "workdir").getValue();
	// Ext.getCmp(this.fileWinId + 'txt_url').setValue(value);
	// this.refresh({
	// filepath : value
	// });
	// },
	checkCurrentFile : function() {
		var selFile = this.getSelectedFile();

		if (this.selectionMode) {
			// multiple selection.

			if (selFile.count == 0) {
				Ext.getCmp(this.fileWinId + 'filename').setValue('');
				Ext.getCmp(this.fileWinId + 'btnSel').disable();
			} else {
				Ext.getCmp(this.fileWinId + 'filename')
						.setValue(selFile.selFileNames);
				Ext.ux.Util.setCursorLast(document
						.getElementById(this.fileWinId + 'filename'));
				Ext.getCmp(this.fileWinId + 'btnSel').enable();
			}

		} else {
			if (selFile.count != 1) {
				Ext.getCmp(this.fileWinId + 'filename').setValue('');
				Ext.getCmp(this.fileWinId + 'btnSel').disable();
			} else {
				Ext.getCmp(this.fileWinId + 'filename')
						.setValue(selFile.selFileNames);
				Ext.ux.Util.setCursorLast(document
						.getElementById(this.fileWinId + 'filename'));
				Ext.getCmp(this.fileWinId + 'btnSel').enable();
			}
		}
	}
		// ,
		// createDefaultFolder:function()
		// {
		//	  
		//	  
		//	  
		//			
		//	
		// }
		//	

});

Ext.extend(Ext.Template.TemplateRemoteFilePanel, Ext.Panel,
		templateRemoteFilePanel_1);

var tinymceRemoteFilePanel_1 = {};
Ext.apply(tinymceRemoteFilePanel_1, fileSupport, {
	initComponent : function() {
		this.limited = FileMngGlobal.pagesLimited;
		// Ext.Desktop.jobdetailfilePanel_1.superclass.initComponent.call(this);
		this.backwardrecords = [];
		this.forwardrecords = [];
		Ext.Ajax.timeout = 900000;

		this.rightClick = new Ext.menu.Menu({
					id : this.fileWinId + 'rightClickCont',
					items : [{
								id : this.fileWinId + 'menu_confirm',
								handler : this.setSelectedFile,
								scope : this,
								text : i18n.confirm
							}, '-', {
								id : this.fileWinId + 'menu_open',
								handler : this.open,
								scope : this,
								text : i18n.menu_open
							}, {
								id : this.fileWinId + 'menu_refresh',
								handler : this.refresh.createDelegate(this, [{
													focus : true
												}]),
								text : i18n.btn_refresh
							}, '-', {
								id : this.fileWinId + 'menu_new',
								text : i18n.menu_new,
								menu : [{
									id : this.fileWinId + 'menu_newfolder',
									text : i18n.menu_newfolder,
									handler : this.newfolder
											.createDelegate(this)

								}, {
									id : this.fileWinId + 'menu_newfile',
									text : i18n.menu_newfile,
									handler : this.newfile.createDelegate(this)
								}],
								listeners : {
									click : function(e) {
										Ext.ux.Util
												.fixExtBugOfPreventDefaultWithIE(e)
									}
								}
							},

							'-', {
								id : this.fileWinId + 'menu_copy',
								handler : this.copy.createDelegate(this),
								text : i18n.menu_copy
							}, {
								id : this.fileWinId + 'menu_cut',
								handler : this.cut.createDelegate(this),
								text : i18n.menu_cut
							}, {
								id : this.fileWinId + 'menu_paste',
								handler : this.paste.createDelegate(this),
								text : i18n.menu_paste
							}, '-', {
								id : this.fileWinId + 'menu_zip',
								handler : this.zip.createDelegate(this),
								text : i18n.menu_zip
							}, {
								id : this.fileWinId + 'menu_unzip',
								handler : this.unzip.createDelegate(this),
								text : i18n.menu_unzip
							}, '-', {
								id : this.fileWinId + 'menu_upload',
								handler : this.upload.createDelegate(this),
								text : i18n.menu_upload
							}, {
								id : this.fileWinId + 'menu_download',
								handler : this.download.createDelegate(this),
								text : i18n.menu_download
							}, '-', {
								id : this.fileWinId + 'menu_delete',
								handler : this.del.createDelegate(this),
								text : i18n.menu_delete
							}, {
								id : this.fileWinId + 'menu_rename',
								handler : this.rename.createDelegate(this),
								text : i18n.menu_rename
							}, '-', {
								id : this.fileWinId + 'menu_properties',
								handler : this.properties.createDelegate(this),
								text : i18n.menu_properties
							}]
				});
		var rightClick = this.rightClick;
		var newworkdir = "";
		var scope = this;

		// this.backwardrecords.push(this.workdir);
		var currentdir = this.currentdir;

		// var upcount = 0;
		var filename = null;

		var filepath = null;
		// var backwardcount = 0, forwardcount = 0;

		// FileMngGlobal.filePasteShares.pasteflag = null;
		// var wardflag = 0;
		var rIndex = 0;
		var spath = null;
		var ctpath = "", newname = "";

		// toolbar
		var tb_newfile = new Ext.menu.Menu({

					items : [{
								id : this.fileWinId + 'tb_newfile',
								text : i18n.menu_newfile,
								icon : "images/Menus/09.gif",
								handler : this.newfile.createDelegate(this)
							}, {
								id : this.fileWinId + 'tb_newfolder',
								text : i18n.menu_newfolder,
								icon : "images/Menus/29.gif",
								handler : this.newfolder.createDelegate(this)
							}]
				});

		// var btnSure = new Ext.Panel({
		// id : this.fileWinId +'btnField' ,
		// layout : "column",
		// autoScroll : false,
		// width : 500,
		// bodyStyle : " background-color:
		// transparent;border:none;margin:0,0,0,0;padding:0,0,0,0;",
		// border : false,
		// defaults : {
		// layout : 'form'
		// },
		// items : [{
		//					
		// bodyStyle : " background-color: transparent;",
		// border : false,
		// items : new Ext.form.TextField({
		// //fieldLabel : i18n.lab_filename,
		// id : ID_SELECTED_WORKDIR,
		// value:this.defaultdir,
		// // labelStyle : "width:60;",
		// maxLength : 100,
		// labelWidth : 100,
		// width : 300
		//							
		// })
		// }, {
		// //width : '50',
		// border : false,
		// bodyStyle : " background-color: transparent;",
		// items : new Ext.Button({
		// id : 'btnSel',
		// width : 50,
		// text : i18n.btn_select,
		// handler : function() {
		//
		// this.setWorkDirValue();
		// Ext.getCmp(this.fileWinId).close();
		// },
		// scope : this
		// })
		// }]
		// });
		var tb1 = new Ext.Toolbar({
					height : 30,
					width : "100%",
					region : 'center',
					autoScroll : true,
					items : [

					{
								id : this.fileWinId + 'tb_new',
								text : i18n.menu_new,
								tooltip : i18n.menu_new,
								tooltipType : "title",
								iconCls : "hd_021",
								menu : tb_newfile
							}, {
								id : this.fileWinId + 'tb_paste',
								text : i18n.menu_paste,
								tooltip : i18n.menu_paste,
								tooltipType : "title",
								iconCls : "hd_022",
								handler : this.paste.createDelegate(this)
							}, {
								id : this.fileWinId + 'tb_upload',
								text : i18n.menu_upload,
								tooltip : i18n.menu_upload,
								// tooltipType : "title",
								iconCls : "hd_upload",
								handler : this.upload.createDelegate(this)
							}, {
								id : this.fileWinId + 'tb_download',
								text : i18n.menu_download,
								// tooltip : i18n.menu_download,
								// tooltipType : "title",
								iconCls : "hd_download",
								handler : this.download.createDelegate(this)
							}, {
								id : this.fileWinId + 'tb_default',
								text : i18n.editor_file_adv,
								// tooltip : i18n.menu_download,
								// tooltipType : "title",
								iconCls : "hd_004",
								handler : function() {
									scope.defaultEditorHandler();
								}
							}

					]
				});
		var tb2 = new Ext.Toolbar({
					height : 30,
					width : "100%",
					autoScroll : true,
					items : [' ', this.labelMame,
							// i18n.btn_job_defaultdir,
							// new Ext.form.TextField({
							// // fieldLabel : i18n.lab_filename,
							// id : this.fileWinId + 'workdir',
							// value : this.defaultdir,
							// readOnly : true,
							// // labelStyle : "width:60;",
							// maxLength : 100,
							// labelWidth : 100,
							// width : 250
							//
							// }), new Ext.Button({
							// id : this.fileWinId + 'btn_url',
							// icon :
							// "./images/file/go.png",
							// cls : "x-btn-text-icon",
							// handler : this.showWorkDir.createDelegate(this)
							// }),

							// i18n.lab_filename,

							new Ext.form.TextField({
										// fieldLabel : i18n.lab_filename,
										id : this.fileWinId + 'filename',
										value : this.defaultfile,
//										readOnly : true,
										// allowBlank: false,
										// labelStyle : "width:60;",
										// maxLength : 100,
										width : '100%'

									}), ' ', new Ext.Button({
										id : this.fileWinId + 'btnSel',
										width : 50,
										icon : "images/icons/ok.png",
										cls : "x-btn-text-icon",
										text : i18n.template_file_select,
										disabled : true,
										// hidden:true,
										// visible:false,
										handler : function() {

											this.setSelectedFile();
										},
										scope : this
									}),

							// new Ext.Button({
							// id : 'btnSel',
							// width : 80,
							// text : i18n.btn_saveandexit,
							// handler : function() {
							//
							// //this.setWorkDirValue();
							//									
							// if(Ext.get(this.fileWinId +
							// 'filename').dom.value!='')
							// {
							// Ext.get(this.remoteTextFieldId).dom.value=(Ext.get(this.fileWinId
							// + 'workdir').dom.value+'/'+
							// Ext.get(this.fileWinId +
							// 'filename').dom.value);
							// }
							//									
							// Ext.getCmp(this.fileWinId).close();
							// },
							// scope : this
							// }),
							'  '

					],
					afterRender : function() {
						Ext.Toolbar.prototype.afterRender
								.apply(this, arguments);
						var pn = Ext.getCmp(scope.fileWinId + 'filename')
								.getEl();
						pn.dom.parentNode.style.width = '100%';

					}
				});
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
						handler : this.backward.createDelegate(this),
						disabled : true

					}, {
						id : this.fileWinId + 'tb_forward',
						// text : i18n.tb_forward,
						tooltip : i18n.tb_forward,
						tooltipType : "title",
						iconCls : "hd_007",
						handler : this.forward.createDelegate(this),
						disabled : true
					}, {
						id : this.fileWinId + 'tb_upward',
						// text : i18n.btn_up,
						tooltip : i18n.btn_up,
						tooltipType : "title",
						iconCls : "hd_008",
						handler : this.upward.createDelegate(this)

					}, {
						id : this.fileWinId + 'tb_refresh',
						// text : i18n.btn_refresh,
						tooltip : i18n.btn_refresh,
						tooltipType : "title",
						iconCls : "hd_009",
						handler : this.refresh.createDelegate(this, [{
											focus : true
										}])
					},i18n.lab_url, new Ext.form.TextField({
								id : this.fileWinId + 'txt_url',
								width : '100%',
								value : this.defaultdir,
								listeners : {
									specialkey : function(field, e) {
										if (e.getKey() == Ext.EventObject.ENTER) {
											this.showUrl();
										}
									}.createDelegate(this)
								}
							}), new Ext.Button({
								id : this.fileWinId + 'btn_url',
								icon : "./images/file/go.png",
								tooltip : i18n.menu_go_url,
								tooltipType : "title",
								cls : "x-btn-text-icon",
								handler : this.showUrl.createDelegate(this)
							})],
			afterRender : function() {
				Ext.Toolbar.prototype.afterRender.apply(this, arguments);
				var pn = Ext.getCmp(scope.fileWinId + 'txt_url').getEl();
				pn.dom.parentNode.style.width = '100%';

			}
		});

		// init the toolbar

		var ds = this.getEmptyStore();
		this.ds = ds;

		// init the toolbar

		var cm = new Ext.grid.ColumnModel({

			columns : [{
				header : i18n.col_filename,
				dataIndex : 'name',
				id : this.fileWinId + 'column_name',
				hideable : false,
				width : 150,
				sortable : true,
				editable : false,
				renderer : Ext.ux.Util.renderFileNameColor,
				editor : new Ext.form.TextField({
							id : this.fileWinId + 'txtFileName',
							allowBlank : false,
							blankText : i18n.val_filenamenotnull,
							invalidText : i18n.val_filenamenotnull,
							regex : this.regex,
							regexText : i18n.val_fileformaterror,
							maxLength : 100,
							validator : function(text) {
								if (this.allowBlank == false
										&& Ext.util.Format.trim(text).length == 0)
									return false;
								else
									return true;
							}

						})
			}, {
				header : i18n.col_filetype,
				dataIndex : 'type',
				sortable : true,
				renderer : Ext.ux.Util.formatType

			}, {
				header : i18n.col_filesize,
				// width : 100,
				dataIndex : 'size',
				sortable : true,
				renderer : Ext.ux.Util.formatSize
			}, {
				header : i18n.col_filelastmodified,
				sortable : true,
				// width : 200,
				dataIndex : 'lastModified'
			}, {
				header : i18n.file_title_preview,
				sortable : true,
				dataIndex : 'currentPath',
				renderer : Ext.ux.Util.formatReview
			}]
		});

		var taskbarEl = Ext.get('ux-taskbar');

		/* ================ definde grid ================= */
		var grid = new Ext.grid.EditorGridPanel({
					// bodyStyle : 'width:100%',
					filePanelId : this.id,
					id : this.fileWinId + 'FileGrid',
					// clicksToEdit : 5,
					editable : false,
					// region : 'center',
					autoHeight : false,
					autoWidth : true,
					// width : Ext.lib.Dom.getViewWidth() * 3 / 4,
					// height : Ext.lib.Dom.getViewHeight() -
					// taskbarEl.getHeight(),
					autoScroll : true,
					// frame : true,
					// viewConfig : {
					// forceFit : true
					// },
					enableDragDrop : true,
					ddGroup : 'mygrid',
					dropConfig : {
						appendOnly : true
					},
					// ddText : "{0} selected row{1} to move",

					viewConfig : {
						forceFit : true
						// ,
						// /**
						// * words can be select on grid cell just for Firefox
						// */
						// templates : {
						// cell : new Ext.Template(
						// '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id}
						// x-selectable {css}" style="{style}" tabIndex="0"
						// {cellAttr}>',
						// '<div class="x-grid3-cell-inner x-grid3-col-{id}"
						// {attr}>{value}</div>',
						// '</td>')
						// }
					},
					region : 'center',
					cm : cm,
					store : ds,
					loadMask : {
						msg : i18n.mask_wait
					},
					sm : new Ext.grid.RowSelectionModel(),
					// monitorResize : true,
					tbar : [],
					listeners : {
						// click : function(e) {
						// var sels = grid.getSelectionModel().getSelections();
						// if (sels.length == 1 && this.editing) {
						// /** don't prevent browser default right click menu */
						// return;
						// } else {
						// scope.getWinCmp().focus(true);
						// }
						//
						// },
						// // rowmousedown:function(e)
						// // {
						// // alert('2');
						// // scope.getWinCmp().focus(true);
						// // },
						// contextmenu : function(e) {
						//
						// var sels = grid.getSelectionModel().getSelections();
						//
						// if (sels.length == 1 && this.editing) {
						// // don't prevent browser default right click menu
						// return;
						// }
						//
						// e.preventDefault();
						// rightClick.showAt(e.getXY());
						// if (scope.errormark == true) {
						// scope.setComponetStatus('menu_confirm', false);
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', false);
						// scope.setComponetStatus('menu_newfolder', false);
						// scope.setComponetStatus('menu_newfile', false);
						// scope.setComponetStatus('menu_copy', false);
						// scope.setComponetStatus('menu_cut', false);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', false);
						// scope.setComponetStatus('menu_unzip', false);
						// scope.setComponetStatus('menu_upload', false);
						// scope.setComponetStatus('menu_download', false);
						// scope.setComponetStatus('menu_delete', false);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						//
						// return;
						//
						// }
						// if (sels.length == 0) {
						// scope.setComponetStatus('menu_confirm', false);
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', true);
						// scope.setComponetStatus('menu_newfolder', true);
						// scope.setComponetStatus('menu_newfile', true);
						// scope.setComponetStatus('menu_copy', false);
						// scope.setComponetStatus('menu_cut', false);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', false);
						// scope.setComponetStatus('menu_unzip', false);
						// scope.setComponetStatus('menu_upload', true);
						// scope.setComponetStatus('menu_download', false);
						// scope.setComponetStatus('menu_delete', false);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						//
						// }
						// if (FileMngGlobal.filePasteShares.pasteflag == "cut"
						// || FileMngGlobal.filePasteShares.pasteflag == "copy")
						// {
						//
						// scope.setComponetStatus('menu_paste', true);
						//
						// } else {
						// scope.setComponetStatus('menu_paste', false);
						//
						// }
						//
						// },
						rowdblclick : function(grid, rowindex, e) {
							scope.resetCellClick();
							grid.getColumnModel().setEditable(0, false);

							var isFile = this.setSelectedFile();
							if (!isFile)
								this.open();
						}.createDelegate(this),
						// rowcontextmenu : function(grid, rowIndex, e) {
						//
						// var sels = grid.getSelectionModel().getSelections();
						//
						// if (sels.length == 1 && this.editing) {
						//
						// return;
						// }
						//
						// // testRightClick.items.items[0].disable();
						//
						// e.preventDefault();
						// rightClick.showAt(e.getXY());
						//
						// if (scope.errormark == true) {
						// scope.setComponetStatus('menu_confirm', false);
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', false);
						// scope.setComponetStatus('menu_newfolder', false);
						// scope.setComponetStatus('menu_newfile', false);
						// scope.setComponetStatus('menu_copy', false);
						// scope.setComponetStatus('menu_cut', false);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', false);
						// scope.setComponetStatus('menu_unzip', false);
						// scope.setComponetStatus('menu_upload', false);
						// scope.setComponetStatus('menu_download', false);
						// scope.setComponetStatus('menu_delete', false);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						//
						// return;
						//
						// }
						//
						// // check whether to select new row
						// var isnewrow = true;
						// for (var i = 0; i < sels.length; i++) {
						// if (sels[i] == this.store.getAt(rowIndex)) {
						// isnewrow = false;
						// break;
						// }
						// }
						// if (isnewrow) {
						// grid.getSelectionModel().selectRow(rowIndex);
						// }
						// sels = grid.getSelectionModel().getSelections();
						//
						// if (sels.length > 1) {
						// scope.setComponetStatus('menu_confirm', true);
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', true);
						// scope.setComponetStatus('menu_newfolder', true);
						// scope.setComponetStatus('menu_newfile', true);
						// scope.setComponetStatus('menu_copy', true);
						// scope.setComponetStatus('menu_cut', true);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', true);
						// scope.setComponetStatus('menu_unzip', true);
						// scope.setComponetStatus('menu_upload', true);
						// scope.setComponetStatus('menu_download', true);
						// scope.setComponetStatus('menu_delete', true);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						//
						// for (var i = 0; i < sels.length; i++) {
						// var type = sels[i].get('type');
						// var name = sels[i].get('name');
						//
						// if (type != 0) {
						// scope.setComponetStatus('menu_confirm', false);
						//
						// } else {
						// if (!scope.selectionMode) {
						// scope.setComponetStatus('menu_confirm',
						// false);
						// }
						//
						// if ((name.toLowerCase().lastIndexOf('.rar') == -1
						// && name.toLowerCase()
						// .lastIndexOf('.tar') == -1
						// && name.toLowerCase()
						// .lastIndexOf('.tar.gz') == -1 && name
						// .toLowerCase().lastIndexOf('.zip') == -1)) {
						//
						// scope
						// .setComponetStatus('menu_unzip',
						// false);
						//
						// }
						//
						// }
						// }
						//
						// } else if (sels.length == 1) {
						//
						// scope.setComponetStatus('menu_open', true);
						// scope.setComponetStatus('menu_tail', true);
						// scope.setComponetStatus('menu_new', true);
						// scope.setComponetStatus('menu_newfolder', true);
						// scope.setComponetStatus('menu_newfile', true);
						// scope.setComponetStatus('menu_copy', true);
						// scope.setComponetStatus('menu_cut', true);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', true);
						// scope.setComponetStatus('menu_unzip', true);
						// scope.setComponetStatus('menu_upload', true);
						// scope.setComponetStatus('menu_download', true);
						// scope.setComponetStatus('menu_delete', true);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', true);
						// scope.setComponetStatus('menu_rename', true);
						//
						// var filename = grid.getSelections()[0].get('name');
						// var type = grid.getSelections()[0].get('type');
						//
						// if (type == 0)
						// scope.setComponetStatus('menu_confirm', true);
						// else
						// scope.setComponetStatus('menu_confirm', false);
						//
						// if (type != 0
						// || (filename.toLowerCase().lastIndexOf('.rar') == -1
						// && filename.toLowerCase()
						// .lastIndexOf('.tar') == -1
						// && filename.toLowerCase()
						// .lastIndexOf('.tar.gz') == -1 && filename
						// .toLowerCase().lastIndexOf('.zip') == -1)) {
						//
						// scope.setComponetStatus('menu_unzip', false);
						//
						// } else {
						// scope.setComponetStatus('menu_unzip', true);
						//
						// }
						//
						// } else if (sels.length == 0) {
						// scope.setComponetStatus('menu_confirm', false);
						// scope.setComponetStatus('menu_open', false);
						// scope.setComponetStatus('menu_tail', false);
						// scope.setComponetStatus('menu_new', true);
						// scope.setComponetStatus('menu_newfolder', true);
						// scope.setComponetStatus('menu_newfile', true);
						// scope.setComponetStatus('menu_copy', false);
						// scope.setComponetStatus('menu_cut', false);
						// scope.setComponetStatus('menu_paste', false);
						// scope.setComponetStatus('menu_zip', false);
						// scope.setComponetStatus('menu_unzip', false);
						// scope.setComponetStatus('menu_upload', true);
						// scope.setComponetStatus('menu_download', false);
						// scope.setComponetStatus('menu_delete', false);
						// scope.setComponetStatus('menu_refresh', true);
						// scope.setComponetStatus('menu_properties', false);
						// scope.setComponetStatus('menu_rename', false);
						//
						// }
						//
						// if (FileMngGlobal.filePasteShares.pasteflag == "cut"
						// || FileMngGlobal.filePasteShares.pasteflag == "copy")
						// {
						// scope.setComponetStatus('menu_paste', true);
						//
						// } else {
						// scope.setComponetStatus('menu_paste', false);
						//
						// }
						//
						// },
						'render' : function() {

							tb2.render(grid.bbar);
							tb1.render(grid.tbar);
							tb3.render(grid.tbar);

							scope.gridDragDrop();
						}
					},

					// grid.addListener('afterRender',afterrender);
					// function afterrender(){
					// var ddrow = new
					// Ext.dd.DropTarget(grid.getView().mainBody, {
					// ddGroup : 'mygrid',
					// notifyDrop : function(dd, e, data){
					// var sm = grid.getSelectionModel();
					// var rows = sm.getSelections();
					// var cindex = dd.getDragData(e).rowIndex;
					// if (sm.hasSelection()) {
					// for (i = 0; i < rows.length; i++) {
					// store.remove(store.getById(rows[i].id));
					// store.insert(cindex,rows[i]);
					// }
					// sm.selectRecords(rows);
					// }
					// }
					// });
					// }
					bbar : scope.getPagingToolBarInstance(ds, true)
				});

		this.grid = grid;

		// grid.on('validateedit', validateedit, grid);
		// function validateedit(e) {
		// alert('validateedit')
		// }
		// grid.on('beforeEdit', beforeEdit, grid);
		// function beforeEdit(e) {
		// alert('beforeEdit')
		// }
		//	

		function checkConfirm() {
			var sels = grid.getSelectionModel().getSelections();
			var length = sels.length;
			if (length == 0) {
				scope.setComponetStatus('menu_confirm', false);
			} else {
				scope.setComponetStatus('menu_confirm', true);
				for (var i = 0; i < sels.length; i++) {
					var type = sels[i].get('type');
					var name = sels[i].get('name');

					if (type != 0) {
						scope.setComponetStatus('menu_confirm', false);
						break;
					} else {
						if (length > 1 && !scope.selectionMode) {
							scope.setComponetStatus('menu_confirm', false);
							break;
						}
					}
				}

			}
		}

		grid.on('click', this.click.createDelegate(this), grid);

		grid.on('contextmenu', function(e) {
					scope.contextmenu(e);
					checkConfirm();
					scope.checkCurrentFile();
				}, grid);
		grid.on('rowcontextmenu', function(grid, rowIndex, columnIndex, e) {
					scope.rowcontextmenu(grid, rowIndex, columnIndex, e);
					checkConfirm();
					scope.checkCurrentFile();
				}, grid);

		grid.on('afteredit', this.afteredit.createDelegate(this), grid);
		grid.on('cellclick', function(grid, rowIndex, columnIndex, e) {
					scope.checkCurrentFile();
					scope.cellclick(grid, rowIndex, columnIndex, e)
				}, grid);
		grid.addListener('rowclick', function(grid, rowIndex, columnIndex, e) {

					scope.rowclick(grid, rowIndex, columnIndex, e);

					scope.checkCurrentFile();
				});

		this.add(grid);

		this.beforeRefresh = function() {

		};

		this.execeptionRefresh = function() {
			var msg = i18n.template_create_workdir;
			Ext.MessageBox.show({
						title : i18n.prompt,
						msg : msg,
						buttons : Ext.Msg.YESNO,
						icon : Ext.Msg.WARNIN,
						scope : scope,
						fn : function(btn) {
							this.getWinCmp().focus(true);
							if (btn == 'yes') {
								// this.createDefaultFolder();
								this.createUrlPathFolder();
							}
						}
					});

		}

	},
	saveTemplateWorkFile : function(filePath) {
		if (Ext.get(this.fileWinId + 'filename').dom.value != '') {
			// var remoteTextField = document
			// .getElementById(this.remoteTextFieldId);
			// remoteTextField.value = filePath;
			// Ext.ux.Util.setCursorLast(remoteTextField);
//			this.editor.insertContent("<img src='" + filePath + "' />");
			var content="";
			for(var i=0;i<filepath.length;i++)
			{
				content+="<a href='" + filePath[i] + "' />"+this.getFileName(filePath[i])+"</a>";
			
			}
			this.editor.insertContent(content);
		}
	},

	getSelectedFile : function() {
		var sels = this.grid.getSelectionModel().getSelections();
		var selFileNames = '';
		var selFilePath = [];
		var value = this.currentdir;
		if (value.indexOf("/") == 0) {
			value = value.substring(1, value.length);
		}
		var count = 0;
		for (var i = 0; i < sels.length; i++) {

			if (sels[i].get('type') == 0) {
				if (count != 0) {
					selFileNames = selFileNames + ' ';
//					selFilePath = selFilePath + '|';
				}
				selFileNames += '"' + sels[i].get('name') + '"';
//				selFilePath += value + '/' + sels[i].get('name');
				selFilePath.push( value + '/' + sels[i].get('name'));
				count++;
			}

		}

		return {
			selFileNames : selFileNames,
			selFilePath : selFilePath,
			count : count
		}

	},
	showWorkDir : function() {
		var value = Ext.getCmp(this.fileWinId + "workdir").getValue();
		Ext.getCmp(this.fileWinId + 'txt_url').setValue(value);
		this.refresh({
					filepath : value
				});
	},
	setSelectedFile : function() {
		// var workDirSelected = Ext.getCmp(ID_SELECTED_WORKDIR).getValue();

		var fileSels = this.getSelectedFile();
		var selFileNames = fileSels.selFileNames;
		var selFilePath = fileSels.selFilePath;
//		if (selFilePath.indexOf("/") == 0) {
//			selFilePath = selFilePath.substring(1, selFilePath.length);
//		}
		var value = this.currentdir;

		if (selFileNames != '') {
			Ext.getCmp(this.fileWinId + 'filename').setValue(selFileNames);

			Ext.getCmp(this.fileWinId + "txt_url").setValue(value);
			Ext.getCmp(this.fileWinId + 'btnSel').disable();
			// Ext.getCmp(this.fileWinId + 'workdir').setValue(value);
			Ext.get(this.fileWinId + "txt_url").setStyle({
						background : 'white'
					});
		} else {
			return;
		}

		if (this.fileSelectedFunc) {
			this.fileSelectedFunc(selFilePath);
		} else {
			this.saveTemplateWorkFile(selFilePath);
		}

		Ext.getCmp(this.fileWinId).close();
		return true;
		// if(sels.length==1&&sels[0].get('type')==0)
		// {
		// var value=this.currentdir;
		// Ext.getCmp(this.fileWinId + "txt_url").setValue(this.currentdir);
		// Ext.getCmp(this.fileWinId +
		// 'filename').setValue(sels[0].get('name'));
		// Ext.getCmp(this.fileWinId + 'workdir').setValue(value);
		//	
		// Ext.get(this.fileWinId + "txt_url").setStyle({background: 'white'});
		// // Ext.getCmp(this.fileWinId + 'btnSel').setVisible(false);
		// Ext.getCmp(this.fileWinId + 'btnSel').disable();
		// this.saveTemplateWorkFile();
		// return true;
		// }
		// else
		// {
		// return false;
		// }

	},
	firstLoad : function(path) {

//		var win, data, dom = this.editor.dom, imgElm = this.editor.selection
//				.getNode();

		

//		var path = dom.getAttrib(imgElm, 'src');

		var firstPath = this.defaultdir;
		if (path != null) {
			path="/"+path;
			if (path.indexOf(this.workdir) == 0) {
				firstPath = this.getFilePath(path);
			}

		}

		this.refresh({
					filepath : firstPath
				});

	},
	// showWorkDir : function() {
	// var value = Ext.getCmp(this.fileWinId + "workdir").getValue();
	// Ext.getCmp(this.fileWinId + 'txt_url').setValue(value);
	// this.refresh({
	// filepath : value
	// });
	// },
	checkCurrentFile : function() {
		var selFile = this.getSelectedFile();

		if (this.selectionMode) {
			// multiple selection.

			if (selFile.count == 0) {
				Ext.getCmp(this.fileWinId + 'filename').setValue('');
				Ext.getCmp(this.fileWinId + 'btnSel').disable();
			} else {
				Ext.getCmp(this.fileWinId + 'filename')
						.setValue(selFile.selFileNames);
				Ext.ux.Util.setCursorLast(document
						.getElementById(this.fileWinId + 'filename'));
				Ext.getCmp(this.fileWinId + 'btnSel').enable();
			}

		} else {
			if (selFile.count != 1) {
				Ext.getCmp(this.fileWinId + 'filename').setValue('');
				Ext.getCmp(this.fileWinId + 'btnSel').disable();
			} else {
				Ext.getCmp(this.fileWinId + 'filename')
						.setValue(selFile.selFileNames);
				Ext.ux.Util.setCursorLast(document
						.getElementById(this.fileWinId + 'filename'));
				Ext.getCmp(this.fileWinId + 'btnSel').enable();
			}
		}
	}
		// ,
		// createDefaultFolder:function()
		// {
		//	  
		//	  
		//	  
		//			
		//	
		// }
		//	

});

Ext.extend(Ext.Template.TinymceRemoteFilePanel, Ext.Panel,
		tinymceRemoteFilePanel_1);