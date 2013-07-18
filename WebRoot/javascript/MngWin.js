Ext.sccportal.MngPanel = function(config) {
	Ext.sccportal.MngPanel.superclass.constructor.call(this, config);
	Ext.QuickTips.init();
}
var mngMap = new Ext.util.MixedCollection();
Ext.extend(Ext.sccportal.MngPanel, Ext.Panel, {
	initComponent : function() {
		var role = this.role;
		var username = this.username;

		putMng(mngMap, 'projectMng', mngHTML('projectMng',
						i18n.list_projectmanger, 32));
		putMng(mngMap, 'statisticsMng', mngHTML('statisticsMng',
						i18n.list_statisticsmanage, 33));
		putMng(mngMap, 'settings', mngHTML('settings', i18n.list_settings, 49));
		putMng(mngMap, 'deptMng', mngHTML('deptMng', i18n.list_deptmanage,
						'cmd-mng'));
		putMng(mngMap, 'userMng', mngHTML('userMng', i18n.list_usermanger, 31));
		putMng(mngMap, 'cmdMng', mngHTML('cmdMng', i18n.list_cmdrightmanage,
						"dept-mng"));
		putMng(mngMap, 'onlineMng', mngHTML('onlineMng',
						i18n.list_onlinemanage, 47));
		putMng(mngMap, 'ldapMng', mngHTML('ldapMng',
						i18n.ldapmanage_name, 47));
 
							
		var html = getMngHTML(mngMap, 'projectMng')
				+ getMngHTML(mngMap, 'statisticsMng')
				+ getMngHTML(mngMap, 'settings');
		if (this.role == 1) {
			html = getMngHTML(mngMap, 'deptMng')
					+ getMngHTML(mngMap, 'userMng')
					+ getMngHTML(mngMap, 'projectMng')
					+ getMngHTML(mngMap, 'cmdMng')
					+ getMngHTML(mngMap, 'statisticsMng')
					+ getMngHTML(mngMap, 'onlineMng')
					+ getMngHTML(mngMap, 'ldapMng');
					
		} else if (this.role == 2) {
			html = getMngHTML(mngMap, 'userMng')
					+ getMngHTML(mngMap, 'projectMng')
					+ getMngHTML(mngMap, 'cmdMng')
					+ getMngHTML(mngMap, 'statisticsMng')
					+ getMngHTML(mngMap, 'onlineMng')
					+ getMngHTML(mngMap, 'settings');
		}
		var panel = new Ext.Panel({
			id : "mngPanel",
			//frame : true,

			autoScroll : true,

			listeners : {
				render : function(t) {
					var jb = t.body;
					Ext.DomHelper.append(jb, '<div id ="x-mng-shortcuts">'
									+ html + '</div>');
					jb.on('mousedown', doAction, null, {
								delegate : 'a'
							});
					jb.on('click', Ext.emptyFn, null, {
								delegate : 'a',
								preventDefault : true
							});
					function doAction(e, t) {
						e.stopEvent();
						var t = e.getTarget('dt', jb);
						//alert(t.id);
						var mngName = "";
						var mngId = t.id;
						var app = Ext.ux.Util.getApp();
						var desktop = app.getDesktop();
						var mngWindow = desktop.getWindow(mngId+"-win");
						// Ext.ux.Util.closeWindow(mngWindow);
						var taskbarEl = Ext.get('ux-taskbar');
						if (mngId == "settings") {
							mngName=i18n.list_settings;
							if (role == 4 || role == 2) {
								Ext.Ajax.request({
									url : "getEmailSettingByEntUser.action",
									scope : this,
									async : false,
									success : function(resp, opts) {
										var responseText = (Ext.util.JSON
												.decode(resp.responseText)).emailSettingInfo;
										var jobIsDone = false;
										var personInfoChange = false;
										var userDelete = false;
										var supporter = false;
										var deptAdminWhenAsk = false;
										var answer = false;
										if (responseText) {
											jobIsDone = responseText.jobIsDone;
											personInfoChange = responseText.personInfoChange;
											userDelete = responseText.userDelete;
											supporter = responseText.supporter;
											deptAdminWhenAsk = responseText.deptAdminWhenAsk;
											answer = responseText.answer;
										}
										mngFormGrid = new Ext.sccportal.SystemSettingsPanel(
												{
													layout : 'border',
													autoScroll : true,
													jobIsDone : jobIsDone,
													personInfoChange : personInfoChange,
													userDelete : userDelete,
													supporter : supporter,
													deptAdminWhenAsk : deptAdminWhenAsk,
													answer : answer
												});
										if (!mngWindow) {
											mngWindow = desktop.createWindow({
														id : mngId+"-win",
														title : mngName,
														frame : true,
														iconCls : 'icon-grid',
														width : Ext.lib.Dom
																.getViewWidth()
																* 3 / 4,
														height : Ext.lib.Dom
																.getViewHeight()
																* 8 / 9,
														shim : false,
														animCollapse : false,
														constrainHeader : true,
														layout : 'fit',
														items : [mngFormGrid]
													})
										}
										mngWindow.show();
									},
									failure : function(resp, opts) {
									}
								})

							}
						} else {
							if (mngId == "deptMng") {
								mngName=i18n.list_deptmanage;
								mngFormPanel = new Ext.Desktop.DepartmentPanel(
										{
											layout : 'fit',
											autoScroll : true
										});
								mngFormGrid = Ext.ux.DepartmentMng.getGrid();

							} else if (mngId == "userMng") {
								mngName=i18n.list_usermanger;
								if (role == 1)
									mngFormPanel = new Ext.Desktop.UserPanelByEntMnger(
											{
												role : role,
												layout : 'fit',
												autoScroll : true
											});
								else if (role == 2)
									mngFormPanel = new Ext.Desktop.UserPanel({
												role : role,
												layout : 'fit',
												autoScroll : true
											});
								mngFormGrid = Ext.ux.userMng.getGrid(role);
								this.width = Ext.ux.userMng.getGrid(role).width;
							} else if (mngId == "projectMng") {
								mngName=i18n.list_projectmanger;
								Ext.ux.Util.setUserName(username);
								if (role == 1)
									mngFormPanel = new Ext.Desktop.EntMngerHoldProjectPanel(
											{
												role : role,
												layout : 'fit',
												autoScroll : true
											});
								if (role == 2)
									mngFormPanel = new Ext.Desktop.DeptMngerHoldProjectPanel(
											{
												role : role,
												layout : 'fit',
												autoScroll : true
											});
								else if (role == 3 || role == 4)
									mngFormPanel = new Ext.Desktop.ProjectMngerHoldProjectPanel(
											{
												role : role,
												layout : 'fit',
												autoScroll : true
											});
								mngFormGrid = Ext.ux.projectMng.getGrid(role);

								this.width = Ext.ux.projectMng.getGrid(role).width;
							}

							else if (mngId == "statisticsMng") {
								mngName=i18n.list_statisticsmanage;
								mngFormGrid = new Ext.sccportal.StatisticsPanel(
										{
											layout : 'border'
										});

							} else if (mngId == "cmdMng") {
								mngName=i18n.list_cmdrightmanage;
								mngFormPanel = new Ext.Desktop.CmdPanel({
											role : role,
											layout : 'fit',
											autoScroll : true
										});
								mngFormGrid = Ext.ux.CmdMng.getGrid(role);

							} else if (mngId == "onlineMng") {
								mngName=i18n.list_onlinemanage;
								// changed by liujie.
								mngFormGridPanel = new Ext.scc.OnlineUserPanel(
										{
											layout : 'fit',
											autoScroll : true
										});
								mngFormGrid = mngFormGridPanel.getGrid();
								// end change
							}
							 else if (mngId == "ldapMng") {
								mngName=i18n.ldapmanage_name;
								// changed by liujie.
								mngFormGridPanel = new Ext.Desktop.LdapInfoPanel(
										{
											layout : 'fit',
											autoScroll : true
										});
								mngFormGrid = mngFormGridPanel.getGrid();
								// end change
							}
							if (mngFormGrid != null) {
								if (!mngWindow) {
									mngWindow = desktop.createWindow({
												id : mngId+"-win",
												title : mngName,
												frame : true,
												iconCls : 'icon-grid',
												width : Ext.lib.Dom
														.getViewWidth()
														* 3 / 4,
												height : Ext.lib.Dom
														.getViewHeight()
														* 8 / 9,
												shim : false,
												animCollapse : false,
												constrainHeader : true,
												layout : 'fit',
												items : [mngFormGrid]
											})
								}
								mngWindow.show();
							}
						}
					}
				}
			}
		})
		this.add(panel);
	},

	cancel : function() {
		this.win.close();
	}

});
