Ext.BLANK_IMAGE_URL = 'images/s.gif';

/**
 * add sorting field support for grid, combine to see function of
 * renderFileNameColor.
 */
Ext.override(Ext.data.Store, {
	sortData : function(f, direction) {

		direction = direction || 'ASC';
		var st = this.fields.get(f).sortType;
		var sorting = this.fields.get(f).sorting;
		var cmp = this.fields.get(f).cmp;
		// var sortingdata=this.fields.get(f).sortingdata
		if (cmp) {
			cmp.sortType = sorting ? sorting : f;
			cmp.sortDir = direction;
			cmp.sortData();
			return;
		}

		var fn = function(r1, r2) {

			if (sorting) {
				var v1 = st(r1.data[sorting] ? r1.data[sorting] : r1.data[f]), v2 = st(r2.data[sorting]
						? r2.data[sorting]
						: r2.data[f]);
			} else {
				var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
			}
			return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
		};
		this.data.sort(direction, fn);
		if (this.snapshot && this.snapshot != this.data) {
			this.snapshot.sort(direction, fn);
		}

	}

});
/**
 * it is for datamenu in chrome.
 */
Ext.override(Ext.menu.DateMenu, {
			render : function() {
				Ext.menu.DateMenu.superclass.render.call(this);
				if (Ext.isGecko || Ext.isSafari) {
					this.picker.el.dom.childNodes[0].style.width = '178px';
					this.picker.el.dom.style.width = '178px';
				}
			}
		});

Ext.grid.EditorGrid = Ext.extend(Ext.grid.GridPanel, {
			loadMask : false,
			initEvents : function() {
				Ext.grid.EditorGrid.superclass.initEvents.call(this);
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

var sendMessage = function(messages) {
	// var meslog = "";
	// for (var i = 0; i < messages.length; i++) {
	// meslog = "<div>" + dwr.util.escapeHtml(messages[i]) + "</div>" + meslog;
	// }

	// $("meslog").innerHTML = meslog;
	// if (!document.getElementById("msg")) {
	// Ext.myMessageBox.msg('', meslog);
	// }

}
var showUserSettings = function() {
	if (theme == "default") {
		Ext.util.CSS.swapStyleSheet("theme", "css/ext-all-patch.css");
		// Ext.util.CSS.swapStyleSheet("theme",
		// "extjs/resources/css/ext-all.css");
	} else {
		Ext.util.CSS.swapStyleSheet("theme", "extjs/resources/css/xtheme-"
						+ theme + ".css");
	}
	Ext.util.CSS.swapStyleSheet("desktop-css", "css/desktop.css");
	document.body.style.background = "url(wallpapers/" + backgroundpic + ")"

}

Ext.ux.Util = {
	username : "",
	getUserName : function() {
		return Ext.ux.Util.useranme;
	},
	setUserName : function(username) {
		Ext.ux.Util.useranme = username
	},
	getExplorer : function() {
		var explorerType;
		if ((navigator.userAgent.indexOf('MSIE') >= 0)) {
			explorerType = "IE";
		} else if (navigator.userAgent.indexOf('Firefox') >= 0) {
			explorerType = "Firefox";
		} else if (navigator.userAgent.indexOf('Opera') >= 0) {
			explorerType = "Opera";
		} else if (navigator.userAgent.indexOf('Chrome') >= 0) {
			explorerType = "Chrome";
		} else {
			explorerType = "Other";
		}
		return explorerType
	},
	getOS : function() {
		var os;
		if (navigator.platform == "Win32" || navigator.platform == "Windows") {
			os = "WIN";
		}
		if ((navigator.platform == "Mac68K")
				|| (navigator.platform == "MacPPC")
				|| (navigator.platform == "Macintosh")
				|| (navigator.platform == "MacIntel")) {
			os = "MAC";
		}
		if (String(navigator.platform).indexOf("Linux") > -1) {
			os = "LINUX";
		}
		return os;
	},
	getFilePathInFirefox : function(fileBrowser) {
		try {
			netscape.security.PrivilegeManager
					.enablePrivilege("UniversalXPConnect");
		} catch (e) {
			var tips = i18n.prompt_security1 + '<br>' + i18n.prompt_security2
					+ '<br>' + i18n.prompt_security3 + '<br>'
					+ i18n.prompt_security4 + '<br>' + i18n.prompt_security5
					+ '<br>' + i18n.prompt_security6
			Ext.MessageBox.show({
						title : i18n.job_submit_fail,
						msg : tips,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.INFO,
						fn : function() {
							Ext.ux.Util.showWindow('submit-template-win');
						}
					});
			// alert('Unable to access local files due to browser security
			// settings. To overcome this, follow these steps: (1) Enter
			// "about:config" in the URL field; (2) Right click and select
			// New->Boolean; (3) Enter
			// "signed.applets.codebase_principal_support" (without the quotes)
			// as a new preference name; (4) Click OK and try loading the file
			// again.');
			return;
		}
		var fileName = fileBrowser.value;
		var file = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
		try {
			// Back slashes for windows
			if (fileName == null || fileName == "") {
				return;
			}
			// file.initWithPath(fileName.replace(/\//g, "\\\\"));
			file.initWithPath(fileName);

		} catch (e) {
			if (e.result != Components.results.NS_ERROR_FILE_UNRECOGNIZED_PATH)
				throw e;
			alert(i18n.prompt_security7 + fileName + i18n.prompt_security8);
			return;
		}

		if (file.exists() == false) {
			alert("File '" + fileName + "' not found.");
			return;
		}
		return file.path;
	},
	getFilePathInIE : function(fileBrowser) {
		var data;
		try {
			if (navigator.userAgent.indexOf('MSIE 6.0') >= 0) {
				return fileBrowser.value;
			} else {
				var fso = new ActiveXObject("Scripting.FileSystemObject");

				var fileName = fso.GetAbsolutePathName(fileBrowser.value);
				if (!fso.FileExists(fileName)) {
					alert("File '" + fileName + "' not found.");
					return;
				}

				return fileName;
			}
		} catch (e) {
			if (e.number == -2146827859) {
				// This is what we get if the browser's security settings
				// forbid

				// the use of the FileSystemObject ActiveX control

				var tips = i18n.prompt_security1 + '<br>'
						+ i18n.prompt_security2 + '<br>'
						+ i18n.prompt_security9 + '<br>'
						+ i18n.prompt_security10 + '<br>'
				Ext.MessageBox.show({
							title : i18n.job_submit_fail,
							msg : tips,
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.INFO,
							fn : function() {
								Ext.ux.Util.showWindow('submit-template-win');
							}
						});

				// alert('Unable to access local files due to browser security
				// settings. To overcome this, go to Tools->Internet
				// Options->Security->Custom Level. Find the setting for
				// "Initialize and script ActiveX controls not marked as safe"
				// and change it to "Enable" or "Prompt"');
			} else if (e.number == -2146828218) {
				// This is what we get if the browser can't access the file

				// because of file permissions
				alert(i18n.prompt_security11 + fileName
						+ i18n.prompt_security12);
			} else
				throw e;
		}

	},

	getFilePath : function(fileBrowser) {
		var explorer = Ext.ux.Util.getExplorer();
		if (explorer == "IE")
			return Ext.ux.Util.getFilePathInIE(fileBrowser);
		else if (explorer == "Firefox") {
			var filePath = Ext.ux.Util.getFilePathInFirefox(fileBrowser);
			return filePath;
			// } else if (explorer == "Chrome") {
			// var filePath = Ext.ux.Util.getFilePathInChrome(fileBrowser);
			// return filePath;
		} else
			alert("Not IE or Firefox (userAgent=" + navigator.userAgent + ")");

	},
	renderFileNameColor : function(value, metadata, record, rowIndex, colIndex,
			store) {
		var filename = value;
		// var filename = value.length > 30 ? value.substr(0, 30) + '...' :
		// value
		// .replace(/ /g, '&nbsp;');

		if (record.get("type") == 1) {

			return '<img src="images/type/folder.png"  style="vertical-align:middle" />'
					+ '<span style="color:green;">' + filename + '</span>';
		} else {
			var reflect = Ext.ux.Util.reflectType(record.data.name);
			// record.data.typesorting = reflect.filetype;
			return '<img src="'
					+ reflect.imgsrc
					+ '" error="images/type/txt.png" style="vertical-align:middle" />'
					+ '<span style="color:blue;">' + filename + '</span>';
		}
	},
	formatReview : function(val, metadata, record) {
		var src = val;
		if (val.indexOf('/') == 0) {
			src = src.substring(1, src.length);
		}
		var reflect = Ext.ux.Util.reflectType(record.data.name);
		if (reflect.filetype == 'Image') {
			return '<img style="height:50;"  onmouseover="this.style.height=200;" onmouseleave="this.style.height=50;" src="'
					+ src + '" />';
		} else {
			return '';
		}

	},
	formatType : function(val, metadata, record) {
		var reflect = Ext.ux.Util.reflectType(record.data.name);

		if (val == 1) {
			return '<span style="color:green;">' + i18n.col_filetype_folder
					+ '</span>';
		} else {
			return '<span style="color:blue;">' + reflect.filetype + ' '
					+ i18n.col_filetype_file + '</span>';
		}
	},

	reflectType : function(filename) {

		var reference = {
			BMP : {
				name : 'img.png',
				value : 'Image'
			},
			JPG : {
				name : 'img.png',
				value : 'Image'
			},
			PNG : {
				name : 'img.png',
				value : 'Image'
			},
			GIF : {
				name : 'img.png',
				value : 'Image'
			},
			TXT : {
				name : 'txt.png',
				value : 'Text'
			},
			TXT : {
				name : 'txt.png',
				value : 'Text'
			},
			PDF : {
				name : 'pdf.png',
				value : 'PDF'
			},
			LSF : {
				name : 'lsf.png',
				value : 'Job Srcipt'
			},
			RAR : {
				name : 'rar.png',
				value : 'RAR'
			},
			ZIP : {
				name : 'rar.png',
				value : 'ZIP'
			},
			TAR : {
				name : 'rar.png',
				value : 'TAR'
			},
			GZ : {
				name : 'rar.png',
				value : 'GZIP'
			}
		}

		var imgsrc;
		var filetype
		if (filename.lastIndexOf('.') == -1) {
			imgsrc = 'images/type/file.png';
			filetype = '';
		} else {
			var extension = filename.substring(filename.lastIndexOf('.') + 1)
					.toUpperCase();

			var ref = reference[extension];
			if (ref) {
				filetype = ref.value;
				imgsrc = "images/type/" + ref.name;
			} else {
				if (filename.match(/output.\d+/)) {
					imgsrc = 'images/type/output.png';
					filetype = 'Output';
				} else {
					filetype = extension;
					imgsrc = 'images/type/txt.png';
				}
			}
		}
		return {
			imgsrc : imgsrc,
			filetype : filetype
		};

	},

	formatSize : function(val) {
		if (val < 1024) {
			return val + ' b'
		} else {
			var m = Math.round(((val * 10) / 1024)) / 10;
			if (m > 1024) {
				return (Math.round(((m * 10) / 1024)) / 10) + " MB";
			} else
				return (Math.round(((val * 10) / 1024)) / 10) + " KB";
		}
	},

	formatSize2 : function(val) {
		if (val <= 0) {
			return "";
		}

		if (val < 1024) {
			return val + ' b'
		}

		if (val < 1024 * 1024) {
			return Math.round(val / 1024) + "KB";
		}

		if (val < 1024 * 1024 * 1024) {
			return Math.round(val / 1024 / 1024) + "MB";
		}

		if (val < 1024 * 1024 * 1024 * 1024) {
			return Math.round(val / 1024 / 1024 / 1024) + "GB";
		}

		return Math.round(val / 1024 / 1024 / 1024 / 1024) + "TB";

	},

	getCheckbox : function(str) {

		var temp2 = str.substring(0, (str.indexOf("check")));
		var s = temp2.lastIndexOf('{');
		var temp3 = str.substring(s, str.length - 1);
		var mm = 'checkBox';
		var temp4 = temp3.substring(temp3.lastIndexOf(mm), temp3.length - 1);
		var temp5 = temp4.substring(temp4.indexOf("},{"), temp4.length - 1);
		// var array = [];
		// array = temp3.split(mm);
		// var len = array.length - 1;
		// for (var i = 0; i < len; i++) {
		// temp3 = temp3
		// .substring(temp3.indexOf(mm) + mm.length, temp3.length);
		// }
		//
		// var temp4 = temp3.substring(temp3.indexOf('},{'), temp3.length);
		var temp1 = str.substring(s, (str.length - temp5.length - 2));

		return temp1;
	},
	getComboBox : function(str) {
		var temp1 = str.substring(0, str.indexOf("comboBox"));
		var s = temp1.lastIndexOf("{");
		var temp2 = str.substring(str.indexOf("comboBox"), str.length - 1);
		var e = temp2.indexOf("},{");
		var temp3 = str.substring(s, e + str.indexOf("comboBox") + 1);
		return temp3;
	},
	getEditableComboBox : function(str) {
		var temp1 = str.substring(0, str.indexOf("editableComboBox"));
		var s = temp1.lastIndexOf("{");
		var temp2 = str.substring(str.indexOf("editableComboBox"), str.length
						- 1);
		var e = temp2.indexOf("},{");
		var temp3 = str.substring(s, e + str.indexOf("editableComboBox") + 1);
		return temp3;
	},
	filterBlankinTextField : function() {
		Ext.apply(Ext.form.TextField.prototype, {
					validator : function(text) {
						if (this.allowBlank == false
								&& Ext.util.Format.trim(text).length == 0)
							return false;
						else
							return true;
					}
				});

	},
	overrideDateField : function() {
		// this method is to support chrome and safari for DateMenu, no need any
		// more.
	},
	isNumber : function(value) {
		if (value == null || value == '' || typeof(value) == 'undefined') {
			return false;
		}

		var c = value.charAt(0);
		if (c < '1' || c > '9') {
			return false;
		}

		for (var i = 1; i < value.length; i++) {
			var c = value.charAt(i);
			if (c < '0' || c > '9') {
				return false;
			}
		}

		return true;
	},

	formatTime : function(value) {
		if (value == null || value == '' || typeof(value) == 'undefined') {
			return '';
		};

		var d = new Date();
		d.setTime(value);

		function ChangeTimeToString(DateIn) {
			var Year = 0;
			var Month = 0;
			var Day = 0;
			var Hour = 0;
			var Minute = 0;
			var CurrentDate = "";

			Year = DateIn.getFullYear();
			Month = DateIn.getMonth() + 1;
			Day = DateIn.getDate();
			Hour = DateIn.getHours();
			Minute = DateIn.getMinutes();
			Second = DateIn.getSeconds();

			CurrentDate = Year + "-";
			if (Month >= 10) {
				CurrentDate = CurrentDate + Month + "-";
			} else {
				CurrentDate = CurrentDate + "0" + Month + "-";
			}
			if (Day >= 10) {
				CurrentDate = CurrentDate + Day;
			} else {
				CurrentDate = CurrentDate + "0" + Day;
			}

			if (Hour >= 10) {
				CurrentDate = CurrentDate + " " + Hour;
			} else {
				CurrentDate = CurrentDate + " 0" + Hour;
			}
			if (Minute >= 10) {
				CurrentDate = CurrentDate + ":" + Minute;
			} else {
				CurrentDate = CurrentDate + ":0" + Minute;
			}
			if (Second >= 10) {
				CurrentDate = CurrentDate + ":" + Second;
			} else {
				CurrentDate = CurrentDate + ":0" + Second;
			}

			return CurrentDate;
		}

		return ChangeTimeToString(d);
	},

	formatMillis : function(value) {
		if (value == null || value == "" || typeof value == "undefined") {
			return 0;
		}
		if (value < 1000) {
			return 0 + i18n.unit_sec;
		}
		if (value < 1000 * 60) {
			return Math.round(value / 1000) + i18n.unit_sec;
		}
		if (value < 1000 * 60 * 60) {
			return Math.round(value / 1000 / 60) + i18n.unit_min;
		}

		return Math.round(value / 1000 / 60 / 60) + i18n.unit_hour;
	},
	dataSort : function(arr, type, direction, fn) {
		// var list = new Array(93, 1, 7, 9, 8, 3, 10, 33, 79, 45, 32, 11,
		// 0, 88,
		// 99, 12, 4, 66, 64, 31, 100, 78);
		// document.write(sort(list).valueOf());
		// function sort(arr) {

		return direction == 'ASC'
				? quickSort(arr, 0, arr.length - 1)
				: quickSort(arr, 0, arr.length - 1).reverse();

		function quickSort(arr, l, r) {
			if (l < r) {
				var mid = arr[parseInt((l + r) / 2)], i = l - 1, j = r + 1;
				while (true) {
					if (fn) {
						while (fn(arr[++i], type, direction) < fn(mid, type,
								direction));
						while (fn(arr[--j], type, direction) > fn(mid, type,
								direction));
					} else {
						while (arr[++i][type] < mid[type]);
						while (arr[--j][type] > mid[type]);
					}
					if (i >= j)
						break;
					var temp = arr[i];
					arr[i] = arr[j];
					arr[j] = temp;
				}
				quickSort(arr, l, i - 1);
				quickSort(arr, j + 1, r);
			}
			return arr;
		}
		// }

	},
	getApp : function() {
		// app is a global variable (incomprehensible!), was initialized in
		// desktop.js
		return app;
	},

	hideAll : function() {
		Ext.ux.Util.getApp().getDesktop().getManager().hideAll();
	},

	minmizeActiveWindow : function() {
		Ext.ux.Util.getApp().getDesktop().minmizeActiveWindow();
	},

	minmizeWindow : function(winID) {
		var win = Ext.ux.Util.getWindow(winID);
		if (win) {
			win.minimized = true;
			win.hide();
		}
	},

	createWindow : function(config) {
		if (typeof config.iconCls == 'undefined') {
			config.iconCls = 'icon-grid';
		}

		var desktop = Ext.ux.Util.getApp().getDesktop();
		if (desktop) {
			return desktop.createWindow(config);
		}
		return null;
	},

	getWindow : function(winId) {
		var desktop = Ext.ux.Util.getApp().getDesktop();
		if (desktop) {
			return desktop.getWindow(winId);
		}
		return null;
	},

	closeWindow : function(win) {
		if (win) {
			win.show();
			win.close();
		}
	},

	showWindow : function(winId) {
		var desktop = Ext.ux.Util.getApp().getDesktop();
		var win = desktop.getWindow(winId);
		if (win) {
			win.minimized = false;
			win.show();
		}
	},

	HideAllWin : function() {
		Ext.ux.Util.getApp().getDesktop().getManager().each(function(w) {
					if (w.isVisible())
						w.minimize();
				});
	},

	CascAllWin : function() {
		var xTick = Math.max(1, 20);
		var yTick = Math.max(1, 20);
		var x = xTick;
		var y = yTick;
		Ext.ux.Util.getApp().getDesktop().getManager().each(function(w) {
			if (w.maximized) {
				w.restore();
			}
			// if (w.isVisible()) {
			w.setPosition(x, y);
			x += xTick;
			y += yTick;
			if (!w.isVisible()) {
				w.show();
			}
				// }
			});
	},

	closeAllWin : function() {

		Ext.ux.Util.getApp().getDesktop().getManager().each(function(w) {

					w.close();
				});

	},
	TileAllWin : function() {
		var availWidth = Ext.lib.Dom.getViewWidth();
		var avaiHeight = Ext.lib.Dom.getViewHeight() - 30;
		var x = 1;
		var y = 1;
		var nextY = y;
		var count = 0;
		Ext.ux.Util.getApp().getDesktop().getManager().each(function(w) {
					count++;
				});

		// var t1= Number(availWidth)/Number(avaiHeight);
		// windowHeight=Math.sqrt((Number(availWidth)*Number(avaiHeight))/count/t1);
		// windowWidth=t1*windowHeight;
		//            
		// var ts=windowHeight*windowWidth*count;
		// var ts1=availWidth*avaiHeight;

		var xnumber;
		var ynumber;
		if (availWidth < avaiHeight) {
			xnumber = Math.floor(Math.sqrt(count));
			ynumber = Math.ceil(count / xnumber);
		} else {
			ynumber = Math.floor(Math.sqrt(count));
			xnumber = Math.ceil(count / ynumber);
		}

		var windowHeight = avaiHeight / ynumber - 3;
		var windowWidth = availWidth / xnumber - 3;
		Ext.ux.Util.getApp().getDesktop().getManager().each(function(w) {
			if (w.maximized) {
				w.restore();
			}

			// if (w.isVisible()) {
			w.setHeight(windowHeight);
			w.setWidth(windowWidth);
			var wi = w.el.getWidth();

			if ((x > 1) && (x + wi > availWidth)) {
				x = 1;
				y = nextY;
			}
			w.setPosition(x, y);
			x += wi + 1;
			nextY = Math.max(nextY, y + w.el.getHeight() + 1);

			if (!w.isVisible()) {
				w.show();
			}

				// }
			});
	},

	getFileGrid : function(thisid) {
		// var grid = Ext.getCmp("FileGrid");
		var grid = Ext.getCmp(thisid + "FileGrid");
		return grid;
	},

	trim : function(sInputString, iType) {
		var sTmpStr = " ";
		var i = -1;
		if (iType == 0 || iType == 1) {
			while (sTmpStr == " ") {
				++i;
				sTmpStr = sInputString.substr(i, 1)
			}
			sInputString = sInputString.substring(i)
		}

		if (iType == 0 || iType == 2) {
			sTmpStr = " ";
			i = sInputString.length;
			while (sTmpStr == " ") {
				--i;
				sTmpStr = sInputString.substr(i, 1)
			}
			sInputString = sInputString.substring(0, i + 1)
		}

		return sInputString;
	},
	filterEnter : function(value) {
		var value1 = value.replace(/\n/g, "");
		if (Ext.isIE) {
			value1 = value.replace(/\r\n/g, "");
		}
		return value1;

	},
	filterBlank : function(value) {
		if (value.match(/^\s+$/))
			return null;
		else
			return value;
	},
	filterBr : function(value) {
		return value.replace(/<br>/g, "");
	},
	containEmpty : function(value) {
		if (value == null || value == 'undefined' || value == '') {
			return true;
		}
		for (var i = 0; i < value.length; i++) {
			var c = value.charAt(i);
			if (c == ' ') {
				return true;
			}
		}
		return false;
	},

	getDefaultWidth : function() {
		return parseInt(Ext.lib.Dom.getViewWidth() * 3 / 4);
	},

	getDefaultHeight : function() {
		return parseInt(Ext.lib.Dom.getViewHeight() * 8 / 9);
	},

	isIP : function(ip) {
		var pcount = 0
		var ip_length = ip.length
		var ip_letters = "1234567890."
		for (p = 0; p < ip_length; p++) {
			var ip_char = ip.charAt(p)
			if (ip_letters.indexOf(ip_char) == -1) {
				return false
			}
		}
		for (var u = 0; u < ip_length; u++) {
			(ip.substr(u, 1) == ".") ? pcount++ : pcount
		}
		if (pcount != 3) {
			return false
		}
		firstp = ip.indexOf(".")
		lastp = ip.lastIndexOf(".")
		str1 = ip.substring(0, firstp)
		ipstr_tmp = ip.substring(0, lastp)
		secondp = ipstr_tmp.lastIndexOf(".")
		str2 = ipstr_tmp.substring(firstp + 1, secondp)
		str3 = ipstr_tmp.substring(secondp + 1, lastp)
		str4 = ip.substring(lastp + 1, ip_length)
		if (str1 == '' || str2 == '' || str3 == '' || str4 == '') {
			return false
		}
		if (str1.length > 3 || str2.length > 3 || str3.length > 3
				|| str4.length > 3) {
			return false
		}
		if (str1 <= 0 || str1 > 255) {
			return false
		} else if (str2 < 0 || str2 > 255) {
			return false
		} else if (str3 < 0 || str3 > 255) {
			return false
		} else if (str4 < 0 || str4 > 255) {
			return false
		}
		return true
	},

	isSuperadmin : function() {
		if (userRole == '1') {
			return true;
		}

		return false;
	},
	isSupporter : function() {
		if (userRole == '5') {
			return true;
		}

		return false;
	},

	isDeptAdmin : function() {
		if (userRole == '2') {
			return true;
		}
		return false;
	},
	formatDir : function(path) {
		var tpath = path;
		if (path.length == path.lastIndexOf("/") + 1) {
			tpath = path.substr(0, path.length - 1);
		}
		return tpath;
	},
	URLencode : function(sStr) {
		return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g, '%22')
				.replace(/\'/g, '%27').replace(/\//g, '%2F');
	},
	textDate : function(date) {
		var today = new Date().clearTime(true);
		var year = today.getFullYear();
		var todayTime = today.getTime();
		var yesterday = today.add('d', -1).getTime();
		var tomorrow = today.add('d', 1).getTime();
		var weekDays = today.add('d', 6).getTime();
		var lastWeekDays = today.add('d', -6).getTime();

		if (!date) {
			return '(No Date)';
		}
		var notime = date.clearTime(true).getTime();

		if (notime == todayTime) {
			return 'Today';
		}
		if (notime > todayTime) {
			if (notime == tomorrow) {
				return 'Tomorrow';
			}
			if (notime <= weekDays) {
				return date.format('l');
			}
		} else {
			if (notime == yesterday) {
				return 'Yesterday';
			}
			if (notime >= lastWeekDays) {
				return 'Last ' + date.format('l');
			}
		}
		return date.getFullYear() == year ? date.format('D m/d') : date
				.format('D m/d/Y');

	},

	setCursorLast : function(o) {
		if (typeof o == "string") {
			o = document.getElementById(o);
		}
		if (o == null)
			return;

		if (o.setSelectionRange) { // FF
			// setTimeout(function() {
			// if (o)
			o.setSelectionRange(o.value.length, o.value.length);
			// o.focus();
			// }, 0);
		} else if (o.createTextRange) { // IE
			var textRange = o.createTextRange();
			textRange.moveStart("character", o.value.length);
			textRange.moveEnd("character", 0);
			textRange.select();
		}
	},

	priorityRenderer : function(value) {
		if (value == "H") {
			return i18n.priority_high;
		} else if (value == "M") {
			return i18n.priority_middle;
		} else if (value == "L") {
			return i18n.priority_low;
		}

		return i18n.priority_middle;
	},

	toFixMenuOverAppletBug : function(el, isDom, isDialog) {
		var fid = el.id + '_ifm_ie';

		switch (this.getExplorer()) {
			case "Firefox" :

				if (isDom) {
					var iframe = document.createElement('iframe');
					iframe.className = 'iframe-no-shadow-ff';
					Ext.fly(el.appendChild(iframe));
				} else {
					Ext.fly(el.createChild({
								tag : "iframe",

								cls : 'iframe-no-shadow-ff-win'
							}));
				}

				break;

			case "IE" :

				if (isDialog)
					break;
				if (isDom) {
					var iframe = document.createElement('iframe');
					iframe.className = 'iframe-no-shadow';
					Ext.fly(el.appendChild(iframe));
				} else {
					Ext.fly(el.createChild({
								tag : "iframe",
								id : fid,
								cls : 'iframe-no-shadow-ie'
							}));
				}

				break;

			case "Chrome" :

				if (isDom) {
					var iframe = document.createElement('iframe');
					iframe.className = 'iframe-no-shadow';
					Ext.fly(el.appendChild(iframe));
				} else {
					Ext.fly(el.createChild({
								tag : "iframe",
								cls : 'iframe-no-shadow'
							}));
				}

				break;

			default :

				if (isDom) {
					var iframe = document.createElement('iframe');
					iframe.className = 'iframe-no-shadow-ff';
					Ext.fly(el.appendChild(iframe));
				} else {
					Ext.fly(el.createChild({
								tag : "iframe",
								cls : 'iframe-no-shadow-ff-win'
							}));
				}

				break;

		}

	},
	fixExtBugOfPreventDefaultWithIE : function(e) {
		if (e) {
			e.preventDefault();
		}
		if (typeof event != 'undefined') {
			event.keyCode = 0
			event.returnValue = false
		}
	},
	fixExtBugofChromePagedn : function(openFileWinId) {
		var map = new Ext.KeyMap(openFileWinId, {
					key : Ext.EventObject.PAGEDOWN,
					fn : function(key, e) {

						if (Ext.ux.Util.getExplorer() == 'Chrome') {
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
						}

					},
					scope : this
				});
		map.addBinding({
					key : Ext.EventObject.PAGEUP,
					fn : function(key, e) {

						if (Ext.ux.Util.getExplorer() == 'Chrome') {
							Ext.ux.Util.fixExtBugOfPreventDefaultWithIE(e);
						}

					},
					scope : this
				});

	},

	isAppTecSupporter : function() {
		if (appTecReturnCode != null && appTecReturnCode != '') {
			return true;
		}
		return false;
	}

}
