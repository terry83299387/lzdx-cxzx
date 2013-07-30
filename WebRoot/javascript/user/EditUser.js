/**
 */
Ext.scc.EditAccountUser = function(grid, record) {
    this.grid = grid;
    this.record = record;

    this.formPanel = new Ext.form.FormPanel({
        items: [{
            xtype: 'fieldset',
            title: '用户信息',
            autoHeight: true,
            defaultType: 'textfield',
            labelAlign: 'center',
            items: [{
                fieldLabel: '用户名',
                name: 'userName',
                value : record.get("userName"),
                width: 200
            }, {
                fieldLabel: '修改密码',
                name: 'password',
                inputType: "password",
                value : record.get("password"),
                width: 200
            }, {
                fieldLabel: '确认密码',
                name: 'confirmPwd',
                inputType: "password",
                value : record.get("password"),
                width: 200
            }, {
                fieldLabel: '状态',
                xtype: "combo",
                name: 'status',
                store: new Ext.data.SimpleStore({
                    fields: ['text', 'value'],
                    data: [["启用" , "0"], ["禁用", "1"]]
                }),
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                value : record.get("status"),
                readOnly: true,
                triggerAction: 'all',
                width: 200
            }, {
                fieldLabel: '公司名称',
                name: 'companyName',
                value : record.get("companyName"),
                width: 200
            }, {
                fieldLabel: '公司类型',
                name: 'companyType',
                value : record.get("companyType"),
                width: 200
            }, {
                fieldLabel: '公司电话',
                name: 'officeTel',
                value : record.get("officeTel"),
                width: 200
            }, {
                fieldLabel: '公司地址',
                name: 'companyAddress',
                value : record.get("companyAddress"),
                width: 200
            }, {
                fieldLabel: '公司邮编',
                name: 'postcode',
                value : record.get("postcode"),
                width: 200
            }, {
                fieldLabel: '传真',
                name: 'fax',
                value : record.get("fax"),
                width: 200
            }, {
                fieldLabel: 'email',
                name: 'email',
                value : record.get("email"),
                width: 200
			}]
        }],
        buttons: [{
            text: '确定',
            handler: this.editAccountUser.createDelegate(this)
        }, {
            text: '取消',
            handler: this.close.createDelegate(this)
        }]
    });
    
    Ext.scc.EditAccountUser.superclass.constructor.call(this, {
        title: '修改用户',
        layout: 'fit',
        width: 380,
        height: 460,
        closeAction: 'hide',
        plain: true,
        constrain: true,
        modal: true,
        layout: 'fit',
        items: [this.formPanel]
    });
};

Ext.extend(Ext.scc.EditAccountUser, Ext.Window, {
    init: function() {
    },
    
    editAccountUser: function() {
    	var scope = this;
        var grid = this.grid;
        var formPanel = this.formPanel;
        var form = formPanel.getForm();

        var userName = form.findField('userName').getValue();
        var password = form.findField('password').getValue();
        var confirmPwd = form.findField('confirmPwd').getValue();
        var status = form.findField('status').getValue();
        var companyName = form.findField('companyName').getValue();
        var companyType = form.findField('companyType').getValue();
        var officeTel = form.findField('officeTel').getValue();
        var companyAddress = form.findField('companyAddress').getValue();
        var postcode = form.findField('postcode').getValue();
        var fax = form.findField('fax').getValue();
        var email = form.findField('email').getValue();

        // 检查用户名格式是否正确
		if (userName == "") {
			Ext.Msg.alert('错误', '用户名不能为空');
            return;
		}
		var userNamePattern = /^[a-zA-Z0-9_]+$/;
		if (!userNamePattern.test(userName)) {
			Ext.Msg.alert('错误', '用户名只能由字母、数字和下划线（_）组成');
            return;
		}

        // 检查密码格式是否正确，两次密码是否一致
		if (password == "") {
			Ext.Msg.alert('错误', '密码不能为空');
            return;
		}
		var pwdPattern = /^[a-zA-Z0-9!@#$%^&*()_+=\-[\];:'",<.>\/?~`\\|]+$/;
		if (!pwdPattern.test(password)) {
			Ext.Msg.alert('错误', '密码必须由字母数字和特殊符号组成');
            return;
		}
		if (password != confirmPwd) {
			Ext.Msg.alert('错误', '两次密码不一致');
            return;
		}

        Ext.Ajax.request({
            url: 'editAccountUser.action',
            params: {
            	userCode: scope.record.get("userCode"),
            	userName: userName,
            	password: password,
            	status : status,
            	companyName : companyName,
            	companyType : companyType,
            	officeTel : officeTel,
            	companyAddress : companyAddress,
            	postcode : postcode,
            	fax : fax,
            	email : email
            },
            success: function(resp, opts) {
                var responseText = Ext.util.JSON.decode(resp.responseText);
                if (responseText.exception) {
                    Ext.example.msg('失败信息', '失败原因：' + responseText.exception);
                } else {
                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: 18
                        }
                    });
                    Ext.example.msg('成功信息', '修改用户信息成功');
                    scope.close();
                }
            },
            failure: function(resp, opts){
                var exception = resp.statusText;
                Ext.example.msg('失败信息', '失败原因：' + exception);
            }
        });
    }
});
