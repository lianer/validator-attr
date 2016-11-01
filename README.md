# validator-attr.js

![](http://shields.hust.cc/build-passing-green.svg)
![](http://shields.hust.cc/version-1.0.3-blue.svg)
![](http://shields.hust.cc/dependence-jQuery-blue.svg)

实现element attribute表单验证，依赖 jQuery or Zepto

## Usage
```html
<form action="/" method="post" id="form">
	<input type="text" data-rule-required="1" data-msg-required="该项必填">
</form>
```

```js
new Validator("#form", {
	success: function (form) {
		form.submit()
	},
	error: function (msg) {
		alert(msg)
	}
})
```

## Changelog

**2016.11.01 v1.0.3**

- 增加range验证方法，支持验证radio/checkbox/select-multiple选中的个数
- 修改默认同步提交表单的逻辑，现在必须通过success回调函数处理
- 修改required针对radio/checkbox的处理逻辑，现在判断同名的radio/checkbox是否有被选中

**2016.10.09 v1.0.2**

- 增加验证方法，增加success，error配置项

**2016.04.25 v1.0.0**

- published
