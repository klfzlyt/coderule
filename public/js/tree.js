function append_slingber() {
	var t = $('#tt');
	var node = t.tree('getSelected');
	t.tree('append', {
		parent: (node ? $(node.target).parents('li').eq(1).children('div').first() : null),
		data: [{
			text: '新条目',
			rule: [],
			isClass:false
		}]
	});
}
function append_slingber_class() {
	var t = $('#tt');
	var node = t.tree('getSelected');
	var parents_arr=$('#tt').tree('getparents',{node:node});
	var result_temp=[];
	for(var i=0;i<parents_arr.length;i++){
		
		result_temp.push(parents_arr[i].id)
	}
	var thisnode={};
	thisnode.depth=result_temp.length+1;
	thisnode.name='新类别';
	thisnode.parents=result_temp;
	var jstr=JSON.stringify(thisnode);
	put_method('/addclass',jstr,function(str){
		t.tree('append', {
			parent: (node ? $(node.target).parents('li').eq(1).children('div').first() : null),
			data: [{
				id:str,
				text: '新类别',
				rule: [],
				isClass:true
			}]
		});		
	});
}
function put_method(url,datastr,cb){
    $.ajax({
        type: "PUT",
        url: url,
        contentType: 'application/json',    // request payload type
        "content-type": "application/json",   // what we want back
        data: datastr,
        success: cb
    });
}
function append_class() {
	var t = $('#tt');
	var node = t.tree('getSelected');
	var parents_arr=$('#tt').tree('getparents',{node:node});
	var result_temp=[];
	for(var i=0;i<parents_arr.length;i++){
		//if(parents_arr[i].isClass)
		result_temp.push(parents_arr[i].id)
	}
	
		result_temp.push(node.id);

	var thisnode={};
	thisnode.depth=result_temp.length+1;
	thisnode.name='新类别';
	thisnode.parents=result_temp;
	var jstr=JSON.stringify(thisnode);
	put_method('/addclass',jstr,function(str){
	t.tree('append', {
		parent: (node ? node.target : null),
		data: [{
			id:str,
			text: '新类别',
			rule: [],
			isClass:true
		}]
	});
	});
}
function append() {
	var t = $('#tt');
	var node = t.tree('getSelected');
	t.tree('append', {
		parent: (node ? node.target : null),
		data: [{
			text: '新规则',
			rule: [],
			isClass:false
		}]
	});
}

function removeit() {
	var node = $('#tt').tree('getSelected');
	if(node.isClass)return;
	$('#tt').tree('remove', node.target);
	var tab = $('#tt').data('tree').options.tabs;
	var input_number = $('#tt').data('tree').options.input_number;
	tab.tabs('close_all');
	input_number.tabnumber('clear_all');
}

function collapse() {
	var node = $('#tt').tree('getSelected');
	$('#tt').tree('collapse', node.target);
}

function expand() {
	var node = $('#tt').tree('getSelected');
	$('#tt').tree('expand', node.target);
}
(function($) {


	var json_str = $.ajax({
		url: "./json/data2.json",
		async: false
	}).responseText;

	var json_ob_arr = JSON.parse(json_str);
	$('#tt').tree({
		data: json_ob_arr,
		animate: true,
		dnd: false,
		lines: true,
		tabs: $('#table_tab'),
		input_number: $('#test1234'),
		currentnode: {},
		lastselect_node: {},
		onContextMenu: function(e, node) {
			e.preventDefault();
			$(this).tree('select', node.target);
			$('#mm').menu('show', {
				left: e.pageX,
				top: e.pageY
			});
		},
		formatter: function(node) {
			var s = node.text;
			if (node.children) { //这里可能要做一些兼容性处理
				s += ' <span style=\'color:blue\'>(' + node.children.length + ')</span>';
			}
			return s;
		},
		onDblClick: function(node) {
			$(this).tree('beginEdit', node.target);
		},
		onSelect: function(node) {
			var ob = $(this);
			ob.data('tree').options.lastselect_node = ob.data('tree').options.currentnode;
			ob.data('tree').options.currentnode = node;
			if (node == ob.data('tree').options.lastselect_node) return;
			ob.data('tree').options.onSelect_old.call(this, ob.data('tree').options.lastselect_node, node);
		},
		onAfterEdit: function(node) {

			//alert(node.text);
		},
		onUpdate_rule: function(node) {
			var rule = node.rule;
			//TODO
			//想办法给node.rule增加一些新的值
		},
		//pram:oldnode 上次选中的node
		//pram:newnode 本次选中的node
		//当选中改变时，要切换从新生成tabcontent
		onSelect_old: function(oldnode, newnode) {
			var ob = $(this);
			
			ob.tree('update_node', {
				node: oldnode
			});
			if(newnode.isClass)return;
			var $tab_main = $.ajax({
				url: "./tabcontent.html",
				async: false
			}).responseText;
			//每次切换都要请求一次
			$tab_main = $tab_main.replace('none', 'block');
			var tab = ob.data('tree').options.tabs;
			var input_number = ob.data('tree').options.input_number;
			tab.tabs('close_all');
			input_number.tabnumber('clear_all');
			var noderule = newnode.rule;
			for (var i = 0; i < noderule.length; i++) {
				input_number.tabnumber('add_Item', {
					length: noderule[i].data.length
				});
				tab.tabs('add_content', {
					content: $tab_main,
					data: noderule[i]
				});
			}

		}
	});


	$.extend($.fn.tree.methods, {
		selectedchanged: function($jq, param) {

			var callback = param;
			var preselect;
			var nowselect;
			preselect = nowselect;
			norwselect = $jq.tree('getSelected');
			callback(preselect, nowselect);
		},
		//以数组形式存入某node的父元素
		getparents: function(ob, param) {
			var targetnode = param.node;
			var result = [];
			//回溯法递归获得
			function backtrace(root, target, ans) {
				if (root == undefined) return false;
				if (root == target) {
					return true;
				}
				for (var i = 0; i < root.children.length; i++) {
					ans.push(root);
					var bools = backtrace(root.children[i], target, ans);
					if (bools) return true;
					ans.pop();
				}
			};
			backtrace(ob.tree('getRoot'), targetnode, result);

			return result;
		},
		get_json_str: function(ob, param) {
			var currentselected = ob.tree('getSelected');
			ob.tree('update_node', {
				node: currentselected
			});
			//然后开始从根遍历 
			var rootnode = ob.tree('getRoot');
			return JSON.stringify(rootnode);
		},
		//根据用户更新的规则，更新node的rule
		update_node: function(ob, param) {
			var node = param.node;
			//如果没有rule return 有rule的话一定是[]
			if (!node.rule) return;
			if(node.isClass)return;
			var tab = ob.data('tree').options.tabs;
			var input_number = ob.data('tree').options.input_number;
			var tabs_rules = tab.tabs('get_rules');
			var input_rules = input_number.tabnumber('get_rules');
			var new_arr = [];
			for (var i = 0; i < input_rules.length; i++) {
				var objec_temp = {};
				objec_temp.name = tabs_rules[i].name;
				objec_temp.data = {};
				objec_temp.data.length = input_rules[i];
				objec_temp.data.content = {};
				if (objec_temp.name == 'fix') {
					objec_temp.data.content.value = tabs_rules[i].data;
				}
				if (objec_temp.name == 'dic') {
					objec_temp.data.content.value = tabs_rules[i].data;

				}
				if (objec_temp.name == 'flu') {
					objec_temp.data.content.value = {};
					objec_temp.data.content.value.type = "";
					objec_temp.data.content.value.content = tabs_rules[i].data;
				}
				if (objec_temp.name == 'custom') {

				}
				new_arr.push(objec_temp);
			}
			node.rule = new_arr;
		}


	});
})(jQuery)