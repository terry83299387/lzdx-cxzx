Ext.grid.Grid = Ext.extend(Ext.grid.GridPanel, {
			loadMask : false,
			initEvents : function() {
				Ext.grid.Grid.superclass.initEvents.call(this);
				if (this.loadMask) {
					if (this.store.autoLoad) {
						return;
					}
					this.loadMask = new Ext.LoadMask(this.bwrap, Ext.apply({
										msg : i18n.mask_wait,
										store : this.store,
										removeMask : true
									}, this.loadMask));

					this.loadMask.show();
				}
			}
		})

Ext.EventManager.onWindowResize(function() {
			var s = Ext.getCmp('notice');
			if (s) {
				s.getEl().alignTo(Ext.getBody(), 'br-br',
						[0, -Ext.get('ux-taskbar').getHeight()]);
			}
		})

removeMessage = function() {
	Ext.Ajax.request({
		url : 'removeMessage.action',
		success : function(resp, opts) {
			var exception = (Ext.util.JSON.decode(resp.responseText)).exception;
			var info = (Ext.util.JSON.decode(resp.responseText)).info;
			if (Ext.util.Format.trim(exception).length != 0
					&& exception != null) {
				Ext.Msg.alert(i18n.error, exception);
				return;
			}
			if (Ext.util.Format.trim(info).length != 0 && info != null) {
				Ext.Msg.alert(i18n.prompt, info);
			}
			if (Ext.getCmp("noticePanel")) {
				Ext.DomHelper.overwrite(Ext.get("noticePanel"), "");
				Ext.DomHelper.overwrite(Ext.get("noticePanel"),
						['<div class="notice-body-wrap"><br><center>'
								+ i18n.notice_no
								+ '</center><div class="hr"></div></div>']
								.join(''));
			}

		},
		failure : function(resp, opts) {
			var resultArray = (Ext.util.JSON.decode(resp.responseText)).exception;
			var exceptionE = "";
			if (resultArray == '' || resultArray == null) {
				exceptionE = 'Unkown exception';
				Ext.Msg.alert(i18n.error, exceptionE);
			} else
				Ext.Msg.alert(i18n.error, resultArray);

		}
	})
}

Ext.myNoticeBox = function(userOpen) {
	if (Ext.getCmp("notice"))
		return;
	Ext.Ajax.request({
		url : 'showAllMessage.action',
		success : function(resp, opts) {
			var list = (Ext.util.JSON.decode(resp.responseText)).messageList;
			if (!userOpen && list.length == 0) {
				return;
			}
			var createNotice = function(list) {
//				if (list.length == 0) {
//					return ['<div class="notice-body-wrap"><br><center>'
//							+ i18n.notice_no
//							+ '</center><div class="hr"></div></div>'].join('');
//				} else {
					var str = "";
					for (var i = 0; i < list.length; i++) {
						var array = list[i].split(",");
						if (array[0] == "project") {
							str += '<div>' + i18n.notice_project1 + array[1]
									+ i18n.notice_project2
									+ '</div><div class="hr"></div>';
						} else if (array[0] == "disk") {
							var s = i18n.notice_disk1 + array[2] + "," + i18n.notice_disk2
									+ array[1] + "."
							str += '<div>' + s + '</div><div class="hr"></div>';
						} else if (array[0] == "job_done") {
							var s = i18n.notice_job  + array[1] + i18n.notice_job_done;
							str += '<div>' + s + '</div><div class="hr"></div>';
						} else if (array[0] == "register") {
							var s = i18n.notice_register1 +array[1] + i18n.notice_register2;
							str += '<div>' + s + '</div><div class="hr"></div>';
						}
					}

					return ['<div class="notice-body-wrap"><br><div class="notice-url-left">'
							+ i18n.notice_total
							+ list.length
							+ i18n.notice_number
							+ '</div><div class="notice-url-right"><a href="#" onclick=removeMessage()>'
							+ i18n.notice_delete
							+ '</a></div><br><div class="hr"></div>'
							+ str
							+ '</div>'].join('');
//				}
			}

			var myNoticeWindow = new Ext.Window({
						width : Ext.lib.Dom.getViewWidth() / 5,
						height : 150,
						id : 'notice',
						shadow : false,
						layout : 'fit',
						title : i18n.prompt,
						items : new Ext.Panel({
									id : 'noticePanel',
									autoScroll : true,
									html : createNotice(list),
									frame : true
								}),
						listeners : {
							show : function() {
								this.el.alignTo(Ext.getBody(), 'br-br', [
												0,
												-Ext.get('ux-taskbar')
														.getHeight()]);
								this.el.slideIn('b', {
											easing : 'easeOut',
											callback : function() {
												// this.close.defer(3000, this);
												// //
												// 定时关闭窗口
											},
											scope : this,
											duration : 1
										});
							}

						}

					});

			myNoticeWindow.show();

		},
		failure : function(resp, opts) {
			var resultArray = (Ext.util.JSON.decode(resp.responseText)).exception;
			var exceptionE = "";
			if (resultArray == '' || resultArray == null) {
				exceptionE = 'Unkown exception';
				Ext.Msg.alert(i18n.error, exceptionE);
			} else
				Ext.Msg.alert(i18n.error, resultArray);
		}
	})

};
Ext.ux.ToastWindowMgr = {
	positions : []
};
Ext.ux.ToastWindow = Ext.extend(Ext.Window, {
			initComponent : function() {
				Ext.apply(this, {
							iconCls : this.iconCls || 'information',
							width : 250,
							height : 150,
							autoScroll : true,
							autoDestroy : true,
							plain : false,
							shadow : false,
							show : function() {
								var s = this
								this.alignTo(Ext.getBody(), 'br-br');
								this.slideIn('b', {
											easing : 'easeOut',
											callback : function() {
												this.close.defer(3000, this); // 定时关闭窗口
											},
											scope : this,
											duration : 1
										});
							},
							hide : function() {
								if (this.isClose === true) { // 防止点击关闭和定时关闭处理
									return false;
								}
								this.isClose = true;
								this.slideOut('b', {
											easing : 'easeOut',
											callback : function() {
												this.un('beforeclose', hide,
														this);
												this.close();
											},
											scope : this,
											duration : 5
										});
								return false;
							}
						});

				Ext.ux.ToastWindow.superclass.initComponent.call(this);
			}

		});

Ext.myMessageBox = function() {

	var msgCt;
	function createBox(t, s) {
		return [
				'<div class="msg" id="msg">',
				'<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
				'<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>',
				t,
				'</h3>',
				s,
				'</div></div></div>',
				'<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
				'</div>'].join('');
	}
	return {
		msg : function(title, format) {
			if (!msgCt) {
				msgCt = Ext.DomHelper.insertFirst(document.body, {
							id : 'msg-div'
						}, true);
			}
			// msgCt.alignTo(document, 'br-br');
			var s = String.format.apply(String, Array.prototype.slice.call(
							arguments, 1));
			var m = Ext.DomHelper.append(msgCt, {
						html : createBox(title, s)
					}, true);
			m.slideIn('t').pause(10).ghost("l", {
						remove : true
					});
		}
	};
}();