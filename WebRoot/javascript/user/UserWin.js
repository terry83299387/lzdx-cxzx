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
            header: '�û���',
            dataIndex: 'userName',
            width: 80
		}, {
            header: '����',
            dataIndex: 'password',
            width: 20,
	        renderer: function(value) {
	        	return "*******";
	        },
            hidden: true
		}, {
            header: '��ʵ����',
            dataIndex: 'realName',
            width: 80
		}, {
            header: '��ɫ',
            dataIndex: 'role',
	        renderer: function(value) {
	        	switch (value) {
	        		case 0:
	        			return '��������Ա';
	        		case 1:
	        			return '����Ա';
	        		case 2:
	        			return '��ͨ�û�';
	        		default:
	        			return '��Ч';
	        	}
	        },
            width: 60
        }, {
            header: '״̬',
            dataIndex: 'status',
	        renderer: function(value) {
	        	switch (value) {
	        		case 0:
	        			return '����';
	        		case 1:
	        			return '����';
	        		default:
	        			return 'δ֪';
	        	}
	        },
            width: 60
        }, {
            header: 'Email',
            dataIndex: 'email',
            width: 120
        }, {
            header: '��������',
            dataIndex: 'createDate',
            width: 60,
            type: "date",
            renderer: Ext.util.Format.dateRenderer('Y��m��d��')
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
            displayMsg: '��ʾ�� {0} ������ {1} ����¼,һ�� {2} ��',
            emptyMsg: "û�м�¼"
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
                msg: '������������,���Ե�...'
            },
            
            tbar: [{
                text: '������û�',
                tooltip: '������û�',
                iconCls: 'add',
                handler: this.newUser.createDelegate(this)
            }, '-', {
                text: 'ˢ��',
                tooltip: 'ˢ���û��б�',
                iconCls: 'add',
                handler: this.refreshUserList.createDelegate(this)
            }],
            bbar: bbar,
            iconCls: 'icon-grid'
        });
        
        var contextmenu = new Ext.menu.Menu({
            id: 'userListCtxMenu',
            items: ['-', {
                text: '�༭',
                tooltip: '�༭�û�',
                iconCls: 'option',
                handler: this.editUser.createDelegate(this)
            }, '-', {
                text: "<span style='color:red;font-weight:bold;'>ɾ��</span>",
                tooltip: 'ɾ���û�',
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

        Ext.Msg.confirm('��Ϣ', 'ȷ��Ҫɾ�����û���', function(btn) {
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
                        Ext.example.msg('����', responseText.exception);
                    } else {
                        grid.getStore().reload();
//                        Ext.example.msg('�ɹ�', '�ɹ�');
                    }
                },
                failure: function(resp, opts){
                    var exception = resp.statusText;
                    Ext.example.msg('����', exception);
                }
            });
        });
	}
}
