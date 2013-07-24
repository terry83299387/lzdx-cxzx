
function txtAllSelect(textareaid) {
	if (Ext.get(textareaid) != null) {
		document.getElementById(textareaid).select();
	}

}

function txtCopy(textareaid) {

	if (Ext.get(textareaid) != null)
		copyToClipboard(textareaid, showSelectTextarea(textareaid));

}
function txtCut(textareaid) {
	if (Ext.get(textareaid) != null) {
		txtCopy(textareaid);
		txtDel(textareaid);
	}

}
function txtPaste(textareaid) {
	if (Ext.get(textareaid) != null) {
		// var e=document.getElementById(textareaid);
		var content = getClipboard();
		if (content != null) {
			insertTxt(textareaid, content);

		}
	}

}
function txtCount(textareaid) {
	// var txt= showSelectTextarea();
	// var e;
	// e=document.getElementById('myimg');

	if (Ext.get(textareaid) != null) {
		var e = document.getElementById(textareaid);
		alert(e.value.length);
		e.focus();
	}
}

function txtDel(textareaid) {
	if (Ext.get(textareaid) != null) {
		var e = document.getElementById(textareaid);
		var r = getStartEnd(textareaid);
		var _value = e.value.replace(/\r\n/g,'\n');
		e.value = _value.substring(0, r.start)
				+ _value.substring(r.end, _value.length);
		locatePoint(textareaid, r.start, r.start);
	}

}

function insertTxt(textareaid, str) {
	var obj = document.getElementById(textareaid);
	if (document.selection) {
		obj.focus();
		var sel = document.selection.createRange();

		// document.selection.empty();
		sel.text = str;

	} else {
		var prefix, main, suffix;
		var start = obj.selectionStart;
		prefix = obj.value.substring(0, obj.selectionStart);
		main = obj.value.substring(obj.selectionStart, obj.selectionEnd);
		suffix = obj.value.substring(obj.selectionEnd);
		obj.value = prefix + str + suffix;

		locatePoint(textareaid, start + str.length, start + str.length);
	}
	obj.focus();
}

function locatePoint(textareaid, _x1, _x2) {
	var tea = document.getElementById(textareaid);
	if (tea.setSelectionRange) {
		setTimeout(function() {
					tea.setSelectionRange(_x1, _x2); // locate cursor 
					tea.focus();
				}, 0);
	} else if (tea.createTextRange) {
		var str = tea.value.substring(0, _x1);
//		var re = new RegExp("[\\r]", "g");// 过滤掉换行符,不然你的文字会有问题,会比你的文字实际长度要长一些.搞死我了.我说我得到的数字怎么总比我的实际长度要长.
//		str = str.replace(re, "");// 过滤
//		str=str.replace(/\r\n/g,'\n');
		var str2 = tea.value.substring(0, _x2);
//		str2 = str2.replace(re, "");// 过滤
//		str2=str2.replace(/\r\n/g,'\n');
		var txt = tea.createTextRange();
		_x1 = str.length;
		_x2 = str2.length;
		// txt.moveEnd("character",0-txt.text.length);
		txt.moveStart('character', _x1);
		txt.collapse(true);
		txt.moveEnd("character", _x2 - _x1);
		txt.select();
		tea.focus();
	}
}

// 获取光标所在文本域的位置
function getCaretForTextArea(textareaid) {
	var txb = document.getElementById(textareaid);// 根据ID获得对象
	var pos = 0;// 设置初始位置
	var sellength = 0;
	var start = 0;
	txb.focus();// 输入框获得焦点,这句也不能少,不然后面会出错,血的教训啦.
	var s = txb.scrollTop;// 获得滚动条的位置
	var r = document.selection.createRange();// 创建文档选择对象
	var t = txb.createTextRange();// 创建输入框文本对象
	sellength = r.text.length;
	t.collapse(true);// 将光标移到头
	t.select();// 显示光标,这个不能少,不然的话,光标没有移到头.当时我不知道,搞了十几分钟
	var j = document.selection.createRange();// 为新的光标位置创建文档选择对象
	r.setEndPoint("StartToStart", j);// 在以前的文档选择对象和新的对象之间创建对象,妈的,不好解释,我表达能力不算太好.有兴趣自己去看msdn的资料
	var str = r.text;// 获得对象的文本
	// var re = new
	// RegExp("[\\r]","g");
	// str = str.replace(re,"");
	str=str.replace(/\r\n/g,'\n');//must do it in compatibility with IE(IE enter'operator needs 2 length while ff just 1)
	pos = str.length;// 获得长度.也就是光标的位置
	// alert(pos);
	r.collapse(false);
	r.select();// 把光标恢复到以前的位置
	txb.scrollTop = s;// 把滚动条恢复到以前的位置
	start = pos - sellength;
//		alert(start+' '+pos);
	return {
		start : start,
		end : pos
	};
}

function getStartEnd(textareaid) {
	var start = 0;
	var end = 0;
	var selectedText;
	var e = document.getElementById(textareaid);
	// ie利用Range，这个和非文本框的是一样的!
	if (document.selection ) {
		// var range=document.selection.createRange();
		// var txtlength=range.text.length;

		// range.moveStart('character', -e.value.length);
		// range.setEndPoint("StartToStart",textbox.createTextRange()) ;
		// range.select();
		var r = getCaretForTextArea(textareaid);
		start = r.start;
		end = r.end;
		// end = start+txtlength;
		// alert('txtlength'+txtlength);
	}
	// ff、chrome，用getSelection
	else if (e.selectionStart != undefined && e.selectionEnd != undefined) {
		start = e.selectionStart;
		end = e.selectionEnd;

	}
	return {
		start : start,
		end : end
	};

}

function showSelectTextarea(textareaid) {
	var selectedText;
	var e;
	e = document.getElementById(textareaid);
	// ie利用Range，这个和非文本框的是一样的!
	if (document.selection && (document.selection.type == "Text")) {
		selectedText = document.selection.createRange().text;
	}
	// ff、chrome，用getSelection
	else if (e.selectionStart != undefined && e.selectionEnd != undefined) {
		var start = e.selectionStart;
		var end = e.selectionEnd;
		selectedText = e.value.substring(start, end);
	}
	return selectedText;
}

function copyToClipboard(textareaid, txt) {
	if (window.clipboardData) {
//		window.clipboardData.clearData();
		window.clipboardData.setData("Text", txt);
	} else if (navigator.userAgent.indexOf("Opera") != -1) {
		window.location = txt;
	} else if (window.netscape) {
		var e = document.getElementById(textareaid);
		var start = e.selectionStart;
		var end = e.selectionEnd;
		locatePoint(textareaid, start, end);
		try {
			netscape.security.PrivilegeManager
					.enablePrivilege("UniversalXPConnect");
		} catch (e) {
			alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
		}
		var clip = Components.classes['@mozilla.org/widget/clipboard;1']
				.createInstance(Components.interfaces.nsIClipboard);
		if (!clip)
			return;
		var trans = Components.classes['@mozilla.org/widget/transferable;1']
				.createInstance(Components.interfaces.nsITransferable);
		if (!trans)
			return;
		trans.addDataFlavor('text/unicode');
		var str = new Object();
		var len = new Object();
		var str = Components.classes["@mozilla.org/supports-string;1"]
				.createInstance(Components.interfaces.nsISupportsString);
		var copytext = txt;
		str.data = copytext;
		trans.setTransferData("text/unicode", str, copytext.length * 2);
		var clipid = Components.interfaces.nsIClipboard;
		if (!clip)
			return false;
		clip.setData(trans, null, clipid.kGlobalClipboard);

	}
	else
	{
		  alert('For security limitation,please press "ctrl+c" or "ctrl+x" instead');
	}
}

function getClipboard() {
	if (window.clipboardData) {
		return (window.clipboardData.getData('text'));
	} else {
		if (window.netscape) {
			try {
				netscape.security.PrivilegeManager
						.enablePrivilege("UniversalXPConnect");
				var clip = Components.classes["@mozilla.org/widget/clipboard;1"]
						.createInstance(Components.interfaces.nsIClipboard);
				if (!clip) {
					return;
				}
				var trans = Components.classes["@mozilla.org/widget/transferable;1"]
						.createInstance(Components.interfaces.nsITransferable);
				if (!trans) {
					return;
				}
				trans.addDataFlavor("text/unicode");
				clip.getData(trans, clip.kGlobalClipboard);
				var str = new Object();
				var len = new Object();
				trans.getTransferData("text/unicode", str, len);
			} catch (e) {
				alert("您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试，相对路径为firefox根目录/greprefs/all.js");
				return null;
			}
			if (str) {
				if (Components.interfaces.nsISupportsWString) {
					str = str.value
							.QueryInterface(Components.interfaces.nsISupportsWString);
				} else {
					if (Components.interfaces.nsISupportsString) {
						str = str.value
								.QueryInterface(Components.interfaces.nsISupportsString);
					} else {
						str = null;
					}
				}
			}
			if (str) {
				return (str.data.substring(0, len.value / 2));
			}
		}
		else
		{
		  alert('For security limitation,please press "ctrl+v" instead');
		}
	}
	return null;
}

function setCursorAtTxt(o,start,txtlength)
{
   if (typeof o == "string") {
			o = document.getElementById(o);
		}
		if (o == null) return;
		var  movestart=o.value.length;
		var  moveend=movestart;
		
		if(start>=0&&start<movestart)
		{
		  movestart=start;
		}
		else
		{
		   movestart=o.value.length;
		}
		if(txtlength>0)
		{
		  moveend=movestart+txtlength;
		}
		if (o.setSelectionRange) { // FF
					o.setSelectionRange(movestart, moveend);
					o.focus(); 
		} else if (o.createTextRange) { // IE
			
			var textRange = o.createTextRange();
			textRange.moveStart( "character", 0) 
			textRange.moveEnd( "character", 0);
			textRange.collapse( true); // move cursor to start position 
			textRange.moveEnd( "character", moveend); 
			textRange.moveStart( "character", movestart); 
			textRange.select();
		}
	
	
}
