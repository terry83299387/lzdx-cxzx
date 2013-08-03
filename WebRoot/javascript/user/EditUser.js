/**
 */
Ext.Desktop.EditUser = function(grid, record) {
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
                fieldLabel: '用户名',
                name: 'userName',
                width: 200,
                value : record.get("userName"),
                disabled : true
            }, {
                fieldLabel: '密码',
                name: 'password',
                inputType: "password",
                width: 200,
                value : record.get("password")
            }, {
                fieldLabel: '确认密码',
                name: 'confirmPwd',
                inputType: "password",
                width: 200,
                value : record.get("password")
            }, {
                fieldLabel: '用户类型',
                name: 'role',
                xtype: "combo",
                store: new Ext.data.SimpleStore({
                    fields: ['text', 'value'],
                    data: (currentUser.role == "0"
                    	? [["管理员" , "1"], ["普通用户", "2"]]
                    	: [["普通用户", "2"]])
                }),
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                value : record.get("role"),
                readOnly: true,
                triggerAction: 'all',
                width: 200
            }, {
                fieldLabel: '用户状态',
                name: 'status',
                xtype: "combo",
                store: new Ext.data.SimpleStore({
                    fields: ['text', 'value'],
                    data: [["正常" , "1"], ["禁用", "0"]]
                }),
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                value : record.get("status"),
                readOnly: true,
                triggerAction: 'all',
                width: 200
            }, {
                fieldLabel: '真实姓名',
                name: 'realName',
                width: 200,
                value : record.get("realName")
            }, {
                fieldLabel: 'email',
                name: 'email',
                width: 200,
                value : record.get("email")
			}]
        }],
        buttons: [{
            text: '确定',
            handler: function() {
            	editUser();
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
        id: 'edit-user-win',
        title: '编辑用户',
		width : 380,
		height : 310,
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

        form.findField('userName').setValue(record.get("userName"));
        form.findField('password').setValue(record.get("password"));
        form.findField('confirmPwd').setValue(record.get("password"));
        form.findField('role').setValue(record.get("role"));
        form.findField('status').setValue(record.get("status"));
        form.findField('realName').setValue(record.get("realName"));
        form.findField('email').setValue(record.get("email"));
	}

	var editUser = function() {
        var form = formPanel.getForm();

        var userName = form.findField('userName').getValue();
        var password = form.findField('password').getValue();
        var confirmPwd = form.findField('confirmPwd').getValue();
        var realName = form.findField('realName').getValue();
        var role = form.findField('role').getValue();
        var status = form.findField('status').getValue();
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
            url: 'editUser.action',
            params: {
            	userCode : record.get("userCode"),
            	userName : userName,
            	password : password,
            	realName : realName,
            	role : role,
            	status : status,
            	email : email
            },
            success: function(resp, opts) {
                var responseText = Ext.util.JSON.decode(resp.responseText);
                if (responseText.exception) {
                    Ext.Msg.alert('错误', responseText.exception);
                } else {
                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: 18
                        }
                    });
//                    Ext.Msg.alert('成功', '用户修改成功');
                    scope.close();
                }
            },
            failure: function(resp, opts){
                var exception = resp.statusText;
                Ext.Msg.alert('错误', exception);
            }
        });
    }
};
