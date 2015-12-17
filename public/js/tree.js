(function($) {
	//初始化的json
	function post_method(url, datastr, cb) {
		$.ajax({
			type: "POST",
			url: url,
			contentType: 'application/json', // request payload type
			"content-type": "application/json", // what we want back
			data: datastr,
			success: cb
		});
	}


	function put_method(url, datastr, cb) {
		$.ajax({
			type: "PUT",
			url: url,
			contentType: 'application/json', // request payload type
			"content-type": "application/json", // what we want back
			data: datastr,
			success: cb
		});
	}

	$('#append_slingber').bind('click', function(e) {
		e.stopPropagation();
		append_slingber();
	});


	function append_slingber() {
		var t = $('#tt');
		var node = t.tree('getSelected');
		var parents_arr = $('#tt').tree('getparents_new', {
			node: node
		});
		var result_temp = [];
		for (var i = 0; i < parents_arr.length; i++) {

			result_temp.push(parents_arr[i].id)
		}
		var thisnode = {};
		thisnode.depth = result_temp.length + 1;
		thisnode.name = '新规则';
		thisnode.parents_id = result_temp;
		thisnode.rule = [];
		var jstr = JSON.stringify(thisnode);
		put_method('/addrule', jstr, function(str) {
			t.tree('append', {
				parent: (node ? $(node.target).parents('li').eq(1).children('div').first() : null),
				data: [{
					id: str,
					text: '新规则',
					rule: [],
					isClass: false,
					children: []
				}]
			});
			if (t.tree('getParent', node.target)) {
				if (t.tree('getParent', node.target).isClass)
					t.tree('update_node', {
						node: t.tree('getParent', node.target)
					});
			}
		});



	}

	$('#append_slingber_class').bind('click', function(e) {
		e.stopPropagation();
		append_slingber_class();
	});

	function append_slingber_class() {
		var t = $('#tt');
		var node = t.tree('getSelected');
		var parents_arr = $('#tt').tree('getparents_new', {
			node: node
		});
		var result_temp = [];
		for (var i = 0; i < parents_arr.length; i++) {

			result_temp.push(parents_arr[i].id);
		}
		var thisnode = {};
		thisnode.depth = result_temp.length + 1;
		thisnode.name = '新类别';
		thisnode.children_length = 0;
		thisnode.parents_id = result_temp;
		var jstr = JSON.stringify(thisnode);
		put_method('/addclass', jstr, function(str) {
			t.tree('append', {
				parent: (node ? $(node.target).parents('li').eq(1).children('div').first() : null),
				data: [{
					id: str,
					text: '新类别',
					isClass: true,
					children: []
				}]
			});
			if (t.tree('getParent', node.target)) {
				if (t.tree('getParent', node.target).isClass)
					t.tree('update_node', {
						node: t.tree('getParent', node.target)
					});
			}
		});

	}

	$('#append_class').bind('click', function(e) {
		e.stopPropagation();
		append_class();
	});

	function append_class() {
		var t = $('#tt');
		var node = t.tree('getSelected');
		var parents_arr = $('#tt').tree('getparents_new', {
			node: node
		});
		var result_temp = [];
		for (var i = 0; i < parents_arr.length; i++) {
			//if(parents_arr[i].isClass)
			result_temp.push(parents_arr[i].id)
		}

		result_temp.push(node.id);

		var thisnode = {};
		thisnode.depth = result_temp.length + 1;
		thisnode.name = '新类别';
		thisnode.children_length = 0;
		thisnode.parents_id = result_temp;
		var jstr = JSON.stringify(thisnode);
		put_method('/addclass', jstr, function(str) {
			t.tree('append', {
				parent: (node ? node.target : null),
				data: [{
					id: str,
					text: '新类别',
					isClass: true,
					children: []
				}]
			});
			t.tree('update_node', {
				node: node
			});
		});

	}

	$('#append').bind('click', function(e) {
		e.stopPropagation();
		append();
	});

	function append() {
		var t = $('#tt');
		var node = t.tree('getSelected');
		var parents_arr = $('#tt').tree('getparents_new', {
			node: node
		});
		var result_temp = [];
		for (var i = 0; i < parents_arr.length; i++) {
			result_temp.push(parents_arr[i].id)
		}
		result_temp.push(node.id);
		var thisnode = {};
		thisnode.depth = result_temp.length + 1;
		thisnode.name = '新规则';
		thisnode.parents_id = result_temp;
		thisnode.rule = [];
		var jstr = JSON.stringify(thisnode);
		put_method('/addrule', jstr, function(str) {
			t.tree('append', {
				parent: (node ? node.target : null),
				data: [{
					id: str,
					text: '新规则',
					rule: [],
					isClass: false,
					children: []
				}]
			});
			t.tree('update_node', {
				node: node
			});
		});
	}
	$('#removeit').bind('click', function(e) {
		e.stopPropagation();
		removeit();
	});

	function removeit() {
		var t = $('#tt');
		var node = t.tree('getSelected');
		if (node.children.length != 0) {
			$.messager.alert('注意', '存在子节点，不能移除！', 'info');
			return;
		}
		$.messager.confirm('注意', '是否要移除此节点?', function(r) {
			if (r) {
				var _temp = $.extend(true, {}, node);
				_temp.target = undefined;
				var nodestr = JSON.stringify(_temp);
				post_method('/deleteNode', nodestr, function(res) {
					if (res === 'ok') {
						var temp = node.target;
						var parent = t.tree('getParent', temp);
						$('#tt').tree('remove', temp);
						if (parent && parent.isClass) {
							t.tree('update_node', {
								node: parent
							});
						}
						var tab = t.data('tree').options.tabs;
						var input_number = t.data('tree').options.input_number;
						tab.tabs('close_all');
						input_number.tabnumber('clear_all');
					}
				});
			} else {
				//do nothing
			}
		});
	}
	$('#collapse').bind('click', function(e) {
		e.stopPropagation();
		collapse();
	});

	function collapse() {
		var node = $('#tt').tree('getSelected');
		$('#tt').tree('collapse', node.target);
	}
	$('#expand').bind("click", function(e) {
		e.stopPropagation();
		expand();
	});

	function expand() {
		var node = $('#tt').tree('getSelected');
		$('#tt').tree('expand', node.target);
	}

	var json_str = $.ajax({
		url: "./getall.json",
		async: false
	}).responseText;
	var json_ob_arr = JSON.parse(json_str);
	var $tab_main = $.ajax({
		url: "./tabcontent.html",
		async: false
	}).responseText;
	//每次切换都要请求一次
	$tab_main = $tab_main.replace('none', 'block');
	$('#tt').tree({
		data: json_ob_arr,
		animate: true,
		dnd: false,
		lines: true,
		tabs: $('#table_tab'),
		input_number: $('#numberblock'),
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
		onClick: function(node) {

		},
		onDblClick: function(node) {
			$(this).tree('beginEdit', node.target);
		},
		onSelect: function(node) {
			var ob = $(this);
			ob.data('tree').options.lastselect_node = ob.data('tree').options.currentnode;
			ob.data('tree').options.currentnode = node;
			if (node === ob.data('tree').options.lastselect_node) return;
			ob.data('tree').options.onSelect_old.call(this, ob.data('tree').options.lastselect_node, node);
		},
		onAfterEdit: function(node) {
			var ob = $(this);
			ob.tree('update_node', {
				node: node,
				callback: function(str) {
					var obb = JSON.parse(str);
					if (!obb.error) {
						//alert("修改成功");
					}
				}
			});
			//alert(node.text);
		},
		onUpdate_rule: function(node) {
			var rule = node.rule;
		},
		//pram:oldnode 上次选中的node
		//pram:newnode 本次选中的node
		//当选中改变时，要切换从新生成tabcontent
		onSelect_old: function(oldnode, newnode) {
			var ob = $(this);
			ob.tree('update_node', {
				node: oldnode
			});
			var tab;
			var lastselected_indexx = ob.data('tree').options.input_number.data('tabnumber').selected_Index;
			if (newnode.isClass) {
				tab = ob.data('tree').options.tabs;
				tab.tabs('close_all');
				ob.data('tree').options.input_number.tabnumber('clear_all');
				return;
			}
			tab = ob.data('tree').options.tabs;
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
					data: noderule[i],
					datavalidate: noderule[i].data.length,
					title: noderule[i].data.name,
					save_func: function() {
						ob.tree('update_node', {
							node: ob.tree('getSelected'),
							callback: function(str) {
								var ob = JSON.parse(str);
								if (!ob.error) {
									$.messager.alert('消息', '规则保存成功！', 'info');
								}
							}
						});
					}
				});
			}
			if (lastselected_indexx === undefined) return;
			//console.log(lastselected_indexx);
			$('#table_tab').tabs('select', lastselected_indexx);
			//获得 以前选中的index，重新选中
			//var selected_index=input_number.data('tabnumber').selected_Index;
			//	console.log("selected_index: ",selected_index);

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
		getparents_new: function(ob, param) {
			var targetnode = param.node;
			var result = [];
			//循环调用$('#tt').tree('getParent',selected.target)
			targetnode = ob.tree('getParent', targetnode.target);
			if (targetnode === null) return [];
			//result.unshift(targetnode);
			while (targetnode) {
				result.unshift(targetnode);
				targetnode = ob.tree('getParent', targetnode.target);
			}
			return result;

		},
		//以数组形式存入某node的父元素
		getparents: function(ob, param) {
			var targetnode = param.node;
			var result = [];
			//回溯法递归获得
			function backtrace(root, target, ans) {
				if (root === undefined) return false;
				if (root === target) {
					return true;
				}
				for (var i = 0; i < root.children.length; i++) {
					ans.push(root);
					var bools = backtrace(root.children[i], target, ans);
					if (bools) return true;
					ans.pop();
				}
				return false;
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
			var callback = param.callback || function() {};
			var isEmptyObject=function( obj ) { 
			for ( var name in obj ) { 
			return false; 
			} 
			return true; 
			};
			if(isEmptyObject(node))return;
			//如果没有rule return 有rule的话一定是[]
			//	if (!node.rule) return;		
			if (node === null) {
				return;
			}
			node.children_length = node.children ? node.children.length : 0;
			var jstr;
			if (node.isClass) {
				var temp = $.extend(true, {}, node);
				temp.target = undefined;
				jstr = JSON.stringify(temp);
				post_method('./updateclass', jstr, callback);
				return;
			}
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
				objec_temp.data.name = tabs_rules[i].segmentinfo.name;
				objec_temp.data.backup = tabs_rules[i].segmentinfo.backup;
				if (objec_temp.name === 'fix') {
					objec_temp.data.content.value = tabs_rules[i].data;
				}
				if (objec_temp.name === 'dic') {
					objec_temp.data.content.value = tabs_rules[i].data;
				}
				if (objec_temp.name === 'flu') {
					objec_temp.data.content.value = {};
					objec_temp.data.content.value.type = tabs_rules[i].type;
					objec_temp.data.content.value.content = tabs_rules[i].data;
				}
				if (objec_temp.name === 'custom') {

				}
				new_arr.push(objec_temp);
			}
			node.rule = new_arr;
			var _temp = $.extend(true, {}, node);
			_temp.target = undefined;
			jstr = JSON.stringify(_temp);
			post_method('./updaterule', jstr, callback);
		}


	});
})(jQuery)