var newsWindows = function(subjectItem, languageComboBox, newsSelectionModel,
		callback) {
	var desktop; // = this.app.getDesktop();
	if (typeof app == 'undefined' || app == null) {
		desktop = this.app.getDesktop();
	} else {
		desktop = app.getDesktop();
	}
	var scope = this;

	var subjectText = subjectItem.text;
	var subjectId = subjectItem.id;
	var lan = languageComboBox.getValue() == "en_name" ? "en_name" : "cn_name";

	var windowwidth = Ext.lib.Dom.getViewWidth();

	var windowheight = Ext.lib.Dom.getViewHeight();

	var newsWinId = 'news-win-'
			+ FileMngGlobal.getGlobalFileWindowAutoSequence();

	var operation = i18n.news_add;

	var newscode = null;
	if (newsSelectionModel) {
		
		newscode = newsSelectionModel.getSelections()[0].data.newsCode;
		newsWinId = 'news-win-' + newscode;
		operation = i18n.news_edit;
	}

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
			title : i18n.news_info,
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
									fieldLabel : i18n.news_title,
									labelSeparator : ':'

								}, {
									xtype : 'textfield',
									id : newsTagId,
									width : '100%',
									fieldLabel : i18n.news_tag,
									labelSeparator : ':'

								},

								new Ext.Panel({
									layout : 'form',
									defaultType : 'textfield',
									// frame : true,
									labelWidth : 100,

									width : '100%',
									tbar : [
											i18n.news_picture,
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
													+ "' src='noimage' onerror='this.style.visibility=\"hidden\"' />"]

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
									fieldLabel : i18n.news_source,
									labelSeparator : ':'

								}, {
									xtype : 'textfield',
									id : newsAuthorId,
									width : '100%',
									fieldLabel : i18n.news_author,
									labelSeparator : ':'

								}, {
									xtype : 'datefield',
									id : newsCreateDateId,
									format : 'Y-m-d',
									width : 200,
									fieldLabel : i18n.news_date,
									value : new Date(),
									labelSeparator : ':'
								}, new Ext.form.ComboBox({
											id : newsLanguageId,
											fieldLabel : i18n.language,
											triggerAction : 'all',
											mode : 'local',
											width : 200,
											store : new Ext.data.SimpleStore({

														fields : ['type',
																'language'],
														data : [
																[
																		'cn_name',
																		i18n.chinese],
																[
																		'en_name',
																		i18n.english]]
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
									fieldLabel : i18n.news_priority,
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
							text : i18n.news_handler_submit_close,
							handler : function() {
								scope.submitData(subjectId, newscode,
										function() {
											Ext.getCmp(newsWinId).close();
											callback(subjectItem);
										});
							}
						}), new Ext.Button({
							text : i18n.news_handler_submit_new,
							handler : function() {
								scope.submitData(subjectId, newscode,
										function() {

											Ext.getCmp(newsWinId).close();
											callback(subjectItem);
											new newsWindows(subjectItem,
													languageComboBox, null,
													callback);

										});

							}
						})],
				autoScroll : true,
				collapsible : true

			});

	var fwnum = FileMngGlobal.getGlobalFileWindowNumbers();

	if (Ext.getCmp(newsWinId)) {
		Ext.getCmp(newsWinId).show();
		return;
	}

	this.win = desktop.createWindow({
				id : newsWinId,
				title : subjectText + '(' + operation + ')',
				frame : true,
				layout : 'fit',
				x : windowwidth * 1 / 8 + 10 * fwnum,
				y : windowheight * 1 / 18 + 10 * fwnum,
				width : windowwidth * 3 / 4,
				height : windowheight * 8 / 9,
				iconCls : 'icon-dynamic1',
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
					},
					'close' : function() {
						tinyMCE.execCommand('mceRemoveEditor', true,
								newsTextareaId);
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
		if (data.newsPicture != null && data.newsPicture != "") {
			document.getElementById(this.newsId.newsTitlePictureId).value = data.newsPicture;
			document.getElementById(this.newsId.newsTitlePictureId + "_img").src = data.newsPicture;
			document.getElementById(this.newsId.newsTitlePictureId + "_img").style.visibility = "visible";
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
							scope.win.getEl().unmask();
						}
					});
		}
	},

	submitData : function(subjectCode, newscode, callback) {
		var scope = this;
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
						scope.win.getEl().unmask();
					}
				});

	}

}
