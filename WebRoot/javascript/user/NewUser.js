/**
 */
Ext.Desktop.NewUser = function(grid) {
	var scope = this;
    
    var formPanel = new Ext.form.FormPanel({
        items: [{
            xtype: 'fieldset',
            title: i18n.user_userinfo,
            autoHeight: true,
            defaultType: 'textfield',
            labelAlign: 'center',
            labelWidth: 100,
            items: [{
                fieldLabel: i18n.user_usertype,
                name: 'role',
                xtype: "combo",
                store: new Ext.data.SimpleStore({
                    fields: ['text', 'value'],
                    data: (currentUser.role == "0"
                    	? [[i18n.user_admin , "1"], [i18n.user_commonuser, "2"]]
                    	: [[i18n.user_commonuser, "2"]])
                }),
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                value : (currentUser.role == 0 ? "1" : "2"),
                readOnly: true,
                triggerAction: 'all',
                width: 200
            }, {
                fieldLabel: i18n.user_username,
                name: 'userName',
                width: 200
            }, {
                fieldLabel: i18n.user_password,
                name: 'password',
                inputType: "password",
                width: 200
            }, {
                fieldLabel: i18n.user_confirmpassword,
                name: 'confirmPwd',
                inputType: "password",
                width: 200
            }, {
                fieldLabel: i18n.user_realname,
                name: 'realName',
                width: 200
            }, {
                fieldLabel: 'email',
                name: 'email',
                width: 200
			}]
        }],
        buttons: [{
            text: i18n.user_add,
            handler: function() {
            	newUser();
            }
        }, {
            text: i18n.user_cancel,
            handler: function() {
            	scope.close();
            }
        }]
    });

	var desktop = app.getDesktop();
	var win = desktop.createWindow({
        id: 'new-user-win',
        title: i18n.user_adduser,
		width : 380,
		height : 280,
        iconCls: 'user',
        shim: false,
        animCollapse: true,
        constrainHeader: true,
        layout: 'fit',
        items: formPanel
    });

	this.show = function() {
		this.reset();
		win.show();
	}

	this.close = function() {
		win.close();
	}

	this.reset = function() {
        var form = formPanel.getForm();

        form.findField('userName').setValue("");
        form.findField('password').setValue("");
        form.findField('confirmPwd').setValue("");
        form.findField('realName').setValue("");
        form.findField('email').setValue("");
	}

	var newUser = function() {
        var form = formPanel.getForm();

        var userName = form.findField('userName').getValue();
        var password = form.findField('password').getValue();
        var confirmPwd = form.findField('confirmPwd').getValue();
        var realName = form.findField('realName').getValue();
        var role = form.findField('role').getValue();
        var email = form.findField('email').getValue();

        // check userName
		if (userName == "") {
			Ext.Msg.alert(i18n.user_error, i18n.user_useremptyerror);
            return;
		}
		var userNamePattern = /^[a-zA-Z0-9_]+$/;
		if (!userNamePattern.test(userName)) {
			Ext.Msg.alert(i18n.user_error, i18n.user_userformaterror);
            return;
		}

        // check password
		if (password == "") {
			Ext.Msg.alert(i18n.user_error, i18n.user_passwordemptyerror);
            return;
		}
		var pwdPattern = /^[a-zA-Z0-9!@#$%^&*()_+=\-[\];:'",<.>\/?~`\\|]+$/;
		if (!pwdPattern.test(password)) {
			Ext.Msg.alert(i18n.user_error, i18n.user_userformaterror);
            return;
		}
		if (password != confirmPwd) {
			Ext.Msg.alert(i18n.user_error, i18n.user_passwordinconsistent);
            return;
		}

        Ext.Ajax.request({
            url: 'newUser.action',
            params: {
            	userName: userName,
            	password: password,
            	realName : realName,
            	role : role,
            	email : email
            },
            success: function(resp, opts) {
                var responseText = Ext.util.JSON.decode(resp.responseText);
                if (responseText.exception) {
                    Ext.Msg.alert(i18n.user_error, responseText.exception);
                } else {
                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: 18
                        }
                    });
                    scope.close();
                }
            },
            failure: function(resp, opts){
                var exception = resp.statusText;
                Ext.Msg.alert(i18n.user_error, exception);
            }
        });
    }
};
