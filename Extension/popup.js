"use strict";

var checkInterval = 60 * 1000; //The interval in milliseconds to initiate checks

var upcomingHolder = document.getElementById("upcomingHolder");
var upcoming1 = document.getElementById("upcoming1");
var upcoming2 = document.getElementById("upcoming2");
var upcoming3 = document.getElementById("upcoming3");
var upcomingDate1 = document.getElementById("upcomingDate1");
var upcomingDate2 = document.getElementById("upcomingDate2");
var upcomingDate3 = document.getElementById("upcomingDate3");
var border1 = document.getElementById("border1");
var border2 = document.getElementById("border2");

var autoTabs = [];
var recentOpen = [];

//load autoTabs and fill in the upcoming pages
loadAutoTabs(true);

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	if (request.optionsChanged) {
		loadAutoTabs(false);
	}
	if(request.recentlyOpened) {
		loadAutoTabs(false);

	}
	sendResponse({message:"Acknowledged."});
});

function loadAutoTabs(repeatUpdate) {
	chrome.storage.sync.get(["autoTabs", "recentOpen"], function(result){
		if(result.autoTabs == null) {
			chrome.storage.sync.set({autoTabs:autoTabs}, function() {});
		} else {
			autoTabs = result.autoTabs;
		}
		if (result.recentOpen == null) {
			chrome.storage.sync.set({recentOpen:recentOpen}, function() {});
		} else {
			recentOpen = result.recentOpen;
		}
		updateUpcomingPages(repeatUpdate);
	});
}
function updateUpcomingPages(repeatUpdate) {
	let checkDate = new Date();
	let milli = checkDate.getSeconds()*1000 + checkDate.getMilliseconds();
	checkDate.setSeconds(0);
	checkDate.setMilliseconds(0);

	//remove autoTabs that have an empty string timeStr
	autoTabs = autoTabs.filter( function(autoTabs) {return autoTabs.timeStr != "";});
	//set dates for autoTabs
	setDates();
	//seperate autoTabs that repeat into multiple autoTabs that dont repeat
	seperateRepeats();
	//sort autoTabs by date
	autoTabs.sort(function(a, b){return a.date-b.date;});
	//remove autoTabs that have a past date
	let date = new Date();
	date.setSeconds(0);
	date.setMilliseconds(0);
	autoTabs = autoTabs.filter( function(autoTab) {return autoTab.date >= date;});
	//display upcoming autoTabs
	if (autoTabs.length >= 3) {
		upcoming1.innerHTML = autoTabs[0].url;
		upcomingDate1.innerHTML = formatDateStr(autoTabs[0].date, autoTabs[0].id);
		upcoming2.innerHTML = autoTabs[1].url;
		upcomingDate2.innerHTML = formatDateStr(autoTabs[1].date, autoTabs[1].id);
		upcoming3.innerHTML = autoTabs[2].url;
		upcomingDate3.innerHTML = formatDateStr(autoTabs[2].date, autoTabs[2].id);
		upcoming1.style.display = null;
		upcomingDate1.style.display = null;
		border1.style.display = null;
		upcoming2.style.display = null;
		upcomingDate2.style.display = null;
		border2.style.display = null;
		upcoming3.style.display = null;
		upcomingDate3.style.display = null;
		fitText(upcoming1);
		fitText(upcoming2);
		fitText(upcoming3);
	} else if (autoTabs.length == 2) {
		upcoming1.innerHTML = autoTabs[0].url;
		upcomingDate1.innerHTML = formatDateStr(autoTabs[0].date, autoTabs[0].id);
		upcoming2.innerHTML = autoTabs[1].url;
		upcomingDate2.innerHTML = formatDateStr(autoTabs[1].date, autoTabs[1].id);
		upcoming1.style.display = null;
		upcomingDate1.style.display = null;
		border1.style.display = null;
		upcoming2.style.display = null;
		upcomingDate2.style.display = null;
		border2.style.display = "none";
		upcoming3.style.display = "none";
		upcomingDate3.style.display = "none";
		fitText(upcoming1);
		fitText(upcoming2);
	} else if (autoTabs.length == 1) {
		upcoming1.innerHTML = autoTabs[0].url;
		upcomingDate1.innerHTML = formatDateStr(autoTabs[0].date, autoTabs[0].id);
		upcoming1.style.display = null;
		upcomingDate1.style.display = null;
		border1.style.display = "none";
		upcoming2.style.display = "none";
		upcomingDate2.style.display = "none";
		border2.style.display = "none";
		upcoming3.style.display = "none";
		upcomingDate3.style.display = "none";
		fitText(upcoming1);
	} else {
		upcoming1.innerHTML = "No upcoming pages. Go to the <a href=\"/options.html\" target=\"_blank\":\ class=\"popupLink\">options page</a> to schedule an automated page opening.";
		upcoming1.style.display = null;
		upcomingDate1.style.display = "none";
		border1.style.display = "none";
		upcoming2.style.display = "none";
		upcomingDate2.style.display = "none";
		border2.style.display = "none";
		upcoming3.style.display = "none";
		upcomingDate3.style.display = "none";
	}

	if (upcoming1.innerHTML == "") {
		upcoming1.innerHTML = String.fromCharCode(160); //insert a non breaking space
	}
	if (upcoming2.innerHTML == "") {
		upcoming2.innerHTML = String.fromCharCode(160);
	}
	if (upcoming3.innerHTML == "") {
		upcoming3.innerHTML = String.fromCharCode(160);
	}

	if (repeatUpdate) {
		setTimeout(function(){updateUpcomingPages(repeatUpdate);}, checkInterval - milli);
	}
}

//(date.getTime() - curDate.getTime()) < 86400000
function formatDateStr(date, id) {
	let curDate = new Date();
	if (date.getTime() < curDate.getTime()) { //the date is past
		if (recentOpen.includes(id)){
			return "...Opened";
		} else {
			return "...";
		}
	} else if ((date.getTime() - curDate.getTime()) < 3600000) { //the date is today and less than an hour away
		return  Math.ceil((date.getTime() - curDate.getTime())/1000/60) + " minutes";
	} else if (date.getDate() == curDate.getDate() && date.getMonth() == curDate.getMonth() && date.getYear() == curDate.getYear()) { //if the upcoming date is today
		return "Today at " + formatTimeStr(date);
	} 
	let tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	if (date.getDate() == tomorrow.getDate() && date.getMonth() == tomorrow.getMonth() && date.getYear() == tomorrow.getYear()) { //if the upcoming date is tomorrow
		return "Tomorrow at " + formatTimeStr(date);
	}
	if ((date.getTime() - curDate.getTime()) < 3600000*24*6) { //the date is within 6 days
		if (date.getDay() == 0) {
			return "Sunday at " + formatTimeStr(date);
		} else if (date.getDay() == 1) {
			return "Monday at " + formatTimeStr(date);
		} else if (date.getDay() == 2) {
			return "Tuesday at " + formatTimeStr(date);
		} else if (date.getDay() == 3) {
			return "Wednesday at " + formatTimeStr(date);
		} else if (date.getDay() == 4) {
			return "Thursday at " + formatTimeStr(date);
		} else if (date.getDay() == 5) {
			return "Friday at " + formatTimeStr(date);
		} else if (date.getDay() == 6) {
			return "Saturday at " + formatTimeStr(date);
		}
	}
	//the date is greater than 6 days away
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	return formatTimeStr(date) + " on " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

function formatTimeStr(date) {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let hourStr = "";
	let minStr = "";
	let amPM = "";
	if (hours < 12) {
		amPM = "AM";
	} else {
		amPM = "PM";
	}
	if (hours == 0) {
		hourStr = "12";
	} else if (hours < 10) {
		hourStr = "0" + hours;
	} else if (hours >= 10 && hours <= 12) {
		hourStr = String(hours);
	} else if (hours > 12) {
		hourStr = hours-12;
	}
	if (minutes < 10) {
		minStr = "0" + minutes;
	} else {
		minStr = minutes;
	}
	return hourStr + ":" + minStr + " " + amPM;
}
//react to scheduled opening of a tab

//react to a change in the autoTabs (probably dont need to implement this)



function setDates() {
	let date = new Date();
	date.setSeconds(0);
	date.setMilliseconds(0);
	let currDay = date.getDay();
	for (let i = 0; i < autoTabs.length; i++) {
		if (autoTabs[i].seperatedRepeat) {
			//the date is already set for seperateRepeats
		} else {
			autoTabs[i].date = new Date();
			autoTabs[i].date.setSeconds(0);
			autoTabs[i].date.setMilliseconds(0);
			let hours = Number(autoTabs[i].timeStr.slice(0,2));
			let minutes = Number(autoTabs[i].timeStr.slice(-2));
			autoTabs[i].date.setHours(hours);
			autoTabs[i].date.setMinutes(minutes);

			if (autoTabs[i].repeat) {

			} else {
				let year = autoTabs[i].dateStr.slice(0,4);
				let month = autoTabs[i].dateStr.slice(5,7)-1;
				let day = autoTabs[i].dateStr.slice(-2);
				autoTabs[i].date.setFullYear(year, month, day);
			}
		}

		
		

		if (!autoTabs[i].repeat && !autoTabs[i].seperatedRepeat) {
			
		}
	}
}

//seperate autoTabs that repeat into multiple autoTabs that dont repeat
function seperateRepeats() {
	let repeats = [];
	let nonRepeats = [];
	for (let i = 0; i < autoTabs.length; i++) {
		if (autoTabs[i].repeat) {
			for (let j = 0; j < 7; j++) {
				if (j == 0 && autoTabs[i].sunday || j == 1 && autoTabs[i].monday || j == 2 &&autoTabs[i].tuesday
					|| j == 3 && autoTabs[i].wednesday || j == 4 && autoTabs[i].thursday
					|| j == 5 && autoTabs[i].friday || j == 6 && autoTabs[i].saturday 
				) {
					let newAutoTab = {};
					let date = new Date();
					date.setSeconds(0);
					date.setMilliseconds(0);
					if (date.getDay() == j) {
					}
					if (date.getDay() == j && (date.getHours() > autoTabs[i].date.getHours() || date.getHours() == autoTabs[i].date.getHours() && date.getMinutes() > autoTabs[i].date.getMinutes())) {
					} else {
						date.setMinutes(autoTabs[i].date.getMinutes());
						date.setHours(autoTabs[i].date.getHours());
						

						let diff = j - date.getDay();
						if (diff < 0) {
							diff = 7 + diff;
						}
						date.setDate(date.getDate() + diff);

						newAutoTab.url = autoTabs[i].url;
						newAutoTab.date = date;
						newAutoTab.id = autoTabs[i].id;
						newAutoTab.dateStr = formatDateStr(date, newAutoTab.id);
						newAutoTab.opened = autoTabs[i].opened;
						newAutoTab.repeat = false;
						newAutoTab.seperatedRepeat = true;
						newAutoTab.timeStr = autoTabs[i].timeStr;
						repeats.push(newAutoTab);
					}
				}

			}

		} else {
			nonRepeats.push(autoTabs[i]);
		}
	}
	autoTabs = nonRepeats.concat(repeats);
}


//style.getPropertyValue('font-style') + ' ' + style.getPropertyValue('font-variant') + ' ' + style.getPropertyValue('font-weight') + ' ' + style.getPropertyValue('font-size') + ' ' + style.getPropertyValue('font-family');

function getTextMetrics(text, font) {
	var canvas = getTextMetrics.canvas || (getTextMetrics.canvas = document.createElement("canvas"));
	var context = canvas.getContext("2d");
	context.font = font;
	var width = context.measureText(text).width;
	var height = context.measureText("M").width;
	return {width, height};
}

function fitText(element) {
	var style = getComputedStyle(element);
	var font = style.getPropertyValue('font-style') + ' ' + style.getPropertyValue('font-variant') + ' ' + style.getPropertyValue('font-weight') + ' ' + style.getPropertyValue('font-size') + ' ' + style.getPropertyValue('font-family');//style.font;
	var width = getTextMetrics(element.innerHTML, font).width;
	var reduced = false;
	while (width > 272) {
		element.innerHTML = element.innerHTML.slice(0,element.innerHTML.length-1);
		width = getTextMetrics(element.innerHTML, font).width;
		reduced = true;
	}
	if (reduced) {
		element.innerHTML = element.innerHTML + "...";
	}
}