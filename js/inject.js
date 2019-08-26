function buildDirectory() {
	let attr = [];
	let desc = [];
	let apis = document.getElementsByTagName('h4');
	let len = apis.length;
	let html = '<ul id = "container_of_li" style="list-style:none;margin-left:-35px;">'
	for (let ele = 0; ele < len; ele++) {
		let current_id = apis[ele].getAttribute('id');
		let current = apis[ele].innerText;
		if (!current_id) {
			continue;
		}

		let h4sibling = '';
		if (apis[ele].nextElementSibling.nextElementSibling) {
			if (apis[ele].nextElementSibling.nextElementSibling.firstElementChild) {
				h4sibling = apis[ele].nextElementSibling.nextElementSibling.firstElementChild.innerText;
			}
		}

		if (h4sibling) {
			desc[current_id] = h4sibling;
		}
		current = current.anchor(current_id);
		apis[ele].innerHTML = current;
		attr.push(current_id);
	}

	for (let i = 0, len = attr.length; i < len; i++) {
		let attri = attr[i];
		if (desc[attri]) {
			html += '<li style="cursor:pointer;line-hight:1.2em" title=' + desc[attri] + '><a style="color:#EEE;" href=#' + attri + '>' + attr[i] + '</a></li>';
		} else {
			html += '<li style="cursor:pointer;line-hight:1.2em"><a style="color:#EEE;" href=#' + attri + '>' + attr[i] + '</a></li>';
		}
	}
	html += '</ul>';

	let panel = document.createElement('div');
	panel.className = 'chrome-plugin-panel';
	panel.innerHTML = html;
	panel.id = "my_panel";

	// 创建搜索框
	let serach = document.createElement("div");
	let input = document.createElement("input");
	input.type = "text";
	input.id = "search";
	input.placeholder = "请输入过滤关键字";
	input.style.width = "285px";
	input.style.height = "32px";
	input.style.lineHeight = "16px";
	input.style.border = "1px solid #006699";
	input.style.font = "12px 'Microsoft Sans Serif'";
	input.style.padding = "2px";
	input.style.color = "#006699";
	input.style.zIndex = 1001;
	input.style.borderRadius = "5px";
	input.onkeyup = filterItem;
	panel.prepend(input);

	let h5 = document.createElement("h5");
	h5.innerText = 'BIMFACE API 目录';
	panel.prepend(h5);
	document.body.appendChild(panel);
}

// 通过postMessage调用content-script
function invokeContentScript(code) {
	window.postMessage({
		cmd: 'invoke',
		code: code
	}, '*');
}
// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(data) {
	window.postMessage({
		cmd: 'message',
		data: data
	}, '*');
}

function filterItem(e) {
	let val = document.getElementById('search').value;
	//alert((val.value));
	let lis = document.querySelectorAll('#container_of_li li');
	let len = lis.length;

	for (let i = 0; i < len; i++) {
		if (lis[i].innerText.indexOf(val) == -1) {
			lis[i].style.display = "none";
		} else {
			lis[i].style.display = "block";
			lis[i].style.cursor = "pointer";
		}
	}

}

// 通过DOM事件发送消息给content-script
(function () {
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('myCustomEvent', true, true);
	// 通过事件发送消息给content-script
	function sendMessageToContentScriptByEvent(data) {
		data = data || '你好，我是injected-script!';
		var hiddenDiv = document.getElementById('main');
		hiddenDiv.innerText = data
		hiddenDiv.dispatchEvent(customEvent);
	}
	window.sendMessageToContentScriptByEvent = sendMessageToContentScriptByEvent;

	//alert(document.getElementsByClassName('page-title')[0].innerText);
	//TODO:生成目录
	buildDirectory();

})();
