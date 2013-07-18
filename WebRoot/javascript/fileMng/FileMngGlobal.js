

var FileMngGlobal = {
	pagesLimited:50,
	file_cache_map : new Ext.util.MixedCollection(),
	file_cache_maxsize : 100,
	file_win_count : 0,
	Ext_windows_count : 0,
	file_panel_collection : new Ext.util.MixedCollection(),
	file_content_page_map : new Ext.util.MixedCollection(),
	filePasteShares : {
		pasteStart : null,
		pasteHost : '',
		pasteSrcPath : '',
		pasteFileList : [],
		pasteflag : ""
	},

	fileContentTextArea : {

		getTotalPage : function(id) {
			var array=FileMngGlobal.file_content_page_map.get(id + '_total');
			var page= array.length;
			return page;
			
		},

		getFileContentTextAreaByPage : function(id, page) {
			var index = --page;
			return FileMngGlobal.file_content_page_map.get(id + '_total')[index];
		},
		getFileContentTextArea : function(id) {

			var content = FileMngGlobal.file_content_page_map
					.get(id + '_total').join('');
			return content;

		},
		removeFileContentTextAreaTotal : function(id) {
		    FileMngGlobal.file_content_page_map.removeKey(id + '_total');
		},

		addFileContentTextAreaByPage : function(id, page, content) {
			var index = --page;
			var array=FileMngGlobal.file_content_page_map.get(id + '_total');
			array[index] = content;
			
//			var array1=FileMngGlobal.file_content_page_map.get(id + '_total');
//			array1[1];
		},

		addFileContentTextAreaTotal : function(id, content) {
			var length = 100000;
			var carray = new Array();
			if (content.length == 0) {
				carray.push('');
			} 
//			else {
//				var p = Math.floor(content.length / length);
//				var totalpage = content.length % length != 0 ? p + 1 : p;
//				for (var i = 0; i < totalpage; i++) {
//					var text;
//					if (totalpage == i + 1) {
//						text = content.substring(i * length, content.length);
//					} else {
//						text = content.substr(i * length, length);
//					}
//					carray.push(text);
//				}
//			}
			else {
				var start = 0;
				var newline='\n';
				while(start<content.length)
				{
				var remain=content.length-start;
				var text='';
				if(remain>length)
				{
					text=content.substr(start,length);
					var newlinestart= text.lastIndexOf(newline);
					if(newlinestart>0.8*length)
					{
					 var end=start+newlinestart+newline.length;
					 text=content.substring(start,end);
					 start=end;
					}
					else
					{
					 start+=length;
					}
				}
				else
				{
				  text=content.substring(start,content.length);
				  start=content.length;
				}
				  carray.push(text);
				}
				
			}
			FileMngGlobal.file_content_page_map.add(id + '_total', carray);

		}
	},

	getGlobalFileDataCacheMaxSize : function() {

		return this.file_cache_maxsize;
	},

	getFileDataCacheMap : function() {

		return this.file_cache_map;
	},

	getFilePanelCollection : function() {
		return this.file_panel_collection;
	},
	getGlobalFileWindowAutoSequence : function() {
		return String(this.file_win_count++);
	},

	getGlobalFileWindowNumbers : function() {
		return this.Ext_windows_count;
	},

	increaseGlobalFileWindowNumbers : function() {
		this.Ext_windows_count++;

	},
	decreaseGlobalFileWindowNumbers : function() {

		this.Ext_windows_count--;
	},

	registeredToGlobalFileWindow : function(filePanelObj, fileWinObj,
			RegisterFn, closeFn) {
		var fileWinId = fileWinObj.id;
		var filePanelid = filePanelObj.id;
		filePanelObj.addMapKey(fileWinId);
		FileMngGlobal.file_panel_collection.add(filePanelid, filePanelObj);
		if (RegisterFn != null && RegisterFn != undefined)
			RegisterFn();
		fileWinObj.on({
					'activate' : {
						fn : function() {
							fileWinObj.markActive;
							filePanelObj.addMapKey(fileWinId);
							fileWinObj.focus(true)
						}
					},

					'close' : {
						fn : function() {
							if (closeFn != null && closeFn != undefined)
								closeFn();
							// alert(file_panel_collection.containsKey(filePanelid));
							FileMngGlobal.file_panel_collection
									.removeKey(filePanelid);
							// alert(file_panel_collection.containsKey(filePanelid));
							filePanelObj = null;
							fileWinObj = null;
						}
					}
				});

	},

	fileWindowDropTarget : {
		lastTargetWinId : null,
		lastX : null,
		lastY : null,

		isThisFileWindowDropTarget : function(fileWinid, pointX, pointY) {
			var scope = this;
			if (!isSamePointsBecauseOfExtBug()) {

				this.caculateTargetWin(fileWinid, pointX, pointY);
				setLastPointBecauseOfExtBug(pointX, pointY);

			}

			return isTargetWinId();

			function isTargetWinId() {

				if (scope.lastTargetWinId == fileWinid) {
					scope.lastTargetWinId = null;
					return true;
				} else {
					return false;
				}

			}

			function setLastPointBecauseOfExtBug(X, Y) {

				scope.lastX = X;
				scope.lastY = Y;

			}

			function isSamePointsBecauseOfExtBug() {
				/**
				 * it triggles same drop event twice occasionally , so must
				 * check this situation and define the rule to eliminate bug ,
				 * it is based on the hypothesis that different points between
				 * previous drop and current drop
				 */
				if (scope.lastX == pointX && scope.lastY == pointY) {
					return true;
				}
				return false;

			}
		},
		isPointXYInScope : function(fileWin, pointX, pointY) {
			if (!checkIsVisible()) {
				return false;
			} else {
				if (checkPointX() && checkPointY())
					return true;
				else
					return false;

			}
			// /////////////////////////////////
			function checkPointX() {
				if (pointX >= fileWin.x
						&& pointX <= fileWin.x + fileWin.lastSize.width)
					return true;
				else
					return false;
			}

			function checkPointY() {
				if (pointY >= fileWin.y
						&& pointY <= fileWin.y + fileWin.lastSize.height)
					return true;
				else
					return false;

			}

			function checkIsVisible() {

				return fileWin.isVisible();
			}
		},

		caculateTargetWin : function(fileWinid, pointX, pointY) {
			var zindex = null;

			for (var i = 0; i < FileMngGlobal.file_panel_collection.items.length; i++) {
				var cWin = Ext
						.getCmp(FileMngGlobal.file_panel_collection.items[i].fileWinId);
				if (cWin == null)
					continue;

				if (!this.isPointXYInScope(cWin, pointX, pointY))
					continue;

				if (zindex == null) {
					zindex = cWin.lastZIndex;
					this.lastTargetWinId = cWin.id;

				} else {
					if (cWin.lastZIndex > zindex) {
						zindex = cWin.lastZIndex;
						this.lastTargetWinId = cWin.id;
					}
				}

			}

		}

	}

};

// var file_cache_map = new Ext.util.MixedCollection();
// var file_cache_maxsize = 100;
// var file_win_count = 0;
// var Ext_Windows_Count = 0;
// var file_panel_collection = new Ext.util.MixedCollection();
// var filePasteShares = {
// pasteStart : null,
// pasteHost : '',
// pasteSrcPath : '',
// pasteFileList : [],
// pasteflag : ""
// };
//
// var getGlobalFileWindowAutoSequenceByFileSupport = function() {
// return String(file_win_count++);
//
// };
//
// var getGlobalFileWindowNumbersByFileSupport = function() {
// return Ext_Windows_Count;
// }
//
// var increaseGlobalFileWindowNumbersByFileSupport = function() {
// Ext_Windows_Count++;
//
// }
// var decreaseGlobalFileWindowNumbersByFileSupport = function() {
//
// Ext_Windows_Count--;
// }
//
// var registeredToGlobalFileWindowByFileSupport = function(filePanelObj,
// fileWinObj, RegisterFn, closeFn) {
// var fileWinId = fileWinObj.id;
// var filePanelid = filePanelObj.id;
// filePanelObj.addMapKey(fileWinId);
// file_panel_collection.add(filePanelid, filePanelObj);
// if (RegisterFn != null && RegisterFn != undefined)
// RegisterFn();
// fileWinObj.on({
// 'activate' : {
// fn : function() {
// fileWinObj.markActive;
// filePanelObj.addMapKey(fileWinId);
// fileWinObj.focus(true)
// }
// },
//
// 'close' : {
// fn : function() {
// if (closeFn != null && closeFn != undefined)
// closeFn();
// // alert(file_panel_collection.containsKey(filePanelid));
// file_panel_collection.removeKey(filePanelid);
// // alert(file_panel_collection.containsKey(filePanelid));
// filePanelObj = null;
// fileWinObj = null;
// }
// }
// });
//
// };
//
// var fileWindowDropTarget = {
// lastTargetWinId : null,
// lastX : null,
// lastY : null,
//
// isThisFileWindowDropTarget : function(fileWinid, pointX, pointY) {
// var scope = this;
// if (!isSamePointsBecauseOfExtBug()) {
//
// this.caculateTargetWin(fileWinid, pointX, pointY);
// setLastPointBecauseOfExtBug(pointX, pointY);
//
// }
//
// return isTargetWinId();
//
// function isTargetWinId() {
//
// if (scope.lastTargetWinId == fileWinid) {
// scope.lastTargetWinId = null;
// return true;
// } else {
// return false;
// }
//
// }
//
// function setLastPointBecauseOfExtBug(X, Y) {
//
// scope.lastX = X;
// scope.lastY = Y;
//
// }
//
// function isSamePointsBecauseOfExtBug() {
// /**
// * it triggles same drop event twice occasionally , so must check
// * this situation and define the rule to eliminate bug , it is based
// * on the hypothesis that different points between previous drop and
// * current drop
// */
// if (scope.lastX == pointX && scope.lastY == pointY) {
// return true;
// }
// return false;
//
// }
// },
// isPointXYInScope : function(fileWin, pointX, pointY) {
// if (!checkIsVisible()) {
// return false;
// } else {
// if (checkPointX() && checkPointY())
// return true;
// else
// return false;
//
// }
// // /////////////////////////////////
// function checkPointX() {
// if (pointX >= fileWin.x
// && pointX <= fileWin.x + fileWin.lastSize.width)
// return true;
// else
// return false;
// }
//
// function checkPointY() {
// if (pointY >= fileWin.y
// && pointY <= fileWin.y + fileWin.lastSize.height)
// return true;
// else
// return false;
//
// }
//
// function checkIsVisible() {
//
// return fileWin.isVisible();
// }
// },
//
// caculateTargetWin : function(fileWinid, pointX, pointY) {
// var zindex = null;
//
// for (var i = 0; i < file_panel_collection.items.length; i++) {
// var cWin = Ext.getCmp(file_panel_collection.items[i].fileWinId);
// if (cWin == null)
// continue;
//
// if (!this.isPointXYInScope(cWin, pointX, pointY))
// continue;
//
// if (zindex == null) {
// zindex = cWin.lastZIndex;
// this.lastTargetWinId = cWin.id;
//
// } else {
// if (cWin.lastZIndex > zindex) {
// zindex = cWin.lastZIndex;
// this.lastTargetWinId = cWin.id;
// }
// }
//
// }
//
// }
//
// }
