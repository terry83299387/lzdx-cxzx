Ext.ux.Template = {
	MULTI_INPUT_KEY: null,
	grid : null,
	getDir : function() {
		var dir = '/home';
		return dir;
	},
	ltextField : [],
	lnumberField : [],
	lsingleUploadField : new Array(),
	lmultiUploadFieldLocal : [],
	lmultiUploadFieldRemote : [],
	lworkDirField : [],
	lcheckBox : [],
	ltextArea : [],
	lftpServerIp : [],
	lComboBox : [],
	lradio : [],
	lId : new Array(),
	lj : 0,
	jobname: "urn:scc:jobname",
	clusterCode:'urn:scc:clusterCode',
	clusterName:'clusterName',
	queueCode:'urn:scc:queueCode',
	queueName:'queueName',
	softwareCode:'urn:scc:softwareCode',
	softwareName:'urn:scc:applicationName',
	workdir:'urn:scc:workdir',
	project:'urn:scc:project',
	projectName:'projectName',
	// add by liujie. 2009-10-12
	getJobName : function(softwareName) {
        var jobName = Ext.ux.Template.getTemplate([{
            id: Ext.ux.Template.jobname,
            name: Ext.ux.Template.jobname,
            label: '<font color="red" >*</font> ' + i18n.lab_jobname ,
            type: 'textField',
			allowBlank: false,
			blankText: i18n.val_jobnamenotnull,
            value: getDefaultJobName(softwareName)
        }]);
        
        function getDefaultJobName(softwareName){
            Ext.Ajax.request({
                url: 'getDefalutJobName.action',
                params:{
					softwareName : softwareName
				},
                success: function(resp, opts){
                    var responseText = Ext.util.JSON.decode(resp.responseText);
                    var jobname = Ext.getCmp(Ext.ux.Template.jobname);
                    
                    if (responseText.exception != null) {
                        jobname.setValue("defaultJobName");
                    }
                    else {
						if (jobname != null && typeof(jobname) != 'undefined') {
							jobname.setValue(responseText.defaultJobName);
						}
                    }
                    
                    //modify by SHEN Jie
                    if(typeof(Ext.getCmp("ap_file_name")) != "undefined"){
                    	Ext.getCmp("ap_file_name").setValue(responseText.defaultJobName);
                    }
                    
                    var clusterCombo =Ext.getCmp(Ext.ux.Template.clusterCode); 
					clusterCombo.store.load();
                },
                failure: function(resp, opts){
                    Ext.getCmp(Ext.ux.Template.jobname).setValue("defaultJobName");
                },
                scope: this
            });
        };
        
        return jobName;
	},
	
	getProject : function() {
        var project = Ext.ux.Template.getTemplate([{
            id: Ext.ux.Template.project,
            name: Ext.ux.Template.project,
            label: i18n.lab_selectproject,
            mode: 'local',
            type: 'comboBox',
            valueField: 'proCode',
            displayField: 'proName',
            store: new Ext.data.Store({
                fields: ['proCode', 'proName'],
                proxy: new Ext.data.HttpProxy({
                    url: 'showProjectList.action'
                }),
                reader: new Ext.data.JsonReader({
                    root: 'projectList',
                    fields: [{
                        name: 'proCode'
                    }, {
                        name: 'proName'
                    }]
                }),
				listeners : {
					load : function(store, records, options) {
						// select first if there is
						if (records.length > 0) {
							if (Ext.getCmp(Ext.ux.Template.project) != null) {
								Ext.getCmp(Ext.ux.Template.project).setValue(records[0].data.proCode);
								Ext.getCmp(Ext.ux.Template.project).lastSelectionText = records[0].data.proName;
							}
							
						}
					}
				}
            })
        }]);
		
        return project;
	},
	
	getJobWorkingDir : function() {
        var workDir = Ext.ux.Template.getTemplate([{
            id: Ext.ux.Template.workdir,
            name: Ext.ux.Template.workdir,
            label: i18n.lab_workdir,
            type: 'workDirField'
        }]);
        
        return workDir;
	},
	

	getCluster : function(softwareCode, softwareName) {
        var cluster = Ext.ux.Template.getTemplate([{
            id: Ext.ux.Template.clusterCode,
            name: Ext.ux.Template.clusterCode,
            label: i18n.lab_selectcluster,
            mode: 'local',
            type: 'comboBox',
            valueField: 'clusterCode',
            displayField: 'clusterName',
            store: new Ext.data.Store({
                fields: ['clusterCode', 'clusterName'],
                proxy: new Ext.data.HttpProxy({
                    url: 'showClusterList.action'
                }),
				baseParams: {
					softwareCode : softwareCode
				},	
                reader: new Ext.data.JsonReader({
                    root: 'clusterlist',
                    fields: [{
                        name: 'clusterCode'
                    }, {
                        name: 'clusterName'
                    }
//                    , {
//                    	name: 'fileTransferProtocol'
//                    }
//                    , {
//                    	name: 'fileTransferPort'
//                    }
                    ]
                }),
                listeners: {
                    load: function(store, records){
                        
                        if (records.length > 0) {
                        	var clusterCombo =Ext.getCmp(Ext.ux.Template.clusterCode); 
                            clusterCombo.setValue(records[0].data.clusterCode);
                            clusterCombo.lastSelectionText = records[0].data.clusterName;
                            setQueue(softwareCode, records[0].data.clusterCode);
                            setWorkDir(softwareCode, records[0].data.clusterCode);
                           
                        }
                    }
                }
            }),
            listeners: {
                select: function(combo, record, index){
                    var clusterCode = combo.getValue();
                    
                    if (softwareCode != null && softwareCode != "" &&
                    clusterCode != null &&
                    clusterCode != "") {
                        setQueue(softwareCode, clusterCode);
                        setWorkDir(softwareCode, clusterCode);
                    }
                }
            }
        }]);
		
		function setQueue(softwareCode, clusterCode)  {
            var queue = Ext.getCmp(Ext.ux.Template.queueCode);
			queue.clearValue();
            queue.store.reload({
                params: {
                    software: softwareCode,
                    cluster: clusterCode
                }
            });
		};
		
		function setWorkDir(softwareCode, clusterCode) {
            var jobName = Ext.getCmp(Ext.ux.Template.jobname).getValue();
            Ext.Ajax.request({
                url: 'getDefaultWorkingDir.action',
                params: {
                    clusterCode: clusterCode,
                    jobName : jobName
                },
                success: function(resp, opts){
                    var responseText = Ext.util.JSON.decode(resp.responseText);
                    var defaultWorkingDir = document.getElementById(Ext.ux.Template.workdir + 'text');
                    
                    if (responseText.exception == null && typeof(defaultWorkingDir) != 'undefined') {
                    	defaultWorkingDir.value = responseText.defaultWorkDir;
                		Ext.ux.Util.setCursorLast(defaultWorkingDir);
                    }
                },
                failure: function(resp, opts){
                },
                scope: this
            });
		};
		
        return cluster;
	},
	
	getQueue : function(softwareCode) {
		
        var queue = Ext.ux.Template.getTemplate([{
            id: Ext.ux.Template.queueCode,
            label: i18n.lab_selectqueue,
            name: Ext.ux.Template.queueCode,
            type: 'comboBox',
            mode: 'local',
            displayField: 'queueName',
            valueField: 'queueCode',
            store: new Ext.data.Store({
                fields: ['queueCode', 'queueName'],
                proxy: new Ext.data.HttpProxy({
                    url: 'showQueueList.action'
                }),
                reader: new Ext.data.JsonReader({
                    root: 'queuelist',
                    fields: [{
                        name: 'queueCode'
                    }, {
                        name: 'queueName'
                    }]
                }),
				listeners: {
					load:function(){
						var queueCombo = Ext.getCmp(Ext.ux.Template.queueCode);
						
						var projectCombo =Ext.getCmp(Ext.ux.Template.project); 
						projectCombo.clearValue();
						if (queueCombo != null && queueCombo != 'undefined') {
							var firstQueue = queueCombo.store.data.first().data;
							queueCombo.setValue(firstQueue.queueCode);
							queueCombo.lastSelectionText = firstQueue.queueName;
							if ((queueCombo.lastSelectionText == "snode") || (queueCombo.lastSelectionText == "csnode")){
								Ext.getCmp("urn:scc:nodes").validator = function() {
									if (this.value % 16  == 0) {
										return true;	
									}
									else {
										return i18n.cpu_validator;
									}
								};
							}
							Ext.getCmp("urn:scc:nodes").validate();
							projectCombo.store.load({
								params:{
									queueCode : firstQueue.queueCode,
									softwareCode:softwareCode
								}
							});
						} 
					}
				}
            }),
            listeners: {
                select: function(){
                	if ((this.lastSelectionText == "snode") || (this.lastSelectionText == "csnode")){
						Ext.getCmp("urn:scc:nodes").validator = function() {
							if (this.value % 16  == 0) {
								return true;	
							}
							else {
								return i18n.cpu_validator;
							}
						};
					}
                	else {
                		Ext.getCmp("urn:scc:nodes").validator = function() { return true;};
                	}
                	Ext.getCmp("urn:scc:nodes").validate();
					var queueCombo = Ext.getCmp(Ext.ux.Template.queueCode);
                    var projectCombo = Ext.getCmp(Ext.ux.Template.project);
					
					var queueCode = queueCombo.getValue();
					projectCombo.clearValue();
                    projectCombo.store.load({
                        params: {
                            queueCode: queueCode,
                            softwareCode: softwareCode
                        }
                    });
                }
            }
        }]);
        
        var qPanel = new Ext.Panel({
            layout: "column",
            border: false,
            labelAlign: "left",
            frame: false,
            bodyStyle: " background-color: transparent;border:none;",
            items: [{
                layout: 'form',
                width: 442,
                border: false,
                frame: false,
                bodyStyle: " background-color: transparent;border:none;",
                items: queue
            }, {
                layout: 'form',
//                autoWidth : true,
                width:162,
                border: false,
                frame: false,
                bodyStyle: " background-color: transparent;border:none",
                items: [{
					frame: false,
					html:'<div id="queueStatusTip" class="tip-target">'+i18n.lab_queuedynamicinfo+'</div>'
				}]
            }]
        });
		
		var panel = new Ext.Panel({
		    width: '100%',
		    layout: "form",
		    border: false,
		    frame: false,
		    bodyStyle: " background-color: transparent;border:none",
		    items: [qPanel]
		});
        return panel;
	},
	
	getParams : function() {
		var params = [];

		var jobWorkingDir = Ext.getCmp('submitPanel').form.findField(Ext.ux.Template.workdir + 'text').getValue();
		var i;

		// Text Fields
		for (i=0; i<Ext.ux.Template.ltextField.length; i++) {
            params.push(Ext.ux.Template.ltextField[i] + ',' + Ext.get(Ext.ux.Template.ltextField[i]).dom.value);
        }

		// Number Fields
        for (i=0; i<Ext.ux.Template.lnumberField.length; i++) {
			var el = Ext.get(Ext.ux.Template.lnumberField[i]);
			if (el) {
				params.push(Ext.ux.Template.lnumberField[i] +  ',' + el.dom.value);
			}
        }

        // Radio Buttons
        for (i=0; i<Ext.ux.Template.lradio.length; i++) {
            var rid = Ext.ux.Template.lradio[i];
			if (rid) {
				var selValue = Ext.DomQuery.selectValue('input[name=' + rid +']:checked/@value');
				params.push(rid+ ',' + selValue);
			}
        }

        // ComboBoxes
		for (i=0; i<Ext.ux.Template.lComboBox.length; i++) {
		    var l = Ext.ux.Template.lComboBox[i];
		    var value = null;
		    var lIds = Ext.ux.Template.lId;
		    var lIdStrs;
		    for (var j = 0; j < lIds.length; j++) {
		    	lIdStrs = lIds[j].split(",");
		        if (lIdStrs[0] == l) {
		            if (Ext.get(l).dom.value == lIdStrs[2]) {
		                value = lIdStrs[1]; 
		                params.push(lIdStrs[0] + "," + value);
		            }
		        }
		    }
		    if (value == null) {
		    	var value = Ext.get(l).getValue();
		        params.push(l + "," + value);
		    }
		}

		// Multiple Upload Files
		var multifile = "";
		if (this.MULTI_INPUT_KEY) {
			// Local Files
	        for (i=0; i<Ext.ux.Template.lmultiUploadFieldLocal.length; i++) {
	            var localFilePath = Ext.ux.Template.lmultiUploadFieldLocal[i];
	            if (!localFilePath) continue;
				var localFileName = localFilePath.substring(localFilePath.lastIndexOf('\\') + 1);
				localFilePath = jobWorkingDir + '/' + localFileName;
				multifile += 'file:///' + localFilePath + '#';
	        }
	        // Remote Files
	        for (i=0; i<Ext.ux.Template.lmultiUploadFieldRemote.length; i++) {
	            var remoteFilePath = Ext.ux.Template.lmultiUploadFieldRemote[i];
	            if (!remoteFilePath) continue;
				multifile += 'file:///' + remoteFilePath + '#';
	        }

			if(multifile.length > 0) {
				params.push(MULTI_INPUT_KEY + ',' + multifile.substring(0,multifile.length-1));
			}
		}

		// Single Upload Files
        for (i=0; i<Ext.ux.Template.lsingleUploadField.length; i++) {
            var sId = Ext.ux.Template.lsingleUploadField[i];
            if(!sId || !Ext.get(sId)) continue;
        	// Remote Files
			if (sId.substring(0, 2) == '_r') {
				var v = Ext.get(sId).dom.value;
				if (typeof v != 'undefined' && v != '') {
					var file = Ext.get(sId).dom.value;
					params.push(sId.substring(2, (sId.length - 7)) + ',' + file);
				}
			} else if (sId.substring(0,2) == '_l') {
			// Local Files
				var localFile = Ext.get(sId).dom.value;
				if (!localFile) continue;
				localFile = localFile.substring(localFile.lastIndexOf('\\') + 1);
				localFile = jobWorkingDir + '/' + localFile;
				params.push(sId.substring(2, (sId.length - 7)) + ',' + localFile);
			}
        }

        // Work Directory Fields
        for (i=0; i<Ext.ux.Template.lworkDirField.length; i++) {
            params.push(Ext.ux.Template.workdir + ',' + Ext.get(Ext.ux.Template.lworkDirField[i]).dom.value);
        }

        // CheckBoxs
        for (i=0; i<Ext.ux.Template.lcheckBox.length; i++) {
            var chk = Ext.ux.Template.lcheckBox[i];
            var chkId = chk.split(',')[0];
            if (document.getElementById(chkId).checked) {
                params.push(Ext.ux.Template.lcheckBox[i]);
            }
        }

        // TextAreas
        for (i=0; i<Ext.ux.Template.ltextArea.length; i++) {
            params.push(Ext.ux.Template.ltextArea[i] + ',' + Ext.get(Ext.ux.Template.ltextArea[i]).dom.value);
        }

        // FtpServerIPs
        for (i=0; i<Ext.ux.Template.lftpServerIp.length; i++) {
            var fId = Ext.ux.Template.lftpServerIp[i];
            params.push(fId.substring(0, (fId.length - 4)) + ',' + Ext.getCmp(Ext.ux.Template.lftpServerIp[i]).getValue());
        }

        return params;
	},
	// end
	
	getContent : function() {
		return Ext.get('txtCpuPerNode').dom.value;
	},

	getGridPanel : function(id) {
		var rIndex = 0;
		var grid = new Ext.grid.EditorGridPanel({
			id : id,
			width : 500,
			clicksToEdit : 1,
			frame : true,
			cm : new Ext.grid.ColumnModel({
						defaultSortable : false,
						defaultWidth : 100,
						columns : [{
									header : i18n.col_filename,
									dataIndex : 'name',
									width : 50,
									editor : new Ext.form.TextField({
												allowBlank : false
											})
								}, {
									header : i18n.col_filepermission,
									width : 50,
									dataIndex : 'permission'
								}, {
									header :i18n.col_filetype,
									width : 50,
									dataIndex : 'typeString',
									renderer : Ext.ux.Util.formatType

								}, {
									header : i18n.col_fileowner,
									width : 50,
									dataIndex : 'owner'
								}, {
									header : i18n.col_filedir,
									width : 100,
									dataIndex : 'currentPath'
								}, {
									header : i18n.col_filegroup,
									width : 50,
									dataIndex : 'group'
								}, {
									header : i18n.col_filesize,
									width : 50,
									dataIndex : 'size',
									renderer : Ext.ux.Util.formatSize
								}, {
									header : i18n.col_filelastmodified,
									width : 100,
									dataIndex : 'lastModified'
								}]
					}),
			store : new Ext.data.Store({
						autoLoad : true,
						proxy : new Ext.data.HttpProxy({
									url : 'showFileList.action'
								}),
						reader : new Ext.data.JsonReader({
									totalProperty : "results",
									root : "fileItems",
									fields : [{
												name : "name"
											}, {
												name : "owner"
											}, {
												name : "currentPath"
											}, {
												name : "parentPath"

											}, {
												name : "group"

											}, {
												name : "permission"
											}, {
												name : "size"

											}, {
												name : "lastModified"

											}, {
												name : "typeString"
											}]
								})
					}),
			height : 400,
			autoScroll : true,
			loadMask : {
				msg : i18n.mask_wait
			},
		
			sm : new Ext.grid.RowSelectionModel({
						singleSelect : true
					}),
			listeners : {
				afterEdit : function(obj) {
					alert("ss");
				}
			},
			tbar : [i18n.lab_url, new Ext.form.TextField({
						id : 'txt_url',
						width : 300,
						value : 'workdir',
						listeners : {
							specialkey : function(field, e) {
								if (e.getKey() == Ext.EventObject.ENTER) {
									Ext.ux.Template.refresh(Ext.ux.Template
											.getDir());
								}
							}
						}
					}), new Ext.Button({
						id : 'btnUrl',
						width : 15,
						tooltip : i18n.search,
						tooltipType : "title",
						icon : "./images/search.png",
						cls : 'x-btn-icon',
						handler : function() {
							alert("search")
							Ext.ux.Template.refresh(Ext.ux.Template.getDir());
						}
					}), new Ext.Button({
				id : 'btnUpard',
				width : 15,
				tooltip : i18n.btn_up,
				tooltipType : "title",
				icon : "./extjs/resources/images/default/grid/col-move-bottom.gif",
				cls : "x-btn-icon",
				handler : function() {
					alert("upload")
					Ext.ux.Template.refresh(Ext.ux.Template.getDir());
					Ext.get('txt_url').dom.value = Ext.ux.Template.getDir();
				}
			}), new Ext.Button({
						id : 'btnRefresh',
						width : 15,
						tooltip : i18n.btn_refresh,
						tooltipType : "title",
						icon : "./extjs/resources/images/default/grid/done.gif",
						cls : "x-btn-icon",
						handler : function() {
							alert("Refresh")
							Ext.ux.Template.refresh(Ext.ux.Template.getDir());
						}
					}), new Ext.Button({
						id : 'btnNewFolder',
						width : 15,
						tooltip : i18n.lab_newfolder,
						tooltipType : "title",
						icon : "./extjs/resources/images/default/tree/folder.gif",
						cls : "x-btn-icon",
						handler : function() {
							var record2 = Ext.data.Record.create([{
										name : 'name'
									}, {
										name : 'owner'
									}, {
										name : 'currentPath'
									}, {
										name : 'group'
									}, {
										name : 'permission'
									}, {
										name : 'size'
									}, {
										name : 'lastModified'
									}, {
										name : 'typeString'
									}]);
							var data2 = new record2({
										name : 'name',
										owner : 'ssc',
										currentPath : '/home/scc/',
										group : 'rd',
										permission : 'drw_rw_rw_',
										size : '10kB',
										lastModified : '2009-08-07 14:00:00',
										typeString : 'File'
									});
							alert("new")

							grid.getStore().insert(0, data2);
							grid.startEditing(rIndex, 0);

						}
					})]
		})
		function showUrl() {

		}
		this.grid = grid;
		grid.autoScroll = true;
		grid.addListener('rowclick', rowclick);
		function rowclick(grid, rowIndex, e) {
			rIndex = rowIndex;
			var filename = grid.getSelections()[0].get('name');
		}
		grid.addListener('rowdblclick', rowdblClick);
		function rowdblClick(grid, rowindex, e) {

			filename = grid.getSelections()[0].get('name');

		}
		return this.grid;
	},
	getTemplate : function(jobfields) {
		
		var ls = [];
		var ll = null;
		if (!jobfields || jobfields == null) {
			return;
		}

        var templateForm = new Ext.Panel({
            layout: "form",
            width: '100%',
            height: "100%",
            border: false,
            frame: false,
            bodyStyle: " background-color: transparent;border:none;",
            defaults: {
                bodyStyle: 'background-color:transparent;',
                border: false,
                frame: false
            }
        });
        
		for (var i = 0; i < jobfields.length; i++) {
			var formField = null;
			 var tp="";
			var field = jobfields[i], mode = "", check = "", labelStyle = "", fieldType = "", fieldName = "", fieldLabel = "", fieldId = "", boxLabel = "", valueField = "", displayField = "", store = "", mode = "", text = "", hideLabel = false;
//			var checkValidate = "";
			fieldType = field.type;
			if (typeof field == 'object') {
				hideLabel = field.fieldLabel;
				fieldLabel = field.label;
				labelStyle = field.labelStyle;
				mode = field.mode;
				fieldId = field.id;
				fieldName = field.name;
				displayField = field.displayField;
				valueField = field.valueField;
				store = field.store;
				text = field.text;
//				checkValidate = field.checkValidate;  //add by SHEN Jie 2011-4-1
				fieldType = field.type;
				check = field.check;
				if (check != null) {
					fieldType = "checkBox";
				}
			}

			var fieldConfig = {
				fieldLabel : fieldLabel,
				id : fieldId,
				name : fieldName
			};
			switch (fieldType) {
				case 'none' :
					formField = new Ext.sccportal.template.None(fieldConfig, field);
					this.ltextField.push(formField.getId());
					break;
				case 'textField' :
					formField = new Ext.sccportal.template.TextField(fieldConfig, field);
					this.ltextField.push(formField.getId());
					break;
				case 'numberField' :
					formField = new Ext.sccportal.template.NumberField(fieldConfig, field);
					this.lnumberField.push(formField.getId());
					break;
				case 'singleUploadField' :
					formField = new Ext.sccportal.template.SingleUploadField(fieldConfig, field, this);
					break;
				/*
				 * 暂未使用，20111123 乔明奎
				 * Unused now. 20111123 QiaoMingkui
				 */
//				case 'singleUploadWithWorkdirField' :
//					formField = new Ext.sccportal.template.SingleUploadWorkdirField(fieldConfig, field, this);
//					break;
				case 'multiUploadField' :
                	MULTI_INPUT_KEY = field.id;
                	formField = new Ext.sccportal.template.MultiUploadField(fieldConfig, field, this);
					break;
				case 'workDirField' :
					formField = new Ext.sccportal.template.WorkDirField(fieldConfig, field);
					this.lworkDirField.push(fieldId);
					break;
				case 'radio' :
					formField = new Ext.sccportal.template.Radio(fieldConfig, field, this);
					break;
				case 'checkBox' :
					formField = new Ext.sccportal.template.CheckBox(fieldConfig, field, this);
					break;
				case 'button' :
					formField = new Ext.sccportal.template.Button(fieldConfig, field);
					break;
				case 'comboBox' :
					formField = new Ext.sccportal.template.ComboBox(fieldConfig, field, this);
					
					// select first
					var combo = Ext.getCmp(field.id); 
					var first = combo.store.data.first();
					if (first != null) {
						var firstData = first.data;
						combo.setValue(firstData.value);
						combo.lastSelectionText = firstData.text;
					}
					this.lComboBox.push(field.id);
					break;
				case 'editableComboBox' :
					formField = new Ext.sccportal.template.EditableComboBox(fieldConfig, field, this);
					
					// select first
					var combo = Ext.getCmp(field.id); 
					var first = combo.store.data.first();
					if (first != null) {
						var firstData = first.data;
						combo.setValue(firstData.value);
						combo.lastSelectionText = firstData.text;
					}
					this.lComboBox.push(field.id);
					break;
				case 'textArea' :
					formField = new Ext.sccportal.template.TextArea(fieldConfig, field);
					this.ltextArea.push(field.id);
					break;
				case 'ftpServerIp' :
					formField = new Ext.sccportal.template.FtpServerIp(fieldConfig, field);
					this.lftpServerIp.push(fieldId + "text");
					break;
				default :
					fieldConfig = {
						width : 0,
						height : 0,
						border : false,
						frame : false,
						hideLabel : true
					};
					formField = new Ext.form.Hidden(fieldConfig);
			}
			templateForm.add(formField);
		}
		templateForm.doLayout();
		return templateForm;
	},
	
	clean : function() {
		this.ltextField = new Array();
		this.lnumberField = new Array();
		this.lsingleUploadField = new Array();
		this.lmultiUploadFieldLocal = new Array();
		this.lmultiUploadFieldRemote = new Array();
		this.lworkDirField = new Array();
		this.lcheckBox = new Array();
		this.ltextArea = new Array();
		this.lftpServerIp = new Array();
		this.lComboBox = new Array();
		this.lradio = new Array();
		this.lId = new Array();
		this.MULTI_INPUT_KEY = null;
	}
}
