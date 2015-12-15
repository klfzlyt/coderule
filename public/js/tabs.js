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
				data: {},
				datavalidate:1
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
			if(param.data.data){
			$("#regu_name_"+param.index).textbox('setValue',param.data.data.name);
			$("#backupinput_"+param.index).textbox('setValue',param.data.data.backup);
			}
			if (param.data.name === "dic") {
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
			if (param.data.name === "fix") {
				$('#cc_' + param.index).combo('setValue', '01').combo('setText', "固定").combo('hidePanel');
				//$('#cc_'+param.index).data('combo').options.onChange.call($('#cc_'+param.index),'01','01');
				$('#fix_input_' + param.index).val(param.data.data.content.value);
				//$('#fix_input_' +param.index).validatebox('validate');
			}
			if (param.data.name === 'flu') {
				$('#cc_' + param.index).combo('setValue', '02').combo('setText', "流水").combo('hidePanel');
				//$('#cc_'+param.index).data('combo').options.onChange.call($('#cc_'+param.index),'02','02');
				if(param.data.data.content.value.type==="number"){
					$('#number_linkbtn_'+param.index).linkbutton('select');
				}
				else if(param.data.data.content.value.type==="alphebat"){
					$('#alphebat_linkbtn_'+param.index).linkbutton('select');
				}
				else if(param.data.data.content.value.type==="date"){
					$('#date_linkbtn_'+param.index).linkbutton('select');
				}
				else{
					//do nothing
				}
				$('#flu_input_' + param.index).val(param.data.data.content.value.content);
			//	$('#flu_input_' +param.index).validatebox('validate');
			
			}
			if (param.data.name === "custom") {
				$('#cc_' + param.index).combo('setValue', '04').combo('setText', "自定义").combo('hidePanel');
				//$('#cc_'+param.index).data('combo').options.onChange.call($('#cc_'+param.index),'04','04');
			}
			var rulestrr="length_single["+param.datavalidate+"]";
			var _temp={};
			_temp.val=rulestrr;
			$.fn.tabs.methods['update_validateRule'].call(ob, ob, _temp);
			
			$('#tab_save_'+param.index).bind('click',function(e){
				e.preventDefault();
				e.stopPropagation();
				param.save_func();						
			});
								
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
			var ans = {};
			var $contet = $.fn.tabs.methods['get_content'].call(ob, ob, param);
			var combvalue = $(param.comboxid + '_' + param.index).combo('getValue');			
			
			
			var segment={};
			segment.name=$('#regu_name_'+param.index).textbox('getValue');
			segment.backup=$('#backupinput_'+param.index).textbox('getValue');
			//01 固定
			ans.segmentinfo=segment;
			if (combvalue == '01') {
				
				ans.name = "fix";
				ans.data = $('#fix_input_' + param.index).val();
				return ans;

			}
			//流水
			if (combvalue == '02') {
			
				ans.name = "flu";
				var numer=$('#number_linkbtn_'+param.index).data('linkbutton').options.selected;
				var alph=$('#alphebat_linkbtn_'+param.index).data('linkbutton').options.selected;
				var dateboolean=$('#date_linkbtn_'+param.index).data('linkbutton').options.selected;
				if(numer)ans.type="number";
				else if(alph)ans.type="alphebat";
				else if(dateboolean)ans.type="date";
				else{//nothing
				}
				ans.data = $('#flu_input_' + param.index).val();
				return ans;
			}
			//字典
			if (combvalue == '03') {
				
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
		},
		update_validateRule:function(ob,setting){
			//默认更新最后一个tab的规则
			//默认为1个字符长度
			var length = $.fn.tabs.methods['get_length'].call(ob, ob, setting);
			var param = $.extend({
				index: length - 1,
				val:'length_single[1]'
			}, setting);
			$('#flu_input_'+param.index).data('validatebox').options.validType=param.val;
			$('#fix_input_'+param.index).data('validatebox').options.validType=param.val;
			$('#dg_'+param.index).data('datagrid').options.columns[0][1].editor.options.validType=param.val;
			//$('#flu_input_'+param.index)
			//$('#fix_input_'+param.index)
			//$('#dg_'+param.index)						
			$('#flu_input_' +param.index).validatebox('validate');
			$('#fix_input_' +param.index).validatebox('validate');
		}

	});
})(jQuery)