// 添加Cookie
function addCookie(name, value, expireHours) {
	var cookieString = name + "=" + escape(value);
	//判断是否设置过期时间
	if(expireHours > 0) {
		var date = new Date();
		date.setTime(date.getTime() + expireHours * 3600 * 1000);
		cookieString = cookieString + "; expires=" + date.toGMTString();
	}
	document.cookie = cookieString;
}
//获取指定name的Cookie值
function getCookie(name) {
	var strCookie = document.cookie;
	var arrCookie = strCookie.split("; ");
	for(var i=0; i<arrCookie.length; i++) {
		var arr = arrCookie[i].split("=");
		if(arr[0] == name) return unescape(arr[1]);
	}
	return null;
}
//删除指定名称的Cookie,cookie对象过期会自动删除
function deleteCookie(name) {
	var date = new Date();
	date.setTime(date.getTime() - 10000);
	var cval = getCookie(name);
	document.cookie = name + "=v; expire=" + date.toGMTString();
}
