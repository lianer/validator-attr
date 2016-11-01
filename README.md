# validator-attr.js

实现element attribute表单验证，依赖 jQuery or Zepto，ie8+

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
* 2016.11.01 移除默认同步提交表单的逻辑，必须通过success回调
* 2016.10.09 增加验证方法，增加success，error配置项
* 2016.04.25 published
