/**
 * validator-attr.js 通用表单验证类
 * 
 * @author lianer
 * @version 1.0.2
 * @description 实现element attribute表单验证，依赖 jQuery or Zepto，ie8+
 * 
 * @example
 *
 * <form action="/" method="post" id="form">
 *   <input type="text" data-rule-required="1" data-msg-required="该项必填">
 * </form>
 *
 * new Validator("#form", {
 *   success: function (form) {
 * 
 *   },
 *   error: function (msg) {
 * 
 *   }
 * })
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Validator = factory());
})(this, function () {
	var Validator = function (form, options) {
		var v = this;
		v.options = $.extend({
			success: null,
			error: null
		}, options);
		v.form = $(form);
		v.$bind();
	};

	Validator.methods = {};

	Validator.addMethod = function (name, fn, message) {
		Validator.methods[name] = {
			fn: fn,
			message: message
		};
	};

	// 绑定表单提交，只有通过validate，后面绑定的validate才会生效
	Validator.prototype.$bind = function () {
		var v = this;
		v.form.on("click", "[data-validate-submit]", function () {
			v.form.trigger("submit");
		});
		v.form.on("submit", function (e) {
			var result = v.validate();
			try{
				if(result.pass){
					v.options.success && v.options.success(v.form[0]);
				}
				else{
					v.options.error && v.options.error(result.message);
				}
			}catch(e){
				console.log(e);
			}
			return false;
		});
	};

	// 校验
	Validator.prototype.validate = function () {
		var v = this;
		var methods = Validator.methods; // 自定义验证方法
		var elems = v.form[0].elements; // 表单的元素
		var pass = true;
		var message = "";

		// 遍历表单元素，遍历自定义验证方法，进行冒泡
		loop: for (var i = 0; i < elems.length; i++) {
			var elem = $(elems[i]);

			for (var methodName in methods){
				// 首字母大写
				var upperCase = methodName.replace(/\w/, function ($0) {
					return $0.toUpperCase();
				});

				var ruleName = "rule" + upperCase;
				var msgName = "msg" + upperCase;
				var elemRule = elem.data(ruleName);

				// 非必填并且值为空，跳过这个元素的所有验证
				var required = elem.data("ruleRequired") == 1 || elem.data("ruleRequired") == true;
				if(!required && elem.val() === "") {
					continue loop;
				}

				// 如果存在验证规则
				if(elemRule !== void 0){
					var valid = methods[methodName].fn(elem.val(), elem[0], elemRule);
					if(!valid){
						message = elem.data(msgName);
						if(!message){
							message = methods[methodName].message;
						}
						pass = false;
						break loop;
					}
				}
			}
		}

		return {
			pass: pass,
			message: message
		};
	};

	Validator.addMethod("required", function (value, elem, param) {
		if(!param){
			return value === "";
		}
		else if(elem.type === "text"){
			return !!value.length;
		}
		else if(elem.type === "hidden"){
			return !!value.length;
		}
		else if(elem.type === "select-one"){
			return !!$(elem).val();
		}
		else if(elem.type === "select-multiple"){
			// 获取select-multiple的值，只能通过对select.options遍历
			// jQuery或Zepto的val函数对此作了封装，方便我们使用
			return $(elem).val().length > 0;
		}
		else if(elem.type === "radio"){
			return elem.checked;
		}
		else if(elem.type === "checkbox"){
			return elem.checked;
		}
		else if(elem.type === "textarea"){
			return !!value.length;
		}
	}, "请填写必填信息");

	Validator.addMethod("mobile", function (value, elem, param) {
		return /^1[0-9]{10}$/.test(value);
	}, "请输入正确的手机号");

	Validator.addMethod("idcard", function (value, elem, param) {
		return /^\d{17}[0-9x]$/i.test(value);
	}, "请输入正确的身份证号");

	Validator.addMethod("rangelength", function (value, elem, param) {
		var length = value.length;
		var range = param.split(",");
		return length >= range[0].trim() && length <= range[1].trim();
	}, "字数不够或超出");

	Validator.addMethod("pattern", function (value, elem, param) {
		var matchPattern = /^\/([^\/]+)\/(\w*)$/;
		var matched = false;
		param.replace(matchPattern, function ($0, pattern, attributes) {
			if(pattern){
				try{
					var reg = new RegExp(pattern, attributes);
					if(reg.test(value)){
						matched = true;
					}
				}catch(e){
					console.error("正则表达式 " + param + " 错误");
				}
			}
		});
		return matched;
	}, "格式不符合要求");

	return Validator;
});