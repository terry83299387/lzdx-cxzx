var fileSupport = {

	setComponetStatus : function(componentid, isEnable) {
		var count = 0;
		var id = componentid;
		while (true) {
			var component = Ext.getCmp(this.fileWinId + id);
			if (!component || component == null || component == undefined)
				break;

			else {
				if (isEnable)
					Ext.getCmp(this.fileWinId + id).enable();
				else
					Ext.getCmp(this.fileWinId + id).disable();
			}
			count++;
			id = id + "{" + count + "}";
		}

		if (count > 0) {
			return true;
		} else {
			return false;
		}

	},
	/**
	 * reload all of windows
	 * 
	 */
	updateAllCache : function() {

		var visited = new Ext.util.MixedCollection();

		for (var i = 0; i < FileMngGlobal.getFilePanelCollection().items.length; i++) {
			var otherfilePanel = FileMngGlobal.getFilePanelCollection().items[i];
			var currentdir = otherfilePanel.currentdir;
			if (visited.containsKey(currentdir)) {
				// otherfilePanel.refresh({
				// filepath : currentdir
				// });
				continue;
			} else {
				visited.add(currentdir, '');

				// find out all panels which have the same currentdir,then
				// refresh one of them and reload others from key-cache.
				var filePanelArray = [];
				for (var j = 0; j < FileMngGlobal.getFilePanelCollection().items.length; j++) {
					var otherfilePaneltemp = FileMngGlobal
							.getFilePanelCollection().items[j];
					if (otherfilePanel.id != otherfilePaneltemp.id
							&& currentdir == otherfilePaneltemp.currentdir) {
						filePanelArray.push(otherfilePaneltemp);

					}
				}

				var oldAfterRefresh = otherfilePanel.afterRefresh;
				otherfilePanel.afterRefresh = function() {
					otherfilePanel.reloadCache(filePanelArray);
					otherfilePanel.afterRefresh = oldAfterRefresh
				};
				otherfilePanel.refresh({
							filepath : currentdir,
							focus : true
						});

			}

		}
		visited.clear();
		visited = null;

	},
	/**
	 * refresh all of other windows
	 * 
	 */
	updateOtherCache : function(multihost) {

		for (var i = 0; i < FileMngGlobal.getFilePanelCollection().items.length; i++) {
			var otherfilePanel = FileMngGlobal.getFilePanelCollection().items[i];
			if (otherfilePanel.id != this.id) {
				if (multihost) {
					otherfilePanel.refresh({
								filepath : otherfilePanel.currentdir
							});
				} else if (this.host == otherfilePanel.host) {
					// && this.host == otherfilePanel.host) {
					otherfilePanel.refresh({
								filepath : otherfilePanel.currentdir
							});
				}
			}

		}

	},
	/**
	 * initStatus all of other windows
	 * 
	 */
	updateOtherStatus : function(multihost) {

		for (var i = 0; i < FileMngGlobal.getFilePanelCollection().items.length; i++) {
			var otherfilePanel = FileMngGlobal.getFilePanelCollection().items[i];

			if (otherfilePanel.id != this.id) {

				if (multihost) {
					otherfilePanel.initStatus(otherfilePanel.currentdir);
				} else if (this.host == otherfilePanel.host) {
					otherfilePanel.initStatus(otherfilePanel.currentdir);
				}

			}

		}
	},
	reloadOtherCache : function() {

		for (var i = 0; i < FileMngGlobal.getFilePanelCollection().items.length; i++) {
			var otherfilePanel = FileMngGlobal.getFilePanelCollection().items[i];
			if (otherfilePanel.id != this.id
					&& this.host == otherfilePanel.host
					&& otherfilePanel.currentdir == this.currentdir) {

				otherfilePanel.initStatus(otherfilePanel.currentdir);
				var key = otherfilePanel.packetKey(otherfilePanel.host,
						otherfilePanel.currentdir);
				if (otherfilePanel.containKey(key)) {

					var theData = otherfilePanel.getData(key);

					// FileMngGlobal.getFileDataCacheMap().removeKey(key);
					// this.addData(key, theData);
					var cachelength = theData.length;

					// not real refresh
					var cachestart = otherfilePanel.pagingmap.get(key);
					cachestart = cachestart == null ? 0 : cachestart;
					otherfilePanel.grid.getEl().mask(i18n.mask_wait);
					otherfilePanel.grid.store.removeAll();
					otherfilePanel.grid.store.add(otherfilePanel.getMyStore(
							key, 1, cachestart).data.items);
					otherfilePanel.firePagingToolBar(cachestart, cachestart
									/ otherfilePanel.limited + 1, cachelength);
					otherfilePanel.grid.getEl().unmask();
				}

			}

		}

	},

	getCurrentData : function() {
		var key = this.packetKey(this.host, this.currentdir);
		return this.getData(key);
	},
	reloadSelfCache : function() {
		var key = this.packetKey(this.host, this.currentdir);
		if (this.containKey(key)) {

			var theData = this.getData(key);

			var cachelength = theData.length;
			var cachestart = this.getPagingToolBarCursor();
			cachestart = cachestart == null ? 0 : cachestart;
			this.grid.getEl().mask(i18n.mask_wait);
			this.grid.store.removeAll();
			this.grid.store.add(this.getMyStore(key, 1, cachestart).data.items);
			this.firePagingToolBar(cachestart, cachestart / this.limited + 1,
					cachelength);
			this.grid.getEl().unmask();
		}

	},
	reloadCache : function(filePanelArray) {

		for (var i = 0; i < filePanelArray.length; i++) {
			var currentfilePanel = filePanelArray[i];
			currentfilePanel.initStatus(currentfilePanel.currentdir);
			var key = currentfilePanel.packetKey(currentfilePanel.host,
					currentfilePanel.currentdir);
			if (currentfilePanel.containKey(key)) {

				var theData = currentfilePanel.getData(key);

				// FileMngGlobal.getFileDataCacheMap().removeKey(key);
				// this.addData(key, theData);
				var cachelength = theData.length;

				// not real refresh
				var cachestart = currentfilePanel.pagingmap.get(key);
				cachestart = cachestart == null ? 0 : cachestart;
				currentfilePanel.grid.getEl().mask(i18n.mask_wait);
				currentfilePanel.grid.store.removeAll();
				currentfilePanel.grid.store.add(currentfilePanel.getMyStore(
						key, 1, cachestart).data.items);
				currentfilePanel.firePagingToolBar(cachestart, cachestart
								/ currentfilePanel.limited + 1, cachelength);
				currentfilePanel.grid.getEl().unmask();
			}

		}

	},
	closeOtherFileWin : function(path) {
		for (var i = 0; i < FileMngGlobal.getFilePanelCollection().items.length; i++) {
			var otherfilePanel = FileMngGlobal.getFilePanelCollection().items[i];
			if (otherfilePanel.id != this.id
					&& this.host == otherfilePanel.host) {
				if (otherfilePanel.currentdir.indexOf(path) == 0) {

					otherfilePanel.getWinCmp().close();
					i--;

				}

			}

		}

	},
	hostUserName : "",

	ds : null,
	r : 0,
	host : "",
	rightClick : null,
	srcfilepath : "",
	currentdir : "",
	init : false,
	workdir : "",
	serverName : "",
	grid : null,
	hostPwd : "",
	fileTransferPort : "",
	fileTransferProtocol : "",
	clientKey : '',
	/***************************************************************************
	 * @type RegExp regex : /^[\w-_#\s\u2E80-\u9FFF]+[\w-_.#\s\u2E80-\u9FFF]*$/
	 *       Modified by lyy for 1.0 1 remove '-' as first alphabet ,because it
	 *       would be an command in Linux ,so that it is a bug 2 it only allows
	 *       space between query string
	 */
	regex : /^[\w_#@\+\u2E80-\u9FFF]+[\w-_.#@\+\u2E80-\u9FFF]*[\w-_.#@\+\u2E80-\u9FFF]+$|^[\w_#@\+\u2E80-\u9FFF]+$/,
	checkFileParam : "-c",
	ignoreFileParam : "-p",
	limited : 50,
	pagingmap : new Ext.util.MixedCollection(),
	beforeEditData : null,
	file_shares : 'file_shares',

	cellclickdata_reset : true,
	cellclickdata_rowindex : -1,
	cellclickdata_name : '',
	cellclickdata_clickcount : 0,
	getRootPath : function() {
		// if(this.r==2)
		// {
		// return this.getFilePath(this.workdir);
		// }
		return this.rootdir;

	},
	resetCellClick : function() {
		this.cellclickdata_reset = true;
		this.cellclickdata_rowindex = -1;
		this.cellclickdata_name = '';
		this.cellclickdata_clickcount = 0;

	},
	sortType : null,
	sortDir : 'ASC',
	sortData : function(onlysort) {

		if (this.sortType) {
			var key = this.packetKey(this.host, this.currentdir);
			if (this.containKey(key)) {
				var sortingdata = this.getCurrentData();

				var fn = function(data, type, direction) {
					if (type == 'typesorting') {
						if (data.type == 1) {
							return '1'
						}
						var reflect = Ext.ux.Util.reflectType(data.name);
						return '0' + reflect.filetype;

					}

					return data[type];
				}

				Ext.ux.Util.dataSort(sortingdata, this.sortType, this.sortDir,
						fn);

				if (!onlysort) {
					var cachestart = this.getPagingToolBarCursor();
					this.grid.store.removeAll();
					this.grid.store
							.add(this.getMyStore(key, 1, cachestart).data.items);
				}

			}
		}
	},
	AddressRecords : {

		forward : 'forward',
		backward : 'backward',
		upward : 'upward',
		enter : 'enter',
		reset : 'reset'
	},

	KeyMap : null,
	forwardrecords : [],
	backwardrecords : [],
	resetAddress : function() {

		this.forwardrecords = [];
		this.backwardrecords = [];

		this.setComponetStatus('tb_forward', false);
		this.setComponetStatus('tb_backward', false);

		// Ext.getCmp(this.fileWinId + 'tb_forward').disable();
		// Ext.getCmp(this.fileWinId + 'tb_backward').disable();

	},
	currentAddressChange : function(type, currentAddr, fileWinId) {

		var newAddr = null;
		if (type == this.AddressRecords.backward) {

			this.forwardrecords.push(currentAddr);

			this.setComponetStatus('tb_forward', true);
			// Ext.getCmp(fileWinId + 'tb_forward').enable();
			if (this.backwardrecords.length > 0) {
				newAddr = this.backwardrecords.pop();
			}
			if (this.backwardrecords.length == 0) {
				this.setComponetStatus('tb_backward', false);
				// Ext.getCmp(fileWinId + 'tb_backward').disable();
			} else {
				this.setComponetStatus('tb_backward', true);
				// Ext.getCmp(fileWinId + 'tb_backward').enable();
			}
			return newAddr;
		} else if (type == this.AddressRecords.forward) {
			this.backwardrecords.push(currentAddr);
			this.setComponetStatus('tb_backward', true);
			// Ext.getCmp(fileWinId + 'tb_backward').enable();
			if (this.forwardrecords.length > 0) {
				newAddr = this.forwardrecords.pop();
			}
			if (this.forwardrecords.length == 0) {
				this.setComponetStatus('tb_forward', false);
				// Ext.getCmp(fileWinId + 'tb_forward').disable();
			} else {
				this.setComponetStatus('tb_forward', true);
				// Ext.getCmp(fileWinId + 'tb_forward').enable();
			}
			return newAddr;
		} else if (type == this.AddressRecords.enter) {
			this.forwardrecords = [];
			return this.currentAddressChange('forward', currentAddr, fileWinId);
		} else if (type == this.AddressRecords.upward) {
			this.forwardrecords = [];
			return this.currentAddressChange('forward', currentAddr, fileWinId);
		}

	},

	openDefaultDir : function(params) {
		var opendir = this.defaultdir;
		if (params && params.folder) {
			opendir = params.folder;

		}

		if (this.currentdir != opendir) {
			this.currentAddressChange(this.AddressRecords.enter,
					this.currentdir, this.fileWinId);

			this.currentdir = opendir;
			Ext.get(this.fileWinId + 'txt_url').dom.value = this.currentdir;
		}

		this.refresh({
					filepath : this.currentdir
				});
	},

	upload : function() {
		this.rightClick.hide();
		var scope = this;
		var invalidpath = this.checkPermission('upload');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			return false;
		}

		dialog = new Ext.ux.UploadDialog.Dialog({
					url : 'uploadServerFile.action',
					reset_on_hide : false,
					allow_close_on_upload : true,
					upload_autostart : false,
					base_params : {
						filepath : scope.currentdir
					}
				});
		dialog.on('uploadsuccess', function(dialog, filename, data, record) {
					var currentdir = scope.currentdir;
					var clusterIp = scope.host;
					var key = scope.packetKey(clusterIp, currentdir);
					var currentCacheData = scope.getData(key);
					var start = scope.getPagingToolBarCursor();

					var newvalue = new Object();
					newvalue.name = data.fileFileName;
					newvalue.permission = '-rwxrwxrwx';
					newvalue.typeString = 'File';
					newvalue.size = data.fileSize;
					newvalue.type = 0;
					newvalue.lastModified = Ext.ux.Util
							.formatTime(data.fileLastModified);
					newvalue.currentPath = currentdir + "/" + filename;

					scope.removeItemValue(key, newvalue)
					scope.addItem(key, newvalue, start);
					scope.refreshStore(key, start);
					scope.grid.getSelectionModel().selectRow(0, false);
					scope.updateOtherCache();

				});
		dialog.show(this.fileWinId + 'menu_uploadplugin');
		// var appletClient = new Ext.sccportal.Applet({
		// host : this.host,
		// user : this.hostUserName,
		// passwd : this.hostPwd,
		// home : this.currentdir,
		// dlgtype : 'Upload',
		// port : this.fileTransferPort,
		// rootpath : this.rootdir,
		// defaultpath : this.workdir,
		// fileTransferProtocol : this.fileTransferProtocol,
		// servername : this.serverName,
		// clientkey : this.clientKey
		// });

	},

	download : function(defaultsels) {
		if (this.rightClick) {
			this.rightClick.hide();
		}
		var scope = this;
		var invalidpath = this.checkPermission('download');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			return false;
		}
		if (defaultsels.sels) {
			var sels = defaultsels.sels;
		} else {
			var sels = this.grid.getSelectionModel().getSelections();
		}
		var len = sels.length;
		var filesArray = '';

		for (var i = 0; i < len; i++) {
			var sel = sels[i];
			if (this.currentdir.lastIndexOf('/') == this.currentdir.length - 1) {

				filesArray = filesArray + this.currentdir + sel.get('name')
						+ '|';
			} else {

				filesArray = filesArray + this.currentdir + '/'
						+ sel.get('name') + '|';
			}

		}

		filesArray = filesArray.substring(0, filesArray.length - 1);

		var appletClient = new Ext.sccportal.Applet({
					host : this.host,
					user : this.hostUserName,
					passwd : this.hostPwd,
					files : filesArray,
					home : this.currentdir,
					dlgtype : 'Download',
					rootpath : this.rootdir,
					defaultpath : this.workdir,
					port : this.fileTransferPort,
					fileTransferProtocol : this.fileTransferProtocol,
					servername : this.serverName,
					clientkey : this.clientKey
				});
	},
	del : function() {
		Ext.Msg.buttonText.yes = i18n.confirm;
		Ext.Msg.buttonText.no = i18n.no;
		var currentdir = this.currentdir;
		var clusterIp = this.host;
		var msg = "";
		var scope = this;
		if (this.grid.getSelectionModel().getSelections().length > 1) {
			msg = i18n.prompt_deletefile;
		} else {
			msg = i18n.prompt_deletesinglefile
					+ this.grid.getSelectionModel().getSelections()[0]
							.get('name') + "?"
		}
		Ext.MessageBox.show({
			title : i18n.prompt,
			msg : msg,
			buttons : Ext.Msg.YESNO,
			icon : Ext.Msg.WARNIN,
			scope : scope,
			fn : function(btn) {
				scope.setWinCmpFocus();

				if (btn == 'yes') {
					var invalidpath = scope.checkPermission('del');
					if (invalidpath != null) {
						Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
										+ invalidpath, function() {
									scope.setWinCmpFocus();
								});
						return false;
					}
					scope.grid.getEl().mask(i18n.mask_wait);
					var sels = this.grid.getSelectionModel().getSelections();
					var len = sels.length;
					var list = [];
					for (var i = 0; i < len; i++) {
						var sel = sels[i];
						list.push(sel.get('name'));
					}

					var key = this.packetKey(clusterIp, currentdir);
					// var olddata = this.getData(key);
					var start = scope.getPagingToolBarCursor();
					// suppose as right
					var itemLength = this
							.removeSelectionItems(key, sels, false);

					var cstart = start;
					if ((cstart = scope.getLastCursor(itemLength)) < start) {
						/** load data from cache to refresh store appearance * */
						this.refreshStore(key, cstart);

					} else {
						/** load data from cache to refresh store appearance * */
						this.refreshStore(key, start);

					}
					this.updateOtherCache();
					scope.grid.getEl().unmask();

					function doDel(ifcheck) {
						Ext.Ajax.request({
							url : 'doDel.action',
							params : {
								filenamelist : list.join(','),
								filepath : currentdir,
								clusterCode : scope.clusterCode,
								ifcheck : ifcheck
							},
							success : function(resp, opts) {
								// this.grid.getEl().unmask();
								var responseObject = Ext.util.JSON
										.decode(resp.responseText);

								if (responseObject.fileInfo.exception) {
									Ext.Msg.alert(i18n.error,
											responseObject.fileInfo.exception,
											function() {
												scope.setWinCmpFocus();
											});
								}

								if (responseObject.unique == 1) {

									/**
									 * ** remove all subdirs of the directory
									 * that has been deleted successfully ***
									 */
									for (var i = 0; i < list.length; i++) {
										var path = currentdir + "/" + list[i];

										this.removeData(this.packetKey(
												clusterIp, path));
										this.closeOtherFileWin(path);
									}

								} else {

									if (responseObject.unique == 3) {
										Ext.MessageBox.show({
											title : i18n.prompt,
											msg : responseObject.fileInfo.info
													+ '</ br>'
													+ i18n.delete_running_job
													+ '\n' + msg,
											buttons : Ext.Msg.YESNO,
											icon : Ext.Msg.WARNIN,
											fn : function(btn) {

												scope.setWinCmpFocus();
												if (btn == 'yes') {
													doDel('false');
													return;
												} else {
													/** ** resume data *** */
													scope.grid
															.getEl()
															.mask(i18n.mask_wait);

													/**
													 * add former selections to
													 * cache
													 */
													var resumesel = [];
													for (var i = 0; i < sels.length; i++) {
														if (responseObject.fileInfo.exception
																.indexOf(currentdir
																		+ '/'
																		+ sels[i]
																				.get('name')) > -1) {
															resumesel
																	.push(sels[i]);

														}
													}

													scope
															.addItemsSelectionGroup(
																	key,
																	resumesel,
																	start);
													/**
													 * load data from cache to
													 * refresh store appearance
													 */
													if (currentdir == scope.currentdir
															&& clusterIp == scope.host) {
														scope.refreshStore(key,
																start);
														scope.grid
																.getSelectionModel()
																.selectRange(
																		0,
																		resumesel.length
																				- 1);
													}
													scope.updateOtherCache();
													scope.grid.getEl().unmask();
												}

											}

										});

									}
								}

								// Ext.Msg.alert(i18n.prompt,
								// resultArray.exception);
							},
							failure : function(resp, opts) {
								/** ** resume data *** */
								var exceptionE = i18n.error_connection;
								Ext.Msg.alert(i18n.error, exceptionE,
										function() {
											scope.setWinCmpFocus();
										});
								scope.grid.getEl().mask(i18n.mask_wait);

								/** add former selections to cache * */
								this.addItemsSelectionGroup(key, sels, start);
								/**
								 * load data from cache to refresh store
								 * appearance *
								 */
								if (currentdir == this.currentdir
										&& clusterIp == this.host) {
									this.refreshStore(key, start);
									this.grid.getSelectionModel().selectRange(
											0, sels.length - 1);
								}
								this.updateOtherCache();
								scope.grid.getEl().unmask();

							},
							scope : scope
						});
					}

					doDel('true');
				}
			}
		})

	},
	allselect : function() {
		var sm = this.grid.getSelectionModel();
		sm.selectAll();
		if (this.checkCurrentFile) {
			this.checkCurrentFile();
		}
	},
	paste : function() {
		// var destfilepath =
		// Ext.ux.Util.URLencode(this.currentdir.replace(/\%/g,
		// "%"));

		function checkPasteIntoSelf() {
			var checkdir = scope.currentdir + '/';
			for (var i = 0; i < list.length; i++) {
				if (checkdir.indexOf(FileMngGlobal.filePasteShares.pasteSrcPath
						+ '/' + list[i].get('name') + '/') == 0) {
					Ext.Msg.alert(i18n.error, 'Cannot be pasted into self',
							function() {
								scope.setWinCmpFocus();
							});
					return false;

				}

				return true;

			}

		}

		function checkInvalidPath() {
			var invalidpath = scope.checkPermission('paste');
			if (invalidpath != null) {
				Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
								+ invalidpath, function() {
							scope.setWinCmpFocus();
						});
				return false;
			}
			return true;

		}

		function checkCopySameCluster() {
			if (pasteClusterCode != scope.clusterCode) {

				// Ext.Msg.alert(i18n.error, 'Cluster must be same', function()
				// {
				// scope.setWinCmpFocus();
				// });
				// return false;

			}
			return true;

		}

		function setAndCheckPasteFileList() {
			for (var i = 0; i < FileMngGlobal.filePasteShares.pasteFileList.length; i++) {
				list.push(FileMngGlobal.filePasteShares.pasteFileList[i]);

			}

			if (list.length == 0 || list == null || list == undefined) {
				FileMngGlobal.filePasteShares.pasteflag = null;
				FileMngGlobal.filePasteShares.pasteSrcPath = null;
				return false;
			}
			return true;

		}

		function checkPasteType() {
			if (pasteClusterCode != scope.clusterCode
					|| srcfilepath != destfilepath) {
				var currentCacheData = scope.getData(key);

				for (var j = 0; j < currentCacheData.length; j++) {
					if (isExisted)
						break;
					for (var i = 0; i < list.length; i++) {
						var name = list[i].get('name');
						if (name == currentCacheData[j].name) {

							isExisted = true;
							break;

						}
					}
				}

			} else {
				// paste file in same directory
				if (pasteType == "cut") {
					list = null;
					return false;
				} else {
					isSameCopy = true;
				}

			}

			return true;

		}

		function pasteCacheData(isCp, isSameDir, isSameHost) {

			var newlist = [];
			var desData = scope.getData(key);

			// var count = 0;
			if (isSameDir) {
				for (var i = 0; i < list.length; i++) {
					var checkname = list[i].get('name');
					var type = list[i].get('type');
					var temp = 1;
					var copyofstr = 'cp_of_';
					while (scope
							.checkFileExisted(scope.getData(key), checkname)) {
						if (checkname.indexOf(copyofstr) == 0) {

							var tem_num = checkname.substring(copyofstr.length,
									checkname.indexOf('_', copyofstr.length));
							if (parseInt(tem_num)) {
								var prefix = copyofstr + (temp++) + '_';
								checkname = prefix
										+ checkname
												.substring(
														(copyofstr + tem_num + '_').length,
														checkname.length);
							} else {
								checkname = copyofstr
										+ '1_'
										+ checkname.substring(copyofstr.length,
												checkname.length);
							}
						} else {
							checkname = copyofstr + checkname;
						}

					}

					var newvalue = new Object();
					newvalue.name = checkname;
					newvalue.oldname = list[i].get('name');
					newvalue.permission = list[i].get('permission');
					newvalue.typeString = list[i].get('typeString');
					newvalue.size = list[i].get('size');
					newvalue.type = type
					newvalue.lastModified = list[i].get('lastModified');
					scope.addItem(key, newvalue, start);
					newlist.push(newvalue);
					addnewfilelist.push(newvalue);
					movefilenamelist.push(list[i].get('name'));
					tonewfilenamelist.push(checkname);
				}
				scope.grid.getEl().mask();

				scope.refreshStore(key, start);
				scope.updateOtherCache(true);
				// count = list.length;
			} else {
				for (var i = 0; i < list.length; i++) {
					var checkname = list[i].get('name');
					var newvalue = new Object();
					newvalue.name = checkname;
					newvalue.oldname = checkname;
					newvalue.permission = list[i].get('permission');
					newvalue.typeString = list[i].get('typeString');
					newvalue.size = list[i].get('size');
					newvalue.type = list[i].get('type');
					if (isSameHost) {
						newvalue.lastModified = list[i].get('lastModified');

					} else {
						newvalue.lastModified = Ext.ux.Util
								.formatTime(new Date().getTime());
					}
					if (!scope.checkFileExisted(scope.getData(key), checkname)) {

						// scope.addItem(key, newvalue, start);
						// count++;
						addnewfilelist.push(newvalue);
					} else {
						// var changedItem=scope.changeItemJson(key, checkname,
						// {
						// permission : list[i].get('permission'),
						// size : list[i].get('size'),
						// lastModified : list[i].get('lastModified')
						// });

						existedfilelist.push(newvalue);
					}

					newlist.push(newvalue);
					movefilenamelist.push(checkname);
					tonewfilenamelist.push(checkname);
				}

				scope.grid.getEl().mask();
				scope.addItemsGroup(key, addnewfilelist, start);
				oldfilelist = scope.changeItemGroup(key, existedfilelist);
				scope.refreshStore(key, start);
				scope.updateOtherCache(true);
			}

			// scope.grid.store.removeAll();
			// scope.grid.store.add(scope.getMyStore(key, null,
			// start).data.items);
			// scope.firePagingToolBar(start, null, olddata.length + count);

			var griditem = scope.grid.store.data.items;
			// var r = this.grid.getSelections()[0];
			for (var k = 0; k < scope.grid.store.getCount(); k++) {
				for (var m = 0; m < list.length; m++) {
					if (griditem[k].data["name"] == list[m].get('name')
							&& griditem[k].data["type"] == list[m].get('type')) {
						scope.grid.getSelectionModel().selectRow(k, true);
						break;
					}
				}

			}

			// scope.grid.getSelectionModel().selectRange(0,
			// FileMngGlobal.filePasteShares.pasteFileList.length - 1);
			scope.reloadStatus();
			scope.grid.getEl().unmask();
			return newlist;
		}

		function parseExistFileErrorFromException(exception) {
			var isFileError = false;
			for (var i = 0; i < movefilenamelist.length; i++) {

				// alert(srcfilepath + "/" +
				// tonewfilenamelist[i]);
				if (exception.indexOf(srcfilepath + "/" + movefilenamelist[i]) > -1) {
					isFileError = true;

					break;
				}

			}
			return isFileError;

		}

		function parseResumeFileListFromException(exception) {
			var resumefilelist = [];
			for (var i = 0; i < list.length; i++) {
				if (exception.indexOf(srcfilepath + "/" + list[i].get('name')) > -1) {
					resumefilelist.push(list[i]);
				}
			}
			return resumefilelist;

		}

		function resumeSourcePasteItems(resumefilelist) {
			if (resumefilelist != null) {
				scope.addItemsSelectionGroup(scope.packetKey(pasteClusteIp,
								srcfilepath), resumefilelist, pasteStart);
			} else {
				scope.addItemsSelectionGroup(scope.packetKey(pasteClusteIp,
								srcfilepath), list, pasteStart);
			}
		}

		var scope = this;
		var destfilepath = this.currentdir;
		// var srcfilepath = this.srcfilepath;
		var srcfilepath = FileMngGlobal.filePasteShares.pasteSrcPath;
		var pasteType = FileMngGlobal.filePasteShares.pasteflag;
		var pasteStart = FileMngGlobal.filePasteShares.pasteStart;
		var clusterIp = this.host;
		var pasteClusteIp = FileMngGlobal.filePasteShares.pasteHost;
		var pasteClusterCode = FileMngGlobal.filePasteShares.pasteClusterCode;
		var list = [];

		if (!checkInvalidPath()) {
			return false;
		}

		if (!checkCopySameCluster()) {

			return false;
		}

		if (!setAndCheckPasteFileList()) {
			return false;
		}

		if (!checkPasteIntoSelf()) {

			return false;
		}

		var operator = this.checkFileParam;
		var key = this.packetKey(clusterIp, destfilepath);
		var isExisted = false;
		var isSameCopy = false;

		if (!checkPasteType())
			return false;

		var start = scope.getPagingToolBarCursor();
		// var olddata = scope.getData(key);

		var movefilenamelist = [];
		var tonewfilenamelist = [];
		var addnewfilelist = [];
		var existedfilelist = [];
		var oldfilelist = [];

		// for (var i = 0; i < list.length; i++) {
		// namelist[i] = list[i].get('name');
		//   
		// }

		// alert(pasteType);
		if (isExisted && !isSameCopy) {
			Ext.MessageBox.show({
				title : i18n.prompt,
				msg : i18n.prompt_folderexists,
				buttons : Ext.Msg.YESNO,
				icon : Ext.Msg.WARNIN,
				fn : function(btn) {

					scope.setWinCmpFocus();
					if (btn == 'yes') {
						if (pasteType == "cut") {
							// scope.setComponetStatus('tb_paste1', false);
							scope.setComponetStatus('tb_paste', false);

							scope.removeSelectionItems(scope.packetKey(
											pasteClusteIp, srcfilepath), list,
									true);
							FileMngGlobal.filePasteShares.pasteflag = null;
							FileMngGlobal.filePasteShares.pasteFileList = [];
							FileMngGlobal.filePasteShares.pasteSrcPath = null;
							// scope.updateOtherStatus();
						}
						pasteCacheData(
								null,
								(pasteClusterCode == scope.clusterCode && srcfilepath == destfilepath),
								pasteClusterCode == scope.clusterCode);

						scope.copyItemValue(pasteClusteIp, srcfilepath,
								this.host, destfilepath, addnewfilelist, true);

						operator = scope.ignoreFileParam;
						Ext.Ajax.request({
							url : 'doPaste.action',
							params : {
								filenamelist : movefilenamelist.join(','),
								tonewfilenamelist : tonewfilenamelist.join(','),
								destfilepath : destfilepath,
								srcfilepath : srcfilepath,
								pasteflag : pasteType,
								filepath : destfilepath,
								operator : operator,
								clusterCode : scope.clusterCode,
								pasteClusterCode : pasteClusterCode
							},
							success : function(resp, opts) {

								// scope.grid.getEl().unmask();
								var responseObject = Ext.util.JSON
										.decode(resp.responseText);

								if (responseObject.fileInfo.exception) {
									Ext.Msg.alert(i18n.error,
											responseObject.fileInfo.exception,
											function() {
												scope.setWinCmpFocus();
											});
								}

								// this.grid.store.removeAll();
								if (responseObject.unique == 1) {
									// var key = scope.host + "," +
									// destfilepath;
									// this.setItems(scope.host,
									// destfilepath,
									// responseObject.fileItems);
									// this.grid.store.removeAll();
									// this.grid.store
									// .add(scope.getMyStore(key).data.items);
									// olddata = null;
									if (pasteType == "cut") {
										// this.removeData(scope.packetKey(scope.host,srcfilepath));

										for (var i = 0; i < movefilenamelist.length; i++) {
											scope
													.removeData(scope
															.packetKey(
																	pasteClusteIp,
																	srcfilepath
																			+ "/"
																			+ movefilenamelist[i]));
										}
									}
									/**
									 * remove folders
									 */
									for (var i = 0; i < existedfilelist.length; i++) {

										var subpath = destfilepath + '/'
												+ existedfilelist[i].name;

										scope.removeData(scope.packetKey(
												clusterIp, subpath));
									}
									// var namelist = [];
									// for (var i = 0; i < list.length; i++)
									// {
									//
									// // alert(srcfilepath + "/" +
									// // list[i]);
									//
									// scope
									// .removeData(scope
									// .packetKey(
									// clusterIp,
									// srcfilepath
									// + "/"
									// + list[i]
									// .get('name')));
									// namelist.push(list[i].get('name'));
									//
									// }
									// scope.removeItem(scope
									// .packetKey(scope.host,
									// srcfilepath),
									// namelist, true);

								} else if (responseObject.unique == 2) {

									if (pasteType == "cut") {
										resumeSourcePasteItems();
									}
									scope.setItems(clusterIp, destfilepath,
											responseObject.fileItems);

									// ====resume=====//
									// for (var i = 0; i < list.length; i++) {
									//
									// this.removeData(scope.packetKey(
									// clusterIp, destfilepath + "/"
									// + list[i].get('name')));
									// }
									if (tonewfilenamelist == null
											|| tonewfilenamelist == undefined
											|| tonewfilenamelist.length == 0) {
										for (var i = 0; i < movefilenamelist.length; i++) {
											scope
													.removeData(scope
															.packetKey(
																	clusterIp,
																	destfilepath
																			+ "/"
																			+ movefilenamelist[i]));
										}
									} else {
										for (var i = 0; i < tonewfilenamelist.length; i++) {
											scope
													.removeData(scope
															.packetKey(
																	clusterIp,
																	destfilepath
																			+ "/"
																			+ tonewfilenamelist[i]));
										}

									}

									if (destfilepath == this.currentdir
											&& clusterIp == this.host) {

										this.refreshStore(key, start);
									}
									// scope.grid.store.removeAll();
									// scope.grid.store.add(scope.getMyStore(key,
									// null, start).data.items);
									// scope.firePagingToolBar(start, null,
									// olddata.length);
									// olddata = null;

									this.updateOtherCache(true);
									// this.paste();
									return true;
								} else {
									// ====resume=====//
									// for (var i = 0; i < list.length; i++) {
									//
									// this.removeData(scope.packetKey(
									// clusterIp, destfilepath + "/"
									// + list[i].get('name')));
									// }

									var isFileError = parseExistFileErrorFromException(responseObject.fileInfo.exception);

									if (isFileError) {
										/***************************************
										 * optimistic handler, to load cache to
										 * resume
										 **************************************/
										if (pasteType == "cut") {

											var resumefilelist = parseResumeFileListFromException(responseObject.fileInfo.exception);

											resumeSourcePasteItems(resumefilelist);
											/**
											 * *copy current resumefilelist to
											 * source directory*
											 */

										}

										if (addnewfilelist != null
												&& addnewfilelist.length != 0) {
											var resumefilelist = [];
											for (var i = 0; i < addnewfilelist.length; i++) {
												if (responseObject.fileInfo.exception
														.indexOf(srcfilepath
																+ "/"
																+ addnewfilelist[i].name) > -1) {

													resumefilelist
															.push(addnewfilelist[i]);
													scope
															.removeData(scope
																	.packetKey(
																			clusterIp,
																			destfilepath
																					+ "/"
																					+ addnewfilelist[i].name));
												}

											}
											scope.removeItemsGroup(key,
													resumefilelist);

										}

										if (oldfilelist != null
												&& oldfilelist.length != 0) {
											var resumefilelist = [];
											for (var i = 0; i < oldfilelist.length; i++) {
												if (responseObject.fileInfo.exception
														.indexOf(srcfilepath
																+ "/"
																+ oldfilelist[i].name) > -1) {

													scope
															.removeData(scope
																	.packetKey(
																			clusterIp,
																			destfilepath
																					+ "/"
																					+ oldfilelist[i].name));
													resumefilelist
															.push(oldfilelist[i]);

												}

											}
											scope.changeItemGroup(key,
													resumefilelist);
										}

										if (destfilepath == this.currentdir
												&& clusterIp == this.host) {

											this.refreshStore(key, start);

										}
									} else {
										/***************************************
										 * pessimistic handler,send request and
										 * reload data to resume
										 **************************************/
										if (pasteType == "cut") {
											resumeSourcePasteItems();
											/**
											 * *copy current resumefilelist to
											 * source directory*
											 */

										}

										if (tonewfilenamelist == null
												|| tonewfilenamelist == undefined
												|| tonewfilenamelist.length == 0) {
											/**
											 * * resume same file with same name
											 * ,so consider movefilenamelist *
											 */

											for (var i = 0; i < movefilenamelist.length; i++) {

												scope
														.removeData(scope
																.packetKey(
																		clusterIp,
																		destfilepath
																				+ "/"
																				+ movefilenamelist[i]));

											}
										} else {
											/**
											 * * resume same file with diffrenct
											 * name ,so consider
											 * tonewfilenamelist *
											 */
											for (var i = 0; i < tonewfilenamelist.length; i++) {

												scope
														.removeData(scope
																.packetKey(
																		clusterIp,
																		destfilepath
																				+ "/"
																				+ tonewfilenamelist[i]));

											}

										}

										if (destfilepath == this.currentdir
												&& clusterIp == this.host) {

											scope.refresh({
														filepath : destfilepath,
														focus : true
													});

										} else {

											scope.removeData(key);
										}

									}

									/** update other window cache */
									this.updateOtherCache(true);

								}

							},
							failure : function(resp, opts) {
								// ====resume=====//

								var exceptionE = i18n.error_connection;
								Ext.Msg.alert(i18n.error, exceptionE,
										function() {
											scope.setWinCmpFocus()
										});
								if (pasteType == "cut") {
									resumeSourcePasteItems();
								}

								if (tonewfilenamelist == null
										|| tonewfilenamelist == undefined
										|| tonewfilenamelist.length == 0) {
									for (var i = 0; i < movefilenamelist.length; i++) {
										scope.removeData(scope.packetKey(
												clusterIp, destfilepath + "/"
														+ movefilenamelist[i]));
									}
								} else {
									for (var i = 0; i < tonewfilenamelist.length; i++) {
										scope
												.removeData(scope
														.packetKey(
																clusterIp,
																destfilepath
																		+ "/"
																		+ tonewfilenamelist[i]));
									}

								}

								if (addnewfilelist != null
										&& addnewfilelist.length != 0) {
									scope.removeItemsGroup(key, addnewfilelist);

								}
								if (oldfilelist != null
										&& oldfilelist.length != 0) {
									scope.changeItemGroup(key, oldfilelist);
								}
								if (destfilepath == this.currentdir
										&& clusterIp == this.host) {

									this.refreshStore(key, start);
								}
								// scope.setItems(clusterIp, destfilepath,
								// olddata);
								// scope.grid.store.removeAll();
								// scope.grid.store.add(scope.getMyStore(key,
								// null, start).data.items);
								// scope.firePagingToolBar(start, null,
								// olddata.length);
								// olddata = null;

								this.updateOtherCache(true);
							},
							scope : scope
						});

					} else {

						scope.grid.getEl().unmask();

						return true;
					}
				}
			})

		} else {
			if (pasteType == "cut") {
				// scope.setComponetStatus('tb_paste1', false);
				scope.setComponetStatus('tb_paste', false);

				scope.removeSelectionItems(scope.packetKey(pasteClusteIp,
								srcfilepath), list, true);

				// scope.grid.getSelectionModel().clearSelections();
				FileMngGlobal.filePasteShares.pasteflag = null;
				FileMngGlobal.filePasteShares.pasteFileList = [];
				FileMngGlobal.filePasteShares.pasteSrcPath = null;
				// scope.updateOtherStatus();
			}
			var newnamelist = pasteCacheData(
					null,
					(pasteClusteIp == clusterIp && srcfilepath == destfilepath),
					pasteClusterCode == scope.clusterCode);
			scope.copyItemValue(pasteClusteIp, srcfilepath, this.host,
					destfilepath, newnamelist, true);
			operator = scope.checkFileParam;
			Ext.Ajax.request({
				url : 'doPaste.action',
				params : {
					filenamelist : movefilenamelist.join(','),
					tonewfilenamelist : tonewfilenamelist.join(','),
					destfilepath : destfilepath,
					srcfilepath : srcfilepath,
					pasteflag : pasteType,
					filepath : destfilepath,
					operator : operator,
					clusterCode : scope.clusterCode,
					pasteClusterCode : pasteClusterCode
				},
				success : function(resp, opts) {

					// scope.grid.getEl().unmask();
					var responseObject = Ext.util.JSON
							.decode(resp.responseText);

					if (responseObject.fileInfo.exception) {
						Ext.Msg.alert(i18n.error,
								responseObject.fileInfo.exception, function() {
									scope.setWinCmpFocus();
								});
					}

					// this.grid.store.removeAll();
					if (responseObject.unique == 1) {
						// olddata = null;
						// var key = scope.host + "," + destfilepath;
						// this.setItems(scope.host, destfilepath,
						// responseObject.fileItems);
						// this.grid.store.removeAll();
						// this.grid.store.add(scope.getMyStore(key).data.items);

						if (pasteType == "cut") {
							// this.removeData(scope.packetKey(scope.host,srcfilepath));

							for (var i = 0; i < movefilenamelist.length; i++) {
								scope.removeData(scope
										.packetKey(pasteClusteIp, srcfilepath
														+ "/"
														+ movefilenamelist[i]));
							}
						}

						// if (pasteType == "cut") {
						// //
						// this.removeData(scope.packetKey(scope.host,srcfilepath));
						//
						// var namelist = [];
						// for (var i = 0; i < list.length; i++) {
						//
						// // alert(srcfilepath + "/" + list[i]);
						// scope.removeData(scope
						// .packetKey(clusterIp, srcfilepath
						// + "/"
						// + list[i].get('name')));
						// namelist.push(list[i].get('name'));
						//
						// // if (!isSameCopy)
						// // this.removeData(scope.packetKey(scope.host,
						// // destfilepath + "/" + list[i]));
						//
						// }
						// this.updateOtherCache();
						// // scope.removeItem(scope.packetKey(scope.host,
						// // srcfilepath), namelist, true);
						// }

					} else if (responseObject.unique == 2) {
						if (pasteType == "cut") {
							resumeSourcePasteItems();
						}
						this.setItems(clusterIp, destfilepath,
								responseObject.fileItems);
						// ====resume=====//
						// for (var i = 0; i < list.length; i++) {
						//
						// this.removeData(scope.packetKey(clusterIp,
						// destfilepath + "/" + list[i].get('name')));
						// }
						// scope.grid.store.removeAll();
						// scope.grid.store
						// .add(scope.getMyStore(key, null, start).data.items);
						// scope.firePagingToolBar(start, null, olddata.length);
						// olddata = null;
						if (tonewfilenamelist == null
								|| tonewfilenamelist == undefined
								|| tonewfilenamelist.length == 0) {
							for (var i = 0; i < movefilenamelist.length; i++) {
								scope.removeData(scope.packetKey(clusterIp,
										destfilepath + "/"
												+ movefilenamelist[i]));
							}
						} else {
							for (var i = 0; i < tonewfilenamelist.length; i++) {
								scope.removeData(scope.packetKey(clusterIp,
										destfilepath + "/"
												+ tonewfilenamelist[i]));
							}

						}

						if (destfilepath == this.currentdir
								&& clusterIp == this.host) {

							this.refreshStore(key, start);
						}
						this.updateOtherCache(true);
						// this.paste();
						return true;
					} else {
						// ====resume=====//
						// for (var i = 0; i < list.length; i++) {
						//
						// this.removeData(scope.packetKey(clusterIp,
						// destfilepath + "/" + list[i].get('name')));
						// }
						// scope.setItems(clusterIp, destfilepath, olddata);
						// scope.grid.store.removeAll();
						// scope.grid.store
						// .add(scope.getMyStore(key, null, start).data.items);
						// scope.firePagingToolBar(start, null, olddata.length);
						// olddata = null;

						var isFileError = parseExistFileErrorFromException(responseObject.fileInfo.exception);

						if (isFileError) {
							/***************************************************
							 * optimistic handler, to load cache to resume
							 **************************************************/
							if (pasteType == "cut") {

								var resumefilelist = parseResumeFileListFromException(responseObject.fileInfo.exception);

								/**
								 * *copy current resumefilelist to source
								 * directory*
								 */
								resumeSourcePasteItems(resumefilelist);

							}

							if (tonewfilenamelist == null
									|| tonewfilenamelist == undefined
									|| tonewfilenamelist.length == 0) {
								/**
								 * * resume same file with same name ,so
								 * consider movefilenamelist *
								 */

								for (var i = 0; i < movefilenamelist.length; i++) {
									if (responseObject.fileInfo.exception
											.indexOf(srcfilepath + "/"
													+ movefilenamelist[i]) > -1) {

										scope.removeData(scope.packetKey(
												clusterIp, destfilepath + "/"
														+ movefilenamelist[i]));
									}
								}
							} else {
								/**
								 * * resume same file with diffrenct name ,so
								 * consider tonewfilenamelist *
								 */
								for (var i = 0; i < tonewfilenamelist.length; i++) {
									if (responseObject.fileInfo.exception
											.indexOf(srcfilepath + "/"
													+ tonewfilenamelist[i]) > -1) {
										scope
												.removeData(scope
														.packetKey(
																clusterIp,
																destfilepath
																		+ "/"
																		+ tonewfilenamelist[i]));

									}
								}

							}

							if (addnewfilelist != null
									&& addnewfilelist.length != 0) {
								var resumefilelist = [];
								for (var i = 0; i < addnewfilelist.length; i++) {
									if (responseObject.fileInfo.exception
											.indexOf(srcfilepath + "/"
													+ addnewfilelist[i].name) > -1) {

										resumefilelist.push(addnewfilelist[i]);

									}

								}
								scope.removeItemsGroup(key, resumefilelist);

							}

							if (oldfilelist != null && oldfilelist.length != 0) {
								var resumefilelist = [];
								for (var i = 0; i < oldfilelist.length; i++) {
									if (responseObject.fileInfo.exception
											.indexOf(srcfilepath + "/"
													+ oldfilelist[i].name) > -1) {

										resumefilelist.push(oldfilelist[i]);

									}

								}
								scope.changeItemGroup(key, resumefilelist);
							}

							if (destfilepath == this.currentdir
									&& clusterIp == this.host) {

								this.refreshStore(key, start);

							}
						} else {
							/***************************************************
							 * pessimistic handler,send request and reload data
							 * to resume
							 **************************************************/
							if (pasteType == "cut") {
								/**
								 * *copy current resumefilelist to source
								 * directory*
								 */
								resumeSourcePasteItems();

							}

							if (tonewfilenamelist == null
									|| tonewfilenamelist == undefined
									|| tonewfilenamelist.length == 0) {
								/**
								 * * resume same file with same name ,so
								 * consider movefilenamelist *
								 */

								for (var i = 0; i < movefilenamelist.length; i++) {

									scope.removeData(scope.packetKey(clusterIp,
											destfilepath + "/"
													+ movefilenamelist[i]));

								}
							} else {
								/**
								 * * resume same file with diffrenct name ,so
								 * consider tonewfilenamelist *
								 */
								for (var i = 0; i < tonewfilenamelist.length; i++) {

									scope.removeData(scope.packetKey(clusterIp,
											destfilepath + "/"
													+ tonewfilenamelist[i]));

								}

							}

							if (destfilepath == this.currentdir
									&& clusterIp == this.host) {

								scope.refresh({
											filepath : destfilepath,
											focus : true
										});

							} else {

								scope.removeData(key);
							}

						}

						/** update other window cache */
						this.updateOtherCache(true);

					}

				},
				failure : function(resp, opts) {
					scope.grid.getEl().unmask();

					// for (var i = 0; i < list.length; i++) {
					//
					// this.removeData(scope.packetKey(clusterIp,
					// destfilepath + "/" + list[i].get('name')));
					// }
					//					
					// var resultArray =
					// (Ext.util.JSON.decode(resp.responseText)).fileInfo;
					// var exceptionE = "";
					// if (resultArray.exception == ''
					// || resultArray.exception == null) {
					// exceptionE = 'Unkown exception';
					// Ext.Msg.alert(i18n.error, exceptionE);
					// } else
					// Ext.Msg.alert(i18n.error, resultArray.exception);
					var exceptionE = i18n.error_connection;
					Ext.Msg.alert(i18n.error, exceptionE, function() {
								scope.setWinCmpFocus()
							});
					if (pasteType == "cut") {
						// ������ǰ�Ķ�����ȥԴĿ¼������
						resumeSourcePasteItems();
					}

					if (tonewfilenamelist == null
							|| tonewfilenamelist == undefined
							|| tonewfilenamelist.length == 0) {
						for (var i = 0; i < movefilenamelist.length; i++) {
							scope.removeData(scope.packetKey(clusterIp,
									destfilepath + "/" + movefilenamelist[i]));
						}
					} else {
						for (var i = 0; i < tonewfilenamelist.length; i++) {
							scope.removeData(scope.packetKey(clusterIp,
									destfilepath + "/" + tonewfilenamelist[i]));
						}

					}

					if (addnewfilelist != null && addnewfilelist.length != 0) {
						scope.removeItemsGroup(key, addnewfilelist);

					}
					if (existedfilelist != null && existedfilelist.length != 0) {
						scope.changeItemGroup(key, oldfilelist);
					}
					if (destfilepath == this.currentdir
							&& clusterIp == this.host) {

						this.refreshStore(key, start);
					}
					this.updateOtherCache(true);
				},
				scope : scope
			});

		}

	},
	unzip : function() {

		var scope = this;
		var invalidpath = this.checkPermission('unzip');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			return false;
		}

		var sels = this.grid.getSelectionModel().getSelections();

		if (sels == null || sels.length == 0)
			return false;
		this.grid.getEl().mask(i18n.mask_wait);
		var filepath = this.currentdir;
		var currentdir = this.currentdir;
		var clusterIp = this.host;
		var newzipvalues = [];

		var isExisted = false;
		var existedName = [];

		var operator = this.checkFileParam;

		var key = this.packetKey(clusterIp, currentdir);
		var currentCacheData = this.getData(key);
		// var beencheckednames=[];

		function checkSubNameDuplicated() {

			for (var i = 0; i < sels.length; i++) {

				var name = sels[i].get('name');
				var index = -1;
				var subname;
				if ((index = name.toLowerCase().lastIndexOf(".zip")) > -1) {
					subname = name.substring(0, index);
				} else if ((index = name.toLowerCase().lastIndexOf(".tar")) > -1) {
					subname = name.substring(0, index);
				} else if ((index = name.toLowerCase().lastIndexOf(".tar.gz")) > -1) {
					subname = name.substring(0, index);
				} else if ((index = name.toLowerCase().lastIndexOf(".rar")) > -1) {
					subname = name.substring(0, index);
				} else {
					Ext.MessageBox.alert(i18n.error, i18n.error_filetype);
					scope.grid.getEl().unmask();
					return false;
				}
				var isSubExisted = false;
				var subExistedName;
				for (var j = 0; j < currentCacheData.length; j++) {

					if (subname == currentCacheData[j].name) {
						// Ext.Msg.alert(i18n.prompt, i18n.val_filenameexist);
						isSubExisted = true;
						subExistedName = subname;
						break;
					}
				}

				if (isSubExisted) {
					isExisted = true;
					var isHasBeenName = false;
					for (var ii = 0; ii < existedName.length; ii++) {
						if (existedName[ii] == subname) {
							isHasBeenName = true;
							break;
						}
					}
					if (!isHasBeenName)
						existedName.push(subname);
				}

			}

		}

		checkSubNameDuplicated();
		// beencheckednames=null;

		var start = scope.getPagingToolBarCursor();
		// var olddata = scope.getData(key);
		var key = scope.packetKey(clusterIp, currentdir);
		function addUnzipFolderItems() {

			var newcount = 0;
			for (var i = 0; i < sels.length; i++) {
				var name = sels[i].get('name');
				var type = sels[i].get('type');
				var isExisted = false;
				var subname;
				var index = -1;
				if ((index = name.toLowerCase().lastIndexOf(".zip")) > -1) {
					subname = name.substring(0, index);
				} else if ((index = name.toLowerCase().lastIndexOf(".tar")) > -1) {
					subname = name.substring(0, index);
				} else if ((index = name.toLowerCase().lastIndexOf(".tar.gz")) > -1) {
					subname = name.substring(0, index);
				} else if ((index = name.toLowerCase().lastIndexOf(".rar")) > -1) {
					subname = name.substring(0, index);
				} else {
					Ext.MessageBox.alert(i18n.error, i18n.error_filetype);
					this.grid.getEl().unmask();
					return false;
				}
				for (var j = 0; j < currentCacheData.length; j++) {

					if (subname == currentCacheData[j].name) {
						if (currentCacheData[j].type == 0) {

							scope.removeItemValue(key, currentCacheData[j]);
						} else {
							isExisted = true;
						}
						break;
					}
				}

				var newfolderKey = scope.packetKey(clusterIp, currentdir + "/"
								+ subname);
				if (!isExisted) {

					var newvalue = new Object();
					newvalue.zipname = name;
					newvalue.name = subname;
					newvalue.permission = 'drwxr-xr-x';
					newvalue.typeString = 'Folder';
					newvalue.size = 80;
					newvalue.type = 1;
					newvalue.lastModified = Ext.ux.Util.formatTime(new Date()
							.getTime());
					newzipvalues.push(newvalue);
					/**
					 * necessary , because it adds new value to key data, next
					 * loop can check new key data
					 */
					scope.addItem(key, newvalue, start);
					currentCacheData = scope.getData(key);
					newcount++;
				}
				scope.removeData(newfolderKey);

			}

			// scope.addItemsGroup(key, newzipvalues, start);
			if (currentdir == scope.currentdir && clusterIp == scope.host) {

				scope.refreshStore(key, start);
			}
			// scope.grid.store.removeAll();
			// scope.grid.store
			// .add(scope.getMyStore(key, null, start).data.items);
			// scope.firePagingToolBar(start, null, olddata.length + newcount);
			scope.updateOtherCache();
			// alert(olddata.length + newcount);
			// alert(scope.getData(key).length);
			scope.grid.getEl().unmask();

		}

		var list = [];
		for (var i = 0; i < sels.length; i++) {
			list.push(sels[i].get('name'));
		}

		if (isExisted) {
			Ext.Msg.buttonText.yes = i18n.confirm;
			Ext.Msg.buttonText.no = i18n.no;
			Ext.MessageBox.show({
				title : i18n.prompt,
				msg : '\"' + existedName.join(' , ') + '\":'
						+ i18n.prompt_zipfolderexists,
				buttons : Ext.Msg.YESNO,
				icon : Ext.Msg.WARNIN,
				fn : function(btn) {
					scope.setWinCmpFocus();
					if (btn == "yes") {
						addUnzipFolderItems();
						scope.grid.getEl().unmask();
						operator = scope.ignoreFileParam;
						Ext.Ajax.request({
							url : 'doUnzip.action',
							params : {
								filename : list.join(','),
								filepath : currentdir,
								operator : operator,
								clusterCode : scope.clusterCode
							},
							success : function(resp, opts) {
								// var resultArray = (Ext.util.JSON
								// .decode(resp.responseText)).fileInfo;
								// Ext.Msg.alert(i18n.prompt,
								// resultArray.exception);

								var responseObject = Ext.util.JSON
										.decode(resp.responseText);

								if (responseObject.fileInfo.exception) {
									Ext.Msg.alert(i18n.error,
											responseObject.fileInfo.exception,
											function() {
												scope.setWinCmpFocus();
											});
								}

								// this.grid.store.removeAll();
								if (responseObject.unique == 1) {
									// var key = scope.host + "," +
									// filepath;
									// this.setItems(scope.host,
									// filepath,
									// responseObject.fileItems);
									// this.grid.store.removeAll();
									// this.grid.store
									// .add(scope.getMyStore(key).data.items);
									//
									// for (var i = 0; i < list.length;
									// i++) {
									// var name = list[i];
									// var index = -1;
									// var subname;
									// if ((index =
									// name.lastIndexOf(".zip")) >
									// -1) {
									// subname = name.substring(0,
									// index);
									// } else if ((index = name
									// .lastIndexOf(".tar")) > -1) {
									// subname = name.substring(0,
									// index);
									// } else if ((index = name
									// .lastIndexOf(".tar.gz")) > -1) {
									// subname = name.substring(0,
									// index);
									// } else if ((index = name
									// .lastIndexOf(".rar")) > -1) {
									// subname = name.substring(0,
									// index);
									// }
									// var path = filepath + "/" +
									// subname;
									// this.removeData(scope.packetKey(
									// scope.host, path));
									// }

								} else if (responseObject.unique == 2) {
									this.setItems(clusterIp, currentdir,
											responseObject.fileItems);

									if (currentdir == this.currentdir
											&& clusterIp == this.host) {

										scope.refreshStore(key, start);
									}
									scope.updateOtherCache();
									scope.grid.getEl().unmask();
									this.unzip();
									return true;
								} else {

									// ====resume=====//

									// newfolder history
									// cache
									var resumelist = [];
									for (var i = 0; i < newzipvalues.length; i++) {
										if (responseObject.fileInfo.exception
												.indexOf(' '
														+ newzipvalues[i].name
														+ ' ') > -1
												|| responseObject.fileInfo.exception
														.indexOf(' '
																+ newzipvalues[i].zipname
																+ ' ') > -1) {
											resumelist.push(newzipvalues[i]);
										}
									}
									scope.removeItemsGroup(key, resumelist);
									if (currentdir == this.currentdir
											&& clusterIp == this.host) {

										scope.refreshStore(key, start);
									}
									scope.updateOtherCache();
								}

							},
							failure : function(resp, opts) {
								// ====resume=====//
								var exceptionE = i18n.error_connection;
								Ext.Msg.alert(i18n.error, exceptionE,
										function() {
											scope.setWinCmpFocus();
										});
								scope.grid.getEl().unmask();
								// newfolder history
								// cache

								scope.removeItemsGroup(key, newzipvalues);
								if (currentdir == this.currentdir
										&& clusterIp == this.host) {

									scope.refreshStore(key, start);
								}
								scope.updateOtherCache();

							},
							scope : scope
						});

					} else {
						scope.grid.getEl().unmask();
						return true;
					}
				}
			});
		} else {
			addUnzipFolderItems();
			operator = scope.checkFileParam;
			Ext.Ajax.request({
				url : 'doUnzip.action',
				params : {
					filename : list.join(','),
					filepath : currentdir,
					operator : operator,
					clusterCode : scope.clusterCode
				},
				success : function(resp, opts) {
					// var resultArray = (Ext.util.JSON
					// .decode(resp.responseText)).fileInfo;
					// Ext.Msg.alert(i18n.prompt,
					// resultArray.exception);
					scope.grid.getEl().unmask();
					var responseObject = Ext.util.JSON
							.decode(resp.responseText);

					if (responseObject.fileInfo.exception) {
						Ext.Msg.alert(i18n.error,
								responseObject.fileInfo.exception, function() {
									scope.setWinCmpFocus();
								});
					}

					// this.grid.store.removeAll();
					if (responseObject.unique == 1) {
						// var key = scope.host + "," + filepath;
						// this.setItems(scope.host, filepath,
						// responseObject.fileItems);
						// this.grid.store.removeAll();
						// this.grid.store.add(scope.getMyStore(key).data.items);
						//
						// for (var i = 0; i < list.length; i++) {
						// var name = list[i];
						// var index = -1;
						// var subname;
						// if ((index = name.lastIndexOf(".zip")) > -1) {
						// subname = name.substring(0, index);
						// } else if ((index = name.lastIndexOf(".tar")) > -1) {
						// subname = name.substring(0, index);
						// } else if ((index = name.lastIndexOf(".tar.gz")) >
						// -1) {
						// subname = name.substring(0, index);
						// } else if ((index = name.lastIndexOf(".rar")) > -1) {
						// subname = name.substring(0, index);
						// }
						// var path = filepath + "/" + subname;
						// this.removeData(scope.packetKey(scope.host, path));
						// }

					} else if (responseObject.unique == 2) {
						this.setItems(clusterIp, currentdir,
								responseObject.fileItems);
						if (currentdir == this.currentdir
								&& clusterIp == this.host) {

							scope.refreshStore(key, start);
						}
						scope.updateOtherCache();
						this.unzip();
						return true;
					} else {
						// ====resume=====//

						// newfolder history
						// cache
						scope.removeItemsGroup(key, newzipvalues);
						if (currentdir == this.currentdir
								&& clusterIp == this.host) {

							scope.refreshStore(key, start);
						}
						scope.updateOtherCache();
					}

				},
				failure : function(resp, opts) {
					scope.grid.getEl().unmask();
					// ====resume=====//

					// newfolder history
					// cache
					var exceptionE = i18n.error_connection;
					Ext.Msg.alert(i18n.error, exceptionE, function() {
								scope.setWinCmpFocus()
							});
					scope.grid.getEl().unmask();
					// newfolder history
					// cache

					scope.removeItemsGroup(key, newzipvalues);
					if (currentdir == this.currentdir && clusterIp == this.host) {

						scope.refreshStore(key, start);
					}
					scope.updateOtherCache();
				},
				scope : scope
			});

		}
	},
	backward : function() {
		if (this.backwardrecords.length == 0)
			return false;
		var newdir = this.currentAddressChange(this.AddressRecords.backward,
				this.currentdir, this.fileWinId);
		this.refresh({
					filepath : newdir
				});

		this.currentdir = newdir;
		Ext.get(this.fileWinId + 'txt_url').dom.value = newdir;

		// var cpath = "";
		// var path = "";
		// if (this.backwardrecords.length > 0)
		// cpath = this.backwardrecords.pop();
		// if (this.backwardrecords.length > 0)
		// path = this.backwardrecords.pop();
		// if (path != "") {
		// this.backwardrecords.push(path);
		// var len = this.backwardrecords.length - 1;
		// var tmp_path = this.backwardrecords[len];
		// if (tmp_path == this.backwardrecords[len - 1]) {
		// this.backwardrecords.pop();
		// }
		// } else {
		// return;
		// }
		// if (cpath != "") {
		// this.forwardrecords.push(cpath);
		// var len1 = this.forwardrecords.length - 1;
		// var tmp_path1 = this.forwardrecords[len];
		// if (tmp_path1 == this.forwardrecords[len - 1]) {
		// this.forwardrecords.pop();
		// }
		// }
		//
		// if (this.backwardrecords.length > 0) {
		// Ext.getCmp('tb_forward').enable();
		//
		// this.refresh({
		// filepath : path
		// });
		//
		// this.currentdir = path;
		//
		// Ext.get('txt_url').dom.value = this.currentdir;
		//
		// } else {
		// Ext.getCmp('tb_backward').disable();
		// Ext.get('txt_url').dom.value = this.currentdir;
		// }

	},
	upward : function() {

		// this.forwardrecords.push(this.currentdir);
		//
		// var len1 = this.forwardrecords.length - 1;
		// var tmp_path1 = this.forwardrecords[len1];
		// if (tmp_path1 == this.forwardrecords[len1 - 1]) {
		// this.forwardrecords.pop();
		// }

		var olddir = this.currentdir;

		var newdir = this.currentdir.substring(0, this.currentdir
						.lastIndexOf('/'));

		// this.backwardrecords.push(this.currentdir);
		// var len = this.backwardrecords.length - 1;
		// var tmp_path = this.backwardrecords[len];
		// if (tmp_path == this.backwardrecords[len - 1]) {
		// this.backwardrecords.pop();
		// }

		if (newdir.indexOf(this.workdir) < 0) {
			if (this.role == 2) {
				var parentPath = this.workdir.substring(0, this.workdir
								.lastIndexOf('/'));

				if (newdir.indexOf(parentPath) == 0) {
					this.currentdir = newdir;
					this.currentAddressChange(this.AddressRecords.upward,
							olddir, this.fileWinId);

					Ext.get(this.fileWinId + 'txt_url').dom.value = this.currentdir;
					this.refresh({
								filepath : this.currentdir
							});
				}

			} else {
				// this.currentdir = this.workdir;
				this.setComponetStatus('tb_upward', false);
				// Ext.getCmp(this.fileWinId + 'tb_upward').disable();
			}

		} else {
			this.currentdir = newdir;
			this.currentAddressChange(this.AddressRecords.upward, olddir,
					this.fileWinId);
			Ext.get(this.fileWinId + 'txt_url').dom.value = this.currentdir;
			this.refresh({
						filepath : this.currentdir
					});

		}

	},
	forward : function() {
		if (this.forwardrecords.length == 0)
			return false;

		var newdir = this.currentAddressChange(this.AddressRecords.forward,
				this.currentdir, this.fileWinId);
		this.refresh({
					filepath : newdir
				});

		this.currentdir = newdir;
		Ext.get(this.fileWinId + 'txt_url').dom.value = newdir;
		// if (this.forwardrecords.length == 0)
		// return;
		// var path = this.forwardrecords.pop();
		// this.backwardrecords.push(path);
		// var len = this.backwardrecords.length - 1;
		// var tmp_path = this.backwardrecords[len];
		// if (tmp_path == this.backwardrecords[len - 1]) {
		// this.backwardrecords.pop();
		// }
		//
		// Ext.getCmp('tb_backward').enable();
		// this.refresh({
		// filepath : path
		// });
		//
		// this.currentdir = path;
		// Ext.get('txt_url').dom.value = this.currentdir;

	},

	tail : function() {
		var scope = this;
		var r = this.grid.getSelections()[0];
		var filetype = r.get('typeString');
		var filename = r.get('name');
		var path = scope.currentdir;
		var date = new Date();
		if (filetype == "File") {
			var invalidpath = this.checkPermission('open');
			if (invalidpath != null) {
				Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
								+ invalidpath, function() {
							scope.setWinCmpFocus();
						});
				return false;
			}
			var tailFileForm = new Ext.form.FormPanel({
						border : false,
						id : scope.fileWinId + "tailFileForm" + date,
						frame : true,
						width : 375,
						height : 80,
						buttonAlign : "center",
						buttons : [{
									id : scope.fileWinId + 'btn_tailfile'
											+ date,
									name : scope.fileWinId + 'btn_tailfile'
											+ date,
									minWidth : 50,
									text : i18n.confirm,
									handler : doTailFile

								}],
						items : [{
									layout : "form",
									border : false,
									// frame : true,
									items : {
										xtype : 'numberfield',
										fieldLabel : i18n.lab_tail,
										fieldWidth : 180,
										labelStyle : "width:180;",
										width : 150,
										frame : false,
										allowDecimals : false,
										maxValue : 200,
										maxText : i18n.val_tailtoolong,
										// i18n.val_linesformat,
										nanText : i18n.val_linesformat,
										allowNegative : false,
										labelSeparator : ':',
										id : scope.fileWinId + 'txt_tailfile'
												+ date,
										name : scope.fileWinId + 'txt_tailfile'
												+ date,
										msgTarget : 'title',
										value : 200
									}

								}]
					})
			var tailWindow = new Ext.Window({
						draggable : true,
						id : scope.fileWinId + 'tailFile' + date,
						width : 380,
						height : 120,
						title : i18n.title_tail,
						closable : true,
						modal : true,
						resizable : false,
						border : false,
						items : [tailFileForm]

					});

			tailWindow.on({
						'close' : {
							fn : function() {
								tailWindow.removeWin;
								scope.setWinCmpFocus();// make
								// file-
								// window
								// has
								// focus
							}
						}
					});
			tailWindow.show();

			var tail_keymap = new Ext.KeyMap(Ext.get(scope.fileWinId
							+ 'tailFile' + date), {
						key : Ext.EventObject.ENTER,
						fn : doTailFile

					});
		}
		function doTailFile() {

			if (tailFileForm.form.isValid()) {
				var num = Ext.fly(scope.fileWinId + 'txt_tailfile' + date).dom.value;
				tailWindow.close();
				if (num != "0" && num != "") {
					var app = Ext.ux.Util.getApp();
					var desktop = app.getDesktop();
					var doTailWindow = desktop.getWindow(scope.fileWinId
							+ 'doTailWindow' + date);
					var doTailFormPanel;

					function refresh() {
						if (!Ext.getCmp(scope.fileWinId + '_win_'
								+ 'txt_tailfile' + date).isValid())
							return;

						doTailFormPanel.getEl().mask(i18n.mask_wait);
						num = Ext.fly(scope.fileWinId + '_win_'
								+ 'txt_tailfile' + date).dom.value;
						Ext.Ajax.request({
							url : 'doTailFile.action',
							params : {
								filename : filename,
								filepath : path,
								linenum : num,
								clusterCode : scope.clusterCode
							},
							callback : function(opts, success, resp) {
								if (success) {
									var exception;
									try {
										exception = Ext.util.JSON
												.decode(resp.responseText).fileInfo.exception;
										if (exception) {
											Ext.Msg
													.alert(i18n.error,
															exception);
											doTailWindow.close();
										}
									} catch (e) {
										var cmp = Ext.fly(scope.fileWinId
												+ 'txt_tailcontent' + date);
										cmp.dom.value = resp.responseText;

										doTailFormPanel.getEl().unmask();
										cmp.scrollTo('bottom', 9999999);

									}

								} else {
									var exceptionE = resp.responseText;
									if (exceptionE == '' || exceptionE == null)
										exceptionE = 'Unkown exception';
									Ext.fly(scope.fileWinId + 'txt_tailcontent'
											+ date).dom.value = exceptionE;

								}

							}
						});

					}
					var toolbar = new Ext.Toolbar({
								height : 30,
								width : "100%",
								region : 'center',
								autoScroll : true,
								items : [i18n.lab_tail, {
									xtype : 'numberfield',
									fieldLabel : i18n.lab_tail,
									fieldWidth : 180,
									labelStyle : "width:180;",
									width : 100,
									frame : false,
									allowDecimals : false,
									maxValue : 200,
									maxText : i18n.val_tailtoolong,
									// i18n.val_linesformat,
									nanText : i18n.val_linesformat,
									allowNegative : false,
									labelSeparator : ':',
									id : scope.fileWinId + '_win_'
											+ 'txt_tailfile' + date,
									name : scope.fileWinId + '_win_'
											+ 'txt_tailfile' + date,
									msgTarget : 'title',
									value : num

								}, {
									// id : this.fileWinId + 'tb_download',
									text : i18n.file_edit_refresh,
									tooltip : i18n.file_edit_refresh,
									tooltipType : "title",
									icon : "images/Menus/refresh.gif",
									cls : "x-btn-text-icon",
									handler : function() {
										refresh();

									}
								}

								]
							});

					doTailFormPanel = new Ext.FormPanel({
								// layout : "fit",
								// border : false,
								frame : true,
								buttonAlign : 'center',
								items : [
										toolbar,
										{
											xtype : 'textarea',
											hideLabel : 'true',
											labelSeparator : '',
											anchor : '100% -60',
											id : scope.fileWinId
													+ 'txt_tailcontent' + date,
											name : scope.fileWinId
													+ 'txt_tailcontent' + date
										},
										scope.newSearchBar(scope.fileWinId
												+ 'txt_tailcontent' + date)],

								buttons : [{
											text : i18n.ok,
											handler : function() {
												doTailWindow.close();
											}
										}]
							})
					Ext.ux.Util.closeWindow(doTailWindow);
					doTailWindow = desktop.createWindow({
								id : scope.fileWinId + 'doTailWindow' + date,
								// var doTailWindow = new Ext.Window({
								draggable : true,
								layout : 'fit',
								width : Ext.lib.Dom.getViewWidth() * 3 / 4,
								height : Ext.lib.Dom.getViewHeight() * 8 / 9,
								title : 'tail',
								closable : true,
								// modal : true,
								autoScroll : true,
								plain : true,
								bodyStyle : 'padding:0 0 0 0',
								items : [doTailFormPanel]

							});
					doTailWindow.on({
								'close' : {
									fn : function() {
										doTailWindow.removeWin;
										scope.setWinCmpFocus();// make
										// file-
										// window
										// has
										// focus
									}
								}
							});
					doTailWindow.show();
					new Ext.KeyMap(doTailFormPanel.id, {
								key : Ext.EventObject.ENTER,
								fn : function() {
									var el = document.activeElement;
									if (el.name == scope.fileWinId + '_win_'
											+ 'txt_tailfile' + date) {

										refresh();
									}
								}
							});
					doTailFormPanel.getEl().mask(i18n.mask_wait);
					refresh();

					// Ext.Ajax.request({
					// url : 'doTailFile.action',
					// params : {
					// filename : filename,
					// filepath : path,
					// linenum : num,
					// clusterCode : scope.clusterCode
					// },
					// callback : function(opts, success, resp) {
					// if (success) {
					// var exception;
					// try {
					// exception = Ext.util.JSON
					// .decode(resp.responseText).fileInfo.exception;
					// if (exception) {
					// Ext.Msg.alert(i18n.error, exception);
					// doTailWindow.close();
					// }
					// } catch (e) {
					// var cmp=Ext.fly(scope.fileWinId + 'txt_tailcontent'
					// + date);
					// cmp.dom.value = resp.responseText;
					//									
					// doTailFormPanel.getEl().unmask();
					// cmp.scrollTo('bottom',9999999);
					// // cmp.scrollIntoView(false);
					// }
					//
					// } else {
					// var exceptionE = resp.responseText;
					// if (exceptionE == '' || exceptionE == null)
					// exceptionE = 'Unkown exception';
					// Ext.fly(scope.fileWinId + 'txt_tailcontent'
					// + date).dom.value = exceptionE;
					//
					// }
					//
					// }
					// });

				}
			}
		}
	},
	about : function() {
		var scope = this;
		var aboutWindow = new Ext.Window({
					draggable : true,
					width : 350,
					height : 350,
					title : i18n.title_about,
					closable : true,
					resizable : false,
					modal : true,
					id : this.fileWinId + 'aboutWindow',
					bodyStyle : 'padding:10 10 10 10',
					items : [{
						xtype : 'panel',
						layout : "fit",
						id : this.fileWinId + 'aboutPanel',
						frame : true,
						items : [{
							html : '<div >' + i18n.lab_version
									+ '</div><br><div>' + i18n.lab_right
									+ '</div>'
						}]

					}]

				});
		aboutWindow.on({
					'close' : {
						fn : function() {
							aboutWindow.removeWin;
							scope.setWinCmpFocus();// make
							// file-
							// window
							// has focus
						}
					}
				});
		aboutWindow.show();

	},
	help : function() {
		var scope = this;
		if (Ext.getCmp('filemng_help') != null) {
			Ext.getCmp('filemng_help').show();
			scope.setWinCmpFocus();
			return;
		}

		var helpWindow = app.getDesktop().createWindow({
			id : 'filemng_help',
			draggable : true,
			width : 350,
			height : 450,
			title : i18n.tb_keyhelp,
			closable : true,
			resizable : true,
			frame : true,
			// modal : true,
			// id : this.fileWinId + 'helpWindow',
			bodyStyle : 'padding:10 10 10 10',
			items : [{
				xtype : 'panel',
				layout : "column",
				id : this.fileWinId + 'helpPanel',
				border : false,
				items : [{
							html : '<div >' + i18n.filemng_help_content
									+ '</div>'
						}]

			}]
		});

		helpWindow.on({
					'close' : {
						fn : function() {
							helpWindow.removeWin;
							// scope.setWinCmpFocus();// make
							// file-
							// window
							// has focus
						}
					}
				});
		helpWindow.show();
		scope.setWinCmpFocus();
	},
	properties : function(isReadSel, sel) {
		var scope = this;
		var filename;
		var filepath;
		var filetype;
		var filetypecode;
		var filepermission;
		var filesize;
		var filelastmodified;
		var selection;
		if (isReadSel == true) {
			selection = sel;
		} else {
			selection = scope.grid.getSelections()[0];
		}

		filename = selection.get('name');
		filepath = this.currentdir;
		filetypecode = selection.get('type');
		filepermission = selection.get('permission');
		filesize = selection.get('size');
		filelastmodified = selection.get('lastModified');

		var reflect = Ext.ux.Util.reflectType(filename);

		if (filetypecode == 1) {
			filetype = i18n.col_filetype_folder;
		} else {
			filetype = reflect.filetype + ' ' + i18n.col_filetype_file;
		}

		var app = Ext.ux.Util.getApp();
		var desktop = app.getDesktop();
		var propertiesWindow = desktop.getWindow(this.fileWinId
				+ 'propertiesWindow');
		var scope = this;
		Ext.ux.Util.closeWindow(propertiesWindow);
		propertiesWindow = desktop.createWindow({

			// var propertiesWindow = new Ext.Window({
			draggable : true,
			width : 360,
			height : 400,
			title : i18n.title_property,
			closable : true,
			resizable : false,
			modal : true,
			id : scope.fileWinId + 'propertiesWindow',
			bodyStyle : 'padding:10 10 10 10',
			items : [{
				xtype : 'panel',
				// layout : "column",
				id : scope.fileWinId + 'propertiesPanel',
				frame : true,
				border : false,
				items : [{
							xtype : 'fieldset',
							// width : 380,
							height : 150,
							border : false,
							items : [{
										xtype : 'textfield',
										id : scope.fileWinId + 'txt_file',
										// width : 200,
										height : 20,
										fieldLabel : i18n.lab_filename,
										labelStyle : "width:80;",
										// fieldWidth : 60,
										name : scope.fileWinId + 'txt_file',
										labelSeparator : ':',
										readOnly : true
									}, {
										xtype : 'textfield',
										id : scope.fileWinId + 'txt_type',
										// width : 200,
										height : 20,
										fieldLabel : i18n.lab_filetype,
										labelStyle : "width:80;",
										// fieldWidth : 60,
										name : scope.fileWinId + 'txt_type',
										labelSeparator : ':',
										readOnly : true
									}, {
										xtype : 'textfield',
										id : scope.fileWinId + 'txt_location',
										// width : 200,
										height : 20,
										fieldLabel : i18n.lab_filelocation,
										labelStyle : "width:80;",
										// fieldWidth : 60,
										name : scope.fileWinId + 'txt_location',
										labelSeparator : ':',
										readOnly : true
									}, {
										xtype : 'textfield',
										id : scope.fileWinId + 'txt_size',
										// width : 200,
										height : 20,
										fieldLabel : i18n.lab_filesize,
										// fieldWidth : 60,
										name : scope.fileWinId + 'txt_size',
										labelStyle : "width:80;",
										labelSeparator : ':',
										readOnly : true
									}, {
										xtype : 'textfield',
										id : scope.fileWinId
												+ 'txt_lastModified',
										// width : 200,
										height : 20,
										fieldLabel : i18n.lab_filemodifytime,
										// fieldWidth : 60,
										labelStyle : "width:80;",
										name : scope.fileWinId
												+ 'txt_lastModified',
										labelSeparator : ':',
										readOnly : true
									}]

						}, {
							xtype : 'panel',
							layout : 'column',
							border : false,
							items : [{
								xtype : 'fieldset',
								width : 100,
								height : 100,
								title : i18n.lab_ownerpermission,
								layout : '',
								items : [{

											xtype : 'checkbox',
											id : scope.fileWinId
													+ 'chb_owner_read',
											boxLabel : i18n.lab_readpermission,
											name : scope.fileWinId
													+ 'chb_owner_read',
											labelSeparator : ''

										}, {
											xtype : 'checkbox',
											id : scope.fileWinId
													+ 'chb_owner_write',
											boxLabel : i18n.lab_writerpermission,
											name : scope.fileWinId
													+ 'chb_owner_write',
											labelSeparator : ''

										}, {

											xtype : 'checkbox',
											id : scope.fileWinId
													+ 'chb_owner_operate',
											boxLabel : i18n.lab_operatepermission,
											name : scope.fileWinId
													+ 'chb_owner_operate',
											labelSeparator : ''

										}]
							}, {
								xtype : 'fieldset',
								width : 100,
								height : 100,
								title : i18n.lab_grouppermission,
								layout : '',
								items : [{

											xtype : 'checkbox',
											id : scope.fileWinId
													+ 'chb_group_read',
											boxLabel : i18n.lab_readpermission,
											name : scope.fileWinId
													+ 'chb_group_read',
											labelSeparator : ''

										}, {
											xtype : 'checkbox',
											id : scope.fileWinId
													+ 'chb_group_write',
											boxLabel : i18n.lab_writerpermission,
											name : scope.fileWinId
													+ 'chb_group_write',
											labelSeparator : ''

										}, {

											xtype : 'checkbox',
											id : scope.fileWinId
													+ 'chb_group_operate',
											boxLabel : i18n.lab_operatepermission,
											name : scope.fileWinId
													+ 'chb_group_operate',
											labelSeparator : ''

										}]
							}, {
								xtype : 'fieldset',
								width : 100,
								height : 100,
								title : i18n.lab_otherpermission,
								layout : '',
								items : [{

											xtype : 'checkbox',
											id : scope.fileWinId
													+ 'chb_other_read',
											boxLabel : i18n.lab_readpermission,
											name : scope.fileWinId
													+ 'chb_other_read',
											labelSeparator : ''

										}, {
											xtype : 'checkbox',
											id : scope.fileWinId
													+ 'chb_other_write',
											boxLabel : i18n.lab_writerpermission,
											name : scope.fileWinId
													+ 'chb_other_write',
											labelSeparator : ''

										}, {

											xtype : 'checkbox',
											id : scope.fileWinId
													+ 'chb_other_operate',
											boxLabel : i18n.lab_operatepermission,
											name : scope.fileWinId
													+ 'chb_other_operate',
											labelSeparator : ''

										}]
							}]

						}],
				buttonAlign : 'center',
				buttons : [{
							id : scope.fileWinId + 'btn_pro_confirm',
							name : scope.fileWinId + 'btn_pro_confirm',
							minWidth : 80,
							text : i18n.confirm,
							handler : doPropertiesConf

						}, {
							id : scope.fileWinId + 'btn_pro_save',
							name : scope.fileWinId + 'btn_pro_save',
							minWidth : 80,
							text : i18n.save,
							handler : doPropertiesSave

						}, {
							id : scope.fileWinId + 'btn_pro_quit',
							name : scope.fileWinId + 'btn_pro_quit',
							minWidth : 80,
							text : i18n.btn_back,
							handler : doPropertiesQuit

						}]

			}]

		});
		propertiesWindow.on({
					'close' : {
						fn : function() {
							propertiesWindow.removeWin;
							scope.setWinCmpFocus();// make
							// file-
							// window
							// has focus
						}
					}
				});
		propertiesWindow.show();

		new Ext.KeyMap(Ext.get(scope.fileWinId + 'propertiesWindow'), {
					key : Ext.EventObject.ENTER,
					fn : doPropertiesSave
				});

		Ext.get(scope.fileWinId + 'txt_file').dom.value = filename;
		Ext.get(scope.fileWinId + 'txt_type').dom.value = filetype;
		Ext.get(scope.fileWinId + 'txt_location').dom.value = filepath;
		if (filesize < 1024) {
			filesize = filesize + 'bytes'
		} else {

			filesize = (Math.round(((filesize * 10) / 1024)) / 10) + " KB";
		}
		Ext.get(scope.fileWinId + 'txt_size').dom.value = filesize;
		Ext.get(scope.fileWinId + 'txt_lastModified').dom.value = filelastmodified;

		// owner

		if (filepermission.charAt(1) == '-') {
			Ext.get(scope.fileWinId + 'chb_owner_read').dom.checked = false;
		} else {
			Ext.get(scope.fileWinId + 'chb_owner_read').dom.checked = true;
		}

		if (filepermission.charAt(2) == '-') {
			Ext.get(scope.fileWinId + 'chb_owner_write').dom.checked = false;
		} else {
			Ext.get(scope.fileWinId + 'chb_owner_write').dom.checked = true;
		}

		if (filepermission.charAt(3) == '-') {
			Ext.get(scope.fileWinId + 'chb_owner_operate').dom.checked = false;
		} else {
			Ext.get(scope.fileWinId + 'chb_owner_operate').dom.checked = true;
		}

		// group
		if (filepermission.charAt(4) == '-')
			Ext.get(scope.fileWinId + 'chb_group_read').dom.checked = false;
		else
			Ext.get(scope.fileWinId + 'chb_group_read').dom.checked = true;

		if (filepermission.charAt(5) == '-')
			Ext.get(scope.fileWinId + 'chb_group_write').dom.checked = false;
		else
			Ext.get(scope.fileWinId + 'chb_group_write').dom.checked = true;

		if (filepermission.charAt(6) == '-')
			Ext.get(scope.fileWinId + 'chb_group_operate').dom.checked = false;
		else
			Ext.get(scope.fileWinId + 'chb_group_operate').dom.checked = true;

		// other
		if (filepermission.charAt(7) == '-')
			Ext.get(scope.fileWinId + 'chb_other_read').dom.checked = false;
		else
			Ext.get(scope.fileWinId + 'chb_other_read').dom.checked = true;

		if (filepermission.charAt(8) == '-')
			Ext.get(scope.fileWinId + 'chb_other_write').dom.checked = false;
		else
			Ext.get(scope.fileWinId + 'chb_other_write').dom.checked = true;

		if (filepermission.charAt(9) == '-')
			Ext.get(scope.fileWinId + 'chb_other_operate').dom.checked = false;
		else
			Ext.get(scope.fileWinId + 'chb_other_operate').dom.checked = true;

		var saveflag = 0;

		function doPropertiesSave() {
			saveflag = 1;
			var owner = 0;
			var group = 0;
			var other = 0;
			// owner
			if (Ext.get(scope.fileWinId + 'chb_owner_read').dom.checked)
				owner = 4;
			else
				owner = 0;
			if (Ext.get(scope.fileWinId + 'chb_owner_write').dom.checked)
				owner += 2;
			else
				owner += 0;
			if (Ext.get(scope.fileWinId + 'chb_owner_operate').dom.checked)
				owner += 1;
			else
				owner += 0;

			// group
			if (Ext.get(scope.fileWinId + 'chb_group_read').dom.checked)
				group = 4;
			else
				group = 0;
			if (Ext.get(scope.fileWinId + 'chb_group_write').dom.checked)
				group += 2;
			else
				group += 0;
			if (Ext.get(scope.fileWinId + 'chb_group_operate').dom.checked)
				group += 1;
			else
				group += 0;

			// other
			if (Ext.get(scope.fileWinId + 'chb_other_read').dom.checked)
				other = 4;
			else
				other = 0;
			if (Ext.get(scope.fileWinId + 'chb_other_write').dom.checked)
				other += 2;
			else
				other += 0;
			if (Ext.get(scope.fileWinId + 'chb_other_operate').dom.checked)
				other += 1;
			else
				other += 0;

			var permission = owner.toString() + group.toString()
					+ other.toString();

			var key = scope.packetKey(scope.host, filepath);

			// filepermission
			// hypothesis : success
			var showpermission = scope.propertiesTranslate(permission,
					filetypecode);
			scope.changeItemValue(key, filename, "permission", showpermission);
			scope.updateOtherCache();
			Ext.Ajax.request({
				url : 'doChmod.action',
				params : {
					permission : permission,
					filename : filename,
					filepath : filepath,
					clusterCode : scope.clusterCode
				},
				success : function(resp, opts) {
					var responseObject = Ext.util.JSON
							.decode(resp.responseText);
					if (responseObject.unique == 1) {

						if (responseObject.fileInfo.exception) {
							Ext.Msg.alert(i18n.error,
									responseObject.fileInfo.exception);
						}

					} else {

						scope.changeItemValue(key, filename, "permission",
								filepermission);
						scope.updateOtherCache();
					}
				},
				failure : function(resp, opts) {
					scope.changeItemValue(key, filename, "permission",
							filepermission);
					scope.updateOtherCache();
					var resultArray = (Ext.util.JSON.decode(resp.responseText)).fileInfo;
					var exceptionE = "";
					if (resultArray.exception == ''
							|| resultArray.exception == null) {
						exceptionE = 'Unkown exception';
						Ext.Msg.alert(i18n.error, exceptionE);
					} else
						Ext.Msg.alert(i18n.error, resultArray.exception);
				},
				scope : scope
			});

		}

		function doPropertiesConf() {
			if (saveflag == 0) {
				var owner = 0;
				var group = 0;
				var other = 0;
				// owner
				if (Ext.get(scope.fileWinId + 'chb_owner_read').dom.checked)
					owner = 4;
				else
					owner = 0;
				if (Ext.get(scope.fileWinId + 'chb_owner_write').dom.checked)
					owner += 2;
				else
					owner += 0;
				if (Ext.get(scope.fileWinId + 'chb_owner_operate').dom.checked)
					owner += 1;
				else
					owner += 0;

				// group
				if (Ext.get(scope.fileWinId + 'chb_group_read').dom.checked)
					group = 4;
				else
					group = 0;
				if (Ext.get(scope.fileWinId + 'chb_group_write').dom.checked)
					group += 2;
				else
					group += 0;
				if (Ext.get(scope.fileWinId + 'chb_group_operate').dom.checked)
					group += 1;
				else
					group += 0;

				// other
				if (Ext.get(scope.fileWinId + 'chb_other_read').dom.checked)
					other = 4;
				else
					other = 0;
				if (Ext.get(scope.fileWinId + 'chb_other_write').dom.checked)
					other += 2;
				else
					other += 0;
				if (Ext.get(scope.fileWinId + 'chb_other_operate').dom.checked)
					other += 1;
				else
					other += 0;

				var permission = owner.toString() + group.toString()
						+ other.toString();
				var key = scope.packetKey(scope.host, filepath);

				var showpermission = scope.propertiesTranslate(permission,
						filetypecode);
				scope.changeItemValue(key, filename, "permission",
						showpermission);
				scope.updateOtherCache();
				Ext.Ajax.request({
							url : 'doChmod.action',
							params : {
								permission : permission,
								filename : filename,
								filepath : filepath,
								clusterCode : scope.clusterCode
							},
							success : function(resp, opts) {
								var responseObject = Ext.util.JSON
										.decode(resp.responseText);

								if (responseObject.fileInfo.exception) {
									Ext.Msg.alert(i18n.error,
											responseObject.fileInfo.exception);
								}

								if (responseObject.unique == 1) {

									if (responseObject.fileInfo.exception) {
										Ext.Msg
												.alert(
														i18n.error,
														responseObject.fileInfo.exception);
									}

								} else {

									scope.changeItemValue(key, filename,
											"permission", filepermission);
									scope.updateOtherCache();
								}
							},
							failure : function(resp, opts) {
								scope.changeItemValue(key, filename,
										"permission", filepermission);
								scope.updateOtherCache();
								var resultArray = (Ext.util.JSON
										.decode(resp.responseText)).fileInfo;
								var exceptionE = "";
								if (resultArray.exception == ''
										|| resultArray.exception == null) {
									exceptionE = 'Unkown exception';
									Ext.Msg.alert(i18n.error, exceptionE);
								} else
									Ext.Msg.alert(i18n.error,
											resultArray.exception);
							}
						});

			}
			propertiesWindow.close();
		}

		function doPropertiesQuit() {
			propertiesWindow.close();
		}
	},
	newfolder : function() {
		var scope = this;

		var invalidpath = scope.checkPermission('new');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			return false;
		}
		var newfolderPanel = new Ext.form.FormPanel({
					layout : "form",
					border : false,
					width : 300,
					height : 80,
					frame : true,
					items : [{
								layout : "form",
								border : false,
								// frame : true,
								items : {
									xtype : 'textfield',
									fieldLabel : i18n.lab_foldername,
									labelStyle : "width:100;",
									// fieldWidth : 100,
									msgTarget : 'qtip',
									width : 150,
									regex : this.regex,
									regexText : i18n.val_fileformaterror,
									allowBlank : false,
									blankText : i18n.val_filenamenotnull,
									maxLength : 100,
									maxLengthText : i18n.val_exceedmaxlength,
									labelSeparator : ':',
									id : scope.fileWinId + 'txt_newfolder',
									name : scope.fileWinId + 'txt_newfolder',
									selectOnFocus : true

								}
							}],
					buttonAlign : 'center',
					buttons : [{
								id : scope.fileWinId + 'btn_newfolder',
								name : scope.fileWinId + 'btn_newfolder',
								minWidth : 80,
								text : i18n.btn_newfile,
								handler : doNewFolder

							}]

				});

		// Ext.getDom("txt_newfolder").select();

		var app = Ext.ux.Util.getApp();
		var desktop = app.getDesktop();
		var newfolderWindow = desktop.getWindow(scope.fileWinId
				+ 'newfolderWindow');
		Ext.ux.Util.closeWindow(newfolderWindow);
		newfolderWindow = desktop.createWindow({
					id : scope.fileWinId + "newfolderWindow",
					// var newfolderWindow = new Ext.Window({
					draggable : true,
					width : 300,
					border : false,
					height : 120,
					title : i18n.title_newfolder,
					closable : true,
					resizable : false,
					bodyStyle : 'padding:0 0 0 0',
					items : [{
								xtype : 'panel',
								layout : "column",
								// layout : "form",
								border : false,
								// frame : true,
								items : [newfolderPanel]
							}],
					listeners : {
						show : function() {
							Ext.getCmp(scope.fileWinId + 'txt_newfolder')
									.focus(true, 100);

						}
					}
				});
		newfolderWindow.on({
					'close' : {
						fn : function() {
							newfolderWindow.removeWin;
							scope.setWinCmpFocus();// make
							// window
							// has focus
						}
					}
				});
		newfolderWindow.show();
		new Ext.KeyMap(Ext.get(scope.fileWinId + 'newfolderWindow'), {
					key : Ext.EventObject.ENTER,
					fn : doNewFolder
				});

		var clusterIp = this.host;
		var currentdir = this.currentdir;
		var myDate = new Date();
		var date = myDate.format("ymdHis");
		Ext.get(scope.fileWinId + 'txt_newfolder').dom.value = "newfolder"
				+ date;
		function doNewFolder() {
			if (newfolderPanel.form.isValid()) {
				var name = currentdir + '/'
						+ Ext.get(scope.fileWinId + 'txt_newfolder').dom.value;

				var key = scope.packetKey(clusterIp, currentdir);
				var currentCacheData = scope.getData(key);
				if (currentCacheData == null || currentCacheData == undefined) {
					Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
									+ currentdir, function() {
								scope.setWinCmpFocus();
							});

					return false;
				}
				var txtnewfolder = Ext.get(scope.fileWinId + 'txt_newfolder').dom.value;
				if (scope.checkFileExisted(currentCacheData, txtnewfolder)) {
					Ext.Msg.alert(i18n.prompt, txtnewfolder
									+ i18n.val_filenameexist, function() {
								scope.setWinCmpFocus();
							});
					return false;
				}
				// for (var i = 0; i < currentCacheData.length; i++) {
				// if (Ext.get(scope.fileWinId + 'txt_newfolder').dom.value ==
				// currentCacheData[i].name) {
				// Ext.Msg.alert(i18n.prompt,
				// i18n.val_filenameexist,function(){scope.setWinCmpFocus();});
				// return;
				// }
				// }

				var start = scope.getPagingToolBarCursor();

				var key = scope.packetKey(clusterIp, currentdir);
				// var olddata = scope.getData(key);
				var newvalue = new Object();
				newvalue.name = txtnewfolder;
				newvalue.permission = 'drwxr-xr-x';
				newvalue.typeString = 'Folder';
				newvalue.size = 80;
				newvalue.type = 1;
				newvalue.lastModified = Ext.ux.Util.formatTime(new Date()
						.getTime());
				// var
				// newvalue=[{name:Ext.get('txt_newfolder').dom.value,permission:'drwxr-xr-x',typeString:'Folder',size:80,lastModified:new
				// Date().format('Y-m-d h:i:s')}];

				var filename = Ext.util.Format.trim(name);
				var newfolderKey = scope.packetKey(clusterIp, filename);
				// var newfolderitem=scope.getData(newfolderKey);
				scope.addData(newfolderKey, []);
				// scope.removeData(newfolderKey);// clear exited newfolder
				scope.addItem(key, newvalue, start);
				scope.refreshStore(key, start);
				scope.grid.getSelectionModel().selectRow(0, false);
				scope.updateOtherCache();

				Ext.Ajax.request({
							url : 'doNewFolder.action',
							params : {
								filename : filename,
								filepath : currentdir,
								clusterCode : scope.clusterCode
							},
							success : function(resp, opts) {

								// this.grid.getEl().unmask();
								var responseObject = Ext.util.JSON
										.decode(resp.responseText);

								if (responseObject.fileInfo.exception) {
									Ext.Msg.alert(i18n.error,
											responseObject.fileInfo.exception,
											function() {
												scope.setWinCmpFocus();
											});

								}

								if (responseObject.unique == 1) {

								} else if (responseObject.unique == 2) {

									this.setItems(clusterIp, currentdir,
											responseObject.fileItems);
									this.removeData(newfolderKey); // clear
									// exited
									// newfolder history
									// cache

									/**
									 * load data from cache to refresh store
									 * appearance
									 */
									if (currentdir == this.currentdir
											&& clusterIp == this.host) {
										this.refreshStore(key, start);
									}
									scope.updateOtherCache();
									this.newfolder();
									return true;
								} else {

									// ====resume=====//
									this.removeData(newfolderKey); // clear
									// exited
									// newfolder history
									// cache

									/**
									 * remove former launched file from cache
									 */
									this.removeItemValue(key, newvalue);
									/**
									 * load data from cache to refresh store
									 * appearance
									 */

									if (currentdir == this.currentdir
											&& clusterIp == this.host) {
										this.refreshStore(key, start);
									}
									scope.updateOtherCache();

								}

							},
							failure : function(resp, opts) {

								var exceptionE = i18n.error_connection;
								Ext.Msg.alert(i18n.error, exceptionE,
										function() {
											scope.setWinCmpFocus();
										});
								// ====resume=====//
								this.removeData(newfolderKey); // clear exited
								// newfolder history

								/**
								 * remove former launched file from cache
								 */
								this.removeItemValue(key, newvalue);
								/**
								 * load data from cache to refresh store
								 * appearance
								 */

								if (currentdir == this.currentdir
										&& clusterIp == this.host) {

									this.refreshStore(key, start);
								}

								scope.updateOtherCache();

							},
							scope : scope
						});

				newfolderWindow.close();
			}
		}
	},
	newfile : function() {
		var scope = this;

		var invalidpath = this.checkPermission('new');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			return false;
		}

		var newfilePanel = new Ext.form.FormPanel({
					layout : "form",
					border : false,
					width : 300,
					height : 80,
					frame : true,
					buttons : [{
								id : scope.fileWinId + 'btn_newfile',
								name : scope.fileWinId + 'btn_newfile',
								minWidth : 80,
								text : i18n.btn_newfile,
								handler : doNewFile

							}],
					buttonAlign : 'center',
					items : [{
								layout : "form",
								border : false,
								items : {
									xtype : 'textfield',
									fieldLabel : i18n.lab_filename,
									labelStyle : "width:100;",
									// fieldWidth : 100,
									width : 150,
									msgTarget : 'qtip',
									regex : this.regex,
									regexText : i18n.val_fileformaterror,
									allowBlank : false,
									blankText : i18n.val_filenamenotnull,
									maxLength : 100,
									maxLengthText : i18n.val_exceedmaxlength,
									frame : true,
									labelSeparator : ':',
									id : scope.fileWinId + 'txt_newfile',
									name : scope.fileWinId + 'txt_newfile'
								}

							}]

				})

		var app = Ext.ux.Util.getApp();
		var desktop = app.getDesktop();
		var newfileWindow = desktop
				.getWindow(scope.fileWinId + 'newfileWindow');
		Ext.ux.Util.closeWindow(newfileWindow);

		newfileWindow = desktop.createWindow({
					id : scope.fileWinId + "newfileWindow",
					// var newfileWindow = new Ext.Window({
					draggable : true,
					width : 300,
					height : 120,
					title : i18n.title_newfile,
					closable : true,
					modal : true,
					border : false,
					resizable : false,
					bodyStyle : 'padding:0 0 0 0',
					items : [{
								xtype : 'panel',
								layout : "form",
								frame : true,
								border : false,
								items : [newfilePanel]
							}],
					listeners : {
						show : function() {
							Ext.getCmp(scope.fileWinId + 'txt_newfile').focus(
									true, 100);
						}
					}

				});

		newfileWindow.on({
					'close' : {
						fn : function() {
							newfileWindow.removeWin;
							scope.setWinCmpFocus();
						}
					}
				});

		newfileWindow.show();

		new Ext.KeyMap(Ext.get(scope.fileWinId + 'newfileWindow'), {
					key : Ext.EventObject.ENTER,
					fn : doNewFile
				});
		var myDate = new Date();
		var date = myDate.format("ymdHis");
		Ext.get(scope.fileWinId + 'txt_newfile').dom.value = "newfile" + date;

		var currentdir = this.currentdir;
		var clusterIp = this.host;
		function doNewFile() {
			if (newfilePanel.form.isValid()) {
				var name = currentdir + '/'
						+ Ext.get(scope.fileWinId + 'txt_newfile').dom.value;

				var key = scope.packetKey(clusterIp, currentdir);
				var currentCacheData = scope.getData(key);

				var txtnewfile = Ext.get(scope.fileWinId + 'txt_newfile').dom.value;
				if (scope.checkFileExisted(currentCacheData, txtnewfile)) {
					Ext.Msg.alert(i18n.prompt, txtnewfile
									+ i18n.val_filenameexist, function() {
								scope.setWinCmpFocus();
							});
					return false;
				}

				var start = scope.getPagingToolBarCursor();

				// var olddata = scope.getData(key);
				var newvalue = new Object();
				newvalue.name = txtnewfile;
				newvalue.permission = '-rw-r--r--';
				newvalue.typeString = 'File';
				newvalue.size = 0;
				newvalue.type = 0;
				newvalue.lastModified = Ext.ux.Util.formatTime(new Date()
						.getTime());
				// var
				// newvalue=[{name:Ext.get('txt_newfolder').dom.value,permission:'drwxr-xr-x',typeString:'Folder',size:80,lastModified:new
				// Date().format('Y-m-d h:i:s')}];

				scope.addItem(key, newvalue, start);
				scope.refreshStore(key, start);
				scope.grid.getSelectionModel().selectRow(0, false);
				scope.updateOtherCache();
				Ext.Ajax.request({
							url : 'doNewFile.action',
							params : {
								filename : Ext.util.Format.trim(name),
								filepath : currentdir,
								clusterCode : scope.clusterCode
							},
							success : function(resp, opts) {
								// this.grid.getEl().unmask();
								var responseObject = Ext.util.JSON
										.decode(resp.responseText);

								if (responseObject.fileInfo.exception) {
									Ext.Msg.alert(i18n.error,
											responseObject.fileInfo.exception,
											function() {
												scope.setWinCmpFocus()
											});
								}

								// this.grid.store.removeAll();
								if (responseObject.unique == 1) {

								} else if (responseObject.unique == 2) {

									/**
									 * remove former launched file from cache
									 */
									this.setItems(clusterIp, currentdir,
											responseObject.fileItems);

									/**
									 * load data from cache to refresh store
									 * appearance
									 */
									if (currentdir == this.currentdir
											&& clusterIp == this.host) {
										this.refreshStore(key, start);
									}
									scope.updateOtherCache();

									this.newfile();
									return true;
								} else {

									// ====resume=====//
									/**
									 * remove former launched file from cache
									 */
									this.removeItemValue(key, newvalue);
									/**
									 * load data from cache to refresh store
									 * appearance
									 */

									if (currentdir == this.currentdir
											&& clusterIp == this.host) {
										this.refreshStore(key, start);
									}
									scope.updateOtherCache();

								}

							},
							failure : function(resp, opts) {
								// this.grid.getEl().unmask();

								// ====resume=====//
								var exceptionE = i18n.error_connection;
								Ext.Msg.alert(i18n.error, exceptionE,
										function() {
											scope.setWinCmpFocus()
										});
								/**
								 * remove former launched file from cache
								 */
								this.removeItemValue(key, newvalue);
								/**
								 * load data from cache to refresh store
								 * appearance
								 */

								if (currentdir == this.currentdir
										&& clusterIp == this.host) {

									this.refreshStore(key, start);
								}
								scope.updateOtherCache();

							},
							scope : scope
						});

				newfileWindow.close();
			}
		}
	},

	md5 : function() {

		var scope = this;

		var invalidpath = this.checkPermission('open');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			return false;
		}
		var myDate = new Date();
		var date = myDate.format("ymdHis");
		var currentdir = this.currentdir;
		var clusterIp = this.host;
		var key = scope.packetKey(clusterIp, currentdir);
		var currentCacheData = scope.getData(key);
		var selection = scope.grid.getSelections()[0];
		var srcfile = selection.get('name');
		var srctype = selection.get('type');
		if (srctype != 0) {
			return false;
		}

		var md5file = srcfile + '_' + date + ".md5";
		var count = 0;
		while (scope.checkFileExisted(currentCacheData, md5file)) {

			md5file = srcfile + '_' + date + '_' + count++ + ".md5";
		}

		var start = scope.getPagingToolBarCursor();

		// var olddata = scope.getData(key);
		var newvalue = new Object();
		newvalue.name = md5file;
		newvalue.permission = '-rw-r--r--';
		newvalue.typeString = 'File';
		newvalue.size = 0;
		newvalue.type = 0;
		newvalue.lastModified = Ext.ux.Util.formatTime(new Date().getTime());

		scope.addItem(key, newvalue, start);
		scope.refreshStore(key, start);
		scope.grid.getSelectionModel().selectRow(0, false);
		scope.updateOtherCache();
		Ext.Ajax.request({
			url : 'doMd5File.action',
			params : {
				md5file : md5file,
				srcfile : srcfile,
				filepath : currentdir,
				clusterCode : scope.clusterCode
			},

			success : function(resp, opts) {
				// this.grid.getEl().unmask();
				var responseObject = Ext.util.JSON.decode(resp.responseText);

				if (responseObject.fileInfo.exception) {
					Ext.Msg.alert(i18n.error,
							responseObject.fileInfo.exception, function() {
								scope.setWinCmpFocus()
							});
				}

				// this.grid.store.removeAll();
				if (responseObject.unique == 1) {

				} else if (responseObject.unique == 2) {

					/**
					 * remove former launched file from cache
					 */
					this.setItems(clusterIp, currentdir,
							responseObject.fileItems);

					/**
					 * load data from cache to refresh store appearance
					 */
					if (currentdir == this.currentdir && clusterIp == this.host) {
						this.refreshStore(key, start);
					}
					scope.updateOtherCache();

					this.md5();
					return true;
				} else {

					// ====resume=====//
					/**
					 * remove former launched file from cache
					 */
					this.removeItemValue(key, newvalue);
					/**
					 * load data from cache to refresh store appearance
					 */

					if (currentdir == this.currentdir && clusterIp == this.host) {
						this.refreshStore(key, start);
					}
					scope.updateOtherCache();

				}

			},
			failure : function(resp, opts) {
				// this.grid.getEl().unmask();

				// ====resume=====//
				var exceptionE = i18n.error_connection;
				Ext.Msg.alert(i18n.error, exceptionE, function() {
							scope.setWinCmpFocus()
						});
				/**
				 * remove former launched file from cache
				 */
				this.removeItemValue(key, newvalue);
				/**
				 * load data from cache to refresh store appearance
				 */

				if (currentdir == this.currentdir && clusterIp == this.host) {

					this.refreshStore(key, start);
				}
				scope.updateOtherCache();

			},
			scope : scope
		});

	},

	preview : function(id, title, html, refresh) {

		var intervalId;
		var count = 0;
		var maxcount = 100;
		var removeIfInvalid = function() {

			if (intervalId) {
				window.clearInterval(intervalId);
			}

		}
		var reload = function() {
			var checkbox = document.getElementById(openFileWinId + 'checkbox');
			if (checkbox.checked) {
				count = 1;
				var num = Ext.getCmp(openFileWinId + '_txt').getValue();
				if (num > 0) {
					removeIfInvalid();
					intervalId = setInterval(function() {
								if (count > maxcount) {
									checkbox.checked = false;
									if (Ext.getCmp(openFileWinId + '_txt')) {
										Ext.getCmp(openFileWinId + '_txt')
												.disable();

									}
								}

								if (!openfileWindow || !checkbox.checked) {
									removeIfInvalid();

									return;
								};
								if (refresh()) {
									count++;
								}

							}, num * 1000);
				}

			} else {
				removeIfInvalid();

			}

			if (refresh) {
				refresh();
			}
		}
		var date = new Date();
		var scope = this;
		var sels = this.grid.getSelectionModel().getSelections();
		var openFileWinId = id + "previewwin";
		var openFileFormId = id + "previewwinform";
		var app = Ext.ux.Util.getApp();
		var desktop = app.getDesktop();
		var openfileWindow = desktop.getWindow(openFileWinId);
		if (openfileWindow) {
			openfileWindow.show();
		} else {
			var openfileForm;
			var toolbar = new Ext.Toolbar({
						height : 30,
						width : "100%",
						region : 'center',
						autoScroll : true,
						items : [{

							xtype : 'checkbox',
							id : openFileWinId + 'checkbox',
							boxLabel : i18n.file_auto_refresh,
							name : openFileWinId + 'checkbox',
							labelSeparator : '',
							listeners : {

								"check" : function() {
									if (this.checked) {
										Ext.getCmp(openFileWinId + '_txt')
												.enable();
										reload();

									} else {

										Ext.getCmp(openFileWinId + '_txt')
												.disable();
										removeIfInvalid();
									}

								}

							}

						}, {
							xtype : 'numberfield',
							fieldWidth : 80,
							labelStyle : "width:80;",
							width : 100,
							frame : false,
							allowDecimals : false,
							// i18n.val_linesformat,
							nanText : i18n.val_linesformat,
							allowNegative : false,
							labelSeparator : ':',
							disabled : true,
							id : openFileWinId + '_txt',
							name : openFileWinId + '_txt',
							msgTarget : 'title',
							value : 30

						}, {
							// id : this.fileWinId + 'tb_download',
							text : i18n.reload,
							tooltip : i18n.reload,
							tooltipType : "title",
							icon : "images/Menus/refresh.gif",
							cls : "x-btn-text-icon",
							handler : function() {
								reload();
							}
						}, {
							id : openFileWinId + 'tb_download',
							text : i18n.menu_download,
							// tooltip : i18n.menu_download,
							// tooltipType : "title",
							iconCls : "hd_download",
							handler : function() {
								scope.download({
											sels : sels
										});
							}
						}

						]
					});

			openfileForm = new Ext.form.FormPanel({
						labelWidth : 75,
						title : title,
						height : '100%',
						width : '100%',
						frame : true,
						buttonAlign : 'center',
						id : openFileFormId,
						tbar : toolbar,

						autoScroll : true,

						items : [{
									xtype : 'label',
									html : html

								}]

					});

			// openfileForm.render(document.body);

			openfileWindow = desktop.createWindow({
						id : openFileWinId,
						draggable : true,
						constrainHeader : true,
						width : Ext.lib.Dom.getViewWidth() * 3 / 4,
						height : Ext.lib.Dom.getViewHeight() * 8 / 9,

						// autoScroll:true,
						// modal : true,
						layout : 'fit',
						title : i18n.title_editfile,
						frame : true,
						plain : true,
						items : openfileForm

					});
			openfileWindow.on({
						'close' : {
							fn : function() {
								removeIfInvalid();
								openfileWindow.removeWin;
								scope.setWinCmpFocus();// make
								// file-
								// window
								// has focus
							}
						}
					});
			openfileWindow.show();

		}

	},

	open : function() {

		var scope = this;

		var invalidpath = this.checkPermission('open');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			return false;
		}

		var r = this.grid.getSelections()[0];
		var filename = r.get('name');
		var filetype = r.get('typeString');
		var size = r.get('size');
		var currentdir = this.currentdir;
		var date = new Date();
		var openFileWinId = getDefaultopenFileWinId();
		var textareaid = getDefaultFileTextAreaId();
		var openFileFormId = getDefaultFileFormId();

		var TYPE = Ext.ux.Util.reflectType(filename);

		if (TYPE.filetype == 'Image') {
			var imgid = openFileWinId + "_img";
			var html = '<center><img id="' + imgid
					+ '" src="showImageContent.action?filepath='
					+ scope.currentdir + '&filename=' + filename
					+ '&clusterCode=' + scope.clusterCode + '&date='
					+ String(new Date()) + '"/></center>';
			var img = null;
			var lasttime = new Date().getTime();
			var IsImageOk = function IsImageOk(img) {

				var nowtime = new Date().getTime();

				if (img == null || img.readyState == 'complete' || img.complete) {
					lasttime = nowtime;
					return true;
				}

				if (nowtime - lasttime > 30 * 1000) {
					lasttime = nowtime;
					return true;
				}

				return false;
			}

			var refresh = function() {

				if (IsImageOk(img)) {
					img = new Image();
					img.src = 'showImageContent.action?filepath='
							+ scope.currentdir + '&filename=' + filename
							+ '&clusterCode=' + scope.clusterCode + '&date='
							+ String(new Date());

					document.getElementById(imgid).src = img.src;

					return true;
				} else {

					return false;
				}

			}
			this.preview(openFileWinId, filename, html, refresh);
			// openImage();
			return;
		}

		if (TYPE.filetype == 'PDF') {
			// openPDF();
			var pdfid = openFileWinId + "_pdf";
			var html = '<center><iframe id="'
					+ pdfid
					+ '" scolling="no" frameborder="no" style="height:100%;width:100%" src="showPdfContent.action?filepath='
					+ scope.currentdir + '&filename=' + filename
					+ '&clusterCode=' + scope.clusterCode + '&date='
					+ String(new Date()) + '"/></center>';
			var isLoading = false;
			var refresh = function() {
				var pdfiframe = document.getElementById(pdfid);
				pdfiframe.onload = function() {
					isLoading = false;
				}

				if (pdfiframe.readyState) {

					if (pdfiframe.readyState == 'complete') {
						pdfiframe.src = 'showPdfContent.action?filepath='
								+ scope.currentdir + '&filename=' + filename
								+ '&clusterCode=' + scope.clusterCode
								+ '&date=' + String(new Date());
						isLoading = true;
						return true;
					} else {
						return false;
					}

				} else {

					if (isLoading === false) {
						isLoading = true;
						pdfiframe.src = 'showPdfContent.action?filepath='
								+ scope.currentdir + '&filename=' + filename
								+ '&clusterCode=' + scope.clusterCode
								+ '&date=' + String(new Date());
						return true;

					} else {
						return false;
					}
				}

			}

			this.preview(openFileWinId, filename, html, refresh);
			return;
		}

		function countFileSize(s) {
			var l = 0;
			var a = s.split("");
			for (var i = 0; i < a.length; i++) {
				if (a[i].charCodeAt(0) < 299) {
					l++;
				} else {
					l += 2;
				}
			}
			return l;
		}
		function doSaveFile() {
			var key = scope.packetKey(scope.host, currentdir);
			var item = scope.getItem(key, filename);

			if (item != null && item.permission.indexOf('-rw') != 0) {
				Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
								+ filename + ' [ -rw ] ', function() {
							scope.setWinCmpFocus();
						});
				return false;
			}

			openfileForm.getEl().mask(i18n.mask_wait);
			var filecontent = Ext.get(textareaid).dom.value;

			// var page = Ext.getCmp(textareaid + '_page').text;
			// FileMngGlobal.fileContentTextArea.addFileContentTextAreaByPage(
			// textareaid, page, Ext.get(textareaid).dom.value);
			// var filecontent = FileMngGlobal.fileContentTextArea
			// .getFileContentTextArea(textareaid);
			Ext.Ajax.request({
						url : 'doSaveFile.action',
						params : {
							filepath : currentdir + '/' + filename,
							filecontent : filecontent.replace("\r\n", "\n"),
							clusterCode : scope.clusterCode

						},
						success : function(resp, opts) {

							// this.refresh({
							// filepath : currentdir
							// });
							openfileForm.getEl().unmask();
							var responseObject = Ext.util.JSON
									.decode(resp.responseText);
							if (responseObject.fileInfo.exception != null
									&& responseObject.fileInfo.exception.length > 0) {
								Ext.Msg.alert(i18n.error,
										responseObject.fileInfo.exception,
										function() {
											scope.setWinCmpFocus();
										});
							} else {
								// FileMngGlobal.fileContentTextArea
								// .addFileContentTextAreaTotal(textareaid,
								// filecontent);
								// Ext.get(textareaid).dom.value =
								// FileMngGlobal.fileContentTextArea
								// .getFileContentTextAreaByPage(textareaid, 1);
								// Ext.getCmp(textareaid + '_totalpage')
								// .setText(FileMngGlobal.fileContentTextArea
								// .getTotalPage(textareaid));
								scope.changeItemValue(scope.packetKey(
												currentdir, filename),
										filename, 'size',
										countFileSize(filecontent));

							}

						},
						failure : function(resp, opts) {
							openfileForm.getEl().unmask();
							var exceptionE = i18n.error_connection;
							Ext.Msg.alert(i18n.error, exceptionE, function() {
										scope.setWinCmpFocus()
									});
						},
						scope : scope
					})
		}

		function getDefaultopenFileWinId() {
			var defaultopenFileWinId = scope.host + ',' + scope.currentdir
					+ ',' + filename + ',openfilewin';

			return defaultopenFileWinId;
		}

		function getDefaultFileTextAreaId() {
			var defaultTextareaid;

			defaultTextareaid = scope.host + ',' + scope.currentdir + ','
					+ filename + ',opentextarea';

			return defaultTextareaid;

		}

		function getDefaultFileFormId() {
			var defaultFileFormid;

			defaultFileFormid = scope.host + ',' + scope.currentdir + ','
					+ filename + ',openfileform';

			return defaultFileFormid;

		}

		function prePage() {
			var page = Ext.getCmp(textareaid + '_page').text;
			if (page > 1) {
				page--;
				Ext.getCmp(textareaid + '_page').setText(page);
				Ext.get(textareaid).dom.value = FileMngGlobal.fileContentTextArea
						.getFileContentTextAreaByPage(textareaid, page);
			}
		}
		function nextPage() {
			var page = Ext.getCmp(textareaid + '_page').text;
			var totalpage = Ext.getCmp(textareaid + '_totalpage').text;
			if (page < totalpage) {
				page++;
				Ext.getCmp(textareaid + '_page').setText(page);
				Ext.get(textareaid).dom.value = FileMngGlobal.fileContentTextArea
						.getFileContentTextAreaByPage(textareaid, page);
			}

		}

		if (filetype == "File") {

			// if(isImage())
			// {
			// openImage();
			// return true;
			// }

			var openfileForm;
			var isfile = true;
			if (isfile) {
				var recs = this.grid.getSelectionModel().getSelections();
				if (isfile) {
					var maxSize = 2 * 1024 * 1024;
					if (size >= maxSize) {
						Ext.MessageBox.show({
									title : i18n.error,
									msg : i18n.msg_filesize
											+ Ext.ux.Util.formatSize(size)
											+ i18n.msg_filesizeexceed
											+ Ext.ux.Util.formatSize(maxSize)
											+ i18n.msg_download,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO,
									modal : true
								});
						return
					}

					var toolbar = new Ext.Toolbar({
						height : 30,
						width : "100%",
						region : 'center',
						autoScroll : true,
						items : [{
									// id : this.fileWinId + 'tb_paste1',
									text : i18n.save,
									tooltip : i18n.save,
									tooltipType : "title",
									icon : "images/Menus/save.png",
									cls : "x-btn-text-icon",
									handler : function() {
										doSaveFile();
									}
								}, {
									// id : this.fileWinId + 'tb_paste1',
									text : i18n.file_edit_cut,
									tooltip : i18n.file_edit_cut,
									tooltipType : "title",
									icon : "images/Menus/cut.gif",
									cls : "x-btn-text-icon",
									handler : function() {
										txtCut(textareaid)
									}
								}, {
									// id : this.fileWinId + 'tb_paste1',
									text : i18n.file_edit_copy,
									tooltip : i18n.file_edit_copy,
									tooltipType : "title",
									icon : "images/Menus/copy.gif",
									cls : "x-btn-text-icon",
									handler : function() {
										txtCopy(textareaid)
									}
								}, {
									// id : this.fileWinId + 'tb_upload',
									text : i18n.file_edit_paste,
									tooltip : i18n.file_edit_paste,
									tooltipType : "title",
									icon : "images/Menus/paste.gif",
									cls : "x-btn-text-icon",
									handler : function() {
										txtPaste(textareaid)
									}
								}, {
									// id : this.fileWinId + 'tb_download',
									text : i18n.file_edit_del,
									tooltip : i18n.file_edit_del,
									tooltipType : "title",
									icon : "images/Menus/del.gif",
									cls : "x-btn-text-icon",
									handler : function() {
										txtDel(textareaid)
									}
								}, {
									// id : this.fileWinId + 'tb_download',
									text : i18n.file_edit_allsel,
									tooltip : i18n.file_edit_allsel,
									tooltipType : "title",
									icon : "images/Menus/allselect.gif",
									cls : "x-btn-text-icon",
									handler : function() {
										txtAllSelect(textareaid)
									}
								}, {
									// id : this.fileWinId + 'tb_download',
									text : i18n.file_property,
									tooltip : i18n.file_property,
									tooltipType : "title",
									icon : "images/Menus/fileprpt.gif",
									cls : "x-btn-text-icon",
									handler : function() {
										scope.properties(true, r);
									}
								}, '-', i18n.file_font_size,
								new Ext.form.ComboBox({
									name : scope.fileWinId + 'fontsize',
									width : 50,
									store : new Ext.data.SimpleStore({
												fields : ['size'],
												data : [['8'], ['12'], ['16'],
														['20'], ['24'], ['28']]

											}),
									mode : 'local',
									value : '12',
									listWidth : 50,
									triggerAction : 'all',
									displayField : 'size',
									valueField : 'size',
									editable : false,
									forceSelection : true,
									listeners : {
										select : function(combo, record) {
											var index = record.get('size');

											Ext.get(textareaid).setStyle({
														'font-size' : Number(index)
													});

										}
									}
								}), "-", {
									// id : this.fileWinId + 'tb_download',
									text : i18n.file_edit_refresh,
									tooltip : i18n.file_edit_refresh,
									tooltipType : "title",
									icon : "images/Menus/refresh.gif",
									cls : "x-btn-text-icon",
									handler : function() {
										openfileForm.getEl()
												.mask(i18n.mask_wait);
										Ext.Ajax.request({
											url : 'showFileContent.action',
											params : {
												filename : filename,
												filepath : currentdir,
												clusterCode : scope.clusterCode

											},
											callback : function(opts, success,
													resp) {
												openfileForm.getEl().unmask();
												if (success) {

													var exception;
													try {
														exception = Ext.util.JSON
																.decode(resp.responseText).fileInfo.exception;
														if (exception) {
															Ext.Msg.alert(
																	i18n.error,
																	exception);

															return false;
														}
													} catch (e) {
														// FileMngGlobal.fileContentTextArea
														// .addFileContentTextAreaTotal(
														// textareaid,
														// resp.responseText);
														// Ext.get(textareaid).dom.value
														// =
														// FileMngGlobal.fileContentTextArea
														// .getFileContentTextAreaByPage(
														// textareaid,
														// 1);
														// Ext
														// .getCmp(textareaid
														// + '_totalpage')
														// .setText(FileMngGlobal.fileContentTextArea
														// .getTotalPage(textareaid));
														Ext.get(textareaid).dom.value = resp.responseText;
													}

												} else {
													var exceptionE = resp.responseText;
													if (exceptionE == ''
															|| exceptionE == null)
														exceptionE = 'Unkown exception';
													Ext.get(textareaid).dom.value = exceptionE;
												}

											}
										});

									}
								}

						]
					});

					var app = Ext.ux.Util.getApp();
					var desktop = app.getDesktop();
					var openfileWindow = desktop.getWindow(openFileWinId);

					if (!openfileWindow) {
						openfileForm = new Ext.form.FormPanel({
									labelWidth : 75,
									title : filename,
									frame : true,
									buttonAlign : 'center',
									id : openFileFormId,
									bbar : [
											// new Ext.Button({
											// text : "<",
											// handler : function() {
											// prePage();
											// }
											// }), {
											// id : textareaid + '_page',
											// text : '1'
											// }, '/',{
											// id : textareaid + '_totalpage',
											// text : '1'
											// }, new Ext.Button({
											// text : ">",
											// handler : function() {
											// nextPage();
											// }
											//
											// }),
											'->', new Ext.Button({
														text : i18n.save,
														handler : doSaveFile
													}), new Ext.Button({
														text : i18n.cancel,
														handler : function() {
															openfileWindow
																	.close();
														}
													})],

									items : [toolbar,
											scope.newSearchBar(textareaid), {
												xtype : 'textarea',
												hideLabel : 'true',
												labelSeparator : '',
												id : textareaid,
												style : 'font-size:12',
												anchor : '100% -50',
												name : 'txt_content'
												// html:'<div><textarea
											// onClick="alert(\"234\");
											// event.cancelBubble=true;"></textarea></div></div>'
										}]

								});

						openfileForm.render(document.body);
						openfileForm.getEl().mask(i18n.mask_wait);
						openfileWindow = desktop.createWindow({
									id : openFileWinId,
									draggable : true,
									constrainHeader : true,
									width : Ext.lib.Dom.getViewWidth() * 3 / 4,
									height : Ext.lib.Dom.getViewHeight() * 8
											/ 9,
									// modal : true,
									layout : 'fit',
									title : i18n.title_editfile,
									frame : true,
									plain : true,
									items : openfileForm

								});
						openfileWindow.on({
									'close' : {
										fn : function() {
											// FileMngGlobal.fileContentTextArea
											// .removeFileContentTextAreaTotal(textareaid);
											openfileWindow.removeWin;
											scope.setWinCmpFocus();// make
											// file-
											// window
											// has focus
										}
									}
								});
						openfileWindow.show();

						Ext.ux.Util.fixExtBugofChromePagedn(openFileWinId);

						// var filecontent = Ext.get(scope.fileWinId
						// + 'txt_content' + filename
						// + date.format("ymdhms"));
						// filecontent.addListener("mousemove",function(){event.cancelBubble=true;});

						Ext.Ajax.request({
							url : 'showFileContent.action',
							params : {
								filename : filename,
								filepath : currentdir,
								clusterCode : scope.clusterCode

							},
							callback : function(opts, success, resp) {
								openfileForm.getEl().unmask();
								if (success) {

									var exception;
									try {
										exception = Ext.util.JSON
												.decode(resp.responseText).fileInfo.exception;
										if (exception) {
											Ext.Msg
													.alert(i18n.error,
															exception);
											openfileWindow.close();
											return false;
										}
									} catch (e) {
										// alert( resp.responseText);
										// FileMngGlobal.fileContentTextArea
										// .addFileContentTextAreaTotal(
										// textareaid,
										// resp.responseText);
										// Ext.get(textareaid).dom.value =
										// FileMngGlobal.fileContentTextArea
										// .getFileContentTextAreaByPage(
										// textareaid, 1);
										// Ext
										// .getCmp(textareaid
										// + '_totalpage')
										// .setText(FileMngGlobal.fileContentTextArea
										// .getTotalPage(textareaid));

										Ext.get(textareaid).dom.value = resp.responseText;

									}

								} else {
									var exceptionE = resp.responseText;
									if (exceptionE == '' || exceptionE == null)
										exceptionE = 'Unkown exception';
									Ext.get(textareaid).dom.value = exceptionE;
								}

							}
						});
					} else {
						openfileWindow.show();
					}

				}
			} else {
				Ext.MessageBox.alert(i18n.prompt, i18n.prompt_selectfile);
			}
		} else if (filetype == "Folder" || filetype == "Link") {
			var foldername = this.grid.getSelectionModel().getSelected()
					.get('name');
			this.openFolder(foldername);
		} else {
			Ext.MessageBox.alert(i18n.prompt, i18n.prompt_unknownfiletype);
		}

	},
	cut : function() {
		var scope = this;
		var invalidpath = this.checkPermission('cut');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			return false;
		}
		FileMngGlobal.filePasteShares.pasteFileList = [];
		var sels = this.grid.getSelectionModel().getSelections();
		if (!sels || sels <= 0) {
			return false;

		}
		var len = sels.length;
		for (var i = 0; i < len; i++) {
			var sel = sels[i];
			FileMngGlobal.filePasteShares.pasteFileList.push(sel);
			// this.pasteFileList.push(sel.get('name'));
		}
		FileMngGlobal.filePasteShares.pasteflag = "cut";
		// this.srcfilepath = this.currentdir;
		FileMngGlobal.filePasteShares.pasteSrcPath = this.currentdir;
		FileMngGlobal.filePasteShares.pasteHost = this.host;
		FileMngGlobal.filePasteShares.pasteClusterCode = this.clusterCode;
		FileMngGlobal.filePasteShares.pasteStart = this
				.getPagingToolBarCursor();
		this.setComponetStatus('tb_paste', true);
		// this.setComponetStatus('tb_paste1', true);
		this.setComponetStatus('menu_paste', true);
		// Ext.getCmp(this.fileWinId + 'tb_paste').enable();
		// Ext.getCmp(this.fileWinId + 'tb_paste1').enable();
		// Ext.getCmp(this.fileWinId + 'menu_paste').enable();
		this.updateOtherStatus(true);
	},
	copy : function() {

		var scope = this;
		var invalidpath = this.checkPermission('copy');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			return false;
		}
		FileMngGlobal.filePasteShares.pasteFileList = [];
		var sels = this.grid.getSelectionModel().getSelections();
		var len = sels.length;
		for (var i = 0; i < len; i++) {
			var sel = sels[i];
			FileMngGlobal.filePasteShares.pasteFileList.push(sel);
			// this.pasteFileList.push(sel.get('name'));
		}
		FileMngGlobal.filePasteShares.pasteflag = "copy";
		FileMngGlobal.filePasteShares.pasteStart = this
				.getPagingToolBarCursor();
		// this.srcfilepath = this.currentdir;
		FileMngGlobal.filePasteShares.pasteSrcPath = this.currentdir;
		FileMngGlobal.filePasteShares.pasteHost = this.host;
		FileMngGlobal.filePasteShares.pasteClusterCode = this.clusterCode;
		this.setComponetStatus('tb_paste', true);
		// this.setComponetStatus('tb_paste1', true);
		this.setComponetStatus('menu_paste', true);
		// Ext.getCmp(this.fileWinId + 'tb_paste').enable();
		// Ext.getCmp(this.fileWinId + 'tb_paste1').enable();
		// Ext.getCmp(this.fileWinId + 'menu_paste').enable();
		this.updateOtherStatus(true);
	},

	/***************************************************************************
	 * 
	 * zip function This function can compress multiple files or folders to a
	 * .zip or .tar or .tar.gz file.
	 * 
	 */
	zip : function() {

		var scope = this;
		var invalidpath = this.checkPermission('zip');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			return false;
		}

		var filename = this.grid.getSelections()[0].get('name');

		var currentdir = this.currentdir;
		var clusterIp = this.host;
		// if (Ext.ux.Util.containEmpty(filename)) {
		// Ext.Msg.alert(i18n.error, i18n.val_zipfilenotcontainblank);
		// return;
		// }
		var st = new Ext.data.SimpleStore({
					fields : ['zip'],
					data : [['zip'], ['tar'], ['gz']]

				})

		var zipPanel = new Ext.form.FormPanel({
			// layout : "column",
			border : false,
			width : 290,
			height : 100,
			buttonAlign : 'center',
			frame : true,
			buttons : [{
						id : scope.fileWinId + 'btn_zipfile',
						name : scope.fileWinId + 'btn_zipfile',
						minWidth : 80,
						text : i18n.confirm,
						handler : doZipFile

					}],
			items : [{
						layout : "form",
						border : false,
						items : {
							xtype : 'textfield',
							fieldLabel : i18n.lab_filename,
							// fieldWidth : 30,
							labelStyle : "width:80;",
							width : 150,
							labelSeparator : ':',
							regex : this.regex,
							regexText : i18n.val_fileformaterror,
							allowBlank : false,
							blankText : i18n.val_filenamenotnull,
							maxLength : 100,
							maxLengthText : i18n.val_exceedmaxlength,
							id : scope.fileWinId + 'txt_zipfile',
							msgTarget : 'qtip',
							name : scope.fileWinId + 'txt_zipfile'
						}

					}, {
						layout : "table",
						layoutConfig : {
							columns : 2
						},
						border : false,
						items : [{
									width : 83,
									items : [new Ext.form.Label({
												width : 83,
												height : 20,
												style : 'font-size:0.8em',
												html : i18n.lab_filetype + ":"
											})]
								}, {
									width : 150,
									items : [new Ext.form.ComboBox({
												id : scope.fileWinId
														+ 'com_zipfile',
												name : scope.fileWinId
														+ 'com_zipfile',
												fieldLabel : i18n.lab_filetype,
												// labelStyle : "width:80;",
												mode : 'local',
												triggerAction : 'all',
												store : st,
												allowBlank : false,
												blankText : i18n.val_filenamenotnull,
												// fieldWidth : 30,
												msgTarget : 'qtip',
												width : 150,
												labelSeparator : ':',
												displayField : 'zip',
												valueField : 'zip',
												foreSelection : true,
												value : 'zip',
												handleHeight : 10

											})]
								}]
					}]

		});
		// function se() {
		// // var code = Ext.getCmp(scope.fileWinId + 'com_zipfile').getValue();
		// // var myDate = new Date();
		// // var date = myDate.format("ymdHis");
		// // Ext.getCmp(scope.fileWinId + 'txt_zipfile').setValue("new" + code
		// // + date);
		// Ext.getCmp(scope.fileWinId + 'txt_zipfile').setValue(filename);
		//
		// }
		// Ext.getCmp(scope.fileWinId + 'com_zipfile').addListener("select",
		// se);

		var app = Ext.ux.Util.getApp();
		var desktop = app.getDesktop();
		var zipWindow = desktop.getWindow(scope.fileWinId + 'zipWindow');
		Ext.ux.Util.closeWindow(zipWindow);
		zipWindow = desktop.createWindow({
					id : scope.fileWinId + "zipWindow",
					draggable : true,
					width : 300,
					height : 130,
					title : i18n.title_zip,
					modal : true,
					closable : true,
					border : false,
					resizable : false,
					bodyStyle : 'padding:0 0 0 0',
					items : [{
								xtype : 'panel',
								layout : "column",
								border : false,
								items : [zipPanel]

							}]

				});
		zipWindow.on({
					'close' : {
						fn : function() {
							zipWindow.removeWin;
							scope.setWinCmpFocus();// make
							// file-
							// window
							// has focus
						}
					}
				});
		zipWindow.show();

		new Ext.KeyMap(Ext.get(scope.fileWinId + "zipWindow"), {
					key : Ext.EventObject.ENTER,
					fn : doZipFile
				});
		// var myDate = new Date();
		// var date = myDate.format("ymdHis");
		// Ext.get(scope.fileWinId + 'txt_zipfile').dom.value = "new"
		// + Ext.get(scope.fileWinId + 'com_zipfile').dom.value + date;
		var zipfilename = filename.replace(/\.[a-zA-Z]+$/, '');
		if (this.grid.getSelections().length > 1) {
			zipfilename = this.currentdir.substring(this.currentdir
					.lastIndexOf('/')
					+ 1);
		}

		Ext.getCmp(scope.fileWinId + 'txt_zipfile').setValue(zipfilename);
		var sels = scope.grid.getSelectionModel().getSelections();
		function doZipFile() {
			if (zipPanel.form.isValid()) {
				var zipflag = Ext.get(scope.fileWinId + 'com_zipfile').dom.value;
				var filename = Ext.get(scope.fileWinId + "txt_zipfile").dom.value;
				var invalidpath = scope.checkPermission(zipflag);
				if (invalidpath != null) {
					Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
									+ invalidpath, function() {
								scope.setWinCmpFocus();
							});
					return false;
				}
				var postfix = "";
				if (zipflag == 'zip')
					postfix = ".zip";
				else if (zipflag == 'gz')
					postfix = ".tar.gz";
				else if (zipflag == 'tar')
					postfix = ".tar";

				var len = sels.length;
				var list = [];
				for (var i = 0; i < len; i++) {
					var sel = sels[i];
					list.push(sel.get('name'));
				}
				if (filename == "") {
					filename = "new" + zipflag;
				}

				var operator = scope.checkFileParam;// cover

				var key = scope.packetKey(clusterIp, currentdir);

				var start = scope.getPagingToolBarCursor();

				filename = Ext.util.Format.trim(filename);

				var currentCacheData = scope.getData(key);

				for (var i = 0; i < currentCacheData.length; i++) {
					if (filename + postfix == currentCacheData[i].name) {
						Ext.Msg.buttonText.yes = i18n.confirm;
						Ext.Msg.buttonText.no = i18n.no;
						Ext.MessageBox.show({
							title : i18n.prompt,
							msg : i18n.prompt_zipfileexists,
							buttons : Ext.Msg.YESNO,
							icon : Ext.Msg.WARNIN,
							fn : function(btn) {
								scope.setWinCmpFocus();
								if (btn == 'yes') {
									// scope.grid.getEl().mask(i18n.mask_wait);
									operator = scope.ignoreFileParam;

									Ext.Ajax.request({
										url : 'doZip.action',
										params : {
											filenamelist : list.join(','),
											filepath : currentdir,
											filename : filename,
											zipflag : zipflag,
											operator : operator,
											clusterCode : scope.clusterCode
										},
										success : function(resp, opts) {

											// scope.grid.getEl().unmask();
											var responseObject = Ext.util.JSON
													.decode(resp.responseText);
											if (responseObject.fileInfo.exception) {
												Ext.Msg
														.alert(
																i18n.error,
																responseObject.fileInfo.exception,
																function() {
																	scope
																			.setWinCmpFocus();
																});
											}
											// this.grid.store.removeAll();
											if (responseObject.unique == 1) {

												if (currentdir == this.currentdir
														&& clusterIp == this.host) {

													for (var i = 0; i < responseObject.fileItems.length; i++) {
														scope
																.changeItemJson(
																		key,
																		responseObject.fileItems[i].name,
																		responseObject.fileItems[i]);

													}
													//													  
													//							                         		
												} else {
													scope
															.changeItem(
																	key,
																	responseObject.fileItems[i].name,
																	responseObject.fileItems[i]);

												}

												scope.updateOtherCache();

											} else if (responseObject.unique == 2) {

												scope
														.setItems(
																clusterIp,
																currentdir,
																responseObject.fileItems);

												/**
												 * load data from cache to
												 * refresh store appearance
												 */

												if (currentdir == scope.currentdir
														&& clusterIp == scope.host) {

													scope.refreshStore(key,
															start);
												}
												scope.updateOtherCache();

												scope.zip();
												return true;
											}

										},
										failure : function(resp, opts) {
											// scope.grid.getEl().unmask();

											var exceptionE = 'Unkown exception';
											Ext.Msg.alert(i18n.error,
													exceptionE, function() {
														scope.setWinCmpFocus();
													});

										},
										scope : scope
									})
									zipWindow.close();

								}

							}
						})

						return true;
					}
				}

				// set "operator = scope.checkFileParam" to check real data
				// stored at cluster before doing work because of no same name
				// at current request
				scope.grid.getEl().mask(i18n.mask_wait);

				var newvalue = new Object();
				newvalue.name = filename + postfix;
				newvalue.permission = '-rw-r--r--';
				newvalue.typeString = 'File';
				newvalue.size = 0;
				newvalue.type = 0;
				newvalue.lastModified = Ext.ux.Util.formatTime(new Date()
						.getTime());
				// var
				// newvalue=[{name:Ext.get('txt_newfolder').dom.value,permission:'drwxr-xr-x',typeString:'Folder',size:80,lastModified:new
				// Date().format('Y-m-d h:i:s')}];
				scope.addItem(key, newvalue, start);
				scope.refreshStore(key, start);

				scope.updateOtherCache();
				scope.grid.getEl().unmask();
				operator = scope.checkFileParam;

				Ext.Ajax.request({
					url : 'doZip.action',
					params : {
						filenamelist : list.join(','),
						filepath : currentdir,
						filename : filename,
						zipflag : zipflag,
						operator : operator,
						clusterCode : scope.clusterCode
					},
					success : function(resp, opts) {

						// scope.grid.getEl().unmask();
						var responseObject = Ext.util.JSON
								.decode(resp.responseText);
						if (responseObject.fileInfo.exception) {
							Ext.Msg.alert(i18n.error,
									responseObject.fileInfo.exception,
									function() {
										scope.setWinCmpFocus();
									});
						}

						if (responseObject.unique == 1) {

							if (currentdir == this.currentdir
									&& clusterIp == this.host) {

								for (var i = 0; i < responseObject.fileItems.length; i++) {
									scope.changeItemJson(key,
											responseObject.fileItems[i].name,
											responseObject.fileItems[i]);

								}

							} else {
								scope.changeItem(key,
										responseObject.fileItems[i].name,
										responseObject.fileItems[i]);

							}

							scope.updateOtherCache();

						} else if (responseObject.unique == 2) {
							scope.setItems(clusterIp, currentdir,
									responseObject.fileItems);

							if (currentdir == this.currentdir
									&& clusterIp == this.host) {
								scope.refreshStore(key, start);
							}
							scope.updateOtherCache();
							scope.zip();
							return true;
						} else {
							// ====resume=====//

							scope.removeItemValue(key, newvalue);
							if (currentdir == this.currentdir
									&& clusterIp == this.host) {
								scope.refreshStore(key, start);

							}

							scope.updateOtherCache();
						}

					},
					failure : function(resp, opts) {
						// scope.grid.getEl().unmask();
						// ====resume=====//
						var exceptionE = i18n.error_connection;
						Ext.Msg.alert(i18n.error, exceptionE, function() {
									scope.setWinCmpFocus();
								});
						scope.removeItemValue(key, newvalue);
						if (currentdir == this.currentdir
								&& clusterIp == this.host) {
							scope.refreshStore(key, start);

						}
						scope.updateOtherCache();

					},

					scope : scope
				})
				zipWindow.close();

			}
		}

	},

	/**
	 * 
	 * rename function
	 * 
	 * 
	 */
	rename : function() {

		/*
		 * 
		 * start editing cell
		 * 
		 */

		this.rightClick.hide(); // right menu will affect editing

		var rowIndex = this.grid.getSelectionModel().lastActive;

		var cname = this.getGridFileNameIndex();

		this.grid.getColumnModel().setEditable(cname, true);

		// var monitormap = this.getData(this.packetKey(this.host,
		// this.currentdir));

		this.grid.startEditing(rowIndex, cname);

		return true;

		/*
		 * 
		 * pop a panel to rename
		 * 
		 */
		// var store = this.grid.store;
		//
		// var r = this.grid.getSelections()[0];
		// var filetype = r.get('typeString');
		// var ctpath = r.get("currentPath");
		// var oldname = r.get("name");
		// if (filetype == "File")
		// name = i18n.lab_filename
		// else
		// name = i18n.lab_foldername
		// var renamePanel = new Ext.form.FormPanel({
		// layout : "form",
		// border : false,
		// width : 290,
		// height : 80,
		// frame : true,
		// buttons : [{
		// id : 'btn_renamefile',
		// name : 'btn_renamefile',
		// minWidth : 80,
		// text : i18n.confirm,
		// handler : doRename
		//
		// }],
		// buttonAlign : 'center',
		// items : [{
		// layout : "form",
		// border : false,
		// items : {
		// xtype : 'textfield',
		// fieldLabel : name,
		// labelStyle : "width:80;",
		// // fieldWidth : 100,
		// width : 150,
		// msgTarget : 'qtip',
		// regex : this.regex,
		// // regex :
		// // /^[\w-_#\s\u4e00-\u9fa5]+[\w-_.#\s\u4e00-\u9fa5]*$/,
		// regexText : i18n.val_fileformaterror,
		// allowBlank : false,
		// blankText : i18n.val_filenamenotnull,
		// maxLength : 100,
		// maxLengthText : i18n.val_exceedmaxlength,
		// frame : true,
		// value : oldname,
		// labelSeparator : ':',
		// id : 'txt_renamefile',
		// name : 'txt_renamefile'
		// }
		//
		// }]
		//
		// })
		//
		// var app = Ext.ux.Util.getApp();
		// var desktop = app.getDesktop();
		// var renameWindow = desktop.getWindow("renameWindow");
		// Ext.ux.Util.closeWindow(renameWindow);
		// renameWindow = desktop.createWindow({
		// id : "renameWindow",
		// // var newfileWindow = new Ext.Window({
		// draggable : true,
		// width : 300,
		// height : 120,
		// title : i18n.lab_rename,
		// closable : true,
		// border : false,
		// resizable : false,
		// bodyStyle : 'padding:0 0 0 0',
		// items : [{
		// xtype : 'panel',
		// layout : "form",
		// frame : true,
		// border : false,
		// items : [renamePanel]
		// }]
		//
		// });
		// renameWindow.show();
		//
		// var FileMngGlobal.getFileDataCacheMap() = new
		// Ext.KeyMap(Ext.get("renameWindow"), {
		// key : Ext.EventObject.ENTER,
		// fn : doRename.createDelegate(this)
		// });
		// var scope = this;
		//
		// function doRename() {
		//
		// if (renamePanel.form.isValid()) {
		//
		// // /////////////////
		// var newname = Ext.get("txt_renamefile").dom.value;
		//
		// if (newname == "") {
		// Ext.MessageBox.alert(i18n.prompt, i18n.val_filenamenotnull);
		// return;
		// }
		//
		// var newname = Ext.get("txt_renamefile").dom.value;
		//
		// if (newname == "") {
		// Ext.MessageBox.alert(i18n.prompt, i18n.val_filenamenotnull);
		// return;
		// }
		//
		// // var all = store.getCount();
		// // var flag = 0;
		// var key = scope.packetKey(scope.host, ctpath);
		//
		// if (scope.checkData(key, newname)) {
		// return;
		// }
		//
		// // var currentCacheData = scope.getData(key);
		// // if (currentCacheData) {
		// // for (var i = 0; i < currentCacheData.length; i++) {
		// // if (newname == currentCacheData[i].name) {
		// // Ext.MessageBox.alert(i18n.prompt,
		// // i18n.val_filenameexist);
		// // return;
		// // }
		// // }
		// // } else {
		// // // read data from grid if no data in cache
		// // var store = this.grid.getStore();
		// // for (var i = 0; i < store.getCount(); i++) {
		// // if (newname == store.getAt(i).get('name')) {
		// // Ext.Msg.alert(i18n.prompt, i18n.val_filenameexist);
		// // return;
		// // }
		// // }
		// // }
		//
		// scope.grid.getEl().mask(i18n.mask_wait);
		// Ext.Ajax.request({
		// url : 'doRename.action',
		// params : "oldfilename="
		// + Ext.util.Format.trim(oldname)
		// + "&newfilename="
		// + Ext.util.Format.trim(newname)
		// + "&filepath=" + ctpath,
		// success : function(resp, opts) {
		//
		// this.grid.getEl().unmask();
		// var responseObject = Ext.util.JSON
		// .decode(resp.responseText);
		//
		// if (responseObject.fileInfo.exception) {
		// Ext.Msg.alert(i18n.error,
		// responseObject.fileInfo.exception);
		// }
		//
		// // this.grid.store.removeAll();
		// if (responseObject.unique == 1) {
		// this.setItems(this.host, ctpath,
		// responseObject.fileItems);
		// this.grid.store.removeAll();
		// this.grid.store
		// .add(this.getMyStore(key).data.items);
		// this.removeData(this.packetKey(this.host,
		// ctpath
		// + "/"
		// + Ext.util.Format
		// .trim(oldname)));
		// } else if (responseObject.unique == 2) {
		//
		// this.setItems(this.host, ctpath,
		// responseObject.fileItems);
		// // this.grid.store.removeAll();
		// // this.grid.store
		// // .add(this.getMyStore(key).data.items);
		// // this.removeData(this.packetKey(this.host,
		// // ctpath
		// // + "/"
		// // + Ext.util.Format
		// // .trim(oldname)));
		// this.rename();
		// return;
		// }
		//
		// },
		// failure : function(resp, opts) {
		// this.grid.getEl().unmask();
		// var resultArray = (Ext.util.JSON
		// .decode(resp.responseText)).fileInfo;
		// var exceptionE = "";
		// if (resultArray.exception == ''
		// || resultArray.exception == null) {
		// exceptionE = 'Unkown exception';
		// Ext.Msg.alert(i18n.error, exceptionE);
		// } else
		// Ext.Msg.alert(i18n.error,
		// resultArray.exception);
		// },
		// scope : scope
		// });
		// renameWindow.close();
		//
		// }
		// }
	},
	openFolder : function(p) {
		// open folder
		var scope = this;
		var invalidpath = this.checkPermission('open');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			return false;
		}

		this.currentAddressChange(this.AddressRecords.enter, this.currentdir,
				this.fileWinId);
		var path = this.currentdir + "/" + p;
		this.currentdir = path;
		Ext.get(this.fileWinId + 'txt_url').dom.value = path;
		this.refresh({
					filepath : path
				});
		// this.upcount++;
		// var len = this.backwardrecords.length - 1;
		// var tmp_path = this.backwardrecords[len];
		// this.backwardrecords.push(path);
		// if (tmp_path == path) {
		// this.backwardrecords.pop();
		// }

		// Ext.getCmp('tb_upward').enable();
		// Ext.getCmp('tb_backward').enable();
		// if (this.upcount > 0) {
		// } else {
		// Ext.getCmp('tb_upward').disable();
		// }

	},
	dos2unix : function() {
		var scope = this;
		var invalidpath = this.checkPermission('open');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			return false;
		}
		var sels = this.grid.getSelectionModel().getSelections();
		var fileList = [];
		for (var i = 0; i < sels.length; i++) {
			fileList.push(sels[i].get('name'));
		}
		Ext.Ajax.request({
					url : 'doDos2unix.action',
					params : {
						filelist : fileList.join(','),
						filepath : this.currentdir,
						clusterCode : scope.clusterCode
					},
					success : function(resp, opts) {

						// scope.grid.getEl().unmask();
						var responseObject = Ext.util.JSON
								.decode(resp.responseText);
						if (responseObject.fileInfo.exception) {
							Ext.Msg.alert(i18n.error,
									responseObject.fileInfo.exception,
									function() {
										scope.setWinCmpFocus();
									});
						}

						if (responseObject.unique == 1) {

							// Ext.Msg.alert(i18n.promp, "dos2unix " + i18n.ok);

						}

					},
					failure : function(resp, opts) {
						// scope.grid.getEl().unmask();
						// ====resume=====//
						var exceptionE = i18n.error_connection;
						Ext.Msg.alert(i18n.error, exceptionE, function() {
									scope.setWinCmpFocus();
								});

					},

					scope : scope
				})

	},
	showUrl : function() {
		var scope = this;
		Ext.get(this.fileWinId + 'txt_url').dom.value = this.parseFilePath(Ext
				.get(this.fileWinId + 'txt_url').dom.value);
		var path = Ext.get(this.fileWinId + 'txt_url').dom.value;
		if (this.currentdir == path) {
			// reload current dir
			this.refresh({
						filepath : path,
						focus : true
					});
			return;
		}
		var substr = this.workdir;
		var sharesstr = this.workdir.substring(0, this.workdir.lastIndexOf('/')
						+ 1)
				+ this.file_shares;
		if (this.r == 2) {
			substr = this.workdir.substring(0, this.workdir.lastIndexOf('/'));
		}
		if (path.indexOf(substr) < 0 && path.indexOf(sharesstr) < 0) {
			Ext.Msg.alert(i18n.prompt, i18n.prompt_noright);
			this.currentAddressChange(this.AddressRecords.enter,
					this.currentdir, this.fileWinId);
			Ext.get(this.fileWinId + 'txt_url').dom.value = this.workdir;
			this.currentdir = this.workdir;
			this.refresh({
						filepath : this.workdir
					});
			// this.initStatus(this.workdir);
		} else {

			this.currentAddressChange(this.AddressRecords.enter,
					this.currentdir, this.fileWinId);
			this.currentdir = path;
			this.refresh({
						filepath : path
					});

		}
	},

	afterRefresh : function() {
	},
	beforeRefresh : function() {
	},
	execeptionRefresh : function() {
	},
	refresh : function(p) {
		this.setWinCmpFocus();
		var scope = this;
		var store = this.ds;
		var spath;
		var autocreate = false;
		if (p != null && p.autocreate) {
			autocreate = p.autocreate;
		}

		if (p == null || !p.filepath) {
			spath = this.currentdir;
		} else {
			spath = p.filepath;
		}
		this.currentdir = spath;
		Ext.get(this.fileWinId + 'txt_url').dom.value = this.currentdir;
		key = this.host + "," + Ext.ux.Util.formatDir(spath);
		var workdir = this.workdir;

		var invalidpath = scope.checkPermission('refresh');
		if (invalidpath != null) {
			Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
							+ invalidpath, function() {
						scope.setWinCmpFocus();
					});
			this.grid.store.removeAll();
			this.firePagingToolBar(0, null, 0);
			this.errorStatus();
			return false;
		}

		scope.beforeRefresh();

		var cursor = this.getPagingToolBarCursor();
		var current = cursor / this.limited + 1;
		this.initStatus(spath);
		if (this.containKey(key)) {

			var theData = this.getData(key);

			FileMngGlobal.getFileDataCacheMap().removeKey(key);
			this.addData(key, theData);
			var cachelength = theData.length;

			if (p == null || !p.focus) {
				// not real refresh
				this.sortData(true);
				var cachestart = this.pagingmap.get(key);
				cachestart = cachestart == null ? 0 : cachestart;
				this.grid.getEl().mask(i18n.mask_wait);
				this.grid.store.removeAll();
				this.grid.store
						.add(this.getMyStore(key, 1, cachestart).data.items);
				this.firePagingToolBar(cachestart, cachestart / this.limited
								+ 1, cachelength);
				this.grid.getEl().unmask();
				scope.afterRefresh();
			} else {

				// var params = {
				// start : cursor,
				// limit : this.limited,
				// // hostIp : this.host,
				// filepath : spath,
				// clusterCode:this.clusterCode
				//					
				// };
				// alert(Ext.getCmp("pagingToolbar").cursor);
				// Ext.apply(params, {
				// filepath : spath
				// });

				this.grid.store.removeAll();
				this.grid.store.proxy = this.getMyProxy(null, null);
				this.grid.store.reader = this.getMyReader(null);
				// this.grid.store.autoLoad = true;
				var params = {
					dataset : this.grid.store,
					path : spath,
					start : cursor,
					limit : this.limited,
					autocreate : autocreate
				};
				// this.doDataLoad(this.grid.store, spath, cursor,
				// this.limited);
				this.doDataLoad(params);
				// this.grid.store.load({
				// params : params,
				// callback : function(records, options, success) {
				// if (success) {
				//
				// if (this.grid.store.reader.jsonData.fileInfo.exception) {
				// var exception =
				// this.grid.getStore().reader.jsonData.fileInfo.exception;
				// Ext.Msg.alert(i18n.error, i18n.error_filelist);
				// this.errorStatus();
				// scope.execeptionRefresh();
				// return false;
				// } else {
				//
				// var pageStart = this.grid.store.reader.jsonData.pageStart;
				// if (pageStart > 0) {
				// this
				// .firePagingToolBar(
				// pageStart,
				// pageStart / this.limited
				// + 1,
				// this.grid.store.reader.jsonData.results);
				// }
				//
				// // var dir = spath;
				// this.ds = this.grid.store;
				// this.setData(this.host, spath, records);
				// // this.initStatus(spath);
				// if (this.grid.getStore().reader.jsonData.results >
				// this.limited) {
				// var params1 = {
				// start : 0,
				// limit : 0,
				// scope : 'all',
				// // hostIp : this.host,
				// filepath : spath,
				// clusterCode:this.clusterCode
				// };
				// this.loadAllItem(this, params1, spath);
				// }
				// scope.reloadOtherCache();
				// scope.afterRefresh();
				// }
				//
				// } else {
				// this.errorStatus();
				//							
				// Ext.Msg.alert(i18n.error, i18n.error_filelist);
				// scope.execeptionRefresh();
				// return false;
				//							
				// }
				// }.createDelegate(this)
				// });

			}
		} else {

			if (p == null || !p.focus) {
				// not real refresh
				// cursor = 0;
				var cursor = this.pagingmap.get(key);
				cursor = cursor == null ? 0 : cursor;
			}

			// var params = {
			// start : cursor,
			// limit : this.limited,
			// clusterCode:this.clusterCode,
			// // hostIp : this.host,
			// filepath : spath
			// };
			// alert(Ext.getCmp("pagingToolbar").cursor);
			// Ext.apply(params, {
			// filepath : spath
			// });
			this.grid.store.removeAll();
			this.grid.store.proxy = this.getMyProxy(null, cursor);
			this.grid.store.reader = this.getMyReader(null);
			// this.grid.store.autoLoad = true;
			var params = {
				dataset : this.grid.store,
				path : spath,
				start : cursor,
				limit : this.limited,
				autocreate : autocreate
			};
			// this.doDataLoad(this.grid.store, spath, cursor, this.limited);
			this.doDataLoad(params);
			// this.grid.store.load({
			// params : params,
			// callback : function(records, options, success) {
			// if (success) {
			//
			// if (this.grid.store.reader.jsonData.fileInfo.exception) {
			// var exception =
			// this.grid.getStore().reader.jsonData.fileInfo.exception;
			// // Ext.Msg.alert(i18n.error, exception);
			// Ext.Msg.alert(i18n.error, i18n.error_filelist);
			// this.errorStatus();
			// scope.execeptionRefresh();
			// return false;
			// } else {
			// // if(!p.focus||p==null)
			// // {
			// // // not real refresh
			// // //alert(this.grid.getStore().reader.jsonData.results);
			// // this.firePagingToolBar(0,current,null);
			// // }
			//
			// var pageStart = this.grid.store.reader.jsonData.pageStart;
			// if (pageStart > 0) {
			// this
			// .firePagingToolBar(
			// pageStart,
			// pageStart / this.limited + 1,
			// this.grid.store.reader.jsonData.results);
			// }
			//
			// // var dir = spath;
			// this.ds = this.grid.store;
			// this.setData(this.host, spath, records);
			// // this.initStatus(spath);
			//
			// if (this.grid.getStore().reader.jsonData.results > this.limited)
			// {
			// var params1 = {
			// start : 0,
			// limit : 0,
			// scope : 'all',
			// // hostIp : this.host,
			// filepath : spath,
			// clusterCode:this.clusterCode
			// };
			// this.loadAllItem(this, params1, spath);
			// }
			// scope.reloadOtherCache();
			// scope.afterRefresh();
			//
			// }
			//
			// } else {
			// this.errorStatus();
			//							
			// Ext.Msg.alert(i18n.error, i18n.error_filelist);
			// scope.execeptionRefresh();
			// return false;
			//							
			// }
			// }.createDelegate(this)
			// });

		}

	},
	parseFilePath : function(path) {
		var newpath = path.replace(/\\+/g, "\/").replace(/\/+/g, "\/");
		if (newpath != '/' && newpath.lastIndexOf('/') == newpath.length - 1) {
			newpath = newpath.substring(0, newpath.length - 1);
		}
		return newpath;
	},

	creatParentPathFolderOnlyInCache : function(path) {
		var createFolder = function() {

			var key = scope.packetKey(clusterIp, parentPath);
			if (scope.getData(key) != null
					&& scope.getItem(key, forderName) == null) {
				var newvalue = new Object();
				newvalue.name = forderName;
				newvalue.permission = 'drwxr-xr-x';
				newvalue.typeString = 'Folder';
				newvalue.size = 80;
				newvalue.type = 1;
				newvalue.lastModified = Ext.ux.Util.formatTime(new Date()
						.getTime());
				scope.addItem(key, newvalue, 0);
				scope.updateOtherCache();
			}

		};

		var scope = this;
		var clusterIp = this.host;

		if (path == null || path.indexOf(this.getRootPath()) < 0) {
			return;
		}

		var parentPath = this.getFilePath(path);
		var forderName = this.getFileName(path);

		// var currentdir = current;
		// if (current == null) {
		// currentdir = this.workdir;
		// }

		// if (currentdir == path || path.indexOf(currentdir) != 0) {
		// return;
		// }
		//
		// var seperatorIndex = path.indexOf('/', currentdir.length + 1);
		// if (seperatorIndex < currentdir.length + 1) {
		// seperatorIndex = path.length;
		// }
		// var folderpath = path.substring(0, seperatorIndex);
		// var newfolder = path.substring(currentdir.length + 1,
		// seperatorIndex);
		//
		// var newfolderKey = this.packetKey(clusterIp, folderpath);

		createFolder();

		scope.creatParentPathFolderOnlyInCache(parentPath);

	},

	createUrlPathFolder : function(url) {
		var scope = this;
		var clusterIp = this.host;
		var path = Ext.getCmp(this.fileWinId + "txt_url").getValue();
		if (url) {
			path = url;
		}
		var currentdir = this.getFilePath(path);
		var newfolder = this.getFileName(path);

		var newfolderKey = scope.packetKey(clusterIp, path);
		if (!FileMngGlobal.getFileDataCacheMap().containsKey(newfolderKey)) {
			// create empty cache as there is no new folder key in dataCacheMap
			scope.addData(newfolderKey, []);
		}
		var key = scope.packetKey(clusterIp, currentdir);
		this.creatParentPathFolderOnlyInCache(path);
		scope.initStatus(path);
		// if(scope.getData(key)!=null&&scope.getItem(key,newfolder)==null)
		// {
		// // var olddata = scope.getData(key);
		// var newvalue = new Object();
		// newvalue.name = newfolder;
		// newvalue.permission = 'drwxr-xr-x';
		// newvalue.typeString = 'Folder';
		// newvalue.size = 80;
		// newvalue.type = 1;
		// newvalue.lastModified = Ext.ux.Util.formatTime(new Date()
		// .getTime());
		// // var
		// //
		// newvalue=[{name:Ext.get('txt_newfolder').dom.value,permission:'drwxr-xr-x',typeString:'Folder',size:80,lastModified:new
		// // Date().format('Y-m-d h:i:s')}];
		//
		// // var newfolderitem=scope.getData(newfolderKey);
		//
		//			
		// scope.addItem(key, newvalue, 0);
		// //scope.refreshStore(key, start);
		// //scope.grid.getSelectionModel().selectRow(0, false);
		// scope.updateOtherCache();
		// }
		Ext.Ajax.request({
			url : 'doNewFolder.action',
			params : {
				filename : path,
				filepath : currentdir,
				clusterCode : scope.clusterCode
			},
			success : function(resp, opts) {

				scope.grid.getEl().unmask();
				var responseObject = Ext.util.JSON.decode(resp.responseText);

				if (responseObject.fileInfo.exception) {
					Ext.Msg.alert(i18n.error,
							responseObject.fileInfo.exception, function() {
								scope.getWinCmp().focus(true);
							});
					scope.errorStatus();

				}

				if (responseObject.unique == 1) {

				} else if (responseObject.unique == 2) {

					this.setItems(clusterIp, currentdir,
							responseObject.fileItems);
					var invalidpath = scope.checkParentPermission('open');
					if (invalidpath != null) {
						Ext.MessageBox.alert(i18n.prompt,
								responseObject.fileInfo.exception + '<br />'
										+ i18n.error_permission + invalidpath,
								function() {
									scope.setWinCmpFocus();
								});
					}
					this.removeData(newfolderKey); // clear
					// exited
					// newfolder history
					// cache

					/**
					 * load data from cache to refresh store appearance
					 */
					if (currentdir == this.currentdir && clusterIp == this.host) {
						this.refreshStore(key, start);
					}
					scope.updateOtherCache();

					return true;
				} else {

					// ====resume=====//
					this.removeData(newfolderKey); // clear
					// exited
					// newfolder history
					// cache

					/**
					 * remove former launched file from cache
					 */
					this.removeItemValue(key, newvalue);
					/**
					 * load data from cache to refresh store appearance
					 */

					if (currentdir == this.currentdir && clusterIp == this.host) {
						this.refreshStore(key, start);
					}
					scope.updateOtherCache();

				}

			},
			failure : function(resp, opts) {
				scope.grid.getEl().unmask();
				var exceptionE = i18n.error_connection;
				Ext.Msg.alert(i18n.error, exceptionE, function() {
							scope.getWinCmp().focus(true);
						});
				scope.errorStatus();
				// ====resume=====//
				this.removeData(newfolderKey); // clear exited
				// newfolder history

				/**
				 * remove former launched file from cache
				 */
				this.removeItemValue(key, newvalue);
				/**
				 * load data from cache to refresh store appearance
				 */

				if (currentdir == this.currentdir && clusterIp == this.host) {

					this.refreshStore(key, start);
				}

				scope.updateOtherCache();

			},
			scope : scope
		});

	},

	getPagingToolBarValue : function() {
		if (!Ext.getCmp(this.fileWinId + "pagingToolbar"))
			return;
		return Ext.getCmp(this.fileWinId + "pagingToolbar").field.dom.value;
	},
	getPagingToolBarCursor : function() {
		if (!Ext.getCmp(this.fileWinId + "pagingToolbar"))
			return;
		return Ext.getCmp(this.fileWinId + "pagingToolbar").cursor;
	},

	adjustPagingToolBarPages : function(pagelimited) {
		FileMngGlobal.pagesLimited = pagelimited;
		var scope = this;
		var key = scope.packetKey(scope.host, scope.currentdir);
		var currentData = scope.getData(key);
		var pagingToolbar = Ext.getCmp(scope.fileWinId + "pagingToolbar");
		var current = pagingToolbar.cursor;
		var cpagecount = scope.limited;
		pagingToolbar.pageSize = scope.limited = pagelimited;
		var pageData = pagingToolbar.getPageData();
		var totalLength = currentData.length;

		pagingToolbar.cursor = current % scope.limited == 0 ? current : Math
				.floor(current / scope.limited)
				* scope.limited;
		scope.pagingmap.add(key, pagingToolbar.cursor);
		pageData.pages = totalLength % this.limited == 0 ? Math
				.floor(totalLength / this.limited) : Math.floor(totalLength
				/ this.limited)
				+ 1;

	},

	firePagingToolBar : function(cursor, current, totalLength) {

		var scope = this;
		var pagingToolbar = Ext.getCmp(this.fileWinId + "pagingToolbar");
		if (!pagingToolbar) {
			return;
		}
		pagingToolbar.cursor = cursor;
		// pagingToolbar.field.dom.value=1;
		pagingToolbar.store.totalLength = totalLength == null
				? pagingToolbar.store.totalLength
				: totalLength;
		// pagingToolbar.store.fireEvent('load', pagingToolbar.store, [], {});
		var d = pagingToolbar.getPageData(), ap = d.activePage, ps = d.pages;
		// pagingToolbar.store.totalLength =
		// FileMngGlobal.getFileDataCacheMap().get(key).length;
		// this.store.fireEvent('load', scope.grid.store, [],
		// {});

		if (pagingToolbar.afterTextEl) {
			pagingToolbar.afterTextEl.el.innerHTML = String.format(
					pagingToolbar.afterPageText, ps);
		}
		if (pagingToolbar.field) {
			pagingToolbar.field.dom.value = current == null ? ap : current;
		}
		pagingToolbar.first.setDisabled(ap == 1);
		pagingToolbar.prev.setDisabled(ap == 1);
		pagingToolbar.next.setDisabled(ap == ps);
		pagingToolbar.last.setDisabled(ap == ps);
		pagingToolbar.loading.enable();
		pagingToolbar.updateInfo();

	},

	getPagingToolBarInstance : function(store, ifPages) {
		var scope = this;
		var pageItems = [];
		if (ifPages) {
			pageItems = ['-', i18n.label_perpage, scope.getPageComboInstance()];

		}

		var pagingToolBar = new Ext.PagingToolbar({
			id : scope.fileWinId + 'pagingToolbar',
			height : 30,
			pageSize : scope.limited,
			store : store,
			displayInfo : true,
			displayMsg : i18n.from + ' {0} ' + i18n.to + ' {1} ' + i18n.postfix
					+ ' {2} ' + i18n.dataunit,
			emptyMsg : i18n.emptymsg,

			items : pageItems,
			onRender : function(ct, position) {
				Ext.PagingToolbar.superclass.onRender.call(this, ct, position);
				this.first = this.addButton({
							tooltip : this.firstText,
							iconCls : "x-tbar-page-first",
							disabled : true,
							handler : this.onClick.createDelegate(this,
									["first"])
						});
				this.prev = this.addButton({
							tooltip : this.prevText,
							iconCls : "x-tbar-page-prev",
							disabled : true,
							handler : this.onClick.createDelegate(this,
									["prev"])
						});
				this.addSeparator();
				this.add(this.beforePageText);
				this.field = Ext.get(this.addDom({
							tag : "input",
							type : "text",
							size : "3",
							value : "1",
							cls : "x-tbar-page-number"
						}).el);
				this.field.on("keydown", this.onPagingKeydown, this);
				this.field.on("focus", function() {
							this.dom.select();
						});
				this.afterTextEl = this.addText(String.format(
						this.afterPageText, 1));
				this.field.setHeight(18);
				this.addSeparator();
				this.next = this.addButton({
							tooltip : this.nextText,
							iconCls : "x-tbar-page-next",
							disabled : true,
							handler : this.onClick.createDelegate(this,
									["next"])
						});
				this.last = this.addButton({
							tooltip : this.lastText,
							iconCls : "x-tbar-page-last",
							disabled : true,
							handler : this.onClick.createDelegate(this,
									["last"])
						});
				this.addSeparator();
				this.loading = this.addButton({
							hidden : false, // <-------control loading
							// button visiblility!
							tooltip : this.refreshText,
							iconCls : "x-tbar-loading",
							handler : this.onClick.createDelegate(this,
									["refresh"])
						});

				if (this.displayInfo) {
					this.displayEl = Ext.fly(this.el.dom).createChild({
								cls : 'x-paging-info'
							});

				}
				if (this.dsLoaded) {
					this.onLoad.apply(this, this.dsLoaded);
				}
			},

			/*******************************************************************
			 * @noted by lyy on 2010-12-17
			 * @PagingToolBar action : doLoad if(start !=
			 *                scope.getPagingToolBarCursor()) { page has
			 *                changed; read cache or load } else { page has not
			 *                been changed,so must refresh; }
			 ******************************************************************/
			doLoad : function(start) {

				if (start != scope.getPagingToolBarCursor()) {

					scope.grid.getEl().mask(i18n.mask_wait);
					var key = scope.packetKey(scope.host, scope.currentdir);
					scope.pagingmap.add(key, start);
					scope.grid.store.removeAll();
					scope.grid.store
							.add(scope.getMyStore(key, null, start).data.items);

					if (scope.grid.store.data.items.length > 0) {

						scope.firePagingToolBar(start, null,
								scope.getData(key).length);
						scope.grid.getEl().unmask();

					} else {

						var params = {
							dataset : scope.grid.store,
							path : scope.currentdir,
							start : start,
							limit : this.pageSize
						};
						// scope.doDataLoad(scope.grid.store, scope.currentdir,
						// start, this.pageSize);
						scope.doDataLoad(params);
					}

				} else {
					scope.refresh({
								filepath : scope.currentdir,
								focus : true
							});

				}

			}
		});

		return pagingToolBar;

	},

	getPageComboInstance : function() {
		var scope = this;
		var pagecombo = new Ext.form.ComboBox({
					name : scope.fileWinId + 'perpage',
					id : scope.fileWinId + 'perpage',
					width : 70,

					store : new Ext.data.SimpleStore({

								fields : ['id'],

								data : [['10'], ['20'], ['50'], ['100'],
										['200'], ['400'], ['...']

								]

							}),

					mode : 'local',

					value : scope.limited,

					listWidth : 70,

					triggerAction : 'all',

					displayField : 'id',

					valueField : 'id',

					editable : false,

					forceSelection : true,
					listeners : {
						select : function(combo, record) {
							var index = (record.get('id') == '...'
									? '1000000'
									: record.get('id'));

							scope.adjustPagingToolBarPages(parseInt(index, 10));
							scope.refresh();

						}
					}
				})
		return pagecombo;
	},
	getEmptyStore : function() {
		proxy = this.getMyProxy(null, null);
		reader = this.getMyReader(null);

		var ds = new Ext.data.Store({
					id : this.fileWinId + 'fileStore',
					proxy : proxy,
					reader : reader,
					autoLoad : false,
					loadMask : {
						msg : i18n.mask_wait
					},
					totalProperty : "results",
					root : "fileItems",
					listeners : {
						"load" : function() {
							// alert("p");
						}.createDelegate(this),
						"loadexception" : function() {
							this.errorStatus();
						}

					}

				});

		return ds;

	},

	getMyStore : function(key, p, start) {
		// alert("only once enter path load");

		var role = this.r;
		var ds = null;
		var proxy = null;
		var reader = null;
		var workdir = this.workdir;
		var currentdir = this.currentdir;
		// var hostIp = this.host;
		if (this.containKey(key)) {
			proxy = this.getMyProxy(key, start);
			reader = this.getMyReader(key);
			currentdir = this.getPathfromKey(key);
			ds = new Ext.data.Store({
						id : this.fileWinId + 'fileStore',
						autoLoad : true,
						proxy : proxy,
						reader : reader
					});
			ds.removeAll();

			ds.load();
			this.ds = ds;

			// ds.loadData(FileMngGlobal.getFileDataCacheMap().get(key),true);
		} else {

			proxy = this.getMyProxy(null, null);
			reader = this.getMyReader(null);

			var params = {
				clusterCode : this.clusterCode,
				// hostIp : hostIp,
				start : 0,
				limit : this.limited
			}
			if (p) {
				currentdir = p.filepath;
				Ext.apply(params, p);
			}

			ds = new Ext.data.Store({
						id : this.fileWinId + 'fileStore',
						proxy : proxy,
						reader : reader,
						autoLoad : false,
						loadMask : {
							msg : i18n.mask_wait
						},
						totalProperty : "results",
						root : "fileItems",
						listeners : {
							"load" : function() {
								// alert("p");
							}.createDelegate(this),
							"loadexception" : function() {
								this.errorStatus();
							}.createDelegate(this)

						}

					});
			var params = {
				dataset : ds,
				path : currentdir
			};
			this.doDataLoad(params);
			// ds.load({
			// params : params,
			// callback : function(records, options, success) {
			// if (success) {
			//
			// if (ds.reader.jsonData.fileInfo.exception) {
			// var exception = ds.reader.jsonData.fileInfo.exception;
			// this.errorStatus();
			// Ext.Msg.alert(i18n.error, exception);
			// } else {
			//
			// var pageStart = this.grid.store.reader.jsonData.pageStart;
			// if (pageStart > 0) {
			// this
			// .firePagingToolBar(
			// pageStart,
			// pageStart / this.limited + 1,
			// this.grid.store.reader.jsonData.results);
			// }
			//
			// // var dir = currentdir;
			// this.ds = ds;
			// this.initStatus(currentdir);
			// // this.setData(this.host, dir, records);
			// if (this.grid.store.reader.jsonData.results > this.limited) {
			// var params1 = {
			// start : 0,
			// limit : 0,
			// scope : 'all',
			// // hostIp : this.host,
			// filepath : currentdir
			// };
			// this.loadAllItem(this, params1, currentdir);
			// }
			// }
			// } else {
			// this.errorStatus();
			// if (ds.reader.jsonData.fileInfo.exception) {
			// var exception = ds.reader.jsonData.fileInfo.exception;
			// Ext.Msg.alert(i18n.error, exception);
			// }
			// }
			// }.createDelegate(this)
			// });

		}

		return ds;
	},

	// doDataLoad : function(who, path, start, limit) {
	//		
	//		
	// },
	doDataLoad : function(p) {

		var who = null;
		var path = null;
		var start = null;
		var limit = null;
		var autocreate = false;

		if (p.dataset) {
			who = p.dataset;
		}
		if (p.path) {
			path = p.path;
		}
		if (p.start) {
			start = p.start;
		}
		if (p.limit) {
			limit = p.limit;
		}
		if (p.autocreate) {
			autocreate = p.autocreate;
		}

		var scope = this;
		var vstart = 0;
		var vlimit = this.limited;
		if (start)
			vstart = start;
		if (limit)
			vlimit = limit;
		var params = {
			clusterCode : this.clusterCode,
			start : vstart,
			limit : vlimit
		}
		if (path)
			params.filepath = path;
		else
			params.filepath = this.currentdir;

		who.load({
			params : params,
			callback : function(records, options, success) {
				scope.grid.getEl().unmask();
				if (success) {

					if (scope.grid.store.reader.jsonData == null) {
						return;
					}

					if (scope.grid.store.reader.jsonData.fileInfo.exception) {

						scope.errorStatus();

						var exception = scope.grid.getStore().reader.jsonData.fileInfo.exception;
						Ext.Msg.alert(i18n.error, exception);

						scope.execeptionRefresh();
					} else {

						if (path == "" || path == null) {
							scope.currentdir = scope.grid.store.reader.jsonData.fileInfo.currentPath;
							path = scope.currentdir;
							Ext.getCmp(scope.fileWinId + "txt_url")
									.setValue(path);
						}
						if (path == scope.currentdir) {
							var pageStart = scope.grid.store.reader.jsonData.pageStart;
							if (pageStart > 0) {
								scope
										.firePagingToolBar(
												pageStart,
												pageStart / scope.limited + 1,
												scope.grid.store.reader.jsonData.results);
							}
						}
						scope.ds = scope.grid.store;
						// var dir = this.workdir;

						scope.setData(scope.host, path, records);

						scope.creatParentPathFolderOnlyInCache(path);
						if (scope.grid.getStore().reader.jsonData.results > scope.limited) {
							// var params1 = {
							// start : 0,
							// limit : 0,
							// scope : 'all',
							// // hostIp : scope.host,
							// filepath : path,
							// clusterCode:scope.clusterCode
							// //
							// fileTransferProtocol:scope.fileTransferProtocol
							// };
							scope.loadAllItem(path);

						} else {
							scope.sortData();
							scope.reloadOtherCache();
							scope.afterRefresh();
						}
					}

				} else {

					if (this.workdir == params.filepath) {
						scope.grid.getEl().mask(i18n.mask_wait);
						this.createUrlPathFolder();
						return;
					}

					if (autocreate) {
						scope.grid.getEl().mask(i18n.mask_wait);
						this.createUrlPathFolder(params.filepath);
						return;
					}

					if (scope.grid.getStore().reader.jsonData != null) {

						scope.errorStatus();
						if (scope.grid.getStore().reader.jsonData.fileInfo.exception) {
							var exception = scope.grid.getStore().reader.jsonData.fileInfo.exception;
							Ext.Msg.alert(i18n.error, exception);
						}

					} else {
						Ext.Msg.alert(i18n.error, i18n.error_filelist);
					}

					scope.execeptionRefresh();

				}
			}.createDelegate(scope)
		});
	},

	getMyReader : function(key) {
		var scope = this;
		var reader = null;
		var Record = new Ext.data.Record.create([{
					name : "name",
					mapping : 'name',
					// sortingdata : this.getData(key),
					cmp : scope
				}, {
					name : "owner",
					mapping : 'owner'
				}, {
					name : "currentPath",
					mapping : 'currentPath'
				}, {
					name : "parentPath",
					mapping : 'parentPath'
				}, {
					name : "group",
					mapping : 'group'
				}, {
					name : "permission",
					mapping : 'permission',
					// sortingdata : this.getData(key),
					cmp : scope
				}, {
					name : "size",
					mapping : 'size',
					type : 'int',
					// sortingdata : this.getData(key),
					cmp : scope
				}, {
					name : "lastModified",
					mapping : 'lastModified',
					// sortingdata : this.getData(key),
					cmp : scope
				}, {
					name : "typeString",
					mapping : 'typeString'
				}, {
					name : "type",
					mapping : 'type',
					sorting : 'typesorting',
					// sortingdata : this.getData(key),
					cmp : scope
				}]);
		if (this.containKey(key))
			reader = new Ext.data.ArrayReader({}, Record);
		else
			reader = new Ext.data.JsonReader({
						params : {
							start : 0,
							limit : this.limited
						},
						totalProperty : "results",
						root : "fileItems",
						fields : [{
									cmp : scope,
									name : "name",
									mapping : 'name',
									type : 'string'
								}, {
									name : "owner",
									mapping : 'owner',
									type : 'string'
								}, {
									name : "currentPath",
									mapping : 'currentPath',
									type : 'string'
								}, {
									name : "parentPath",
									mapping : 'parentPath',
									type : 'string'
								}, {
									name : "group",
									mapping : 'group',
									type : 'string'
								}, {
									cmp : scope,
									name : "permission",
									mapping : 'permission',
									type : 'string'
								}, {
									cmp : scope,
									name : "size",
									mapping : 'size',
									type : 'int'
								}, {
									cmp : scope,
									name : "lastModified",
									mapping : 'lastModified',
									type : 'string'
								}, {
									name : "typeString",
									mapping : 'typeString',
									type : 'string'
								}, {
									cmp : scope,
									name : "type",
									mapping : 'type',
									sorting : 'typesorting',
									type : 'string'

								}]
					});
		return reader;
	},
	getMyProxy : function(key, start) {
		var proxy = null;
		var scope = this;
		if (this.containKey(key)) {
			var data;
			if (start == null) {
				data = this.getData(key);
			} else {
				if (start < 0)
					start = 0;
				data = this.getLimitedItems(key, start);
			}

			// var data = tdata1;
			proxy = new Ext.data.MemoryProxy(data);
		} else {
			proxy = new Ext.data.HttpProxy({
						url : 'showFileList.action',
						params : {
							// clusterCode : this.clusterCode,
							clusterCode : scope.clusterCode

						}
					});
		}
		return proxy;

	},

	errormark : false,

	directionStatus : function(currentdir) {
		var role = this.r;
		var substr = this.workdir.substring(0, this.workdir.lastIndexOf('/'));
		if (role == 2 && currentdir.lastIndexOf(substr) == 0) {
			currentdir = Ext.ux.Util.formatDir(currentdir);
			if (currentdir == substr) {
				this.setComponetStatus('tb_upward', false);
				// Ext.getCmp(this.fileWinId + 'tb_upward').disable();
			} else
				this.setComponetStatus('tb_upward', true);
			// Ext.getCmp(this.fileWinId + 'tb_upward').enable();
		} else {

			if (currentdir.indexOf(this.workdir) == 0) {
				if (currentdir == this.workdir) {
					this.setComponetStatus('tb_upward', false);
					// Ext.getCmp(this.fileWinId + 'tb_upward').disable();
				} else {
					this.setComponetStatus('tb_upward', true);
					// Ext.getCmp(this.fileWinId + 'tb_upward').enable();
				}
			} else {
				this.setComponetStatus('tb_upward', false);
				// Ext.getCmp(this.fileWinId + 'tb_upward').disable();
			}
		}
		if (this.forwardrecords.length == 0) {
			this.setComponetStatus('tb_forward', false);
			// Ext.getCmp(this.fileWinId + 'tb_forward').disable();
		} else
			this.setComponetStatus('tb_forward', true);
		// Ext.getCmp(this.fileWinId + 'tb_forward').enable();
		if (this.backwardrecords.length == 0) {
			this.setComponetStatus('tb_backward', false);
			// Ext.getCmp(this.fileWinId + 'tb_backward').disable();
		} else
			this.setComponetStatus('tb_backward', true);
	},

	errorStatus : function() {
		this.errormark = true;
		this.setComponetStatus('tb_file', false);
		this.setComponetStatus('tb_edit', false);
		this.setComponetStatus('tb_transfer', false);
		this.setComponetStatus('tb_tool', false);

		this.setComponetStatus('tb_upload', false);
		this.setComponetStatus('tb_download', false);
		this.setComponetStatus('tb_new', false);

		this.setComponetStatus('tb_paste', false);
		this.setComponetStatus('menu_paste', false);
		// this.setComponetStatus('tb_paste', false);
		this.setComponetStatus('tb_md5', false);
		this.setComponetStatus('tb_dos2unix', false);
		this.directionStatus(this.currentdir);

	},

	reloadStatus : function() {

		if (!this.grid) {
			return;
		}
		var scope = this;
		var sels = this.grid.getSelectionModel().getSelections();
		var length = sels.length;
		// rIndex = rowIndex;

		// var list = [];

		if (length > 1) {

			scope.setComponetStatus('tb_open', false);
			scope.setComponetStatus('tb_tail', false);
			scope.setComponetStatus('tb_newfolder', true);
			scope.setComponetStatus('tb_newfile', true);
			scope.setComponetStatus('tb_copy', true);
			scope.setComponetStatus('tb_cut', true);
			scope.setComponetStatus('tb_paste', false);
			// scope.setComponetStatus('tb_paste1', false);
			scope.setComponetStatus('tb_zip', true);
			scope.setComponetStatus('tb_unzip', true);
			scope.setComponetStatus('tb_upload', true);
			scope.setComponetStatus('tb_download', true);
			scope.setComponetStatus('tb_delete', true);
			scope.setComponetStatus('tb_properties', false);
			scope.setComponetStatus('tb_md5', false);
			scope.setComponetStatus('tb_dos2unix', true);

			// for (var i = 0; i < sels.length; i++) {
			// var sel = sels[i];
			// list.push(sel.get('name'));
			// }

			for (var i = 0; i < sels.length; i++) {
				var type = sels[i].get('type');
				var name = sels[i].get('name');

				if (type != 0) {

					scope.setComponetStatus('tb_dos2unix', false);
					scope.setComponetStatus('tb_unzip', false);
					break;
				} else {
					if (name.toLowerCase().lastIndexOf('.rar') == -1
							&& name.toLowerCase().lastIndexOf('.tar') == -1
							&& name.toLowerCase().lastIndexOf('.tar.gz') == -1
							&& name.toLowerCase().lastIndexOf('.zip') == -1) {

						scope.setComponetStatus('tb_unzip', false);

					}

				}

			}

		} else if (length == 1) {

			scope.setComponetStatus('tb_open', true);
			scope.setComponetStatus('tb_tail', true);
			scope.setComponetStatus('tb_newfolder', true);
			scope.setComponetStatus('tb_newfile', true);
			scope.setComponetStatus('tb_copy', true);
			scope.setComponetStatus('tb_cut', true);
			scope.setComponetStatus('tb_paste', false);
			// scope.setComponetStatus('tb_paste1', false);
			scope.setComponetStatus('tb_zip', true);
			scope.setComponetStatus('tb_unzip', true);
			scope.setComponetStatus('tb_upload', true);
			scope.setComponetStatus('tb_download', true);
			scope.setComponetStatus('tb_delete', true);
			scope.setComponetStatus('tb_properties', true);
			scope.setComponetStatus('tb_md5', true);
			scope.setComponetStatus('tb_unzip', true);
			scope.setComponetStatus('tb_dos2unix', true);

			var selections = sels[0];
			var filename = selections.get('name');

			var type = selections.get('type');

			if (type != 0) {
				scope.setComponetStatus('tb_dos2unix', false);
				scope.setComponetStatus('tb_md5', false);
				scope.setComponetStatus('tb_tail', false);
				scope.setComponetStatus('tb_unzip', false);
			} else {
				if (filename.toLowerCase().lastIndexOf('.rar') == -1
						&& filename.toLowerCase().lastIndexOf('.tar') == -1
						&& filename.toLowerCase().lastIndexOf('.tar.gz') == -1
						&& filename.toLowerCase().lastIndexOf('.zip') == -1) {

					scope.setComponetStatus('tb_unzip', false);
				}

			}

		} else if (length == 0) {
			scope.setComponetStatus('tb_open', false);
			scope.setComponetStatus('tb_tail', false);
			scope.setComponetStatus('tb_newfolder', true);
			scope.setComponetStatus('tb_newfile', true);
			scope.setComponetStatus('tb_copy', false);
			scope.setComponetStatus('tb_cut', false);
			scope.setComponetStatus('tb_paste', false);
			// scope.setComponetStatus('tb_paste1', false);
			scope.setComponetStatus('tb_zip', false);
			scope.setComponetStatus('tb_unzip', false);
			scope.setComponetStatus('tb_upload', true);
			scope.setComponetStatus('tb_download', false);
			scope.setComponetStatus('tb_delete', false);
			scope.setComponetStatus('tb_properties', false);
			scope.setComponetStatus('tb_md5', false);
			scope.setComponetStatus('tb_dos2unix', false);
		}

		if (FileMngGlobal.filePasteShares.pasteflag == "cut"
				|| FileMngGlobal.filePasteShares.pasteflag == "copy") {
			scope.setComponetStatus('tb_paste', true);
			// scope.setComponetStatus('tb_paste1', true);

		} else {
			scope.setComponetStatus('tb_paste', false);
			// scope.setComponetStatus('tb_paste1', false);

		}

	},

	initStatus : function(currentdir) {
		this.errormark = false;
		var workdir = this.workdir;

		this.setComponetStatus('tb_file', true);
		this.setComponetStatus('tb_edit', true);
		this.setComponetStatus('tb_transfer', true);
		this.setComponetStatus('tb_tool', true);
		this.setComponetStatus('tb_new', true);
		this.setComponetStatus('tb_open', true);
		this.setComponetStatus('tb_newfolder', true);
		this.setComponetStatus('tb_newfile', true);
		this.setComponetStatus('tb_upload', true);
		this.setComponetStatus('tb_download', false);
		this.setComponetStatus('tb_copy', false);
		this.setComponetStatus('tb_tail', false);
		this.setComponetStatus('tb_cut', false);
		this.setComponetStatus('tb_paste', false);
		this.setComponetStatus('tb_zip', false);
		this.setComponetStatus('tb_unzip', false);
		this.setComponetStatus('tb_delete', false);
		this.setComponetStatus('tb_properties', false);
		this.setComponetStatus('tb_md5', false);
		this.setComponetStatus('tb_dos2unix', false);
		this.setComponetStatus('tb_refresh', true);
		this.setComponetStatus('tb_backward', false);
		this.setComponetStatus('tb_properties', false);
		this.setComponetStatus('tb_unzip', false);

		if (FileMngGlobal.filePasteShares.pasteflag == "cut"
				|| FileMngGlobal.filePasteShares.pasteflag == "copy") {
			// this.setComponetStatus('tb_paste1', true);
			this.setComponetStatus('menu_paste', true);
			this.setComponetStatus('tb_paste', true);

		} else {
			// this.setComponetStatus('tb_paste1', false);
			this.setComponetStatus('menu_paste', false);
			this.setComponetStatus('tb_paste', false);

		}

		// if (this.grid) {
		// var selections = this.grid.getSelections();
		//			
		// this.rowclick(this.grid);
		//			
		//			
		// if (selections.length > 0) {
		// for (var i = 0; i < selections.length; i++) {
		// var type = selections[i].get('type');
		// var name = selections[i].get('name');
		// if (type == 0
		// && ((name.toLowerCase().lastIndexOf('.rar') != -1
		// || name.toLowerCase().lastIndexOf('.tar') != -1
		// || name.toLowerCase()
		// .lastIndexOf('.tar.gz') != -1 || name
		// .toLowerCase().indexOf('.zip') != -1))) {
		// this.setComponetStatus('tb_unzip', true);
		// // Ext.getCmp(this.fileWinId + 'tb_unzip').disable();
		//
		// } else {
		// this.setComponetStatus('tb_unzip', false);
		// break;
		// }
		// }
		//
		// // Ext.getCmp(this.fileWinId + 'tb_unzip').enable();
		// }
		// }
		this.directionStatus(currentdir);

	},
	getData : function(key) {
		var data = FileMngGlobal.getFileDataCacheMap().get(key);
		return data;
	},
	getItem : function(key, filename) {

		var data = FileMngGlobal.getFileDataCacheMap().get(key);
		for (var i = 0; i < data.length; i++) {
			var datafilename = data[i].name;
			if (filename == datafilename) {
				return data[i];
			}

		}
		return null;
	},

	getLimitedItems : function(key, start) {
		var returnItems = [];
		var items = FileMngGlobal.getFileDataCacheMap().get(key);

		if (items) {
			var limited = this.limited;

			if (start > items.length) {
				return null;
			}
			var endcount = start + limited < items.length
					? start + limited
					: items.length;

			for (var i = start; i < endcount; i++) {
				returnItems.push(items[i]);
			}

			return returnItems;
		} else {
			return null;
		}

	},
	getLastCursor : function(length) {
		var cursor = 0;
		if (length > 0) {
			if (length % this.limited == 0) {
				cursor = (parseInt(length / this.limited) - 1) * this.limited;
			} else {
				cursor = parseInt(length / this.limited) * this.limited;
			}
		}
		return cursor;
	},

	/**
	 * remove all data including sub data
	 */
	removeData : function(key) {

		var cpkey = [];
		for (var i = 0; i < FileMngGlobal.getFileDataCacheMap().keys.length; i++) {

			// alert("key: "+keyvalue);

			if (FileMngGlobal.getFileDataCacheMap().keys[i].indexOf(key) == 0)// =startwith
			{
				cpkey.push(FileMngGlobal.getFileDataCacheMap().keys[i]);
				// alert("remove: "+keyvalue);
			}
		}
		for (var i = 0; i < cpkey.length; i++) {
			FileMngGlobal.getFileDataCacheMap().removeKey(cpkey[i]);
		}
		cpkey = null;

	},

	setItems : function(host, dir, items) {
		var key = this.packetKey(host, dir);
		if (FileMngGlobal.getFileDataCacheMap().containsKey(key)) {
			// FileMngGlobal.getFileDataCacheMap().remove(key);
			FileMngGlobal.getFileDataCacheMap().add(key, items);

		} else {
			if (FileMngGlobal.getFileDataCacheMap().length < FileMngGlobal
					.getGlobalFileDataCacheMaxSize()) {
				FileMngGlobal.getFileDataCacheMap().add(key, items);
			} else {
				FileMngGlobal.getFileDataCacheMap().removeAt(0);
				FileMngGlobal.getFileDataCacheMap().add(key, items);
			}
		}

	},
	setData : function(host, dir, store) {
		var list = [];
		var key = host + "," + Ext.ux.Util.formatDir(dir);
		for (var i = 0; i < store.length; i++) {
			list.push(store[i].data);
		}

		if (FileMngGlobal.getFileDataCacheMap().containsKey(key)) {
			// if (FileMngGlobal.getFileDataCacheMap().get(key) == list) {
			// } else {
			// FileMngGlobal.getFileDataCacheMap().remove(key);
			FileMngGlobal.getFileDataCacheMap().add(key, list);
			// }
		} else {
			if (FileMngGlobal.getFileDataCacheMap().length < FileMngGlobal
					.getGlobalFileDataCacheMaxSize()) {
				FileMngGlobal.getFileDataCacheMap().add(key, list);
			} else {
				FileMngGlobal.getFileDataCacheMap().removeAt(0);
				FileMngGlobal.getFileDataCacheMap().add(key, list);
			}
		}

	},
	getFilePath : function(path) {
		return path.substring(0, path.lastIndexOf('/'));
	},
	getFileName : function(path) {
		return path.substring(this.getFilePath(path).length + 1, path.length);
	},

	containKey : function(key) {
		if (FileMngGlobal.getFileDataCacheMap().containsKey(key))
			return true;
		else
			return false;

	},
	getPathfromKey : function(key) {
		var list = key.split(",");
		return list[1];
	},
	getHostfromKey : function(key) {
		var list = key.split(",");
		return list[0];
	},
	packetKey : function(host, path) {

		return host + "," + Ext.ux.Util.formatDir(path);
	}

	,
	checkData : function(key, newname, oldname) {

		var currentCacheData;

		var newnamecount = 0;
		var oldnamecount = 0;

		if (currentCacheData) {
			for (var i = 0; i < currentCacheData.length; i++) {
				if (newname == currentCacheData[i].name) {
					// Ext.MessageBox.alert(i18n.prompt,
					// i18n.val_filenameexist);
					newnamecount++;
				} else if (oldname != null
						&& oldname == currentCacheData[i].name) {
					oldnamecount++;
				}
			}
		} else {
			// read data from grid if no data in cache
			var store = this.grid.getStore();
			for (var i = 0; i < store.getCount(); i++) {
				if (newname == store.getAt(i).get('name')) {
					// Ext.Msg.alert(i18n.prompt, i18n.val_filenameexist);
					newnamecount++;
				} else if (oldname != null
						&& oldname == store.getAt(i).get('name')) {
					oldnamecount++;
				}
			}
		}

		var count = {
			newnamecount : newnamecount,
			oldnamecount : oldnamecount
		};
		return count;

	},

	propertiesTranslate : function(value, isDir) {
		var returnvalue = value;
		var permission = [];
		if (value.length == 3) { // 777
			for (var i = 0; i < value.length; i++) {
				permission[i] = value.substr(i, 1);
			}
			if (isDir == "1") {
				returnvalue = "d";
			} else {
				returnvalue = "-";
			}
			for (var i = 0; i < 3; i++) {
				if (permission[i] == "0") {
					returnvalue += "---";
				} else if (permission[i] == "1") {

					returnvalue += "--x";
				} else if (permission[i] == "2") {

					returnvalue += "-w-";
				} else if (permission[i] == "3") {

					returnvalue += "-wx";
				} else if (permission[i] == "4") {
					returnvalue += "r--";

				} else if (permission[i] == "5") {

					returnvalue += "r-x";
				} else if (permission[i] == "6") {

					returnvalue += "rw-";
				} else if (permission[i] == "7") {
					returnvalue += "rwx";
				}
			}
		} else if (value.length == 10) {
			var i = 1;
			for (var i = 0; i < value.length; i++) {
				permission[i] = value.substr(i, 1);
			}
			for (var i = 1; i < permission.length; i = i + 3) {
				var num = 0;
				if (permission[i] == "r") {
					num = 4 + num;
				}
				if (permission[i + 1] == "w") {
					num = 2 + num;
				}
				if (permission[i + 1] == "x") {
					num = 1 + num;
				}
				returnvalue += num;
			}
		}
		return returnvalue;
	},
	removeSelectionItems : function(key, itemlist, ifkey) {

		if (!ifkey) {
			var griditem = this.grid.store.data.items;
			// var r = this.grid.getSelections()[0];

			var count = this.grid.store.getCount();

			for (var i = 0; i < count; i++) {
				for (var j = 0; j < itemlist.length; j++) {
					if (griditem[i].data["name"] == itemlist[j].data['name']) {
						// griditem[i].data[item]= value ;
						// rItem.push(griditem[i]);
						this.grid.store.remove(this.grid.store.getAt(i));
						count--;
						i--;
						break;
					}
				}
			}
			griditem = null;
		}

		var items = FileMngGlobal.getFileDataCacheMap().get(key);
		var newitems = [];

		if (items) {
			// alert(items.length);
			for (var i = 0; i < items.length; i++) {
				var isadd = true;
				for (var j = 0; j < itemlist.length; j++) {
					if (items[i].name == itemlist[j].data['name']) {
						isadd = false;
						break;
					}
				}
				if (isadd)
					newitems.push(items[i])

			}
			// alert(items.length);
			// cache items > store items , because store items just have 50

			FileMngGlobal.getFileDataCacheMap().add(key, newitems);

		}
		items = null;
		return newitems.length;

	},
	removeItemValue : function(key, itemvalue) {
		var items = FileMngGlobal.getFileDataCacheMap().get(key);
		var newitems = [];
		if (items) {
			// alert(items.length);
			for (var i = 0; i < items.length; i++) {

				if (items[i].name == itemvalue.name) {
					continue;
				} else {
					newitems.push(items[i]);
				}

			}
			// alert(items.length);
			// cache items > store items , because store items just have 50

			FileMngGlobal.getFileDataCacheMap().add(key, newitems);

		}
		items = null;
		return newitems.length;
	},
	removeItemsGroup : function(key, itemsgroup, context) {
		var items = FileMngGlobal.getFileDataCacheMap().get(key);
		var path = this.getPathfromKey(key);
		var newitems = [];
		if (items) {
			// alert(items.length);
			for (var i = 0; i < items.length; i++) {
				var isadd = true;
				for (var j = 0; j < itemsgroup.length; j++) {
					if (items[i].name == itemsgroup[j].name) {

						if (context != null && context != undefined) {
							alert(path + '/' + items[i].name);
							if (context.indexOf(path + '/' + items[i].name) > -1) {
								alert('isadd' + isadd);
								isadd = false;
								alert('isadd' + isadd);
							}
						} else {
							isadd = false;

						}
						break;
					}
				}
				// alert(isadd);
				if (isadd)
					newitems.push(items[i])

			}
			// alert(items.length);
			// cache items > store items , because store items just have 50

			FileMngGlobal.getFileDataCacheMap().add(key, newitems);

		}
		items = null;
		return newitems.length;

	},

	removeItem : function(key, namelist, ifkey) {

		if (!ifkey) {
			var griditem = this.grid.store.data.items;
			// var r = this.grid.getSelections()[0];

			var count = this.grid.store.getCount();

			for (var i = 0; i < count; i++) {
				for (var j = 0; j < namelist.length; j++) {
					if (griditem[i].data["name"] == namelist[j]) {
						// griditem[i].data[item]= value ;
						// rItem.push(griditem[i]);
						this.grid.store.remove(this.grid.store.getAt(i));
						count--;
						i--;
						break;
					}
				}
			}
			griditem = null;
		}

		var items = FileMngGlobal.getFileDataCacheMap().get(key);
		var newitems = [];
		if (items) {
			// alert(items.length);
			for (var i = 0; i < items.length; i++) {
				var isadd = true;
				for (var j = 0; j < namelist.length; j++) {
					if (items[i].name == namelist[j]) {
						isadd = false;
						break;
					}
				}
				if (isadd)
					newitems.push(items[i])

			}
			// alert(items.length);
			// cache items > store items , because store items just have 50

			FileMngGlobal.getFileDataCacheMap().add(key, newitems);

		}
		items = null;
		return newitems.length;
	},
	loadAllItem : function(path) {
		var scope = this;
		var params = {
			start : 0,
			limit : 0,
			scope : 'all',
			// hostIp : scope.host,
			filepath : path,
			clusterCode : scope.clusterCode
			// fileTransferProtocol:scope.fileTransferProtocol
		};
		Ext.Ajax.request({
					url : 'showFileList.action',
					params : params,
					success : function(resp, opts) {

						var responseObject = Ext.util.JSON
								.decode(resp.responseText);

						if (responseObject.fileInfo.exception) {
							return false;
						}

						// this.grid.store.removeAll();

						scope.setItems(scope.host, path,
								responseObject.fileItems);
						scope.sortData(true);
						scope.reloadSelfCache();
						scope.reloadOtherCache();
						scope.afterRefresh();

					},
					failure : function(resp, opts) {

					}

				});

	},
	addData : function(key, value) {
		// alert(FileMngGlobal.getFileDataCacheMap().keys.length);
		if (FileMngGlobal.getFileDataCacheMap().containsKey(key)) {
			// FileMngGlobal.getFileDataCacheMap().remove(key);
			FileMngGlobal.getFileDataCacheMap().add(key, value);

		} else {
			if (FileMngGlobal.getFileDataCacheMap().length < FileMngGlobal
					.getGlobalFileDataCacheMaxSize()) {
				FileMngGlobal.getFileDataCacheMap().add(key, value);
			} else {
				FileMngGlobal.getFileDataCacheMap().removeAt(0);
				FileMngGlobal.getFileDataCacheMap().add(key, value);
			}
		}

	},

	addItemsSelectionGroup : function(key, jsonGroup, start) {
		var data = this.getData(key);
		var newdata = [];
		var isAdd = false;
		if (data) {
			for (var i = 0; i < data.length; i++) {

				if (i == start) {

					/**
					 * add jsonGroup at current index in cache
					 */
					isAdd = true;
					for (var j = 0; j < jsonGroup.length; j++) {

						newdata.push(jsonGroup[j].data);

					}
					/**
					 * add next item following jsonGroup in cache
					 */
					newdata.push(data[i]);

				} else
					newdata.push(data[i]);

			}
		}

		if (!isAdd) {
			for (var j = 0; j < jsonGroup.length; j++) {
				newdata.push(jsonGroup[j].data);
			}
		}

		this.addData(key, newdata);
		data = null;

	},
	addItemsGroup : function(key, valueGroup, start) {
		var data = this.getData(key);
		var newdata = [];
		var isAdd = false;
		if (data) {
			for (var i = 0; i < data.length; i++) {

				if (i == start) {

					isAdd = true;
					for (var j = 0; j < valueGroup.length; j++) {

						newdata.push(valueGroup[j]);
					}
					newdata.push(data[i]);

				} else
					newdata.push(data[i]);

			}
		}
		if (!isAdd) {
			for (var j = 0; j < valueGroup.length; j++) {
				newdata.push(valueGroup[j]);
			}
		}

		this.addData(key, newdata);
		data = null;

	},
	addItem : function(key, valueArray, start) {

		var data = this.getData(key);
		var newdata = [];
		var isAdd = false;
		if (data) {
			for (var i = 0; i < data.length; i++) {

				if (i == start) {

					isAdd = true;
					newdata.push(valueArray);
					newdata.push(data[i]);

				} else
					newdata.push(data[i]);

			}
		}

		if (!isAdd) {
			newdata.push(valueArray);
		}

		this.addData(key, newdata);
		data = null;

	},
	checkFileExisted : function(dirfiles, filename) {
		for (var i = 0; i < dirfiles.length; i++) {
			if (filename == dirfiles[i].name) {

				return true;
			}

		}
		return false;

	},

	/**
	 * 
	 * js judges whether file permission is valid before submit to server ,
	 * judges two aspects, file itself and its parent path.
	 */
	checkPermission : function(oper) {
		var result;
		if (oper != 'upload' && oper != 'paste' && oper != 'new'
				&& oper != 'refresh') {
			result = this.checkFilePermission(oper);
			if (result != null)
				return result;
		}

		result = this.checkParentPermission(oper);
		if (result != null)
			return result;

		return null;

	}

	,
	checkFilePermission : function(oper) {

		var sels = this.grid.getSelections();
		if (sels != null) {
			for (var k = 0; k < sels.length; k++) {
				var fname = sels[k].get('name');
				var ftype = sels[k].get('type');
				var fpermission = sels[k].get('permission');

				if (ftype == 1) {
					if (oper == 'open' || oper == 'download' || oper == 'copy'
							|| oper == 'gz') {
						if (fpermission.indexOf('drwx') != 0
								&& fpermission.indexOf('dr-x') != 0) {
							return fname + ' [ dr-x ]';
						}
					} else if (oper == 'del' || oper == 'cut') {
						if (fpermission.indexOf('drwx') != 0) {
							return fname + ' [ drwx ]';
						}
					}
				} else {
					if (oper == 'open' || oper == 'rename' || oper == 'unzip'
							|| oper == 'zip' || oper == 'copy'
							|| oper == 'download') {
						if (fpermission.indexOf('-r') != 0) {
							return fname + ' [ -r ]';
						}
					} else if (oper == 'del') {
						if (fpermission.indexOf('-rw') != 0
								&& fpermission.indexOf('--w') != 0) {
							return fname + ' [ -w ]';
						}
					} else if (oper == 'cut') {
						if (fpermission.indexOf('-rw') != 0) {
							return fname + ' [ -rw ]';
						}
					}

				}

			}
		}

		return null;

	}

	,
	checkParentPermission : function(oper) {

		var parentpath = "/";
		var host = this.host;
		while (parentpath.length < this.currentdir.length) {

			if (parentpath == '/')
				parentpath = '';

			var temp = this.currentdir.indexOf('/', parentpath.length + 1);
			if (temp < parentpath.length + 1) {
				temp = this.currentdir.length;
			}

			var parentname = this.currentdir.substring(parentpath.length + 1,
					temp);

			// var
			// parentname=this.currentdir.substring(parentpath.length+1,this.currentdir.indexOf('/',parentpath.length+1));
			var key = this.packetKey(host, parentpath);
			var data = this.getData(key);

			if (data != null && data != undefined) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].name == parentname) {
						if (oper == 'open' || oper == 'download'
								|| oper == 'copy' || oper == 'refresh') {
							if (data[i].permission.indexOf('drwx') != 0
									&& data[i].permission.indexOf('dr-x') != 0) {
								return parentpath + '/' + parentname
										+ ' [ dr-x ]';
							}

						} else // paste ,cut
						{
							if (data[i].permission.indexOf('drwx') != 0) {
								return parentpath + '/' + parentname + '\n'
										+ ' [ drwx ]';
							}
						}

						break;
					}
				}

			}

			parentpath = parentpath + '/' + parentname;
		}

		return null;

		//	  
		// var parentpath=this.currentdir;
		// if(oper=='rename'||oper=='unzip'||oper=='zip'||oper=='del'||oper=='refresh'||oper=='new')
		// {
		//	    
		// while(true)
		// {
		// var parentname=
		// parentpath.substring(parentpath.lastIndexOf('/')+1,parentpath.length);
		// parentpath = parentpath.substring(0, parentpath.lastIndexOf('/'));
		// parentpath= Ext.ux.Util.formatDir(parentpath);
		// var key=this.packetKey(this.host,parentpath);
		// var data=this.getData(key);
		//	        
		// if(data!=null||data!=undefined)
		// {
		// for(var i=0;i<data.length;i++)
		// {
		// if(data[i].name==parentname)
		// {
		// if(data[i].permission.indexOf('drwx')==0)
		// {
		// result=1;
		// }
		// else
		// {
		// result=-1;
		// }
		//	             	
		// break;
		// }
		//	          	
		// }
		//	        	
		// }
		// if(parentpath==this.workdir)
		// {
		// break;
		// }
		//	     
		//	     
		//	      
		// }
		//	  
		// }

	},

	changeItem : function(key, name, json) {
		var items = FileMngGlobal.getFileDataCacheMap().get(key);
		if (items) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].name == name) {
					items[i]['permission'] = json.permission;
					items[i]['size'] = json.size;
					if (name.indexOf('.tar') < 0) // tar might meet error from
						// basement
						items[i]['lastModified'] = json.lastModified;
					// alert(item+" "+value);
					break;
				}

			}
			// this.addData(key,items);
		}

	},

	changeItemGroup : function(key, itemgroup, context) {
		if (itemgroup == null || itemgroup.length == 0
				|| itemgroup == undefined)
			return null;

		var oldItemGroup = [];
		var items = FileMngGlobal.getFileDataCacheMap().get(key);
		if (items) {

			for (var j = 0; j < itemgroup.length; j++) {
				for (var i = 0; i < items.length; i++) {
					if (items[i].name == itemgroup[j].name) {
						if (context != null && context != undefined) {
							if (context.indexOf(this.getPathfromKey(key) + '/'
									+ items[i].name) < 0)// no error
							{
								break;
							}

						}
						var oldItem = items[i];
						oldItemGroup.push(oldItem);
						items[i]['permission'] = itemgroup[j].permission;
						items[i]['size'] = itemgroup[j].size;
						if (name.indexOf('.tar') < 0) // tar might meet error
							// from// basement
							items[i]['lastModified'] = itemgroup[j].lastModified;
						// alert(item+" "+value);
						break;
					}

				}
			}
			// this.addData(key,items);
			return oldItemGroup;
		}

	},

	changeItemJson : function(key, name, json) {
		var changedItem = null;
		var griditem = this.grid.store.data.items;
		// var r = this.grid.getSelections()[0];
		for (var i = 0; i < this.grid.store.getCount(); i++) {

			if (griditem[i].data["name"] == name) {
				// griditem[i].data[item]= value ;

				griditem[i].set('permission', json.permission);
				griditem[i].set('size', json.size);
				if (name.indexOf('.tar') < 0) // tar might meet error from
					// basement
					griditem[i].set('lastModified', json.lastModified);
				break;
			}
		}

		this.grid.store.commitChanges();
		// cache items > store items , because store items just have 50
		var items = FileMngGlobal.getFileDataCacheMap().get(key);
		if (items) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].name == name) {
					changedItem = items[i];
					items[i]['permission'] = json.permission;
					items[i]['size'] = json.size;
					if (name.indexOf('.tar') < 0) // tar might meet error from
						// basement
						items[i]['lastModified'] = json.lastModified;
					// alert(item+" "+value);
					break;
				}

			}
			// this.addData(key,items);
			return changedItem;
		}

	},

	copyItemValue : function(srcClusteIp, srcpath, desClusterIp, destpath,
			namelist, iskeep) {
		for (var i = 0; i < namelist.length; i++) {
			var curname = namelist[i].name;
			var oldname = namelist[i].oldname;
			// var oldsubpath = srcpath + "/" + curname;
			var oldsubpath = srcpath + "/" + oldname;
			/*
			 * very important , mapkeys is an array without any reference to
			 * keys of FileMngGlobal.getFileDataCacheMap() , if loop
			 * FileMngGlobal.getFileDataCacheMap()'s keys, it will be affected
			 * by itself's push that mean length will enlarge
			 * 
			 */
			var mapkeys = [];
			for (var k = 0; k < FileMngGlobal.getFileDataCacheMap().keys.length; k++) {
				mapkeys.push(FileMngGlobal.getFileDataCacheMap().keys[k]);

			}
			for (var k = 0; k < mapkeys.length; k++) {
				var currentkey = mapkeys[k];
				var currentIp = this.getHostfromKey(currentkey);
				var currentpath = this.getPathfromKey(currentkey);
				if (currentIp == srcClusteIp
						&& currentpath.indexOf(oldsubpath) == 0) {
					var newsubpath = destpath
							+ "/"
							+ curname
							+ currentpath.substring(srcpath.length
											+ oldname.length + 1,
									currentpath.length);
					var newsubkey = this.packetKey(desClusterIp, newsubpath);
					var oldsubdata = FileMngGlobal.getFileDataCacheMap()
							.get(currentkey);
					var oldsunbdatalength = oldsubdata.length;
					if (FileMngGlobal.getFileDataCacheMap()
							.containsKey(newsubkey)) {
						var newsubdata = FileMngGlobal.getFileDataCacheMap()
								.get(newsubkey);
						for (var a = 0; a < oldsunbdatalength; a++) {
							var isExisted = false;
							for (var aa = 0; aa < newsubdata.length; aa++) {
								if (newsubdata[aa].name == oldsubdata[a]) {
									isExisted = true;
									break;
								}

							}

							if (!isExisted) {
								var olddata = oldsubdata[a];
								newsubdata.push(olddata);

							}

						}

						this.addData(newsubkey, newsubdata);
					} else {
						this.addData(newsubkey, oldsubdata);

					}
					if (!iskeep) {

						FileMngGlobal.getFileDataCacheMap()
								.removeKey(currentkey);
					}

				}

			}
			mapkeys = null;
		}
	},
	changeItemValue : function(key, name, item, value, isdir) {
		var griditem = this.grid.store.data.items;
		// var r = this.grid.getSelections()[0];
		for (var i = 0; i < this.grid.store.getCount(); i++) {

			if (griditem[i].data["name"] == name) {
				// griditem[i].data[item]= value ;
				griditem[i].set(item, value);
				break;
			}
		}

		this.grid.store.commitChanges();
		// cache items > store items , because store items just have 50
		var items = FileMngGlobal.getFileDataCacheMap().get(key);
		if (items) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].name == name) {
					items[i][item] = value;
					if (item == 'name' && isdir) {
						/*
						 * very important , mapkeys is an array without any
						 * reference to keys of
						 * FileMngGlobal.getFileDataCacheMap() , if loop
						 * FileMngGlobal.getFileDataCacheMap()'s keys, it will
						 * be affected by itself's push that mean length will
						 * enlarge
						 * 
						 */
						var mapkeys = [];
						for (var k = 0; k < FileMngGlobal.getFileDataCacheMap().keys.length; k++) {
							mapkeys
									.push(FileMngGlobal.getFileDataCacheMap().keys[k]);

						}
						for (var k = 0; k < mapkeys.length; k++) {

							var currentkey = mapkeys[k];

							if (currentkey.indexOf(key + "/" + name) == 0) {
								var oldcurdirkey = key + "/" + name;
								var oldsubdir = "";
								if (currentkey.length > oldcurdirkey.length) {

									oldsubdir = currentkey.substring(
											oldcurdirkey.length,
											currentkey.length);
								}
								var newkey = key + "/" + value + oldsubdir;

								this.addData(newkey, FileMngGlobal
												.getFileDataCacheMap()
												.get(currentkey));

								FileMngGlobal.getFileDataCacheMap()
										.removeKey(currentkey);

							}
						}
						mapkeys = null;
					}

					break;
				}

			}
			// var monitor = FileMngGlobal.getFileDataCacheMap().get(key);
			/**
			 * It doesn't need to call this.addData(key, items), because items
			 * is reference and it's contents has been changed
			 */
			// this.addData(key, items);
		}
	},
	refreshStore : function(key, start) {
		this.grid.store.removeAll();
		var storeitems = this.getMyStore(key, null, start).data.items;
		this.grid.store.add(storeitems);
		this.firePagingToolBar(start, null, this.getData(key).length);
		// this.updateOtherCache();
	},

	gridDragDrop : function() {
		var targetscope = this;
		new Ext.dd.DropTarget(targetscope.grid.getEl(), {

					ddGroup : "mygrid",// 
					copy : false,
					// notifyOver : function(dd, e, data){
					// // var ddata=dd.getDragData(e);
					// var srcscope = Ext.getCmp(data.grid.filePanelId);
					// // alert('over '+cindex);
					// if(targetscope!=srcscope)
					// {
					// targetscope.getWinCmp().show();
					// targetscope.setWinCmpFocus();
					// }
					// },
					// notifyOut : function(dd, e, data){
					// var srcscope = Ext.getCmp(data.grid.filePanelId);
					// if(targetscope!=srcscope)
					// {
					// srcscope.getWinCmp().show();
					// srcscope.setWinCmpFocus();
					// }
					// },
					notifyDrop : function(dd, e, data) {

						var currentPanel = Ext.getCmp(targetscope.fileWinId);

						var isTarget = FileMngGlobal.fileWindowDropTarget
								.isThisFileWindowDropTarget(
										targetscope.fileWinId, e.xy[0], e.xy[1]);
						if (!isTarget) {
							return;
						}

						var srcscope = Ext.getCmp(data.grid.filePanelId);
						var sm = data.grid.getSelectionModel();
						var rows = sm.getSelections();
						if (rows.length > 0) {

							if (data.grid.id != targetscope.grid.id) {
								sm.selectRecords(rows);
								if (srcscope.cut() != false) {
									targetscope.paste();
									Ext.getCmp(targetscope.fileWinId).show();
								}

							} else {
								var cindex = dd.getDragData(e).rowIndex;
								if (cindex) {
									for (i = 0; i < rows.length; i++) {
										data.grid.store.remove(data.grid.store
												.getById(rows[i].id));
										data.grid.store.insert(cindex, rows[i]);
									}
									sm.selectRecords(rows);
								}
							}

						}
					}

				});

	},

	getWinCmp : function() {
		return Ext.getCmp(this.fileWinId);
	},
	setWinCmpFocus : function() {
		var winCmp = this.getWinCmp();
		if (winCmp != null)
			winCmp.focus(true)
	},
	getGridFileNameIndex : function() {
		var cindex = this.grid.colModel.getIndexById(this.fileWinId
				+ 'column_name');
		return cindex;
	},
	newSearchBar : function(textareaid) {
		var scope = this;
		function search(direction, textareaid) {

			var cursorobj = getStartEnd(textareaid);
			var number = 0;
			var ifchecked = Ext.getCmp(textareaid + 'txt_search_lettercase').checked;
			var text = Ext.get(textareaid + 'txt_search').dom.value;
			var content = Ext.get(textareaid).dom.value.replace(/\r\n/g, '\n');

			if (!ifchecked) {
				text = text.toLowerCase();
				content = content.toLowerCase();
			}

			var index = -1;
			if (direction) {
				if (cursorobj.end >= 0) {
					number = cursorobj.end;
				}
				index = content.substring(number).indexOf(text);
				if (index == -1) {
					index = content.indexOf(text);
					if (index == -1) {
						return;
					}
				} else {
					index = index + number;
				}

			} else {
				if (cursorobj.start >= 0) {
					number = cursorobj.start;
				}
				index = content.substring(0, number).lastIndexOf(text);
				if (index == -1) {
					index = content.lastIndexOf(text);
					if (index == -1) {
						return;
					}
				}

			}

			setCursorAtTxt(textareaid, index, text.length);

		}
		var footbar = new Ext.Toolbar({
					height : 25,
					width : "100%",
					region : 'center',
					autoScroll : true,
					items : [i18n.text_find_title, {
								xtype : 'textfield',
								labelStyle : "font-size:15px;",
								width : 150,
								height : 17,
								id : textareaid + 'txt_search',
								name : textareaid + 'txt_search',
								value : ''

							}, 
							// {
							// xtype : 'hidden',
							// id : textareaid+ 'txt_search_number',
							// value : '0'
							// },
							{
								text : i18n.text_find_previous,
								handler : function() {
									search(false, textareaid);
								}
							}, {
								text : i18n.text_find_next,
								handler : function() {
									search(true, textareaid);

								}
							},'-', new Ext.form.Checkbox({
										id : textareaid
												+ 'txt_search_lettercase',
										boxLabel : i18n.text_find_case_sensitive
									})
					]
				});

		return footbar;
	},
	addMapKey : function(id) {

		if (this.KeyMap != null) {
			this.KeyMap.disable();
		}
		/**
		 * ctrl+c
		 */
		this.KeyMap = new Ext.KeyMap(id, {
					key : 'c',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.copy()
						}
					},
					scope : this

				});

		/**
		 * ctrl+x
		 */
		this.KeyMap.addBinding({
					key : 'x',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.cut();
						}
					},
					scope : this
				});
		/**
		 * ctrl+v
		 */
		this.KeyMap.addBinding({
					key : 'v',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT"
								&& FileMngGlobal.filePasteShares.pasteflag != null) {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.paste();
						}
					},
					scope : this
				});
		/**
		 * del
		 */
		this.KeyMap.addBinding({
					key : Ext.EventObject.DELETE,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.del();
						}
					},
					scope : this
				});
		/**
		 * f5
		 */
		this.KeyMap.addBinding({
					key : Ext.EventObject.F5,

					fn : function(key, e) {
						// e.preventDefault();
						Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
						this.refresh({
									filepath : this.currentdir,
									focus : true
								});
					},
					scope : this

				});
		/**
		 * open folder or file
		 */
		this.KeyMap.addBinding({
					key : Ext.EventObject.ENTER,

					fn : function(key, e) {
						// e.preventDefault();
						Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
						if (document.activeElement.tagName != "INPUT") {

							var selected = this.grid.getSelections()[0];
							if (selected != null) {
								var openname = selected.get('name');
								if (selected.get('type') == 1)
									this.openFolder(openname);
								else
									this.open();
							}
						}
					},
					scope : this

				});

		/**
		 * ctrl+f new file
		 */
		this.KeyMap.addBinding({
					key : 'f',
					ctrl : true,

					fn : function(key, e) {

						if (document.activeElement.tagName != "INPUT") {

							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.newfile();

						}

					},
					scope : this
				});
		/**
		 * ctrl+d new folder
		 */
		this.KeyMap.addBinding({
					key : 'd',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.newfolder();
						}
					},
					scope : this
				});

		/**
		 * ctrl+z ;zip
		 */
		this.KeyMap.addBinding({
					key : 'z',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.zip();
						}
					},
					scope : this
				});

		/**
		 * ctrl+q ;unzip
		 */
		this.KeyMap.addBinding({
					key : 'q',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.unzip();
						}
					},
					scope : this
				});

		/**
		 * ctrl+u ;uplaod
		 */
		this.KeyMap.addBinding({
					key : 'u',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.upload();
						}
					},
					scope : this
				});

		/**
		 * ctrl+u ;download
		 */
		this.KeyMap.addBinding({
					key : 'n',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.download();
						}
					},
					scope : this
				});

		/**
		 * ctrl+u ;rename
		 */
		this.KeyMap.addBinding({
					key : 'r',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.rename();
						}
					},
					scope : this
				});

		/**
		 * ctrl+m ;chmode
		 */
		this.KeyMap.addBinding({
					key : 'm',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.properties();
						}
					},
					scope : this
				});

		/**
		 * ctrl+t ;tail
		 */
		this.KeyMap.addBinding({
					key : 't',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.tail();
						}
					},
					scope : this
				});

		/**
		 * ctrl+left: backward
		 */
		this.KeyMap.addBinding({
					key : Ext.EventObject.LEFT,
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {

							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.backward();
						}
					},
					scope : this
				});
		/**
		 * ctrl+right: forward
		 */
		this.KeyMap.addBinding({
					key : Ext.EventObject.RIGHT,
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.forward();
						}
					},
					scope : this
				});

		/**
		 * ctrl+up: upward
		 */
		this.KeyMap.addBinding({
					key : Ext.EventObject.UP,
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.upward();
						}
					},
					scope : this
				});

		/**
		 * ctrl+a: upward
		 */
		this.KeyMap.addBinding({
					key : 'a',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.allselect();
						}
					},
					scope : this
				});

		/**
		 * ctrl+h: help
		 */
		this.KeyMap.addBinding({
					key : 'h',
					ctrl : true,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.help();
						}
					},
					scope : this
				});

		// /**
		// * ctrl+b: about
		// */
		// this.KeyMap.addBinding({
		// key : 'b',
		// ctrl : true,
		//
		// fn : function(key, e) {
		// if (document.activeElement.tagName != "INPUT") {
		// // e.preventDefault();
		// Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
		// this.about();
		// }
		// },
		// scope : this
		// });

		/**
		 * home
		 */
		this.KeyMap.addBinding({
					key : Ext.EventObject.HOME,

					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.openDefaultDir();
						}
					},
					scope : this
				});

		/**
		 * md5
		 */
		this.KeyMap.addBinding({
					key : '5',
					ctrl : true,
					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.md5();
						}
					},
					scope : this
				});

		/**
		 * dos2unix
		 */
		this.KeyMap.addBinding({
					key : 'o',
					ctrl : true,
					fn : function(key, e) {
						if (document.activeElement.tagName != "INPUT") {
							// e.preventDefault();
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
							this.dos2unix();
						}
					},
					scope : this
				});

	},

	afteredit : function(e) {

		// alert(1098);
		var scope = this;
		var record = e.record;
		var newname = record.data.name;
		var oldname = record.modified.name;

		var isdir = record.data.type == 1 ? true : false;
		var findex = this.getGridFileNameIndex();
		if (newname != oldname) {
			// alert(1102);

			/*******************************************************************
			 * consider change key and resume key change key to new key, so can
			 * enter quickly , like copy,move,unzip
			 * 
			 * 
			 ******************************************************************/

			var key = scope.packetKey(scope.host, scope.currentdir);

			/* change cache */
			var count = scope.checkData(key, newname, oldname);
			/*
			 * condition rule must follow below cause cache data might be
			 * affected by store data change,it can't judge key's data directly
			 */
			if ((count.newnamecount >= 1 && count.oldnamecount == 1)
					|| (count.newnamecount >= 2 && count.oldnamecount == 0)) {
				// true: same name
				scope.grid.store.data.items[e.row].set('name', oldname);
				scope.grid.store.commitChanges();
				Ext.MessageBox.alert(i18n.prompt, i18n.val_filenameexist,
						function() {
							scope.grid.getColumnModel().setEditable(findex,
									true);

							scope.grid.startEditing(e.row, e.column);
						});

			} else {

				var invalidpath = this.checkPermission('rename');
				if (invalidpath != null) {
					Ext.MessageBox.alert(i18n.prompt, i18n.error_permission
									+ invalidpath, function() {
								scope.setWinCmpFocus();
							});
					scope.grid.store.data.items[e.row].set('name', oldname);
					scope.grid.store.commitChanges();
					return false;
				}
				var currentdir = scope.currentdir;
				var clusterIp = scope.host;
				scope.changeItemValue(key, oldname, 'name', newname, isdir);
				scope.updateOtherCache();
				var start = scope.getPagingToolBarCursor();
				Ext.Ajax.request({
					url : 'doRename.action',
					params : {
						oldfilename : Ext.util.Format.trim(oldname),
						newfilename : Ext.util.Format.trim(newname),
						filepath : scope.currentdir,
						clusterCode : scope.clusterCode
					},
					success : function(resp, opts) {

						scope.grid.getEl().unmask();
						var responseObject = Ext.util.JSON
								.decode(resp.responseText);

						if (responseObject.fileInfo.exception) {
							Ext.Msg.alert(i18n.error,
									responseObject.fileInfo.exception,
									function() {

										scope.setWinCmpFocus();
										if (currentdir == scope.currentdir
												&& clusterIp == scope.host) {
											scope.grid.getColumnModel()
													.setEditable(findex, true);
											scope.grid.startEditing(e.row,
													e.column);
										}
									});
						}

						// this.grid.store.removeAll();
						if (responseObject.unique == 1) {
							// this.setItems(this.host, ctpath,
							// responseObject.fileItems);
							// this.grid.store.removeAll();
							// this.grid.store
							// .add(this.getMyStore(key).data.items);
							// scope
							// .removeData(scope.packetKey(scope.host,
							// scope.currentdir
							// + "/"
							// + Ext.util.Format
							// .trim(oldname)));
						} else if (responseObject.unique == 2) {
							/* existed handler */
							scope.setItems(scope.host, scope.currentdir,
									responseObject.fileItems);

							if (currentdir == scope.currentdir
									&& clusterIp == scope.host) {

								scope.refreshStore(key, start);
							}
							// scope.grid.store.removeAll();
							// scope.grid.store.add(scope.getMyStore(key, null,
							// start).data.items);
							// scope.firePagingToolBar(start, null, scope
							// .getData(key).length);
							scope.updateOtherCache();
						} else {
							/* error handler */
							if (currentdir == scope.currentdir
									&& clusterIp == scope.host) {
								scope.grid.store.data.items[e.row].set('name',
										oldname);
								scope.grid.store.commitChanges();

							}
							scope.changeItemValue(key, newname, 'name',
									oldname, isdir);
							scope.updateOtherCache();
						}

					},
					failure : function(resp, opts) {
						var exceptionE = i18n.error_connection;
						Ext.Msg.alert(i18n.error, exceptionE, function() {
									scope.setWinCmpFocus()
								});
						scope.grid.store.data.items[e.row].set('name', oldname);
						scope.grid.store.commitChanges();
						scope.changeItemValue(key, newname, 'name', oldname,
								isdir);
						scope.updateOtherCache();
						var resultArray = (Ext.util.JSON
								.decode(resp.responseText)).fileInfo;

					},
					scope : scope
				});

			}
		}

		scope.grid.stopEditing();
		scope.grid.getColumnModel().setEditable(findex, false);
	},

	cellclick : function(grid, rowIndex, columnIndex, e) {
		var scope = this;
		var record = grid.getStore().getAt(rowIndex);
		var sels = grid.getSelectionModel().getSelections();
		var length = sels.length;
		if (length > 1) {
			scope.resetCellClick();
			return;
		}

		var fileIndex = this.getGridFileNameIndex();

		if (columnIndex == fileIndex) {

			var fieldName = grid.getColumnModel().getDataIndex(columnIndex); // Get
			// field
			// name
			var dataname = record.get(fieldName);

			if (record != null) {
				if (scope.cellclickdata_name == dataname) {
					if (scope.cellclickdata_clickcount < 2) {
						scope.cellclickdata_clickcount++;
					}
					if (scope.cellclickdata_clickcount == 2) {

						var interID = window.setInterval(function() {

									window.clearInterval(interID);
									if (scope.cellclickdata_name == dataname
											&& scope.cellclickdata_clickcount == 2
											&& scope.cellclickdata_reset == false) {

										grid.getColumnModel().setEditable(
												columnIndex, true);

										grid
												.startEditing(rowIndex,
														columnIndex);
									}

								}, 500)
					}

				} else {
					if (dataname) {
						scope.cellclickdata_reset = false;
						scope.cellclickdata_name = dataname;
						scope.cellclickdata_clickcount = 1;
					} else {
						scope.resetCellClick();
					}

				}
			}

			// Ext.MessageBox.alert('show','��ǰѡ�е������'+data);
		} else if (rowIndex != scope.cellclickdata_rowindex) {
			var fileFieldName = grid.getColumnModel().getDataIndex(fileIndex);
			var fileDataname = record.get(fileFieldName);
			scope.cellclickdata_reset = false;
			scope.cellclickdata_name = fileDataname;
			scope.cellclickdata_clickcount = 1;

		}
		scope.cellclickdata_rowindex = rowIndex;
	},

	// Click

	click : function(e) {
		var scope = this;
		var grid = scope.grid;
		var sels = grid.getSelectionModel().getSelections();
		if (sels.length == 1 && grid.editing) {
			/** don't prevent browser default right click menu */
			return;
		} else {
			scope.getWinCmp().focus(true);
		}
	},
	rowdblclick : function(grid, rowindex, e) {
		var scope = this;
		var grid = scope.grid;
		scope.resetCellClick();
		grid.getColumnModel().setEditable(0, false);
		this.open();
	},
	rowclick : function(grid, rowIndex, columnIndex, e) {

		var scope = this;
		// scope.cellclickdata_rowindex = rowIndex;
		scope.getWinCmp().show();
		// alert('1');
		var sels = grid.getSelectionModel().getSelections();
		var length = sels.length;
		// rIndex = rowIndex;

		// var list = [];

		if (length > 1) {

			scope.setComponetStatus('tb_open', false);
			scope.setComponetStatus('tb_tail', false);
			scope.setComponetStatus('tb_newfolder', true);
			scope.setComponetStatus('tb_newfile', true);
			scope.setComponetStatus('tb_copy', true);
			scope.setComponetStatus('tb_cut', true);
			scope.setComponetStatus('tb_paste', false);
			// scope.setComponetStatus('tb_paste1', false);
			scope.setComponetStatus('tb_zip', true);
			scope.setComponetStatus('tb_unzip', true);
			scope.setComponetStatus('tb_upload', true);
			scope.setComponetStatus('tb_download', true);
			scope.setComponetStatus('tb_delete', true);
			scope.setComponetStatus('tb_properties', false);
			scope.setComponetStatus('tb_md5', false);
			scope.setComponetStatus('tb_dos2unix', true);

			// for (var i = 0; i < sels.length; i++) {
			// var sel = sels[i];
			// list.push(sel.get('name'));
			// }

			for (var i = 0; i < sels.length; i++) {
				var type = sels[i].get('type');
				var name = sels[i].get('name');

				if (type != 0) {

					scope.setComponetStatus('tb_dos2unix', false);
					scope.setComponetStatus('tb_unzip', false);
					break;
				} else {
					if (name.toLowerCase().lastIndexOf('.rar') == -1
							&& name.toLowerCase().lastIndexOf('.tar') == -1
							&& name.toLowerCase().lastIndexOf('.tar.gz') == -1
							&& name.toLowerCase().lastIndexOf('.zip') == -1) {

						scope.setComponetStatus('tb_unzip', false);

					}

				}

			}

		} else if (length == 1) {

			scope.setComponetStatus('tb_open', true);
			scope.setComponetStatus('tb_tail', true);
			scope.setComponetStatus('tb_newfolder', true);
			scope.setComponetStatus('tb_newfile', true);
			scope.setComponetStatus('tb_copy', true);
			scope.setComponetStatus('tb_cut', true);
			scope.setComponetStatus('tb_paste', false);
			// scope.setComponetStatus('tb_paste1', false);
			scope.setComponetStatus('tb_zip', true);
			scope.setComponetStatus('tb_unzip', true);
			scope.setComponetStatus('tb_upload', true);
			scope.setComponetStatus('tb_download', true);
			scope.setComponetStatus('tb_delete', true);
			scope.setComponetStatus('tb_properties', true);
			scope.setComponetStatus('tb_md5', true);
			scope.setComponetStatus('tb_unzip', true);
			scope.setComponetStatus('tb_dos2unix', true);

			var selections = sels[0];
			var filename = selections.get('name');

			var type = selections.get('type');

			if (type != 0) {
				scope.setComponetStatus('tb_dos2unix', false);
				scope.setComponetStatus('tb_md5', false);
				scope.setComponetStatus('tb_tail', false);
				scope.setComponetStatus('tb_unzip', false);
			} else {
				if (filename.toLowerCase().lastIndexOf('.rar') == -1
						&& filename.toLowerCase().lastIndexOf('.tar') == -1
						&& filename.toLowerCase().lastIndexOf('.tar.gz') == -1
						&& filename.toLowerCase().lastIndexOf('.zip') == -1) {

					scope.setComponetStatus('tb_unzip', false);
				}

			}

		} else if (length == 0) {
			scope.setComponetStatus('tb_open', false);
			scope.setComponetStatus('tb_tail', false);
			scope.setComponetStatus('tb_newfolder', true);
			scope.setComponetStatus('tb_newfile', true);
			scope.setComponetStatus('tb_copy', false);
			scope.setComponetStatus('tb_cut', false);
			scope.setComponetStatus('tb_paste', false);
			// scope.setComponetStatus('tb_paste1', false);
			scope.setComponetStatus('tb_zip', false);
			scope.setComponetStatus('tb_unzip', false);
			scope.setComponetStatus('tb_upload', true);
			scope.setComponetStatus('tb_download', false);
			scope.setComponetStatus('tb_delete', false);
			scope.setComponetStatus('tb_properties', false);
			scope.setComponetStatus('tb_md5', false);
			scope.setComponetStatus('tb_dos2unix', false);
		}

		if (FileMngGlobal.filePasteShares.pasteflag == "cut"
				|| FileMngGlobal.filePasteShares.pasteflag == "copy") {
			scope.setComponetStatus('tb_paste', true);
			// scope.setComponetStatus('tb_paste1', true);

		} else {
			scope.setComponetStatus('tb_paste', false);
			// scope.setComponetStatus('tb_paste1', false);

		}

	},

	contextmenu : function(e) {
		var scope = this;
		var rightClick = this.rightClick;
		var grid = scope.grid;
		var sels = grid.getSelectionModel().getSelections();

		if (sels.length == 1 && grid.editing) {
			// don't prevent browser default right click menu
			return;
		}

		e.preventDefault();
		rightClick.showAt(e.getXY());

		if (scope.errormark == true) {
			scope.setComponetStatus('menu_open', false);
			scope.setComponetStatus('menu_tail', false);
			scope.setComponetStatus('menu_new', false);
			scope.setComponetStatus('menu_newfolder', false);
			scope.setComponetStatus('menu_newfile', false);
			scope.setComponetStatus('menu_copy', false);
			scope.setComponetStatus('menu_cut', false);
			scope.setComponetStatus('menu_paste', false);
			scope.setComponetStatus('menu_zip', false);
			scope.setComponetStatus('menu_unzip', false);
			scope.setComponetStatus('menu_upload', false);
			scope.setComponetStatus('menu_download', false);
			scope.setComponetStatus('menu_delete', false);
			scope.setComponetStatus('menu_refresh', true);
			scope.setComponetStatus('menu_properties', false);
			scope.setComponetStatus('menu_rename', false);
			scope.setComponetStatus('menu_md5', false);
			scope.setComponetStatus('menu_dos2unix', false);
			return;

		}

		if (sels.length == 0) {

			scope.setComponetStatus('menu_open', false);
			scope.setComponetStatus('menu_tail', false);
			scope.setComponetStatus('menu_new', true);
			scope.setComponetStatus('menu_newfolder', true);
			scope.setComponetStatus('menu_newfile', true);
			scope.setComponetStatus('menu_copy', false);
			scope.setComponetStatus('menu_cut', false);
			scope.setComponetStatus('menu_paste', false);
			scope.setComponetStatus('menu_zip', false);
			scope.setComponetStatus('menu_unzip', false);
			scope.setComponetStatus('menu_upload', true);
			scope.setComponetStatus('menu_download', false);
			scope.setComponetStatus('menu_delete', false);
			scope.setComponetStatus('menu_refresh', true);
			scope.setComponetStatus('menu_properties', false);
			scope.setComponetStatus('menu_rename', false);
			scope.setComponetStatus('menu_md5', false);
			scope.setComponetStatus('menu_dos2unix', false);

		}
		if (FileMngGlobal.filePasteShares.pasteflag == "cut"
				|| FileMngGlobal.filePasteShares.pasteflag == "copy") {

			scope.setComponetStatus('menu_paste', true);

		} else {
			scope.setComponetStatus('menu_paste', false);

		}

	},

	rowcontextmenu : function(grid, rowIndex, e) {
		var scope = this;

		var rightClick = this.rightClick;
		var sels = grid.getSelectionModel().getSelections();

		if (sels.length == 1 && scope.grid.editing) {

			return;
		}
		// check whether to select new row
		var isnewrow = true;
		for (var i = 0; i < sels.length; i++) {
			if (sels[i] == scope.grid.store.getAt(rowIndex)) {
				isnewrow = false;
				break;
			}
		}
		if (isnewrow) {
			grid.getSelectionModel().selectRow(rowIndex);
			scope.cellclickdata_reset = false;
			scope.cellclickdata_name = scope.grid.store.getAt(rowIndex)
					.get('name');
			scope.cellclickdata_clickcount = 2;
		}
		// testRightClick.items.items[0].disable();
		scope.rowclick(grid, rowIndex);

		e.preventDefault();
		rightClick.showAt(e.getXY());

		if (scope.errormark == true) {
			scope.setComponetStatus('menu_open', false);
			scope.setComponetStatus('menu_tail', false);
			scope.setComponetStatus('menu_new', false);
			scope.setComponetStatus('menu_newfolder', false);
			scope.setComponetStatus('menu_newfile', false);
			scope.setComponetStatus('menu_copy', false);
			scope.setComponetStatus('menu_cut', false);
			scope.setComponetStatus('menu_paste', false);
			scope.setComponetStatus('menu_zip', false);
			scope.setComponetStatus('menu_unzip', false);
			scope.setComponetStatus('menu_upload', false);
			scope.setComponetStatus('menu_download', false);
			scope.setComponetStatus('menu_delete', false);
			scope.setComponetStatus('menu_refresh', true);
			scope.setComponetStatus('menu_properties', false);
			scope.setComponetStatus('menu_rename', false);
			scope.setComponetStatus('menu_md5', false);
			scope.setComponetStatus('menu_dos2unix', false);

			return;

		}

		sels = grid.getSelectionModel().getSelections();

		if (sels.length > 1) {

			scope.setComponetStatus('menu_open', false);
			scope.setComponetStatus('menu_tail', false);
			scope.setComponetStatus('menu_new', true);
			scope.setComponetStatus('menu_newfolder', true);
			scope.setComponetStatus('menu_newfile', true);
			scope.setComponetStatus('menu_copy', true);
			scope.setComponetStatus('menu_cut', true);
			scope.setComponetStatus('menu_paste', false);
			scope.setComponetStatus('menu_zip', true);
			scope.setComponetStatus('menu_unzip', true);
			scope.setComponetStatus('menu_upload', true);
			scope.setComponetStatus('menu_download', true);
			scope.setComponetStatus('menu_delete', true);
			scope.setComponetStatus('menu_refresh', true);
			scope.setComponetStatus('menu_properties', false);
			scope.setComponetStatus('menu_rename', false);
			scope.setComponetStatus('menu_md5', false);
			scope.setComponetStatus('menu_dos2unix', true);

			for (var i = 0; i < sels.length; i++) {
				var type = sels[i].get('type');
				var name = sels[i].get('name');

				if (type != 0) {
					scope.setComponetStatus('menu_dos2unix', false);
					scope.setComponetStatus('menu_unzip', false);
					break;
				} else {

					if (name.toLowerCase().lastIndexOf('.rar') == -1
							&& name.toLowerCase().lastIndexOf('.tar') == -1
							&& name.toLowerCase().lastIndexOf('.tar.gz') == -1
							&& name.toLowerCase().lastIndexOf('.zip') == -1) {

						scope.setComponetStatus('menu_unzip', false);

					}
				}

			}

		} else if (sels.length == 1) {
			scope.setComponetStatus('menu_open', true);
			scope.setComponetStatus('menu_tail', true);
			scope.setComponetStatus('menu_new', true);
			scope.setComponetStatus('menu_newfolder', true);
			scope.setComponetStatus('menu_newfile', true);
			scope.setComponetStatus('menu_copy', true);
			scope.setComponetStatus('menu_cut', true);
			scope.setComponetStatus('menu_paste', false);
			scope.setComponetStatus('menu_zip', true);
			scope.setComponetStatus('menu_unzip', true);
			scope.setComponetStatus('menu_upload', true);
			scope.setComponetStatus('menu_download', true);
			scope.setComponetStatus('menu_delete', true);
			scope.setComponetStatus('menu_refresh', true);
			scope.setComponetStatus('menu_properties', true);
			scope.setComponetStatus('menu_rename', true);
			scope.setComponetStatus('menu_md5', true);
			scope.setComponetStatus('menu_unzip', true);
			scope.setComponetStatus('menu_dos2unix', true);

			filename = grid.getSelections()[0].get('name');

			var type = grid.getSelections()[0].get('type');

			if (type != 0) {
				scope.setComponetStatus('menu_dos2unix', false);
				scope.setComponetStatus('menu_md5', false);
				scope.setComponetStatus('menu_tail', false);
				scope.setComponetStatus('menu_unzip', false);
			} else {
				if (filename.toLowerCase().lastIndexOf('.rar') == -1
						&& filename.toLowerCase().lastIndexOf('.tar') == -1
						&& filename.toLowerCase().lastIndexOf('.tar.gz') == -1
						&& filename.toLowerCase().lastIndexOf('.zip') == -1) {

					scope.setComponetStatus('menu_unzip', false);
				}

			}

		} else if (sels.length == 0) {

			scope.setComponetStatus('menu_open', false);
			scope.setComponetStatus('menu_tail', false);
			scope.setComponetStatus('menu_new', true);
			scope.setComponetStatus('menu_newfolder', true);
			scope.setComponetStatus('menu_newfile', true);
			scope.setComponetStatus('menu_copy', false);
			scope.setComponetStatus('menu_cut', false);
			scope.setComponetStatus('menu_paste', false);
			scope.setComponetStatus('menu_zip', false);
			scope.setComponetStatus('menu_unzip', false);
			scope.setComponetStatus('menu_upload', true);
			scope.setComponetStatus('menu_download', false);
			scope.setComponetStatus('menu_delete', false);
			scope.setComponetStatus('menu_refresh', true);
			scope.setComponetStatus('menu_properties', false);
			scope.setComponetStatus('menu_rename', false);
			scope.setComponetStatus('menu_md5', false);
			scope.setComponetStatus('menu_dos2unix', false);
		}

		if (FileMngGlobal.filePasteShares.pasteflag == "cut"
				|| FileMngGlobal.filePasteShares.pasteflag == "copy") {
			scope.setComponetStatus('menu_paste', true);

		} else {
			scope.setComponetStatus('menu_paste', false);

		}

	}

};
