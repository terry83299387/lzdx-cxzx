/**
 */
Ext.Desktop.NewUser = function(grid) {
	var scope = this;
    
    var formPanel = new Ext.form.FormPanel({
        items: [{
            xtype: 'fieldset',
            title: '用户信息',
            autoHeight: true,
            defaultType: 'textfield',
            labelAlign: 'center',
            labelWidth: 100,
            items: [{
                fieldLabel: '用户类型',
                name: 'role',
                xtype: "combo",
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['text', 'value'],
                    data: [["admin" , "1"], ["common user", "2"]]
                }),
                displayField: 'text',
                valueField: 'value',
                value : "1",
                readOnly: true,
                triggerAction: 'all',
                width: 200
            }, {
                fieldLabel: '用户名',
                name: 'userName',
                width: 200
            }, {
                fieldLabel: '密码',
                name: 'password',
                inputType: "password",
                width: 200
            }, {
                fieldLabel: '确认密码',
                name: 'confirmPwd',
                inputType: "password",
                width: 200
            }, {
                fieldLabel: '真实姓名',
                name: 'realName',
                width: 200
            }, {
                fieldLabel: 'email',
                name: 'email',
                width: 200
			}]
        }],
        buttons: [{
            text: '添加',
            handler: function() {
            	newUser();
            }
        }, {
            text: '取消',
            handler: function() {
            	scope.close();
            }
        }]
    });

	var desktop = app.getDesktop();
	var win = desktop.createWindow({
        id: 'new-user-win',
        title: '添加新用户',
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
		this.clear();
		win.show();
	}

	this.close = function() {
		win.close();
	}

	this.clear = function() {
        var form = formPanel.getForm();

        form.findField('userName').setValue("");
        form.findField('password').setValue("");
        form.findField('confirmPwd').setValue("");
        form.findField('realName').setValue("");
        form.findField('role').setValue("1");
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
			Ext.Msg.alert('Error', 'userName is empty');
            return;
		}
		var userNamePattern = /^[a-zA-Z0-9_]+$/;
		if (!userNamePattern.test(userName)) {
			Ext.Msg.alert('Error', '字母、数字和下划线');
            return;
		}

        // check password
		if (password == "") {
			Ext.Msg.alert('Error', 'password is empty');
            return;
		}
		var pwdPattern = /^[a-zA-Z0-9!@#$%^&*()_+=\-[\];:'",<.>\/?~`\\|]+$/;
		if (!pwdPattern.test(password)) {
			Ext.Msg.alert('Error', '字母、数字和特殊符号');
            return;
		}
		if (password != confirmPwd) {
			Ext.Msg.alert('Error', '两次密码不一致');
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
                    Ext.Msg.alert('Failure', 'Info:' + responseText.exception);
                } else {
                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: 18
                        }
                    });
                    Ext.Msg.alert('Succeed', '用户添加成功');
                    scope.close();
                }
            },
            failure: function(resp, opts){
                var exception = resp.statusText;
                Ext.Msg.alert('Failure', 'Info:' + exception);
            }
        });
    }
};
