//inital

$(document).ready(function(){
	//验证规则
	$.extend($.fn.validatebox.defaults.rules, {
		length_single: {
			validator: function(value, param) {

				return value.length === param[0];
			},
			message: "请输入{0}位字符"
		}
	});
	var $tab_main = $.ajax({
		url: "tabcontent.html",
		async: false
	}).responseText;
	$tab_main = $tab_main.replace('none', 'block');

	$('#add_btn').bind('click', function(e) {
		//这里要判断能不能加规则，如果是类别，就不能加									
		e.preventDefault();
		e.stopPropagation();
		if ($('#tt').tree('getSelected').isClass) return;
		$('#numberblock').tabnumber('add_Item', {});
		$('#table_tab').tabs('add_content', {
			content: $tab_main,
			closable: false,
			selected: true,
			datavalidate: 1,
			save_func: function() {
				$('#tt').tree('update_node', {
					node: $('#tt').tree('getSelected'),
					callback: function(str) {
						var ob = JSON.parse(str);
						if (!ob.error) {
							$.messager.alert('消息', '规则保存成功！', 'info');
						}
					}
				});
			}
		});

	});
	$('#delete_btn').bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		if ($('#tt').tree('getSelected').isClass) return;
		var length = $('#numberblock').tabnumber('get_length', {});
		$('#numberblock').tabnumber('remove_Item', {});
		$('#table_tab').tabs('close', length - 1);
	});
	$('#numberblock').tabnumber({
		rules: [],
		width: 400,
		onclick: function(e) {
			//	console.log("tabnumber on click: ",e);
			$('#table_tab').tabs('select', e);
			// selected_Index=e;
			$('#numberblock').data('tabnumber').selected_Index = e;
		},
		onupdate: function(e) {
			var setting = {};
			setting.index = e.index;
			setting.val = "length_single[" + e.value + "]";
			$('#table_tab').tabs('update_validateRule', setting);
			//	console.log("更新tab索引: ", e.index, " 更新值: ", e.value);
		}
	});
	//inital
	$('#table_tab').tabs({
		fit: true,
		onSelect: function(title, index12) {
			//console.log('tab on Select');
			//	selected_Index=index12;
			$('#numberblock').data('tabnumber').selected_Index = index12;
			$('#numberblock').tabnumber('set_active', {
				index: index12,
				raise_event: false
			});
		},
		onAdd: function(title, index) {
			//console.log('tab on Add');
		},
		onupdate_content: function(setting) {
			//	var changed_object = this;
			//console.log("index: " + setting.index + " selecttype:" + setting.data.type + " datavaule: " + setting.data.value);
		}
	});
})