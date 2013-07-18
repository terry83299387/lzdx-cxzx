Ext.namespace("Ext.sccportal");
Ext.namespace("Ext.sccportal.template");

Ext.Ajax.on('requestcomplete',checkUserSessionStatus, this);   
function checkUserSessionStatus(conn,response,options){   
	
	// not login
    if(response.responseText == 'login:false'){   
		window.location.href= "/scc/index.jsp";   
    }   
}  

Array.prototype.remove = function(dx){
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i]
        }
    }
    this.length -= 1
}

Array.prototype.index = function(value){
    if (!this || this.length == 0) {
        return -1;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] == value) {
            return i;
        }
    }
	
	return -1;
}

