Ext.grid.ButtonColumn = function(config) {
	Ext.apply(this, config);
	if (!this.id) {
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.ButtonColumn.prototype = {
	buttonWidth : "95%",
	buttenText : 'Button',
	init : function(grid) {
		this.grid = grid;
		this.grid.on('render', function() {
					var view = this.grid.getView();
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},

	/*
	 * ButtonColumn:当前列, grid:当前的grid, record:当前点击行的记录, field:当前被点击的列的dataIndex,
	 * value:当前被点击列所对应的dataIndex的值
	 */
	onClick : function(ButtonColumn, grid, record, field, value) {
		alert('onClick:function(ButtonColumn,grid,record,field,value)');
	},
	onMouseDown : function(e, t) {
		if (t.id == this.id) {
			e.stopEvent();
			var index = this.grid.getView().findRowIndex(t);
			var record = this.grid.store.getAt(index);
			// add by jliu

			this.grid.getSelectionModel().selectRow(index);
			this.onClick(this, this.grid, record, this.dataIndex,
					record.data[this.dataIndex]);
		}
	},
	renderer : function(v, p, record) {
		var username = Ext.ux.Util.getUserName();

		var s = '<table border="0" width="{2}"  style="table-layout: fixed;" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr >'
				+ '<td class="x-btn-left" style="padding:0px;" mce_style="padding:0px"></td><td id="{1}" style="vertical-align:middle;LINE-HEIGHT: 21px;white-space:nowrap;overflow:hidden;text-overflow: ellipsis; "mce_style="vertical-align:middle;LINE-HEIGHT: 21px" class="x-btn-ellipsis">{0}</td><td class="x-btn-right"></td>'
				+ "</tr></tbody></table>";

		var hasMnger = record.get('deptMnger');

		if (hasMnger != '' && hasMnger != null && this.name == "addDeptMnger") {
			s = "";
		}

		if (username == record.get('proManagerName')
				&& this.name == "approveProject") {
			s = ""
		}

		if (record.get('proStatus') == "2" && this.name == "approveProject") {
			s = "";
		}

		if (record.get('proStatus') == "3") {
			s = "";
		}

		if (record.get('proStatus') == "4") {
			s = "";
		}
		if (record.get('proStatus') == "1" && this.name == "deleteProject") {
			s = "";
		}
		if ((record.get('proStatus') == "5" && this.name == "approveProject")) {
			s = "";
		}
		if ((record.get('proDefault') == "1" && this.name == "deleteProject")) {
			s = "";
		}
		if ((record.get('proDefault') == "1" && this.name == "approveProject")) {
			s = "";
		}

		if ((record.get('statusCode') != "2" && this.name == "deleteUser")) {
			s = "";
		}
		if (record.get('statusCode') == "4") {
			s = "";
		}

		if ((record.get('statusCode') != "1" && this.name == "approveUser")) {
			s = "";
		}

		return String.format(s, this.buttenText, this.id, this.buttonWidth);
	}
}