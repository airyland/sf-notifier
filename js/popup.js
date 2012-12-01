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
						data = JSON.parse(xhr.responseText.slice(6, -1));
					for(var i = 0, len = data.data.count; i < len; i++) {
						var notice = data['data']['event'][i];
						html += '<li class="msg" data-id="' + notice.id + '" data-url="' + notice.url + '">\
					<span class="right">' + notice.createdDate + '</span>' + notice.sentence + '<cite>' + notice.title + '</cite>\
					</li>'
					}

					var ul = document.querySelector('#msg-box'),
						li = ul.firstElementChild.outerHTML;
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
	console.log(ul);
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
			chrome.tabs.create({
				url: target.href
			});
		} else {
			var parent = target.parentNode;
			var url = parent.dataset.url;
			chrome.tabs.create({
				url: url
			})

		}
	}, false);
}()