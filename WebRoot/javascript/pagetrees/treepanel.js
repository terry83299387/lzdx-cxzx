var TreePanel = function(id, text) {

	
	
	var scope = this;
	var root = new Ext.tree.AsyncTreeNode({

				text : text,
				expanded : true,
				id : 'subject_root'

			});

	this.treePanel = new Ext.tree.TreePanel({
				id : id + '_tree',
				tbar : [

				{
							text : i18n.config_reload,
							handler : function() {
								var loader = Ext.getCmp(id + '_tree')
										.getLoader();

								loader.load(root, function() {

											root.expand();
										})

							}
						}

				],

				// region : 'west',
				// title : '',

				// width:250,
				autoWidth : true,
				autoHeight : true,
				autoScroll : true,
				root : root,
				rootVisable : false,
				loader : new Ext.tree.TreeLoader({
							baseAttrs : {},
							dataUrl : 'showTreeNode.action'

						}),
				listeners : {
					'click' : function(target, event) {
						var tree = Ext.getCmp(id + '_tree');
						var id = target.id;
						var subjectTab = Ext.getCmp(id + '_subjectTabs');

						scope.openGridPanel(target, id + "_grid", target.text);

					},
					'contextmenu' : function(target, event) {

						scope.contextMenu(target, event);
					}

				}

			});

	this.subjectTabs = new Ext.TabPanel({
		id : id + "_subjectTabs",
		region : 'center',
		frame : true,
		margins : '3 3 3 0',
		activeTab : 0,
		autoScroll : true,
		enableTabScroll : true,
		items : [{
					html : "<div style='text-align:center;'>News Manament</div>"
				}]

	});

}
TreePanel.prototype = {

	addPanel : function(tabs, panel) {
		tabs.add(panel);
	},
	refreshGrid : function() {
		this.grid.getStore().reload();
	},
	refreshPanel : function(tabs, panelID) {
		tabs.activate(panelID);
		tabs.doLayout();
		this.doLayout();
	},
	openGridPanel : function(target, gridid, title) {
		var scope = this;
		if (Ext.getCmp(gridid)) {
			this.subjectTabs.activate(gridid);
			return;
		}
		var store;
		var pagingToolBar;
		var reader = new Ext.data.JsonReader({
					totalProperty : "results",
					root : 'newsList',
					fields : [{
								name : 'newsTitle',
								mapping : 'newsTitle'
							}, {
								name : 'newsSource',
								mapping : 'newsSource'
							}, {
								name : 'createDate',
								mapping : 'createDate'
							}, {
								name : 'newsCode',
								mapping : 'newsCode'
							}, {
								name : 'newsPicture',
								mapping : 'newsPicture'
							}, {
								name : 'newsTag',
								mapping : 'newsTag'
							}, {
								name : 'newsPriority',
								mapping : 'newsPriority'
							}, {
								name : 'author',
								mapping : 'author'
							}, {
								name : 'type',
								mapping : 'type'
							}]
				});
		var pageComboBox = new Ext.form.ComboBox({
			id : gridid + "_pageTypeCombo",
			limit : 10,
			fieldLabel : i18n.paging,
			triggerAction : 'all',
			mode : 'local',
			store : new Ext.data.SimpleStore({

						fields : ['page', 'pagedisplay'],
						data : [
								[
										'10',
										i18n.page_perpage + '10'
												+ i18n.page_unit],
								[
										'50',
										i18n.page_perpage + '50'
												+ i18n.page_unit],
								[
										'100',
										i18n.page_perpage + '100'
												+ i18n.page_unit],
								[
										'200',
										i18n.page_perpage + '200'
												+ i18n.page_unit],
								[
										'500',
										i18n.page_perpage + '500'
												+ i18n.page_unit],
								['100000000', i18n.page_pageall]]
					}),
			value : '10',
			editable : 'true',
			displayField : 'pagedisplay',
			valueField : 'page',
			listeners : {

				select : function(combo, record, index) {

					var selectPage = Number(combo.getValue());
					store.baseParams.limit = selectPage;
					pagingToolBar.pageSize = selectPage;
					store.load({
								params : {
									start : 0,
									limit : selectPage
								}
							});
				}

			}
				// resizable:true,
				// handleHeight:10
			});

		var languageComboBox = new Ext.form.ComboBox({
			id : gridid + "_languageTypeCombo",
			fieldLabel : i18n.language,
			triggerAction : 'all',
			mode : 'local',
			store : new Ext.data.SimpleStore({

						fields : ['type', 'language'],
						data : [['', i18n.language_all], ['1', i18n.chinese],
								['2', i18n.english]]
					}),
			value : '',
			editable : 'false',
			displayField : 'language',
			valueField : 'type',
			listeners : {

				select : function(combo, record, index) {

					var selectLan = combo.getValue();
					store.baseParams.type = selectLan;
					store.load({
								params : {
									start : 0,
									limit : pageComboBox.limit
								}
							});
				}

			}
				// resizable:true,
				// handleHeight:10
			});

		store = new Ext.data.GroupingStore({
					proxy : new Ext.data.HttpProxy({
								url : 'showNewsList.action'
							}),

					root : "newslist",
					reader : reader,
					loadMask : {
						msg : i18n.mask_wait
					},
					autoLoad : {
						params : {
							start : 0

						}
					},
					baseParams : {
						nodeid : target.id,
						type : languageComboBox.getValue(),
						limit : pageComboBox.limit
					},
					listeners : {

						scope : scope,
						load : function() {
							// alert('1');

						}

					}
				});
		pagingToolBar = new Ext.PagingToolbar({
					store : store,
					pageSize : pageComboBox.limit,
					displayInfo : true,
					displayMsg : i18n.from + ' {0} ' + i18n.to + ' {1} '
							+ i18n.postfix + ' {2} ' + i18n.dataunit,
					emptyMsg : i18n.emptymsg
				});
		var sm = new Ext.grid.CheckboxSelectionModel();
		var gridpanel = new Ext.grid.GridPanel({
			nodeTarget : target,
			title : title,
			id : gridid,
			closable : true,
			split : true,
			tbar : new Ext.Toolbar({
				height : 30,
				width : "100%",
				region : 'center',
				autoScroll : true,
				items : [i18n.select_language, languageComboBox, {
					text : i18n.news_add,
					iconCls : "hd_017",
					handler : function() {
						scope.addNews(target, languageComboBox, sm, function() {
									store.load({
												params : {
													start : pagingToolBar.cursor,
													limit : pageComboBox.limit
												}
											});
								});
					}
						// disabled : true

				}, {
					text : i18n.news_edit,
					iconCls : "hd_002",
					handler : function() {
						scope.editNews(target, languageComboBox, sm,
								function() {
									store.load({
												params : {
													start : pagingToolBar.cursor,
													limit : pageComboBox.limit
												}
											});
								});
					}
						// disabled : true

				}, {
					text : i18n.news_del,
					iconCls : "jB_02",
					handler : function() {
						scope.delNews(target, languageComboBox, sm);
					}

						// disabled : true

					}, {
					text : i18n.news_refresh,
					iconCls : "hd_015",
					handler : function() {

						// pagingToolBar.doLoad({
						// params : {
						// start : pagingToolBar.cursor
						// }
						// });
						store.load({
									params : {
										start : pagingToolBar.cursor,
										limit : pageComboBox.limit
									}
								});

					}

						// disabled : true

					}, '->',

				pageComboBox

				]
			}),
			// autoWidth : true,
			// autoHeight : true,
			autoScroll : true,
			// width : '100%',
			// height : '500',
			frame : true,
			store : store,
			sm : sm,
			pagingbar : pagingToolBar,
			bbar : pagingToolBar,
			columns : [new Ext.grid.RowNumberer(), sm, {
						header : i18n.news_title,
						width : 300,
						sortable : true,
						dataIndex : "newsTitle"
					}, {
						header : i18n.news_source,
						width : 100,
						sortable : true,
						dataIndex : "newsSource"
					}, {
						header : i18n.news_picture,
						width : 100,
						sortable : true,
						dataIndex : "newsPicture"
					}, {
						header : i18n.news_tag,
						width : 100,
						sortable : true,
						dataIndex : "newsTag"
					}, {
						header : i18n.news_author,
						width : 100,
						sortable : true,
						dataIndex : "author"
					}, {
						header : i18n.news_language,
						width : 50,
						sortable : true,
						dataIndex : "type"
					}, {
						header : i18n.news_priority,
						width : 50,
						sortable : true,
						dataIndex : "newsPriority"
					}, {
						header : i18n.news_date,
						width : 100,
						sortable : true,
						dataIndex : "createDate"
					}

			],
			listeners : {
				'activate' : function(source) {
					var selection = scope.treePanel.getSelectionModel();
					selection.select(source.nodeTarget);

				}

			}

		});

		this.subjectTabs.add(gridpanel);
		this.subjectTabs.activate(gridid);

	},

	contextMenu : function(target, event) {
		var nodeid = target.id;
		var rightClick = new Ext.menu.Menu({
					id : nodeid,
					items : [{
								id : nodeid + 'menu_new',
								handler : function() {

									var text = "1";
									var id = "id";
									var node = new Ext.tree.TreeNode({

												id : id,
												text : text

											});
									target.leaf = false;
									target.expand();
									target.appendChild(node);
									var selection = this.treePanel
											.getSelectionModel();
									selection.select(node);
								},
								scope : this,
								text : "add"
							}, {
								id : this.fileWinId + 'menu_refresh',
								handler : function() {

								},
								text : "refresh"
							}, {
								id : this.fileWinId + 'menu_edit',
								handler : function() {

								},
								text : "edit"
							}, {
								id : this.fileWinId + 'menu_del',
								handler : function() {

								},
								text : "delete"
							}]
				});

		event.preventDefault();
		rightClick.showAt(event.getXY());

	},

	addNews : function(node, languageComboBox, sm) {
		var scope = this;
		var newsWindow = new newsWindows(node, languageComboBox, null,
				scope.refreshNews);

	},

	editNews : function(node, languageComboBox, sm) {
		var scope = this;
		if (sm.getSelections().length != 1) {
			Ext.MessageBox.alert(i18n.error, i18n.select_one_news);
			return;
		}
		var newsWindow = new newsWindows(node, languageComboBox, sm,
				scope.refreshNews);

	},

	refreshNews : function(node) {
		var gridPanel = Ext.getCmp(node.id + "_grid");
		if (gridPanel) {
			gridPanel.getEl().mask(i18n.mask_wait);
			gridPanel.store.load({
						params : {
							start : gridPanel.pagingbar.cursor,
							limit : gridPanel.pagingbar.limit
						},
						callback : function() {
							gridPanel.getEl().unmask();
						}
					});
		}
	},

	delNews : function(node, languageComboBox, sm) {
		Ext.Msg.buttonText.yes = i18n.confirm;
		Ext.Msg.buttonText.no = i18n.no;
		var scope = this;
		Ext.MessageBox.show({
					title : i18n.prompt,
					msg : i18n.news_del+"?",
					buttons : Ext.Msg.YESNO,
					icon : Ext.Msg.WARNIN,
					scope : scope,
					fn : function(btn) {

						if (btn == 'yes') {

							
							var newsCodes = "";
							for (var i = 0; i < sm.getSelections().length; i++) {
								if (i == 0) {
									newsCodes = sm.getSelections()[i].data.newsCode;

								} else {
									newsCodes = newsCodes
											+ ","
											+ sm.getSelections()[i].data.newsCode;
								}
							}
							if (newsCodes == "") {
								return;
							}

							var gridPanel = Ext.getCmp(node.id + "_grid");

							gridPanel.getEl().mask(i18n.mask_wait);
							Ext.Ajax.request({
										url : 'deleteNews.action',
										params : {
											newsCodes : newsCodes

										},
										success : function(resp, opts) {
											var responseObject = Ext.util.JSON
													.decode(resp.responseText);
											scope.refreshNews(node);
											// gridPanel.store.load({
											// params : {
											// start :
											// gridPanel.pagingbar.cursor,
											// limit : gridPanel.pagingbar.limit
											// }
											// });

											gridPanel.getEl().unmask();

										},
										failure : function(resp, opts) {
											Ext.MessageBox.alert(i18n.error,
													"delete news error!");
											gridPanel.getEl().unmask();
										}
									});
						}
					}
				});
	}

}
