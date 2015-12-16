

# 编码规则制定

主要使用easyui+Node.js+mongodb搭建
- [示例地址](http://114.215.239.151:3000): `pm2`

##运行方式
进入项目文件夹
```javascript
1. npm install
2. node app.js(或是使用pm2等管理工具)
```

## 文件说明
```js
tabs.js
```
主要使用了easyui的tab，但是为了适配业务逻辑扩展了以下方法：
```js
`get_content` 用于根据tab索引获得tab对象
`add_content` 增加tab项目的主要方法，根据需要扩展下列参数：<br>
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
			data为tab内的规则数据
```

