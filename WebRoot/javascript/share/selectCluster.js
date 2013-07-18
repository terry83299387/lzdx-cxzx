Ext.ux.selectCluster = {
	clusterCode : '',
	workDir : '',
	backwardrecords : [],
	currentdir : '',
	url : '',
	display : [],
	value : [],
	getUrl : function() {
		return Ext.ux.selectCluster.url;
	},
	getClusterCode : function() {
		return Ext.ux.selectCluster.clusterCode;

	},
	getWorkDir : function() {
		return Ext.ux.selectCluster.workDir;
	},
	getCurrentDir : function() {
		return Ext.ux.selectCluster.currentdir
	},
	getBackwardRecords : function() {
		return Ext.ux.selectCluster.backwardrecords
	},
	setCluster : function(n, v) {
		display = n;
		value = v;
	},
	getClusterDisplay : function() {

		return Ext.ux.selectCluster.display;
	},
	getClusterValue : function() {

		return Ext.ux.selectCluster.value;
	},
	selectCluster : function() {

		var comboStore = new Ext.data.Store({
					fields : ['clusterCode', 'clusterName'],
					proxy : new Ext.data.HttpProxy({
								url : 'showClusterListInFileMng.action'
							}),
					reader : new Ext.data.JsonReader({
								root : 'clusterlist',
								fields : [{
											name : 'clusterCode'
										}, {
											name : 'clusterName'
										}]
							})
				});

		var combo = new Ext.form.ComboBox({
			id : 'com_cluster',
			name : 'com_cluster',
			triggerAction : 'all',
			allowBlank : false,
			labelStyle : "width:100;",
			blankText : i18n.val_notnull,
			typeAhead : true,
			selectOnFocus : true,
			fieldWidth : 50,
			width : 150,
			height : 30,
			listWidth : 150,
			editable : false,
			SelectOnFocus : true,
			labelSeparator : ':',
			forceSelection : true,
			handleHeight : 10,
			fieldLabel : i18n.lab_selectcluster,
			mode : 'remote',
			value : this.firstRecord,
			valueField : 'clusterCode',
			displayField : 'clusterName',
			store : comboStore,
			// value:
			listeners : {
				select : function(combo, record, index) {
					Ext.ux.selectCluster.clusterCode = combo.getValue();
					Ext.Ajax.request({
						url : 'showWorkDir.action',
						params : "clusterCode="
								+ Ext.ux.selectCluster.clusterCode,
						success : function(resp, opts) {
							var resultArray = (Ext.util.JSON
									.decode(resp.responseText)).workDir;

							hostUserName = (Ext.util.JSON
									.decode(resp.responseText)).userName;
							hostIp = (Ext.util.JSON.decode(resp.responseText)).host;
							hostPwd = (Ext.util.JSON.decode(resp.responseText)).pwd;
							Ext.ux.selectCluster.workDir = resultArray;

							Ext.ux.selectCluster.currentdir = Ext.ux.selectCluster.workDir;
							Ext.ux.selectCluster.backwardrecords
									.push(Ext.ux.selectCluster.workDir);
							grid.getStore().reload({
								params : 'clusterCode='
										+ Ext.ux.selectCluster.clusterCode
							});
							// alert(Ext.get('txt_url').dom.value);
							Ext.ux.selectCluster.url = Ext.ux.selectCluster.workDir;
						},
						failure : function(resp, opts) {
							var resultArray = resp.responseText;
							Ext.Msg.alert(i18n.error, resultArray);

						}
					});

				}
			}
		})
		comboStore.load({
			callback : function(records, options, success) {
				if (success == true) {
					if (records.length <= 0) {
						return;
					}
					var n = [], v = [];
					for (var i = 0; i < records.length; i++) {
						n.put(records[0].get("clusterCode"));
						v.put(records[0].get("clusterName"));
					}
					Ext.ux.selectCluster.setCluster(n, v);
					this.firstRecord = comboStore.getAt(0).get('clusterName');
					combo.setValue(this.firstRecord);
					Ext.ux.selectCluster.clusterCode = comboStore.getAt(0)
							.get('clusterCode');
					Ext.Ajax.request({
						url : 'showWorkDir.action',
						params : "clusterCode="
								+ Ext.ux.selectCluster.clusterCode,
						success : function(resp, opts) {
							var resultArray = (Ext.util.JSON
									.decode(resp.responseText)).workDir;

							hostUserName = (Ext.util.JSON
									.decode(resp.responseText)).userName;
							hostIp = (Ext.util.JSON.decode(resp.responseText)).host;
							hostPwd = (Ext.util.JSON.decode(resp.responseText)).pwd;
							Ext.ux.selectCluster.workDir = resultArray;
							// alert(Ext.ux.selectCluster.getWorkDir())
							Ext.ux.selectCluster.currentdir = Ext.ux.selectCluster.workDir;
							Ext.ux.selectCluster.backwardrecords
									.push(Ext.ux.selectCluster.workDir);

							// alert(Ext.get('txt_url').dom.value);
							// Ext.get('txt_url').dom.value =
							// Ext.ux.selectCluster.workDir;
						},
						failure : function(resp, opts) {
							var resultArray = resp.responseText;
							Ext.Msg.alert(i18n.error, resultArray);

						}
					})

				} else {
					// alert("返回失败");
				}
			}
		});

		return combo;

	}
}