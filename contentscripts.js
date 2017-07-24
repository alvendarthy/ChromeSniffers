var statu = "off";
var lastMsg = ""
var topMsg = ""
var news_date = ""
var timer = ""

String.prototype.trim=function(){
　　return this.replace(/(^\s*)|(\s*$)/g, "");
}

function sendBackGroundMsg(msg){
	chrome.extension.sendRequest(msg)
}

function getNewDate(){
	return $("#index > div.main > div.start > div.topic > span.date").text()	
}


function getAllEtems(){
	var nEtems = $('#entries > ul').children().length;
	var foundTop = false;
	for(i = 1; i <= nEtems; i ++){
		var news = $("#entries > ul:nth-child(" + i + ") > li.content").text().trim()
		var time = $("#entries > ul:nth-child(" + i + ") > li.time.pconly").text().trim()

		if(news.length == 0){
			continue;
		}
		
		if(!foundTop){
			topMsg = news;
			foundTop = true;
		}
		
		if(lastMsg == news){
			break;
		}
		
		console.log(news_date + " - " + time + " : " + news)

		var msg = {}
		msg.date = news_date
		msg.time = time
		msg.news = news
		sendBackGroundMsg(msg)

	}
	lastMsg = topMsg;
}

function getPageData() {
	if(statu != "on"){
		return;
	}
	//console.log($("#entries > ul:nth-child(1) > li.content").text())
	news_date = getNewDate();
	getAllEtems();
	timer = setTimeout(getPageData, 5000);
};

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    console.log("recive msg: " + request.msg)
	sendResponse({"msg": "ok"});
	statu = request.msg;
	lastMsg = "";
	topMsg = "";
	if("" != timer){
		clearTimeout(timer);
		timer = "";
	}
	getPageData();
 });