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
							text : '重新加载根',
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
							html : "1"
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
								name : 'type',
								mapping : 'type'
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
			fieldLabel : '分页',
			triggerAction : 'all',
			mode : 'local',
			store : new Ext.data.SimpleStore({

						fields : ['page', 'pagedisplay'],
						data : [['10', '每页10条'], ['50', '每页50条'],
								['100', '每页100条'], ['200', '每页200条'],
								['500', '每页500条'], ['100000000', '全部']]
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
			fieldLabel : '语言',
			triggerAction : 'all',
			mode : 'local',
			store : new Ext.data.SimpleStore({

						fields : ['type', 'language'],
						data : [['', '所有'], ['1', '中文'], ['2', 'English']]
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
					displayMsg : '第 {0} 条到 {1} 条，一共 {2} 条',
					emptyMsg : '沒有记录'
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
						items : ["选择语言", languageComboBox, {
							text : "添加",
							iconCls : "hd_006",
							handler : function() {
								scope.addNews(target, languageComboBox, sm);
							}
								// disabled : true

							}, {
							text : "编辑",
							iconCls : "hd_006",
							handler : function() {
								scope.editNews(target, languageComboBox, sm);
							}
								// disabled : true

						}, {
							text : "刪除",
							iconCls : "hd_006",
							handler : function() {
								scope.delNews(target, languageComboBox, sm);
							}

								// disabled : true

							}, {
							text : "刷新",
							iconCls : "hd_006",
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
			bbar : pagingToolBar,
			columns : [new Ext.grid.RowNumberer(), sm, {
						header : "标题",
						width : 100,
						sortable : true,
						dataIndex : "newsTitle"
					}, {
						header : "来源",
						width : 100,
						sortable : true,
						dataIndex : "newsSource"
					}, {
						header : "类型",
						width : 100,
						sortable : true,
						dataIndex : "type"
					}, {
						header : "封面图片",
						width : 100,
						sortable : true,
						dataIndex : "newsPicture"
					}, {
						header : "新闻标签",
						width : 100,
						sortable : true,
						dataIndex : "newsTag"
					}, {
						header : "作者",
						width : 100,
						sortable : true,
						dataIndex : "author"
					}, {
						header : "语言",
						width : 100,
						sortable : true,
						dataIndex : "type"
					}, {
						header : "优先级",
						width : 100,
						sortable : true,
						dataIndex : "newsPriority"
					}, {
						header : "创建时间",
						width : 150,
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
								text : "添加新栏目"
							}, {
								id : this.fileWinId + 'menu_refresh',
								handler : function() {

								},
								text : "刷新栏目"
							}, {
								id : this.fileWinId + 'menu_edit',
								handler : function() {

								},
								text : "编辑栏目"
							}, {
								id : this.fileWinId + 'menu_del',
								handler : function() {

								},
								text : "删除栏目"
							}]
				});

		event.preventDefault();
		rightClick.showAt(event.getXY());

	},

	addNews : function(node, languageComboBox, sm) {
		var scope = this;
		var newsWindow=new newsWindows(node,languageComboBox, null);
		
	},
	
	editNews:function(node, languageComboBox, sm)
	{
		var newsWindow=new newsWindows(node, languageComboBox, sm);
		
		
		
	}

}
