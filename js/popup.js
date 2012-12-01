!function() {
	var sfsess, option = {
		url: 'http://segmentfault.com',
		name: 'sfsess'
	}

	chrome.cookies.get(option, function(cookie) {
		sfsess = cookie.value;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200) {
					var html = '',
						ul = document.querySelector('#msg-box'),
						data = JSON.parse(xhr.responseText.slice(6, -1));
					if(data.data.count === 0) {
						ul.innerHTML = '<li class="no-msg">暂无未读消息</li><li class="all"><a href="http://segmentfault.com/user/events" style="width: 100%; border-right: none">查看全部</a></li>';
						return;
					}
					for(var i = 0, len = data.data.count; i < len; i++) {
						var notice = data['data']['event'][i];
						html += '<li class="msg" data-id="' + notice.id + '" data-url="' + notice.url + '">\
					<a href="#" title="忽略" class="i-cancel right">✕</a>\
					<span class="right">' + notice.createdDate + '</span>' + notice.sentence + '<cite>' + notice.title + '</cite>\
					</li>'
					}

					var li = ul.firstElementChild.outerHTML;
					ul.innerHTML = html + li;
				}
			} else {
				//to do 
			}
		}
		xhr.open('GET', 'http://x.segmentfault.com/event/dump?sfsess=' + sfsess + '&_=' + new Date(), true);
		xhr.send();
	});


	var ul = document.querySelector('#msg-box');

	ul.addEventListener('click', function(e) {
		console.dir(e);
		var target = e.target;
		if(target.tagName === 'LI') {
			var target = e.target;
			var url = target.dataset.url;
			chrome.tabs.create({
				url: url
			})
		} else if(target.tagName === 'A') {
			if(target.classList.contains('i-cancel')) {
				//alert('click');
				//return;
				var parent = target.parentNode;
				id = parent.dataset.id;

				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if(xhr.readyState == 4) {
						if(xhr.status == 200) {
							parent.parentNode.removeChild(parent);
						}

						var data = JSON.parse(xhr.responseText.slice(6, -1));
						chrome.browserAction.setBadgeText({
							text: data.data == 0 ? '' : data.data + ''
						});

						ul.innerHTML = '<li class="no-msg">暂无未读消息</li><li class="all"><a href="http://segmentfault.com/user/events" style="width: 100%; border-right: none">查看全部</a></li>';

					} else {
						//to do 
					}
				}
				xhr.open('GET', 'http://x.segmentfault.com/event/view?sfsess=' + sfsess + '&_=' + new Date() + '&id=' + id, true);
				xhr.send();

			} else if(target.classList.contains('ignore')) {
				alert('抱歉，还未支持');

			} else {
				chrome.tabs.create({
					url: target.href
				});
			}

		} else {
			var parent = target.parentNode;
			var url = parent.dataset.url;
			chrome.tabs.create({
				url: url
			})

		}
	}, false);
}()