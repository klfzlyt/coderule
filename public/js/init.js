//inital
(function($){		
		//var selected_Index=0;
	$('#test1234').tabnumber({
	rules: [],
	width: 400,
	onclick: function(e) {
	//	console.log("tabnumber on click: ",e);
		$('#table_tab').tabs('select', e);
			// selected_Index=e;
			 $('#test1234').data('tabnumber').selected_Index=e;
	},
	onupdate: function(e) {
		//console.log("index: " + e.index + " value: " + e.value);
	}
});
//inital
$('#table_tab').tabs({
	fit: true,
	onSelect: function(title, index12) {
		//console.log('tab on Select');
		//	selected_Index=index12;
			 $('#test1234').data('tabnumber').selected_Index=index12;
		$('#test1234').tabnumber('set_active', {
			index: index12,
			raise_event:false
		});	
	},
	onAdd:function(title,index){
		//console.log('tab on Add');
	},
	onupdate_content: function(setting) {
	//	var changed_object = this;
		//console.log("index: " + setting.index + " selecttype:" + setting.data.type + " datavaule: " + setting.data.value);
	}
});
})(jQuery);
