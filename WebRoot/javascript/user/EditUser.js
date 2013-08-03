/**
 */
Ext.Desktop.EditUser = function(grid, record) {
	var scope = this;

    var formPanel = new Ext.form.FormPanel({
        items: [{
            xtype: 'fieldset',
            title: '�û���Ϣ',
            autoHeight: true,
            defaultType: 'textfield',
            labelAlign: 'center',
            labelWidth: 100,
            items: [{
                fieldLabel: '�û���',
                name: 'userName',
                width: 200,
                value : record.get("userName"),
                disabled : true
            }, {
                fieldLabel: '����',
                name: 'password',
                inputType: "password",
                width: 200,
                value : record.get("password")
            }, {
                fieldLabel: 'ȷ������',
                name: 'confirmPwd',
                inputType: "password",
                width: 200,
                value : record.get("password")
            }, {
                fieldLabel: '�û�����',
                name: 'role',
                xtype: "combo",
                store: new Ext.data.SimpleStore({
                    fields: ['text', 'value'],
                    data: (currentUser.role == "0"
                    	? [["����Ա" , "1"], ["��ͨ�û�", "2"]]
                    	: [["��ͨ�û�", "2"]])
                }),
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                value : record.get("role"),
                readOnly: true,
                triggerAction: 'all',
                width: 200
            }, {
                fieldLabel: '�û�״̬',
                name: 'status',
                xtype: "combo",
                store: new Ext.data.SimpleStore({
                    fields: ['text', 'value'],
                    data: [["����" , "1"], ["����", "0"]]
                }),
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                value : record.get("status"),
                readOnly: true,
                triggerAction: 'all',
                width: 200
            }, {
                fieldLabel: '��ʵ����',
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
            text: 'ȷ��',
            handler: function() {
            	editUser();
            }
        }, {
            text: 'ȡ��',
            handler: function() {
            	scope.close();
            }
        }]
    });

	var desktop = app.getDesktop();
	var win = desktop.createWindow({
        id: 'edit-user-win',
        title: '�༭�û�',
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
			Ext.Msg.alert('Error', '��ĸ�����ֺ��»���');
            return;
		}

        // check password
		if (password == "") {
			Ext.Msg.alert('Error', 'password is empty');
            return;
		}
		var pwdPattern = /^[a-zA-Z0-9!@#$%^&*()_+=\-[\];:'",<.>\/?~`\\|]+$/;
		if (!pwdPattern.test(password)) {
			Ext.Msg.alert('Error', '��ĸ�����ֺ��������');
            return;
		}
		if (password != confirmPwd) {
			Ext.Msg.alert('Error', '�������벻һ��');
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
                    Ext.Msg.alert('����', responseText.exception);
                } else {
                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: 18
                        }
                    });
//                    Ext.Msg.alert('�ɹ�', '�û��޸ĳɹ�');
                    scope.close();
                }
            },
            failure: function(resp, opts){
                var exception = resp.statusText;
                Ext.Msg.alert('����', exception);
            }
        });
    }
};
