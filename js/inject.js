function buildDirectory() {
	let attr = [];
	let desc = [];
	let apis = document.getElementsByTagName('h4');
	let len = apis.length;
	let html = '<ul id = "container_of_li" style="list-style:disc;margin-left:24px;">'
	for (let ele = 0; ele < len; ele++) {
		let current_id = apis[ele].getAttribute('id');
		let current = apis[ele].innerText;
		if (!current_id) {
			continue;
		}

		let h4sibling = '';
		if (apis[ele].nextElementSibling) {
			if (apis[ele].nextElementSibling.firstElementChild) {
				h4sibling = apis[ele].nextElementSibling.firstElementChild.innerText;
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
			html += '<li style="cursor:pointer;line-hight:1.5em" title=' + desc[attri] + '><a href=#' + attri + '>' + attr[i] + '</a></li>';
		} else {
			html += '<li style="cursor:pointer;line-hight:1.5em"><a href=#' + attri + '>' + attr[i] + '</a></li>';
		}
	}
	html += '</ul>';

	let panel = document.createElement('div');
	panel.className = 'chrome-plugin-panel';
	panel.innerHTML = html;
	panel.id = "my_panel";

	let top = document.createElement('div');
	top.className = 'top';
	top.id = 'top';

	// 创建搜索框
	let input = document.createElement("input");
	input.type = "text";
	input.id = "search";
	input.placeholder = "请输入过滤关键字";
	input.className = "my-input";
	input.onkeyup = filterItem;
	top.prepend(input);

	let h4 = document.createElement("h4");
	h4.innerText = 'BIMFACE API 目录';
	top.prepend(h4);

	panel.prepend(top);
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
	let lis = document.querySelectorAll('#container_of_li li');
	let len = lis.length;

	for (let i = 0; i < len; i++) {
		if (lis[i].innerText.indexOf(val) == -1 && lis[i].getAttribute('title').indexOf(val) == -1) {
			lis[i].style.display = "none";
		} else {
			lis[i].style.display = "block";
			lis[i].style.cursor = "pointer";
		}
	}

}

// 通过DOM事件发送消息给content-script
(function() {
	buildDirectory();
})();