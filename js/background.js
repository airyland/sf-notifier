chrome.browserAction.setBadgeText({
	text: '...'
});

var sfsess, option = {
	url: 'http://segmentfault.com',
	name: 'sfsess'
}

chrome.cookies.get(option, function(cookie) {
	sfsess = cookie.value;
	var poll = function() {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					if(xhr.status == 200) {
						var data = JSON.parse(xhr.responseText.slice(6, -1));
						chrome.browserAction.setBadgeText({
							text: data.data + ''
						});
					}
				} else {
					chrome.browserAction.setBadgeText({
						text: 'x'
					});
				}
			}
			xhr.open('GET', 'http://x.segmentfault.com/event/check?sfsess=' + sfsess + '&_=' + new Date(), true);
			xhr.send();
		}
	setInterval(poll, 10 * 1000);
});