// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function() {
	// 注入自定义JS
	injectCustomJs();
});


// 向页面注入JS
function injectCustomJs(jsPath) {
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function() {
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	let pan = document.getElementById('my_panel');
	let search = document.getElementById('search');
	if (request.cmd == 'block') {
		pan.style.display = 'block';
	} else if (request.cmd == 'none') {
		pan.style.display = 'none';
	} else if (request.cmd == 'enable') {
		search.disabled = false;
	} else if (request.cmd == 'disable') {
		search.disabled = true;
	}
});