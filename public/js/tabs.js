//(c) Copyright 2015 lyt. All Rights Reserved. 2015-11-26
(function($) {
	//为原先tabs增加新的方法
	$.extend($.fn.tabs.methods, {
		//默认为选中tab，可传入想选中的tab的index
		get_content: function(ob, setting) {
			var default_index = ob.tabs('getTabIndex', ob.tabs('getSelected'));
			var param = $.extend({
				index: default_index
			}, setting);
			var $content = ob.tabs('getTab', param.index);
			return $content;
		},
		add_content: function(ob, setting) {
			var indexx = $.fn.tabs.methods['get_length'].call(ob, ob, setting);
			var param = $.extend({
				content: '',
				index: indexx,
				title: "tab" + indexx,
				closable: false,
				selected: true,
				iconCls: null,
				data: {}
			}, setting);
			//string_html得带script
			var string_html = param.content;
			string_html = string_html.replace(/id="(\w+)"|id='(\w+)'/g, 'id="$1_' + param.index + '"');
			string_html = string_html.replace(/#([0-9A-Za-z_]+)/g, '#$1_' + param.index);
			var tab_index = param.index;
			ob.tabs('add', {
				id: param.index,
				title: param.title,
				selected: param.selected,
				closable: param.closable,
				iconCls: param.iconCls,
				content: string_html
			});
			tabcontent_script(ob);
			if (param.data.name == "dic") {
				//直接触发选择要好一点
				//字典是3号
				$('#cc_' + param.index).combo('setValue', '03').combo('setText', "字典").combo('hidePanel');
				//$('#cc_'+param.index).data('combo').options.onChange.call($('#cc_'+param.index),'03','03');
				var arryofdic = param.data.data.content.value;
				for (var i = 0; i < arryofdic.length; i++) {
					$('#dg_' + param.index).datagrid('appendRow', {
						attr1: arryofdic[i].key,
						attr2: arryofdic[i].value
					});
				}
			}
			if (param.data.name == "fix") {
				$('#cc_' + param.index).combo('setValue', '01').combo('setText', "固定").combo('hidePanel');
				//$('#cc_'+param.index).data('combo').options.onChange.call($('#cc_'+param.index),'01','01');
				$('#fix_input_' + param.index).textbox('setValue', param.data.data.content.value);
			}
			if (param.data.name == 'flu') {
				$('#cc_' + param.index).combo('setValue', '02').combo('setText', "流水").combo('hidePanel');
				//$('#cc_'+param.index).data('combo').options.onChange.call($('#cc_'+param.index),'02','02');
				$('#flu_input_' + param.index).textbox('setValue', param.data.data.content.value.content);
				//TODO还需要选择一个日期   纯数字 混合
			}
			if (param.data.name == "custom") {
				$('#cc_' + param.index).combo('setValue', '04').combo('setText', "自定义").combo('hidePanel');
				//$('#cc_'+param.index).data('combo').options.onChange.call($('#cc_'+param.index),'04','04');

			}

			//加一个js 动态的
		},
		get_length: function(ob, setting) {
			return ob.tabs('tabs').length;
		},
		get_rules: function(ob, setting) {
			var resultss = [];
			var length = $.fn.tabs.methods['get_length'].call(ob, ob, setting);
			for (var i = 0; i < length; i++) {
				var setting = {};
				setting.index = i;
				resultss.push($.fn.tabs.methods['get_rule'].call(ob, ob, setting));
			}
			return resultss;
		},
		get_rule: function(ob, setting) {
			var length = $.fn.tabs.methods['get_length'].call(ob, ob, setting);
			var param = $.extend({
				index: length - 1,
				comboxid: '#cc'
			}, setting);
			var $contet = $.fn.tabs.methods['get_content'].call(ob, ob, param);
			var combvalue = $(param.comboxid + '_' + param.index).combo('getValue');
			//01 固定
			if (combvalue == '01') {
				var ans = {};
				ans.name = "fix";
				ans.data = $('#fix_input_' + param.index).textbox('getValue');
				return ans;

			}
			//流水
			if (combvalue == '02') {
				var ans = {};
				ans.name = "flu";
				ans.data = $('#flu_input_' + param.index).textbox('getValue');
				return ans;
			}
			//字典
			if (combvalue == '03') {
				var ans = {};
				var result = [];
				var $datagrid = $('#dg_' + param.index);
				var rows = $datagrid.datagrid('getData').rows;
				for (var i = 0; i < rows.length; i++) {
					var data = rows[i];
					var _key = data.attr1;
					var _value = data.attr2;
					var _temp = {
						key: _key,
						value: _value
					};
					result.push(_temp);
				}
				ans.name = 'dic';
				ans.data = result;
				return ans;
			}
			//自定义
			if (combvalue == '04') {
				var ans = {};
				ans.name = "custom";
				ans.data = undefined;
				return ans;
			}
		},
		close_all: function(ob, setting) {
			var length = $.fn.tabs.methods['get_length'].call(ob, ob, setting);
			for (var i = 0; i < length; i++) {
				ob.tabs('close', length - 1 - i);
			}
		}

	});
})(jQuery)