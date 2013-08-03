/**
 */
Ext.Desktop.UserWin = function(){
    this.grid = this.init();
}

Ext.Desktop.UserWin.prototype = {
    init: function() {
        var userCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
            header: 'userCode',
            dataIndex: 'userCode',
            hidden: true
        }, {
            header: '用户名',
            dataIndex: 'userName',
            width: 80
		}, {
            header: '密码',
            dataIndex: 'password',
            width: 20,
	        renderer: function(value) {
	        	return "*******";
	        },
            hidden: true
		}, {
            header: '真实姓名',
            dataIndex: 'realName',
            width: 80
		}, {
            header: '角色',
            dataIndex: 'role',
	        renderer: function(value) {
	        	switch (value) {
	        		case 0:
	        			return '超级管理员';
	        		case 1:
	        			return '管理员';
	        		case 2:
	        			return '普通用户';
	        		default:
	        			return '无效';
	        	}
	        },
            width: 60
        }, {
            header: '状态',
            dataIndex: 'status',
	        renderer: function(value) {
	        	switch (value) {
	        		case 0:
	        			return '禁用';
	        		case 1:
	        			return '正常';
	        		default:
	        			return '未知';
	        	}
	        },
            width: 60
        }, {
            header: 'Email',
            dataIndex: 'email',
            width: 120
        }, {
            header: '创建日期',
            dataIndex: 'createDate',
            width: 60,
            type: "date",
            renderer: Ext.util.Format.dateRenderer('Y年m月d日')
        }]);

        var userListReader = new Ext.data.JsonReader({
            totalProperty: "size",
            root: "users",
            fields: [{
                name: 'userCode'
            }, {
                name: 'userName'
            }, {
                name: 'password'
            }, {
				name: 'realName'
			}, {
				name: 'role'
			}, {
				name: 'status'
            }, {
                name: 'email'
            }, {
                name: 'createDate',
                type: 'date',
                dateFormat: 'Y-m-dTH:i:s'
            }]
        });
        
        var userListStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: 'listUsers.action'
            }),
            reader: userListReader
        });
        
        var bbar = new Ext.PagingToolbar({
            pageSize: 18,
            store: userListStore,
            displayInfo: true,
            displayMsg: '显示第 {0} 条到第 {1} 条记录,一共 {2} 条',
            emptyMsg: "没有记录"
        });
        
        var grid = new Ext.grid.GridPanel({
            id: 'user-grid',
            border: false,
            store: userListStore,
            cm: userCm,
            height: 500,
            stripeRows: true,
            autoDestroy: true,
            
            viewConfig: {
                forceFit: true
            },
            loadMask: {
                msg: '正在载入数据,请稍等...'
            },
            
            tbar: [{
                text: '添加新用户',
                tooltip: '添加新用户',
                iconCls: 'add',
                handler: this.newUser.createDelegate(this)
            }, '-', {
                text: '刷新',
                tooltip: '刷新用户列表',
                iconCls: 'add',
                handler: this.refreshUserList.createDelegate(this)
            }],
            bbar: bbar,
            iconCls: 'icon-grid'
        });
        
        var contextmenu = new Ext.menu.Menu({
            id: 'userListCtxMenu',
            items: ['-', {
                text: '编辑',
                tooltip: '编辑用户',
                iconCls: 'option',
                handler: this.editUser.createDelegate(this)
            }, '-', {
                text: "<span style='color:red;font-weight:bold;'>删除</span>",
                tooltip: '删除用户',
                iconCls: 'remove',
                handler: this.cancelUser.createDelegate(this)
            }]
        });

        grid.on("rowcontextmenu", function(grid, rowIndex, e){
            e.preventDefault();
            grid.getSelectionModel().selectRow(rowIndex);
            contextmenu.showAt(e.getXY());
        });
        
		return grid;
    },

    newUser: function(btn) {
		var win = new Ext.Desktop.NewUser(this.grid);
		win.show();
    },

    refreshUserList: function(btn) {
		this.grid.getStore().reload();
    },

	editUser: function(btn) {
		var grid = this.grid;
		var selRow = grid.getSelectionModel().getSelected();

		var win = new Ext.Desktop.EditUser(this.grid, selRow);
		win.show();
	},

	cancelUser: function(btn) {
        var grid = this.grid;
		var selRow = grid.getSelectionModel().getSelected();

        Ext.Msg.confirm('信息', '确定要删除该用户吗？', function(btn) {
            if (btn != 'yes') {
            	return;
            }

            Ext.Ajax.request({
                url: 'deleteUser.action',
                params: {
                    userCode: selRow.get('userCode')
                },
                success: function(resp, opts){
                    var responseText = Ext.util.JSON.decode(resp.responseText);
                    if (responseText.exception) {
                        Ext.example.msg('错误', responseText.exception);
                    } else {
                        grid.getStore().reload();
//                        Ext.example.msg('成功', '成功');
                    }
                },
                failure: function(resp, opts){
                    var exception = resp.statusText;
                    Ext.example.msg('错误', exception);
                }
            });
        });
	}
}
