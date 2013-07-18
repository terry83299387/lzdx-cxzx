Ext.onReady(function(){

    Ext.ux.Util.overrideDateField();
    Ext.ux.Util.filterBlankinTextField();
    //	var deptCode = "";
    Ext.QuickTips.init();
    var IsPRight = false;
    var IsCPRight = false;
    var IsUnique = false;
    var IsRight = false;
    var IsERight = false;
    
    var registerFormPanel = new Ext.form.FormPanel({
        id: 'registerFormPanel',
        height: 250,
        width: 400,
        frame: false,
        border: false,
        labelSeparator: ':',
        labelWidth: 150,
        labelAlign: 'right',
        defaults: {
            border: false
        },
        buttonAlign: 'center',
        buttons: [{
            text: i18n.register,
            type: 'submit',
            handler: registerFn
        }],
        listeners: {
            show: function(){
                var s = Ext.getCmp("ff");
                Ext.getCmp("ff").render()
            }
        },
        items: [new Ext.form.TextField({
            id: 'txt_register_userName',
            fieldLabel: i18n.username,
            width: 150,
            allowBlank: false,
            blankText: i18n.val_usernamenotnull,
            emptyText: i18n.emptext_username,
            regex: /^[\w-_]+$/,
            regexText: i18n.val_usernameformaterror,
            validateOnBlur: true,
            validationEvent: 'blur',
            msgTarget: 'side',
            validator: function(val){
                if (Ext.util.Format.trim(val).length == 0) {
                    Ext.getCmp("txt_register_userName").clearInvalid();
                    Ext.getCmp("txt_register_userName").markInvalid(i18n.val_usernamenotblank);
                    return i18n.val_usernamenotblank;
                }
                else 
                    if (Ext.ux.Util.containEmpty(val)) {
                        Ext.getCmp("txt_register_userName").clearInvalid();
                        Ext.getCmp("txt_register_userName").markInvalid(i18n.val_usernamenotcontainblank);
                        return i18n.val_usernamenotcontainblank;
                    }
                    else {
                        if (!val.match(/^[\w-_]+$/)) {
                            Ext.getCmp("txt_register_userName").clearInvalid();
                            return i18n.val_usernameformaterror;
                        }
                        
                        var conn = Ext.lib.Ajax.getConnectionObject().conn;
                        var url = 'judgeUserNameUnique.do?userName=' + val;
                        conn.open("GET", url, false);
                        conn.send(null);
                        data = conn.responseText;
                        
                        var exception = (Ext.util.JSON.decode(data)).exception;
                        var info = (Ext.util.JSON.decode(data)).info;
                        if (Ext.util.Format.trim(exception).length != 0 &&
                        exception != null) {
                            Ext.Msg.alert(i18n.error, exception);
                            Ext.getCmp("txt_register_userName").markInvalid(i18n.val_judgeusernameuniquefail);
                            return i18n.val_judgeusernameuniquefail;
                        }
                        if (info == "true") {
                            Ext.getCmp("txt_register_userName").clearInvalid();
                            return true;
                        }
                        else {
                            Ext.getCmp("txt_register_userName").markInvalid(i18n.val_usernameexists);
                            return i18n.val_usernameexists;
                        }
                    }
            }
        }), new Ext.form.TextField({
            id: 'txt_register_password',
            fieldLabel: i18n.password,
            inputType: 'password',
            allowBlank: false,
            width: 150,
            blankText: i18n.pwdnotnull,
            msgTarget: 'side',
            validationEvent: 'blur',
            invalidText: i18n.val_passwordnotunanimous,
            validator: function(val){
                if (val.length < 8) {
                    return i18n.val_passworderrorformat;
                }
                var ls = 0;
                if (val.match(/([a-zA-Z])+/)) {
                    ls++;
                }
                if (val.match(/([0-9])+/)) {
                    ls++;
                }
                if (ls < 2) {
                    return (i18n.val_passworderrorformat);
                }
                
                if (!val.match(/^[\w-_.]+$/)) {
                    return (i18n.val_passworderrorformat);
                }
                var pwd = Ext.getCmp("txt_register_rePassword").getValue();
                if (Ext.util.Format.trim(val).length == 0) {
                    Ext.getCmp("txt_register_password").markInvalid(i18n.pwdnotblank);
                    return i18n.pwdnotblank;
                }
                else {
                    if (pwd == "" || pwd == null) {
                        Ext.getCmp("txt_register_rePassword").clearInvalid();
                        return true;
                    }
                    if (val == pwd) {
                        Ext.getCmp("txt_register_rePassword").clearInvalid();
                        Ext.getCmp("txt_register_password").clearInvalid();
                        return true;
                    }
                }
            }
        }), new Ext.form.TextField({
            id: 'txt_register_rePassword',
            inputType: 'password',
            fieldLabel: i18n.repassword,
            allowBlank: false,
            width: 150,
            blankText: i18n.repwdnotnull,
            msgTarget: 'side',
            invalidText: i18n.val_passwordnotunanimous,
            validationEvent: 'blur',
            validator: function(val){
                if (val.length < 8) {
                    return i18n.val_passworderrorformat;
                }
                var ls = 0;
                if (val.match(/([a-zA-Z])+/)) {
                    ls++;
                }
                if (val.match(/([0-9])+/)) {
                    ls++;
                }
                if (ls < 2) {
                    return (i18n.val_passworderrorformat);
                }
                if (!val.match(/^[\w-_.]+$/)) {
                    return (i18n.val_passworderrorformat);
                }
                var pwd = Ext.getCmp("txt_register_password").getValue();
                if (Ext.util.Format.trim(val).length == 0) {
                    Ext.getCmp("txt_register_rePassword").markInvalid(i18n.repwdnotblank);
                    return i18n.repwdnotblank;
                }
                else {
                    if (pwd == "" || pwd == null) {
                        Ext.getCmp("txt_register_password").clearInvalid();
                        return true;
                    }
                    if (val == pwd) {
                        Ext.getCmp("txt_register_rePassword").clearInvalid();
                        Ext.getCmp("txt_register_password").clearInvalid();
                        return true;
                    }
                    else {
                        Ext.getCmp("txt_register_rePassword").clearInvalid();
                        Ext.getCmp("txt_register_rePassword").markInvalid(i18n.val_passwordnotunanimous);
                        return i18n.val_passwordnotunanimous;
                    }
                }
            }
            
        }), new Ext.form.TextField({
            id: 'txt_register_realName',
            fieldLabel: i18n.realname,
            allowBlank: false,
            width: 150,
            blankText: i18n.val_realnamenotnull,
            validationEvent: 'blur',
            msgTarget: 'side',
            validator: function(val){
                var realname = Ext.getCmp("txt_register_realName").getValue();
                if (Ext.util.Format.trim(realname).length == 0) {
                    Ext.getCmp("txt_register_realName").markInvalid(i18n.val_realnamenotblank);
                    return i18n.val_realnamenotblank;
                }
                else {
                
                    var conn = Ext.lib.Ajax.getConnectionObject().conn;
                    var url = 'judgeUserRealNameUnique.do?userRealName=' + val;
                    conn.open("GET", url, false);
                    conn.send(null);
                    data = conn.responseText;
                    
                    var exception = (Ext.util.JSON.decode(data)).exception;
                    var info = (Ext.util.JSON.decode(data)).info;
                    if (Ext.util.Format.trim(exception).length != 0 &&
                    exception != null) {
                        Ext.Msg.alert(i18n.error, exception);
                        Ext.getCmp("txt_register_realName").markInvalid(i18n.val_judgerealnameuniquefail);
                        return i18n.val_judgerealnameuniquefail;
                    }
                    if (info == "true") {
                        Ext.getCmp("txt_register_realName").clearInvalid();
                        return true;
                    }
                    else {
                        Ext.getCmp("txt_register_realName").markInvalid(i18n.var_realnameexists);
                        return i18n.var_realnameexists;
                    }
                }
            }
        }), new Ext.form.TextField({
            id: 'txt_register_adminName',
            fieldLabel: '所属管理员名称', // TODO i18n 下同
            width: 150,
            allowBlank: false,
            blankText: '所属管理员名称不能为空,请重新输入',
            emptyText: '请输入所属管理员名称',
            regex: /^[\w-_]+$/,
            regexText: '所属管理员名称包含数字、字母和特殊字符_-',
            validateOnBlur: true,
            validationEvent: 'blur',
            msgTarget: 'side',
            validator: function(val){
                if (Ext.util.Format.trim(val).length == 0) {
                    Ext.getCmp("txt_register_adminName").clearInvalid();
                    Ext.getCmp("txt_register_adminName").markInvalid('所属管理员名称不能为空格,请重新输入');
                    return '所属管理员名称不能为空格,请重新输入';
                }
                else 
                    if (Ext.ux.Util.containEmpty(val)) {
                        Ext.getCmp("txt_register_adminName").clearInvalid();
                        Ext.getCmp("txt_register_adminName").markInvalid('所属管理员名称不能包含空格,请重新输入');
                        return '所属管理员名称不能包含空格,请重新输入';
                    }
                    else {
                        if (!val.match(/^[\w-_]+$/)) {
                            Ext.getCmp("txt_register_adminName").clearInvalid();
                            return '所属管理员名称包含数字、字母和特殊字符_-';
                        }
						
					return true;
                    // TODO 在这里判断管理员名称是否正确，或者在提交的时候判断
                    /*Ext.Ajax.request({
                    
                     
                    
                     url : 'judgeUserNameUnique.do',
                    
                     
                    
                     params : {
                    
                     
                    
                     userName : val
                    
                     
                    
                     },
                    
                     
                    
                     success : function(resp, opts) {
                    
                     
                    
                     // registerFormPanel.getEl().unmask();
                    
                     
                    
                     var exception = (Ext.util.JSON
                    
                     
                    
                     .decode(resp.responseText)).exception;
                    
                     
                    
                     var info = (Ext.util.JSON.decode(resp.responseText)).info;
                    
                     
                    
                     if (Ext.util.Format.trim(exception).length != 0
                    
                     
                    
                     && exception != null) {
                    
                     
                    
                     Ext.Msg.alert(i18n.error, exception);
                    
                     
                    
                     Ext
                    
                     
                    
                     .getCmp("txt_register_userName")
                    
                     
                    
                     .markInvalid(i18n.val_judgeusernameuniquefail);
                    
                     
                    
                     return i18n.val_judgeusernameuniquefail;
                    
                     
                    
                     }
                    
                     
                    
                     if (info == "true") {
                    
                     
                    
                     Ext.getCmp("txt_register_userName")
                    
                     
                    
                     .clearInvalid();
                    
                     
                    
                     return true;
                    
                     
                    
                     } else {
                    
                     
                    
                     Ext.getCmp("txt_register_userName")
                    
                     
                    
                     .markInvalid(i18n.val_usernameexists);
                    
                     
                    
                     return i18n.val_usernameexists;
                    
                     
                    
                     }
                    
                     
                    
                     },
                    
                     
                    
                     failure : function(resp, opts) {
                    
                     
                    
                     // registerFormPanel.getEl().unmask();
                    
                     
                    
                     var resultArray = (Ext.util.JSON
                    
                     
                    
                     .decode(resp.responseText)).exception;
                    
                     
                    
                     var exceptionE = "";
                    
                     
                    
                     if (resultArray == '' || resultArray == null) {
                    
                     
                    
                     exceptionE = 'Unkown exception';
                    
                     
                    
                     Ext.Msg.alert(i18n.error, exceptionE);
                    
                     
                    
                     } else
                    
                     
                    
                     Ext.Msg.alert(i18n.error, resultArray);
                    
                     
                    
                     }
                    
                     
                    
                     })*/
                    
                    }
                
            }
        }),        /*new Ext.form.ComboBox({
         id : 'combo_register_deptName',
         loadingText : i18n.ldtext_dept,
         msgTarget : 'side',
         editable : false,
         width : 150,
         fieldLabel : i18n.department,
         triggerAction : 'all',
         valueField : 'deptCode',
         displayField : 'deptName',
         forceSelection : true,
         handleHeight : 10,
         emptyText : i18n.combo_emptytext,
         store : new Ext.data.Store({
         fields : ['deptCode', 'deptName'],
         proxy : new Ext.data.HttpProxy({
         url : 'showDeptList.do'
         }),
         reader : new Ext.data.JsonReader({
         root : 'deptlist',
         fields : [{
         name : 'deptCode'
         }, {
         name : 'deptName'
         }]
         }),
         listeners : {
         load : function(store, records) {
         var exception = store.reader.jsonData.exception;
         var info = store.reader.jsonData.info;
         if (Ext.util.Format.trim(exception).length != 0
         && exception != null) {
         Ext.Msg.alert(i18n.error, exception);
         return;
         }
         if (Ext.util.Format.trim(info).length != 0
         && info != null) {
         Ext.Msg.alert(i18n.prompt, info);
         }
         }
         }
         }),
         listeners : {
         select : function(combo, record, index) {
         deptCode = combo.getValue();
         }
         },
         mode : 'remote',
         allowBlank : false,
         width : 150,
         blankText : i18n.val_depnamenotnull
         // msgTarget : 'side'
         })*/
        new Ext.form.TextField({
            id: 'txt_register_email',
            fieldLabel: i18n.email,
            allowBlank: false,
            regex: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            regexText: i18n.val_emailformaterror,
            width: 150,
            blankText: i18n.val_emailnotnull,
            msgTarget: 'side',
            validationEvent: 'blur',
            validator: function(val){
                var realname = Ext.getCmp("txt_register_email").getValue();
                if (Ext.util.Format.trim(realname).length == 0) {
                    Ext.getCmp("txt_register_email").markInvalid(i18n.val_emailnotblank);
                    return i18n.val_emailnotblank;
                }
                else {
                    Ext.getCmp("txt_register_email").clearInvalid();
                    return true;
                }
                
            }
        }), {
            html: "<div style='text-align:center;'><font color='red' style='FONT-FAMILY:Microsoft Yahei'>" +
            i18n.val_passworderrorformat +
            "</font></div>"
        }]
    })
    registerFormPanel.render("registerpanel");
    
    function registerFn(){
        if (registerFormPanel.form.isValid()) {
            var password = registerFormPanel.getForm().findField('txt_register_password').getValue();
            var rePassword = registerFormPanel.getForm().findField('txt_register_rePassword').getValue();
            var userName = registerFormPanel.getForm().findField('txt_register_userName').getValue();
            var realName = registerFormPanel.getForm().findField('txt_register_realName').getValue();
            var adminName = registerFormPanel.getForm().findField('txt_register_adminName').getValue();
            
            var email = registerFormPanel.getForm().findField('txt_register_email').getValue();
            registerFormPanel.getEl().mask(i18n.mask_register);
            Ext.Ajax.request({
                url: 'register.do',
                params: {
                    userName: userName,
                    password: password,
                    adminName: adminName, // TODO
                    //					deptCode : deptCode,
                    realName: realName,
                    email: email
                },
                success: function(resp, opts){
                    registerFormPanel.getEl().unmask();
                    var exception = (Ext.util.JSON.decode(resp.responseText)).exception;
                    var info = (Ext.util.JSON.decode(resp.responseText)).info;
                    if (Ext.util.Format.trim(exception).length != 0 &&
                    exception != null) {
                        Ext.Msg.alert(i18n.error, exception);
                        return;
                    }
                    
                    if (Ext.util.Format.trim(info).length != 0 && info != null) {
                        Ext.Msg.alert(i18n.prompt, info);
                    }
                    
                },
                failure: function(resp, opts){
                    registerFormPanel.getEl().unmask();
                    var resultArray = (Ext.util.JSON.decode(resp.responseText)).exception;
                    var exceptionE = "";
                    
                    if (resultArray == '' || resultArray == null) {
                        exceptionE = 'Unkown exception';
                        Ext.Msg.alert(i18n.error, exceptionE);
                    }
                    else 
                        Ext.Msg.alert(i18n.error, resultArray);
                }
                
            })
        }
    }
    var map = new Ext.KeyMap(document, {
        key: Ext.EventObject.ENTER,
        fn: registerFn
    });
    
    // Ext.get("registerpanel").setStyle('position', 'relative').center(Ext
    // .getBody());
    // Ext.get("content1").setStyle('position', 'absolute').center(Ext
    // .getBody());
    // Ext.get("btm").setStyle('position', 'absolute').center(Ext
    // .getBody());

})
