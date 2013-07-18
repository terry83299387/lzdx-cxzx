/*
 * Ext JS Library 2.0.2 Copyright(c) 2006-2008, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */

var activeWindow;
Ext.Desktop = function(app) {
	scope=this;
	this.taskbar = new Ext.ux.TaskBar(app);
	var taskbar = this.taskbar;

	// taskbar.addDeskButton();

	var desktopEl = Ext.get('x-desktop');
	var taskbarEl = Ext.get('ux-taskbar');
	var shortcuts = Ext.get('x-shortcuts');

	var windows = new Ext.WindowGroup();

	// add by liujie. 20091117
	this.minmizeActiveWindow = function() {
		if (activeWindow) {
			scope.minimizeWin(activeWindow);
		}
	}
	
	this.getActiveWin = function() {
		return activeWindow;
	}

	this.minimizeWin=function(win) {
		win.minimized = true;
		win.hide();
	}

	this.markActive=function(win) {
		if (activeWindow && activeWindow != win) {
			scope.markInactive(activeWindow);
		}
		taskbar.setActiveButton(win.taskButton);
		activeWindow = win;
   
		Ext.fly(win.taskButton.el).addClass('active-win');
		win.minimized = false;


	}

	this.markInactive=function(win) {
		if (win == activeWindow) {
			activeWindow = null;
			Ext.fly(win.taskButton.el).removeClass('active-win');
		}
	}

	this.removeWin = function(win) {
		taskbar.removeTaskButton(win.taskButton);
		scope.layout();
		
	}

	this.layout=function() {
		var s = taskbar.startMenu;
		if (s) {
			s.hide();
		}
		desktopEl
				.setHeight(Ext.lib.Dom.getViewHeight() - taskbarEl.getHeight());
	}
	Ext.EventManager.onWindowResize(this.layout);

	

	this.createWindow = function(config, cls) {
		var win = new (cls || Ext.Window)(Ext.applyIf(config || {}, {
					manager : windows,
					constrainHeader : true,
					minimizable : true,
					maximizable : true
				}));
		win.render(desktopEl);
		win.taskButton = taskbar.addTaskButton(win);
		win.cmenu = new Ext.menu.Menu({
					items : [

					]
				});

		win.animateTarget = win.taskButton.el;
		win.on({
					'activate' : {
						fn : this.markActive
						
					},
					'beforeshow' : {
						fn : this.markActive
					},
					'deactivate' : {
						fn : this.markInactive
					},
					'minimize' : {
						fn : this.minimizeWin
					},
					'close' : {
						fn : this.removeWin
					}
				});

		scope.layout();

		return win;
	};

	this.getManager = function() {
		return windows;
	};

	this.getWindow = function(id) {
		return windows.get(id);
	}

	this.getWinWidth = function() {
		var width = Ext.lib.Dom.getViewWidth();
		return width < 200 ? 200 : width;
	}

	this.getWinHeight = function() {
		var height = (Ext.lib.Dom.getViewHeight() - taskbarEl.getHeight());
		return height < 100 ? 100 : height;
	}

	this.getWinX = function(width) {
		return (Ext.lib.Dom.getViewWidth() - width) / 2
	}

	this.getWinY = function(height) {
		return (Ext.lib.Dom.getViewHeight() - taskbarEl.getHeight() - height)
				/ 2;
	}

	scope.layout();

	if (shortcuts) {
		shortcuts.on('click', function(e, t) {
					if (t = e.getTarget('dt', shortcuts)) {
						e.stopEvent();
						var module = app.getModule(t.id
								.replace('-shortcut', ''));
						if (module) {
							module.createWindow();
						}
					}
				});
		shortcuts.on('contextmenu', function(e, t) {
			e.preventDefault();
			t = e.getTarget('dt', shortcuts);
			
			function deleteQuickRun(){
				var shortcutCode = t.id.replace("-win-shortcut", "");
				if(winMap.containsKey(shortcutCode)){
					Ext.Ajax.request({
							url: 'deleteShortcut.action',
							params : {shortcutCode:shortcutCode},
							success : function(response, options){
//								Ext.Msg.alert(i18n.shortcut_mention,i18n.shortcut_deleteSuccess);								
								deleteWin(winMap,shortcutCode);
								document.getElementById('x-shortcuts').innerHTML = wholeHTML(winMap);
								
							},
							failure : function(response, options){
								var msg = ["failure:", "\n",
											response.responseTest];
								alert(msg.join(''));
							}
						});
				}
			}
			function renameQuickRun(){				
			}
			if(t!= null){
				if(!winMap.containsKey(t.id)){
					this.rightClick = new Ext.menu.Menu({
						id : 'rightClickCont',
						items : [{
								id : 'deleteQuickRun',
								handler : deleteQuickRun,
								text : i18n.shortcut_deleteShortCut
//							},{
//								id : 'renameQuickRun',
//								handler : renameQuickRun,
//								text : i18n.shortcut_renameShortcut
							}]
					})
					this.rightClick.showAt(e.getXY());
				}
			}
			
		})
	}
};
