

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

## 前端文件说明
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
其中`id`是后端分配的，新创建一个节点的时候注意要发请求以便获得此id
* `fix`=================>固定
* `flu`=================>流水
* `dic`=================>字典
* `custom`==============>自定义
树加载上述数据成功以后