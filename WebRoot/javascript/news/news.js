var newsWindows = function(subjectItem, languageComboBox, newsSelectionModel) {
	var desktop; // = this.app.getDesktop();
	if (typeof app == 'undefined' || app == null) {
		desktop = this.app.getDesktop();
	} else {
		desktop = app.getDesktop();
	}
	var scope = this;

	var subjectText = subjectItem.text;
	var subjectId = subjectItem.id;
	var lan = languageComboBox.getValue() == "2" ? "2" : "1";
	var newscode = null;
	if (newsSelectionModel) {
		newscode = newsSelectionModel.getSelections()[0].data.newsCode;
	}

	var windowwidth = Ext.lib.Dom.getViewWidth();

	var windowheight = Ext.lib.Dom.getViewHeight();

	var newsWinId = 'news-win'
			+ FileMngGlobal.getGlobalFileWindowAutoSequence();
	var newsTextareaId = newsWinId + "textarea";
	var newsPanelid = newsWinId + 'news-panel';

	var newsTitleId = newsWinId + "title_field";
	var newsCreateDateId = newsWinId + "createdate_field";
	var newsTitlePictureId = newsWinId + "title_pic_field";

	var newsTitlePicWinId = newsTitlePictureId + "_win";
	var newsLanguageId = newsWinId + "language";
	var newsAuthorId = newsWinId + "author";
	var newsPriorityId = newsWinId + "priority";
	var newsTagId = newsWinId + "tag";
	var newsSourceId = newsWinId + "source";
	this.newsId = {

		newsTitleId : newsTitleId,
		newsTextareaId : newsTextareaId,
		newsCreateDateId : newsCreateDateId,
		newsTitlePictureId : newsTitlePictureId,
		newsLanguageId : newsLanguageId,
		newsAuthorId : newsAuthorId,
		newsPriorityId : newsPriorityId,
		newsTagId : newsTagId,
		nwsSourceId : newsSourceId
	}

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
			title : '������Ϣ',
			width : '100%',
			layout : 'column',
			items : [
					// when use layout, items must be panel
					new Ext.Panel({
						layout : 'form',
						defaultType : 'textfield',
						columnWidth : .5,
						frame : true,
						labelWidth : 80,
						items : [{
									xtype : 'textfield',
									id : newsTitleId,
									width : '100%',
									fieldLabel : '���±���',
									labelSeparator : ':'

								}, {
									xtype : 'textfield',
									id : newsTagId,
									width : '100%',
									fieldLabel : '��ǩ',
									labelSeparator : ':'

								},

								new Ext.Panel({
									layout : 'form',
									defaultType : 'textfield',
									// frame : true,
									labelWidth : 100,

									width : '100%',
									tbar : [
											'ͼƬ����',
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
											"<img style='height:70;' id='"
													+ newsTitlePictureId
													+ "_img"
													+ "' src='no' onerror='this.style.visibility=\"hidden\"' />"]

								})]
					}), new Ext.Panel({
						layout : 'form',
						defaultType : 'textfield',
						frame : true,
						labelWidth : 80,
						columnWidth : .5,
						items : [{
									xtype : 'textfield',
									id : newsSourceId,
									width : '100%',
									fieldLabel : '��Դ',
									labelSeparator : ':'

								}, {
									xtype : 'textfield',
									id : newsAuthorId,
									width : '100%',
									fieldLabel : '����',
									labelSeparator : ':'

								}, {
									xtype : 'datefield',
									id : newsCreateDateId,
									format : 'Y-m-d',
									width : 200,
									fieldLabel : '��������',
									value : new Date(),
									labelSeparator : ':'
								}, new Ext.form.ComboBox({
											id : newsLanguageId,
											fieldLabel : '����',
											triggerAction : 'all',
											mode : 'local',
											width : 200,
											store : new Ext.data.SimpleStore({

														fields : ['type',
																'language'],
														data : [
																['1', '����'],
																['2', 'English']]
													}),
											value : lan,
											editable : 'false',
											displayField : 'language',
											valueField : 'type'
										}),

								{
									xtype : 'textfield',
									id : newsPriorityId,
									width : '100%',
									fieldLabel : '���ȼ�',
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
				// bbar : [tb3],
				buttons : [new Ext.Button({
							text : "�ύ���˳�",
							handler : function() {
								scope.submitData(subjectId, newscode,
										function() {
											Ext.getCmp(newsWinId).close();
										});
							}
						}), new Ext.Button({
							text : "�ύ��ʼ��һ��"
						}), new Ext.Button({
							text : "�ύ��ͣ���ڵ�ǰ"
						})],
				autoScroll : true,
				collapsible : true

			});

	var fwnum = FileMngGlobal.getGlobalFileWindowNumbers();
	
	if(Ext.getCmp(newsWinId))
	{
		Ext.getCmp(newsWinId).show();
		return ;
	}
	
	this.win = desktop.createWindow({
				id : newsWinId,
				title : subjectText,
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

	this.win.show();

	this.loadData(newscode);

}
newsWindows.prototype = {

	setData : function(data) {

		document.getElementById(this.newsId.newsTitleId).value = data.newsTitle;
		Ext.getCmp(this.newsId.newsLanguageId).setValue(data.type);
		document.getElementById(this.newsId.newsAuthorId).value = data.author;
		document.getElementById(this.newsId.newsPriorityId).value = data.newsPriority;
		document.getElementById(this.newsId.newsTagId).value = data.newsTag;
		document.getElementById(this.newsId.nwsSourceId).value = data.newsSource;
		if (data.newsPicture != null&&data.newsPicture !="") {
			document.getElementById(this.newsId.newsTitlePictureId).value = data.newsPicture;
		}
		Ext.getCmp(this.newsId.newsCreateDateId).setValue(data.createDate
				.replace("T00:00:00", ""));

		document.getElementById(this.newsId.newsTextareaId).innerHTML = data.newsContent;

	},

	getData : function() {

		var data = {

			newsTitle : document.getElementById(this.newsId.newsTitleId).value,
			newsTextarea : tinymce.get(this.newsId.newsTextareaId).getContent(),
			newsCreateDate : document
					.getElementById(this.newsId.newsCreateDateId).value,
			newsTitlePicture : document
					.getElementById(this.newsId.newsTitlePictureId).value,
			newsLanguage : Ext.getCmp(this.newsId.newsLanguageId).getValue(),
			newsAuthor : document.getElementById(this.newsId.newsAuthorId).value,
			newsPriority : document.getElementById(this.newsId.newsPriorityId).value,
			newsTag : document.getElementById(this.newsId.newsTagId).value,
			newsSource : document.getElementById(this.newsId.nwsSourceId).value
		}
		return data;
	},

	loadData : function(newscode) {
		var scope = this;
		if (newscode) {
			this.win.getEl().mask(i18n.mask_wait);
			Ext.Ajax.request({
						url : 'loadNews.action',
						params : {
							newsCode : newscode

						},
						success : function(resp, opts) {
							var responseObject = Ext.util.JSON
									.decode(resp.responseText);

							scope.setData(responseObject.newsInfo);
							scope.win.getEl().unmask();

						},
						failure : function(resp, opts) {
							Ext.MessageBox
									.alert(i18n.error, "read data error!");
							this.win.getEl().unmask();
						}
					});
		}
	},

	submitData : function(subjectCode, newscode, callback) {

		this.win.getEl().mask(i18n.mask_wait);
		var params = this.getData();
		params.subjectCode = subjectCode;
		params.newsCode = newscode;
		Ext.Ajax.request({
					url : 'submitNews.action',
					params : params,
					success : function(resp, opts) {
						var responseObject = Ext.util.JSON
								.decode(resp.responseText);

						callback();
						scope.win.getEl().unmask();

					},
					failure : function(resp, opts) {
						Ext.MessageBox.alert(i18n.error, "read data error!");
						this.win.getEl().unmask();
					}
				});

	}

}
