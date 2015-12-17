

# 编码规则制定工具

使用easyui+Node.js+mongodb 进行前后端搭建
- [示例地址](http://114.215.239.151:3000): `pm2`
```html
兼容IE8+ Chrome Firefox
```
------------------------------------------------------------
## 运行方式
进入项目文件夹
```javascript
需装有node环境和mongodb数据库

1. npm install
2. node app.js(或是使用pm2等管理工具)
```

## 前端说明(coderule/public/js/)
----------------------------------------------------
### TAB
```js
tabs.js
```
__主要使用了`easyui`的`tab`，但是为了适配业务逻辑扩展了以下方法：__
```js
1.- [get_content]: 用于根据tab索引获得tab对象
2.- [add_content]: 增加tab项目的主要方法，根据需要扩展下列参数：
			{	
				content: '',
				index: indexx,
				title: "tab" + indexx,
				closable: false,
				selected: true,
				iconCls: null,
				data: {},
				datavalidate:1
			}
			`content`为tab内容的html字符串，
			`datavalidate`为段的验证规则
			`data`为tab内的规则数据
3.- [get_length]:获得tab长度
4.- [get_rules]:获得整个tab的规则数组
5.- [get_rule]:获得某个tab索引的规则
6.- [close_all]:关闭所有tab
7.- [update_validateRule]:更新索引tab的长度规则
```
--------------------------------------------
### NUMBERBLOCK
```js
numberblock.js
```
__仿支付宝密码输入框，提供2个方法__
```js
1.- [number_input]初始化：
	可以传入如下参数
	{
			render_To: "document",
				inputsize: {
					width: 29,
					height: 7
				},
				inputenabled:false,
				cursorenabled:false,
				activeCssName: "active",
				containerCSSName: "digital_Container",
				digitalCssName: "digital",
				centactiveCssName: "centeractive",
				number_of_input: 6,
				validator: function(charcode) {
					return true;
				}
	}
			inputsize:框大小
			inputenabled：是否准许输入
			cursorenabled:是否显示游标
			activeCssName containerCSSName digitalCssName 激活，容器， 方格样式名
			number_of_input：初始输入个数
			validator：校验回调函数
2.- [set_number_of_container]：设置输入数量
```
-----------------------------------
### TABNUMBER
```js
tabnumber.js
```
__依赖于上一个控件，针对业务逻辑在NUMBERBLOCK基础上编写__
```js
1.- [tabnumber]：初始化：
------------------------------------
					$('#numberblock').tabnumber({
						rules: [],
						width: 400,
						onclick: function(e) {},
						onupdate: function(e) {}
					});
					rules表示规则数组
------------------------------------
2.- [add_Item]:增加条目，可以指定索引与规则
3.- [remove_Item]:移除索引条目，默认为最后一个
4.- [set_active]:设置某索引获得
5.- [get_selected]:获得当前选择
6.- [clear_all]:清除所有段
7.- [get_length]:获得总段数
8.- [get_rule]:获得某索引规则
9.- [get_rules]:获得所有规则，得到规则数组
```
--------------------------------------
### TREE
```js
tree.js  注意：所有与后端交互都在此文件中！
```
__依赖于`TABNUMBER`，`TAB`,针对业务逻辑在`easyui`的tree的基础上扩写__
```js
1.- [onSelect_old: function(oldnode, newnode)]：扩写原生事件，事件中能拿到新选中节点，和上次选中节点。在此事件中做了大量操作 __核心函数__
2.- [getparents]:废弃，有bug
3.- [getparents_new]:获得某个节点的父元素，以数组返回
4.- [get_json_str]:获得整棵树的json字符串
5.- [update_node]:更新节点信息，__核心函数__
```
## 前端运行过程
最开始的是树的加载过程，需要ajax获得如下JSON格式数据，进行树的初始化
```js
[
    {
        "id": "5666ed348a10380011000001",
        "text": "01",
        "rule": [],
        "isClass": true,
        "children": [
            {
                "id": 11,
                "text": "11",
                "isClass": false,
                "rule": [
                    {
                        "name": "fix",
                        "data": {
                            "name": "fixname",
                            "length": 2,
                            "content": {
                                "value": "GB"
                            },
                            "backup": "backup1"
                        }
                    },
                    {
                        "name": "dic",
                        "data": {
                            "name": "dicname",
                            "length": 3,
                            "content": {
                                "value": [
                                    {
                                        "key": "1~",
                                        "value": "2~"
                                    },
                                    {
                                        "key": "11~",
                                        "value": "22~"
                                    }
                                ]
                            },
                            "backup": "backup1"
                        }
                    },
                    {
                        "name": "flu",
                        "data": {
                            "name": "fluname",
                            "length": 2,
                            "content": {
                                "value": {
                                    "type": "nubmer",
                                    "content": "32131"
                                }
                            },
                            "backup": "backup1"
                        }
                    }
                ],
                "children": []
            },
            {
                "id": 112,
                "text": "111111",
                "isClass": false,
                "rule": [
                    {
                        "name": "fix",
                        "data": {
                            "name": "fix1name",
                            "length": 2,
                            "content": {
                                "value": "GB111"
                            },
                            "backup": "backup1"
                        }
                    }
                ],
                "children": []
            }
        ]
    }
]
```
其中`id`是后端分配的，新创建一个节点的时候注意要发请求以便获得此id,其中数据中的对应如下：
* `fix`=================>固定<br>
* `flu`=================>流水<br>
		[number]:数字型<br>
		[alphebat]:数字字母型<br>
		[date]:日期型<br>
* `dic`=================>字典
* `custom`==============>自定义
树加载上述数据成功以后，会渲染出树，其中选中的树节点的规则已经加载好。<br>
当点击某个节点时，触发`onSelect_old`事件，事件中主要是:<br>
		1.更新上次选中节点信息<br>
		2.重新渲染当前选中节点的规则<br>
		
### 接口说明:
```js
app.put('/addclass',class_route.createClass);
app.put('/addrule',rule_route.createRule);
app.post('/updateclass',class_route.updateClass);
app.post('/updaterule',rule_route.updateRule);
app.post('/deleteNode',ruleClass_route.deleteNode);
app.get('/getall.json',ruleClass_route.getClassRuleJSON);
```

* `增`:`(有多个增加方法，增加类别与增加规则)`
```js
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
```

* `删`:`删除类与规则都在一个方法中`
```js
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
```

* `改`:`更新类与规则都在一个方法中`
```js
更行某个节点信息，直接调用`tree`的`update_node`方法。用户操作过程中会频繁调用此方法
```
更新节点主要发生以下几个情况：<br>
```js
* 1 点击树中的某个节点，会更新上次选中过的节点
* 2 修改树中的节点名，会更新当前节点
* 3 点击·保存规则·按钮，会更新当前选中的节点
* 4 删除某个节点时，更新父节点
* 5 增加某个节点时，更新父节点
```
* `查`:`主要是后端`
主要是页面一开始加载时提供JSON数据的接口，__只在页面初始加载时进行查的方法调用__前端会记录用户操作记录，不用每次去后端查

 **Note:  所有的与后端交互的方法都在tree.js一个文件中 **
 ----------------------------------------------------

## 后端说明
----------------------------------------------------
后端使用express和mongodb
主要结构
>coderule
>>routes————路由<br>
>>data----------数据访问层

使用async异步控制
使用了三个mongodb集合，

 1. class:类集合
  ![image](https://github.com/klfzlyt/picrepo/raw/master/class.PNG)<br>
 2. data:段集合
  ![image](https://github.com/klfzlyt/picrepo/raw/master/data.PNG)<br>
 3. regulation:规则集合
 ![image](https://github.com/klfzlyt/picrepo/raw/master/regulation.PNG)<br>

集合结构对`增``删``改`都比较容易<br>
对`查询`的操作需要从一个二维数组都构造多颗树(** 前端树不止一颗**)

