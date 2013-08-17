/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */

tinymce.PluginManager.add('download', function(editor) {
	
	function showFileDialog()
	{
		
	var insertContentFun=function(pathArray)
	{
		var content="";
		if(pathArray)
		{
		for(var i=0;i<pathArray.length;i++)
		{
		content+="<a class='download' href='downloadFile.action?filename=/" + pathArray[i] + "' target='_self' >"+pathArray[i].substring(pathArray[i].lastIndexOf("/")+1,pathArray[i].length)+"</a><br />";
			
		}
		this.editor.insertContent(content);
		}
	
	
	}
	
	var win, data={}, dom = editor.dom;
	var selection = editor.selection;
	var path;
	var selectedElm = selection.getNode();
		anchorElm = dom.getParent(selectedElm, 'a[href]');
		if (anchorElm) {
			selection.select(anchorElm);
		

		data.text = initialText = selection.getContent({format: 'text'});
		data.href = anchorElm ? dom.getAttrib(anchorElm, 'href') : '';
		data.target = anchorElm ? dom.getAttrib(anchorElm, 'target') : '';
		data.rel = anchorElm ? dom.getAttrib(anchorElm, 'rel') : '';
		path=data.href;
		}
		
	 TinymceFileSeletor(editor,path,null,insertContentFun);
	
	}
	
	
	editor.addButton('download', {
//		icon: 'browse',
		image:'images/icons/arrow-down.gif',
		tooltip: 'Insert/edit download',
		shortcut: 'Ctrl+N',
		onclick: showFileDialog,
		stateSelector: 'a[class=download]'
	});

	editor.addShortcut('Ctrl+N', '', showFileDialog);


	editor.addMenuItem('download', {
//		icon: 'browse',
		image:'images/icons/arrow-down.gif',
		text: 'Insert download',
		shortcut: 'Ctrl+N',
		onclick: showFileDialog,
		stateSelector: 'a[class=download]',
		context: 'insert',
		prependToContext: true
	});
});