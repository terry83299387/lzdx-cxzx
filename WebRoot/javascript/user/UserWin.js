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
            header: i18n.user_username,
            dataIndex: 'userName',
            width: 80
		}, {
            header: i18n.user_password,
            dataIndex: 'password',
            width: 20,
	        renderer: function(value) {
	        	return "*******";
	        },
            hidden: true
		}, {
            header: i18n.user_realname,
            dataIndex: 'realName',
            width: 80
		}, {
            header: i18n.user_role,
            dataIndex: 'role',
	        renderer: function(value) {
	        	switch (value) {
	        		case 0:
	        			return i18n.user_superadmin;
	        		case 1:
	        			return i18n.user_admin;
	        		case 2:
	        			return i18n.user_commonuser;
	        		default:
	        			return i18n.user_invalid;
	        	}
	        },
            width: 60
        }, {
            header: i18n.user_status,
            dataIndex: 'status',
	        renderer: function(value) {
	        	switch (value) {
	        		case 0:
	        			return i18n.user_disable;
	        		case 1:
	        			return i18n.user_valid;
	        		default:
	        			return i18n.user_unknown;
	        	}
	        },
            width: 60
        }, {
            header: 'Email',
            dataIndex: 'email',
            width: 120
        }, {
            header: i18n.user_createdate,
            dataIndex: 'createDate',
            width: 60,
            type: "date",
            renderer: Ext.util.Format.dateRenderer(i18n.user_ymdformat1)
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
            displayMsg: i18n.user_toolbarformat,
            emptyMsg: i18n.user_nodata
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
                msg: i18n.user_loading
            },
            
            tbar: [{
                text: i18n.user_adduser,
                tooltip: i18n.user_adduser,
                iconCls: 'add',
                handler: this.newUser.createDelegate(this)
            }, '-', {
                text: i18n.user_refresh,
                tooltip: i18n.user_refresh,
                iconCls: 'add',
                handler: this.refreshUserList.createDelegate(this)
            }],
            bbar: bbar,
            iconCls: 'icon-grid'
        });
        
        var contextmenu = new Ext.menu.Menu({
            id: 'userListCtxMenu',
            items: ['-', {
                text: i18n.user_edit,
                tooltip: i18n.user_edit,
                iconCls: 'option',
                handler: this.editUser.createDelegate(this)
            }, '-', {
                text: "<span style='color:red;font-weight:bold;'>" + i18n.user_delete + "</span>",
                tooltip: i18n.user_delete,
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

        Ext.Msg.confirm(i18n.user_info, i18n.user_confirmdelete, function(btn) {
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
                        Ext.example.msg(i18n.user_error, responseText.exception);
                    } else {
                        grid.getStore().reload();
                    }
                },
                failure: function(resp, opts){
                    var exception = resp.statusText;
                    Ext.example.msg(i18n.user_error, exception);
                }
            });
        });
	}
}
