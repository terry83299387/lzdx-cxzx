Ext.sccportal.Applet = function(parameter) {

	this.parameter = null;
	this.applet = null;
	this.openerWin = null;
	this.width = Ext.ux.Util.getDefaultWidth() - 10; // orignal width
	this.height = Ext.ux.Util.getDefaultHeight() - 35; // orignal height
	this.parameter = parameter;

	if (window.location.hostname == 'localhost') {
		this.parameter.port = '21';
	} else {
		this.parameter.host = window.location.hostname; // portal server is NAT
		// server
	}

	this.startApplet();
}

Ext.sccportal.Applet.prototype = {

	startApplet : function() {

		var params = this.parameter;
		var module = params['module'];

		if (typeof module == 'undefined') {
			module = 'file';
		}
		var id = '';
		var appletName = i18n.fileApplet;

		// if(!canAppletExist(module)){
		// Ext.Msg.show({
		// title: i18n.cmdMention,
		// msg: i18n.Appletcaution
		// });
		// Ext.Msg.alert( i18n.cmdMention, i18n.Filecaution);

		// }else{
		if (module == 'job') {
			var htmlContent = [
					'<applet id="ftpApplet" name="FtpTransferWindow" height="'
							+ this.height
							+ '" width="'
							+ this.width
							+ '" style="left:0px,top:0px,border:1px solid #ccc;"',
					'code="cn.net.ssc.ftp.client.applet.FtpClientApplet" codebase="./archive" ',
					'archive="ftptransfer.jar,commons-net-ftp-3.0.jar,jsch-0.1.43.jar" >',
					'</applet>'];
			// id = 'jobTransfer';
			id = 'appletTransfer';
			// appletName= i18n.jobApplet;
		} else {
			var htmlContent = [
					'<applet id="ftpApplet" name="FtpTransferWindow" height="'
							+ this.height
							+ '" width="'
							+ this.width
							+ '" style="left:0px,top:0px,border:1px solid #ccc;"',
					'code="cn.net.ssc.ftp.client.applet.FtpClientApplet" codebase="./archive" ',
					'archive="ftptransfer.jar,commons-net-ftp-3.0.jar,jsch-0.1.43.jar" >',
					'</applet>'];
			id = 'appletTransfer';
			// appletName= i18n.fileApplet;
		}

		// id is uesd for judging whether is the same openerwin
		var openerWin = Ext.ux.Util.getWindow(id);

		// Open this.openerWin once
		// for upload and download items can work well as before

		var serverclass = (params['fileTransferProtocol'] == undefined
				? "Ftp"
				: params['fileTransferProtocol'])
				+ "Tool";
		params["serverclass"] = serverclass;
		params["language"] = language;

		if (typeof openerWin == 'undefined') {

			if (params != null && typeof params == "object") {
				var len = htmlContent.length, ary = htmlContent.slice(0, len
								- 1), last = htmlContent[len - 1];
				var name;
				for (name in params) {
					ary.push('<param name="' + name + '" value="'
							+ params[name] + '" id="' + name + '" />');
				}
				if (id == 'appletTransfer') {

					ary.push('<param name="serverclass" value="' + serverclass
							+ '" id="fileTransferProtocol" />');
					ary.push('<param name="language" value="' + language
							+ '" id="language" />');

				}
				ary.push(last);
				htmlContent = ary;
			}
			openerWin = Ext.ux.Util.createWindow({
						id : id,
						title : appletName,
						width : this.width + 10,
						height : this.height + 35,
						plain : true,
						closable : true,
						resizable : true,
						html : htmlContent
					});

			if (module == "file")
				openerWin.setTitle(appletName + "<font color = 'red'> ("
						+ i18n.appletTransferTitleFresh + ")</font>");

			this.openerWin = openerWin;
			// keep the applet's size is resizable to the window
			openerWin.on("resize", function() {
				document.getElementById("ftpApplet").height = this.el.dom.clientHeight
						- 35;
				document.getElementById("ftpApplet").width = this.el.dom.clientWidth
						- 10;
			});

			openerWin.on("close", function() {
				// 从文件列表中得到刷新
				// try
				// {
				// if(module=='file'){
				// var fileWin = Ext.getCmp('FileGrid');
				// if (fileWin) {
				// fileWin.getStore().reload({
				// params : {
				// filepath : params['home'],
				// start : 0,
				// limit : 50
				// }
				// });
				// }
				//						
				//						
				// var jobFileGrid = Ext.getCmp('fileInWorkDirGrid');
				// if (jobFileGrid) {
				// jobFileGrid.getStore().reload();
				// }
				// }
				// }
				// catch (e) {
				// alert("set FileGrid failed. " + e);
				// }

				fileSupport.updateAllCache();

				IAmDead(module);
				AppletUtil.destroyApplet(document.getElementById("ftpApplet"));
					// document.applets[0].destroyjs();
					// document.applets[0].startFtpPool();
				});

			IAmAlive(module);

		}

		// Make sure that the applet's size is resizable to the window
		document.getElementById("ftpApplet").height = openerWin.el.dom.clientHeight
				- 35;
		document.getElementById("ftpApplet").width = openerWin.el.dom.clientWidth
				- 10;

		openerWin.show(this);

		this.openerWin = openerWin;
		// start applet
		this.applet = document.getElementById("ftpApplet");
		this.applet.clearParameters();
		var name;
		if (params != null && typeof params == "object") {
			for (name in params) {
				try {
					this.applet.setParameter(name, params[name]);
				} catch (e) {
					alert("set parameter failed. " + e);
				}
			}
		}

		try {
			this.applet.finishSetParameter();
			if (module == 'job') {
				// document.applets[0].startTransfer();
				this.applet.directTransfer("upload", params['files'],
						params['home']);
			} else
				this.applet.startTransfer();
		} catch (e) {
			alert("start transfer failed. " + e);
		}

		// }
	},

	getFlag : function(serverName, mfiles, workdir) {
		if (typeof this.openerWin == 'undefined'
				|| typeof this.applet == 'undefined') {
			return 'exception_terminate';
		}

		var percent
		try {
			percent = this.applet.getTaskPercentage(serverName,
					"upload", mfiles, workdir);
		} catch (e) {

			return 'transfer_file_failed'
		}

		if (percent == '100' || percent == 'mk_workingdir_failed'
				|| percent == 'transfer_file_failed') {
			// this.applet = null;
			this.openerWin.minimize();
			// this.openerWin = null;
		}
		return percent;
	},

	closeApplet : function() {
		// this.applet = null;
		// if (this.openerWin != null) {
		// this.openerWin.close();
		// this.openerWin = null;
		// }
	}
}

var AppletUtil = {

	destroyApplet : function(applet) {
		try {
			if (applet != null) {
				applet.destroyjs();
			} else {
				var applets = document.applets;
				if (applets) {
					for (var i = 0; i < applets.length; i++) {
						applets[i].destroyjs();
					}

				}
			}
		} catch (ex) {
		}
	}

}