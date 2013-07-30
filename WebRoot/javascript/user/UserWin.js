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
            header: 'userName',
            dataIndex: 'userName',
            width: 10
		}, {
            header: 'password',
            dataIndex: 'password',
            width: 10,
	        renderer: function(value) {
	        	return "*******";
	        },
            hidden: true
		}, {
            header: 'realName',
            dataIndex: 'realName',
            width: 10
		}, {
            header: 'role',
            dataIndex: 'role',
	        renderer: function(value) {
	        	switch (value) { // TODO i18n
	        		case 0:
	        			return 'super admin';
	        		case 1:
	        			return 'admin';
	        		case 2:
	        			return 'common user';
	        		default:
	        			return 'invalid user role';
	        	}
	        }
        }, {
            header: 'status',
            dataIndex: 'status',
	        renderer: function(value) {
	        	switch (value) { // TODO i18n
	        		case 0:
	        			return 'invalid';
	        		case 1:
	        			return 'valid';
	        		default:
	        			return 'invalid user status';
	        	}
	        }
        }, {
            header: 'Email',
            dataIndex: 'email',
            width: 25
        }, {
            header: 'createDate',
            dataIndex: 'createDate',
            width: 15,
            type: "date",
            renderer: Ext.util.Format.dateRenderer('Y��m��d��')
        }]);

        var userListReader = new Ext.data.JsonReader({
            totalProperty: "size",
            root: "userList",
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
		win.show(btn);
    },

    refreshUserList: function(btn) {
		this.grid.getStore().reload();
    },

	editUser: function(btn) {
		var grid = this.grid;
		var selRow = grid.getSelectionModel().getSelected();

		var win = new Ext.Desktop.EditUser(grid, selRow);
		win.show(btn);
	},

	cancelUser: function(btn) {
		// TODO
	}
}
