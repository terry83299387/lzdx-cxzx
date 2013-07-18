var winHTML = function(id,imageNum,title_filemanage){
	return '<dt id="'+id+'"><a href="#" class="a2"><img src="images/icons/'
			+imageNum+'.png" /><div>'
			+ title_filemanage
			+ '</div></a></dt>';
};

var shortCutHTML = function(shortcutCode, softwareName,imageNum){
	return '<dt id="' + shortcutCode.replace(/\s/, "_")
			+ '-win-shortcut"><a href="#" class="a2"><img src="images/icons/'+imageNum+'.png" /><div>'
			+ softwareName + '_' +i18n.shortcut_shortcut
			+ '</div></a></dt>';
};

var putWin = function(winMap,id,winHTML){
	if(winMap.containsKey(id)){
		Ext.Msg.alert(i18n.shortcut_mention, i18n.shortcut_exsit);
		return;
	}
	winMap.add(id,winHTML);
};

var putWinToWin = function(winMap,shortWinMap){
};

var deleteWin = function(winMap,id){
	if(winMap.containsKey(id)){
		winMap.removeKey(id);
	}
};

var getWinHTML = function(winMap, id){
	return winMap.get(id);
};

var wholeHTML = function(winMap){
	var wholeHTML="";
	
	var windowheight=Ext.lib.Dom.getViewHeight();
	var k = Math.floor((windowheight-80)/90);
	var i=0;
	winMap.each(function(winHTML){
		if((i%k)==0)
			wholeHTML+='<div class="float_left" >';
		wholeHTML+=winHTML;
		if(((i+1)%k)==0 || (i+1)==winMap.length)
			wholeHTML+='</div>';
			
		i=i+1;
	});
	return wholeHTML;
};


var mngHTML = function(id, name, img) {
	return '<dt id=' + id + '><a href="#" class="a2"><img src="images/Menus/'
			+ img + '.gif" /><div><font style="FONT-FAMILY: Microsoft Yahei">'
			+ name + '</font></div> </a></dt>';
}
var putMng = function(mngMap, id, mngHTML) {
	if (mngMap.containsKey(id)) {
		//Ext.Msg.alert(i18n.shortcut_mention, i18n.shortcut_exsit);
		return;
	}
	mngMap.add(id, mngHTML);
};

var getMngHTML = function(mngMap, id) {
	return mngMap.get(id);
};

var wholeMngHTML = function(mngMap) {
	var wholeHTML = "";

	var windowheight = Ext.lib.Dom.getViewHeight();
	var k = Math.floor((windowheight - 80) / 80);
	var i = 0;
	mngMap.each(function(mngHTML) {
				if ((i % k) == 0)
					wholeHTML += '<div class="float_left" >';
				wholeHTML += mngHTML;
				if (((i + 1) % k) == 0 || (i + 1) == mngMap.length)
					wholeHTML += '</div>';

				i = i + 1;
			});
	return wholeHTML;
};
