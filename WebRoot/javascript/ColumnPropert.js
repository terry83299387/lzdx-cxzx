ColumnPropert = function(config) {
	
	this.Columns = config;
	// Columns:[{Caption:'',Name:'',Type:'',ColumnModelConfig:[],StoreConfig:[]}],
	// this.Columns.Caption=

	// 获取数据源的字段描述
	// VorP是显示,还是打印
	this.GetJsonStoreFields = function(VorP) {

		var fields = [], ln = this.Columns.length, j = 0;
		for (var i = 0; i < ln; i++) {
			var column = this.Columns[i];
			var field = {};
			// for(var o in column)
			// {
			// field[o]=column[o];
			// }
			// 显示
			if (VorP == 'V' && column.IsView == 1 || VorP == null) {
				if (column.Name != null) {
					field.name = column.Name;
					field.type = column.Type;
					fields[j] = field;
					j++;
				}
			}
			// 打印
			if (VorP == 'P' && column.IsPrint == 1) {
				if (column.Name != null) {
					field.name = column.Name;
					field.type = column.Type;
					fields[j] = field;
					j++;
				}
			}
		}
		return fields;
	};

	// 获取数据源的字段描述
	this.GetColumnModel = function(VorP) {
		var ColumnModels = [], ln = this.Columns.length, j = 0;

		for (var i = 0; i < ln; i++) {
			var column = this.Columns[j];
			var ColumnModel = {};

			if (column.Type == 'date') {
				ColumnModel.renderer = Ext.util.Format.dateRenderer("Y-m-d");// 默认的日期渲染方式
			}
           
			if (VorP == 'V' && column.IsView == 1 || VorP == null) {
				for (var o in column) {
					ColumnModel[o] = column[o];
				}
				ColumnModel.header = column.Caption;
		
				ColumnModel.dataIndex = column.Name;
				
				if(column.Name==undefined){
					ColumnModel.dataIndex=column.dataIndex;
				}
						
				ColumnModel.type = column.Type;
				
				ColumnModels[j] = ColumnModel;
				j++;
			} else if (VorP == 'P' && column.IsPrint == 1) {
				for (var o in column) {
					ColumnModel[o] = column[o];
				}
				ColumnModel.header = column.Caption;
				ColumnModel.dataIndex = column.Name;
				ColumnModel.type = column.Type;
				ColumnModels[j] = ColumnModel;
				j++;
			}
        
		}
		return ColumnModels;
	};
	// 单条记录
	this.GetRecord = function(VorP) {

		var fields = [], ln = this.Columns.length, j = 0;
		for (var i = 0; i < ln; i++) {
			var column = this.Columns[i];
			var field = {};
			if (VorP == 'V' && column.IsView == 1 || VorP == null) {
				if (column.Name != null) {
					field.name = column.Name;
					// field.type=column.Type;
					fields[j] = field;
					j++;
				}
			} else if (VorP == 'P' && column.IsPrint == 1) {
				if (column.Name != null) {
					field.name = column.Name;
					// field.type=column.Type;
					fields[j] = field;
					j++;
				}
			}
		}
		return fields;
	}

	// 返回一条新的空记录
	this.GetNewRecord = function(VorP) {
		var newObj = {}, ln = this.Columns.length;
		for (var i = 0; i < ln; i++) {
			var column = this.Columns[i];

			if (VorP == 'V' && column.IsView == 1 || VorP == null) {
				if (column.Name != null) {
					newObj[column.Name] = column.DefaultValue == null
							? ''
							: column.DefaultValue;
				}
			} else if (VorP == 'P' && column.IsPrint == 1) {
				if (column.Name != null) {
					newObj[column.Name] = column.DefaultValue == null
							? ''
							: column.DefaultValue;
				}
			}
		}
		return newObj;
	}

};
/*
 * 根据store来渲染grid的列,不需要自己再写额外的渲染方法 Examples
 * 
 * storeConfig:{ store:infoStore, valueField:'Id', DisplayField:'Name' }
 */
ColumnPropert.getStoreRenderer = function(storeConfig) {
	return function(value) {
		var ln = storeConfig.store.getCount();
		var record;
		for (var i = 0; i < ln; i++) {
			record = storeConfig.store.getAt(i);
			if (record.get(storeConfig.valueField) == value) {
				return record.get(storeConfig.DisplayField);
			}
		}
	}
}
