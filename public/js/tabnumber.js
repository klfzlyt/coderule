//(c) Copyright 2015 lyt. All Rights Reserved. 2015-11-26
(function($) {
	$.fn.tabnumber = function(setting, o) {
		if (typeof setting == "string") {
			return $.fn.tabnumber.methods[setting].call(this, o);
		}
		if (typeof setting == 'object') {
			var param = $.extend({
				render_To: this,
				input_width: 300,
				activeclass: "tabnumber_activeclass",
				rules: [0]
			}, setting);
			var property_data = $.extend({}, this.tabnumber.default.property, this.tabnumber.default.callbacks, param);

			this.each(function(i) {
				$.data(this, 'tabnumber', property_data);
			});
			var ruls = this.data('tabnumber').rules;
			for (var i = 0; i < ruls.length; i++) {
				$.fn.tabnumber.methods['add_Item'].call(this, {
					length: ruls[i]
				});
			}


		}
	};
	$.fn.tabnumber.default = {};
	$.fn.tabnumber.default.property = {
		rules: [0]
	};
	$.fn.tabnumber.default.callbacks = {
		onadd: function(item) {},
		onclick: function(item) {},
		onchange: function(item) {}
	};
	$.fn.tabnumber.methods = {};
	$.extend($.fn.tabnumber.methods, {
		add_Item: function(setting) {
			var indexx = $.fn.tabnumber.methods['get_length'].call(this, setting);
			var param = $.extend({
				activeclassName: 'ttttt',
				length: 1,
				index: indexx,
				hovercontainercssname:'hovercontainer'
			}, setting);
			if (param.length <= 0) return;
			var THIs = this;

			var container = $('<div class="Item" style="float:left"></div>')
				.bind('mouseenter', function(e) {
					//console.log("testsets");
					hover_container.show();
				})
				.bind('mouseleave', function(e) {
					hover_container.hide();

				}).bind('click', function(e) {
					///callback
				//	console.log('container click');
					e.preventDefault();
					e.stopPropagation();
					var childrens = THIs.children("div.Item").removeClass(param.activeclassName);
					$(this).addClass(param.activeclassName);
					for (var i = 0; i < childrens.length; i++) {
						if ($(childrens[i]).hasClass(param.activeclassName)) {
							//THIS & this
							THIs.data('tabnumber').onclick.call(this, i);
						}
					}
				});
			var numberinput = $('<div></div>').appendTo(container);
			var hover_container = $('<div></div>').appendTo(container).hide().addClass(param.hovercontainercssname);
			var numberinput_1 = $.fn.numberinput.number_input({
				render_To: numberinput,
				number_of_input: param.length,
			});

			$('<input id="input_slider_' + param.index + '" style="width:100px"/>').appendTo(hover_container).slider({
				showTip: true,
				rule: [1, '|', 5, '|', 10, '|', 15, '|', 20],
				max: 20,
				min: 1,
				value: param.length,
				onChange: function(old, newvalue) {
					numberinput_1.numberinput.set_number_of_container.call(numberinput_1, old);
					var _param = {};
					_param.index = param.index;
					_param.value = old;
					THIs.data('tabnumber').onupdate.call(this, _param);

				}
			});
			container.appendTo(THIs);
			THIs.data('tabnumber').onadd.call(THIs, container);


		},
		remove_Item: function(setting) {
			var THIS = this;
			var childrens = THIS.children("div.Item");
			var param = $.extend({
				index: childrens.length - 1,
			}, setting);
			var index = param.index;
			if (index >= 0)
				$(childrens[index]).remove();
		},
		set_active: function(setting) {
			var THIS = this;
			var param = $.extend({
				index: 0,
				activeclassName: 'ttttt',
				raise_event:true
			}, setting);
			var childrens = THIS.children("div.Item").removeClass(param.activeclassName);
			$(childrens[param.index]).addClass(param.activeclassName);
			if(param.raise_event)
			THIS.data('tabnumber').onclick.call(THIS, param.index);
		},
		get_selected: function(setting) {
			var param = $.extend({
				activeclassName: 'ttttt'
			}, setting);
			var children = THIS.children("div.Item");
			for (var i = 0; i < children.length; i++) {
				if ($(children[i]).hasClass(param.activeclassName)) return i;
			}
			return 0;
		},
		clear_all: function(setting) {
			var le = this.children("div.Item").length;
			while (le--) {
				$.fn.tabnumber.methods['remove_Item'].call(this, setting);
			}
		},
		get_length: function(setting) {
			return this.children("div.Item").length;
		},
		get_rule: function(setting) {
			var param = $.extend({
				index: 0
			}, setting);
			return $('#input_slider_' + param.index).slider('getValue');
		},
		get_rules: function(setting) {
			var length = $.fn.tabnumber.methods['get_length'].call(this, setting);
			var result = [];
			for (var i = 0; i < length; i++) {
				result.push($.fn.tabnumber.methods['get_rule'].call(this, {
					index: i
				}));
			}
			return result;
		}


	});
})(jQuery)