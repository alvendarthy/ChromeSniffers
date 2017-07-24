
var statu = "off";
chrome.browserAction.setBadgeText({text:statu});

function sendContentMsg(msg){
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, msg);
	});
}

function sendToServer(msg){
	var http = new XMLHttpRequest();
	var url = "http://10.75.131.33/api/cailianshe/news";
	var data = msg;
	http.open("POST", url, true);
	
	//Send the proper header information along with the request
	//http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			console.log("server says: " + http.responseText);
		}
	}
	http.send(data);
}

chrome.browserAction.onClicked.addListener(function(tab) {
	if(statu == "off"){
		statu = "on";
	} else {
		statu = "off";
	}
	sendContentMsg({"msg":statu});
	chrome.browserAction.setBadgeText({text:statu});
	//postData();
});


function postData(){ 
		chrome.tabs.executeScript(null,{file:"jquery.js"});  //executeScript 相当于在当前页面插入js代码/文件
		chrome.tabs.executeScript(null,{file:"contentscripts.js"});
}


chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    console.log("bg recive msg: " + request.date + request.time + request.news)
	request.type = "news"
	sendToServer(JSON.stringify(request))
	sendResponse({"msg": "ok"});
});