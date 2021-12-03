"use strict";
var autoTabs = [];
var recentOpen = []; //recently opened auto tabs
var checkInterval = 60 * 1000; //The interval in milliseconds to initiate checks
var lastCheckedDate = new Date();
lastCheckedDate.setDate(lastCheckedDate.getDate()-1); //might want to remove or change this line

//load autoTabs upon startup
loadAutoTabs();

setTimeout(function(){checkAutoTabs();},5000);

chrome.runtime.onInstalled.addListener(function(){
});

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	if (request.optionsChanged) {
		loadAutoTabs();
		
	}
	sendResponse({message:"Acknowledged."});
});

function loadAutoTabs() {
	chrome.storage.sync.get(["autoTabs", "recentOpen"], function (result) {
		if (result.autoTabs == null) {
			chrome.storage.sync.set({autoTabs:autoTabs}, function() {});
		} else {
			autoTabs = result.autoTabs;
			setDates();
		}
		if(result.recentOpen == null) {
			chrome.storage.sync.set({recentOpen:recentOpen}, function(){});
		} else {
			recentOpen = result.recentOpen;
		}
		
		//sort autoTabs
		autoTabs.sort(function(a, b){return a.date-b.date;});
		//remove autoTabs that have a past date
		let date = new Date();
		date.setSeconds(0);
		date.setMilliseconds(0);
		//remove autoTabs with a past date
		autoTabs = autoTabs.filter( function(autoTab) {return autoTab.date >= date;});
	});
}

function  checkAutoTabs() {
	let date = new Date();
	let milli = date.getSeconds()*1000 + date.getMilliseconds();
	date.setSeconds(0);
	date.setMilliseconds(0);
	if (recentOpen.length > 0) {
		recentOpen = [];
		chrome.storage.sync.set({recentOpen:recentOpen}, function(){});
	}
	
	if (date > lastCheckedDate && (date.getDate() != lastCheckedDate.getDate() || date.getMonth() != lastCheckedDate.getMonth() || date.getYear() != lastCheckedDate.getYear())) { //if date has changed then reload the autoTabs
		loadAutoTabs();
		lastCheckedDate = date;
	} else {
		while (autoTabs.length > 0) {
			chrome.browserAction.setBadgeText({text: ""});
			if (autoTabs[0].date.getTime() == date.getTime()) { //Open the tab if the current time equals the autotab's opening time
				recentOpen.push(autoTabs[0].id);

				let url = autoTabs[0].url;
				let urlVar = [url];

				if (url[url.length] != "/" && url[url.length] != "\\") {
					urlVar.push(url + "/");
				}
				if (url.substr(0,4) != "www.") {
					urlVar.push("www." + url);
				}
				if (url.substr(0,4) != "www." && url[url.length] != "/" && url[url.length] != "\\") {
					urlVar.push("www." + url + "/");
				}
				url = ensureScheme(url);

				let alreadyOpenTabId = -1;
				chrome.tabs.query({}, function(tabs) {
					for (let i = 0; i < tabs.length; i++) {
						for (let j = 0; j < urlVar.length; j++) {
							if (urlVar[j] == tabs[i].url || ensureScheme(urlVar[j]) == tabs[i].url) {
								alreadyOpenTabId = tabs[i].id;
								break;
							}
						}
					}
					if (alreadyOpenTabId == -1) { //The url to open is not currently open
						let createProperties = {url:url};
						chrome.tabs.create(createProperties, function() {
							chrome.browserAction.setBadgeText({text:"open"}, function() {
								setTimeout(function(){chrome.browserAction.setBadgeText({text:""});}, 4000);
							});
							
						});
					} else { //The url to open is already open
						let updateProperties = {active:true};
						chrome.tabs.update(alreadyOpenTabId, updateProperties, function() { //switch to tab
							chrome.tabs.reload(alreadyOpenTabId, {}, function(){
								chrome.browserAction.setBadgeText({text:">>"}, function() {
									setTimeout(function(){chrome.browserAction.setBadgeText({text:""});}, 4000);
								});
							});
						});
					}
				});

				autoTabs.shift();

			} else {
				break;
			}
		}
		if (recentOpen.length > 0) {
			chrome.storage.sync.set({recentOpen:recentOpen}, function() {
			});
		}
	    lastCheckedDate = date;
		
	}	
	setTimeout(function(){checkAutoTabs();}, checkInterval - milli);
}

function setDates() {
	let date = new Date();
	date.setSeconds(0);
	date.setMilliseconds(0);
	let currDay = date.getDay();
	for (let i = 0; i < autoTabs.length; i++) {
		autoTabs[i].date = new Date();
		autoTabs[i].date.setSeconds(0);
		autoTabs[i].date.setMilliseconds(0);

		let hours = Number(autoTabs[i].timeStr.slice(0,2));
		let minutes = Number(autoTabs[i].timeStr.slice(-2));
		autoTabs[i].date.setHours(hours);
		autoTabs[i].date.setMinutes(minutes);

		if (autoTabs[i].repeat) {
			//***************************************************************************************************
			if (autoTabs[i].sunday || autoTabs[i].monday || autoTabs[i].tuesday || autoTabs[i].wednesday || autoTabs[i].thursday || autoTabs[i].friday || autoTabs[i].saturday) {
				let j;
				for(j = 0; j < 7; j++) {
					let dayCheck = currDay + j;
					if (dayCheck >= 7) {
						dayCheck = dayCheck - 7;
					}

					if (dayCheck == 0 && autoTabs[i].sunday) {
						autoTabs[i].date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() + j);
						break;
					} else if (dayCheck == 1 && autoTabs[i].monday) {
						autoTabs[i].date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() + j);
						break;
					} else if (dayCheck == 2 && autoTabs[i].tuesday) {
						autoTabs[i].date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() + j);
						break;
					} else if (dayCheck == 3 && autoTabs[i].wednesday) {
						autoTabs[i].date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() + j);
						break;
					} else if (dayCheck == 4 && autoTabs[i].thursday) {
						autoTabs[i].date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() + j);
						break;
					} else if (dayCheck == 5 && autoTabs[i].friday) {
						autoTabs[i].date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() + j);
						break;
					} else if (dayCheck == 6 && autoTabs[i].saturday) {
						autoTabs[i].date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() + j);
						break;
					}
				}
			} else { //no days selected to repeat
				//set year to the year 1000 so that the autoTab can be filtered out and removed later
				autoTabs[i].date.setFullYear(1000, date.getMonth(), date.getDate());
			}

		} else {
			let year = autoTabs[i].dateStr.slice(0,4);
			let month = autoTabs[i].dateStr.slice(5,7)-1;
			let day = autoTabs[i].dateStr.slice(-2);
			autoTabs[i].date.setFullYear(year, month, day);
		}
	}
}

function ensureScheme(url) {
	//local links.. may NOT WORK FOR SECURITY REASONS
	if (url.search(/^[a-z]:[\/\\]/i) == 0) { //check for a:/ b:/ ... z:/
		url = "file:///" + url; //add file scheme to url
	} else if (url.search(/^(https?:\/\/)|(tel:)|(fax:)|(file:\/)|(ftp:\/\/)|(chrome-extension:\/\/)|(ftp:\/\/)|(mailto:)|(about:)|(chrome:)/i) == 0) { //
		//do nothing because scheme is found
	} else { //if no scheme is found then add https:// to the beginning of the url
		url = "https://" + url;
	}
	return url;
}