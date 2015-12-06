//inital
$('#test1234').tabnumber({
	rules: [],
	width: 400,
	onclick: function(e) {
		$('#table_tab').tabs('select', e);
	},
	onupdate: function(e) {
		console.log("index: " + e.index + " value: " + e.value);
	}
});
//inital
$('#table_tab').tabs({
	fit: true,
	onSelect: function(title, index12) {
		$('#test1234').tabnumber('set_active', {
			index: index12
		});
	},
	onupdate_content: function(setting) {
		var changed_object = this;
		console.log("index: " + setting.index + " selecttype:" + setting.data.type + " datavaule: " + setting.data.value);
	}
});