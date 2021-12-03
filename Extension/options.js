"use strict";

var addAutoTabButton = document.getElementById("addAutoTab");
var autoTabHolder = document.getElementById("autoTabHolder");
var optionsSavedText = document.getElementById("optionsSavedText");


var count = 0;
var waitingToSave = false;

function compare(a, b) {
	if (a.repeat && !b.repeat) { //a repeats and b does not repeat
		return -1;
	} else if (b.repeat && !a.repeat) { //b repeats and a does not repeat
		return 1;
	} else if (a.repeat && b.repeat) { //a and b repeats
		let aHours = Number(a.timeStr.slice(0,2));
		let aMinutes = Number(a.timeStr.slice(-2));
		let aDate = new Date(2001,3,10,aHours,aMinutes,0,0);
		let bHours = Number(b.timeStr.slice(0,2));
		let bMinutes = Number(b.timeStr.slice(-2));
		let bDate = new Date(2001,3,10,bHours,bMinutes,0,0);
		if (isNaN(aDate.getTime()) || a.timeStr == "") { //aDate is invalid
			return 1;
		} else if (isNaN(bDate.getTime()) || b.timeStr == "") { //bDate is invalid
			return -1;
		} else if (aDate > bDate) { 
			return -1;
		} else {
			return 1;
		}
	} else { //a and b do not repeat
		let aDate = new Date(a.dateStr);
		aDate.setHours(Number(a.timeStr.slice(0,2)), Number(a.timeStr.slice(-2)));
		let bDate = new Date(b.dateStr);
		bDate.setHours(Number(b.timeStr.slice(0,2)), Number(b.timeStr.slice(-2)));
		if (isNaN(aDate.getTime()) || a.timeStr == "") { //aDate is invalid
			return 1;
		} else if (isNaN(bDate.getTime()) || b.timeStr == "") { //bDate is invalid
			return -1;
		} else if (aDate > bDate) { 
			return -1;
		} else {
			return 1;
		}
	}

}

//load preexisting autoTabs
chrome.storage.sync.get(["count", "autoTabs"], function(result){
	if(result.count == null) {
		count = 0; //the total number of autoTabs that have been created
	} else {
		count = result.count;
	}
	result.autoTabs.sort(compare);
	if(result.autoTabs != null) {
		for(let i = 0; i < result.autoTabs.length; i++) {
			//add ui elements
			let newAutoTabInput = document.createElement("div");
			newAutoTabInput.id = result.autoTabs[i].id;
			newAutoTabInput.className = "autoTabInput";
			newAutoTabInput.append("URL: ");
			let urlInput = document.createElement("input");
			urlInput.id = "url" + result.autoTabs[i].id;
			urlInput.type = "url";
			urlInput.value = result.autoTabs[i].url;
			newAutoTabInput.append(urlInput);
			newAutoTabInput.append(" Time to Open: ");
			let timeInput = document.createElement("input");
			timeInput.id = "time" + result.autoTabs[i].id;
			timeInput.type = "time";
			timeInput.value = result.autoTabs[i].timeStr;
			newAutoTabInput.append(timeInput);
			newAutoTabInput.append(" Repeat: ");
			let repeatInput = document.createElement("input");
			repeatInput.id = "repeat" + result.autoTabs[i].id;
			repeatInput.type = "checkbox";
			repeatInput.className = "clicky";
			newAutoTabInput.append(repeatInput);
			let repeatLabel = document.createElement("label");
			repeatLabel.id = "repeatLabel" + result.autoTabs[i].id;
			repeatLabel.htmlFor = "repeat" + result.autoTabs[i].id;
			newAutoTabInput.append(repeatLabel);

			let daysToRepeatSpan = document.createElement("span");
			daysToRepeatSpan.innerHTML = " Days to Repeat: ";
			daysToRepeatSpan.id = "daysToRepeatSpan" + result.autoTabs[i].id;
			newAutoTabInput.append(daysToRepeatSpan);

			let sundayInput = document.createElement("input");
			sundayInput.id = "sunday" + result.autoTabs[i].id;
			sundayInput.type = "checkBox";
			if (result.autoTabs[i].sunday) {
				sundayInput.className = "clickyChecked";
				sundayInput.checked = true;
			} else {
				sundayInput.className = "clicky";
				sundayInput.checked = false;
			}
			sundayInput.onclick = function() {
				if(sundayInput.checked) {
					sundayInput.className = "clickyChecked";
				} else {
					sundayInput.className = "clicky";
				}
			};
			newAutoTabInput.append(sundayInput);
			let sundayLabel = document.createElement("label");
			sundayLabel.id = "sundayLabel" + result.autoTabs[i].id;
			sundayLabel.htmlFor = "sunday" + result.autoTabs[i].id;
			sundayLabel.innerHTML = "Sunday";
			newAutoTabInput.append(sundayLabel);
			newAutoTabInput.append(" ");
			let mondayInput = document.createElement("input");
			mondayInput.id = "monday" + result.autoTabs[i].id;
			mondayInput.type = "checkBox";
			if (result.autoTabs[i].monday) {
				mondayInput.className = "clickyChecked";
				mondayInput.checked = true;
			} else {
				mondayInput.className = "clicky";
				mondayInput.checked = false;
			}
			mondayInput.onclick = function() {
				if(mondayInput.checked) {
					mondayInput.className = "clickyChecked";
				} else {
					mondayInput.className = "clicky";
				}
			};
			newAutoTabInput.append(mondayInput);
			let mondayLabel = document.createElement("label");
			mondayLabel.id = "mondayLabel" + result.autoTabs[i].id;
			mondayLabel.htmlFor = "monday" + result.autoTabs[i].id;
			mondayLabel.innerHTML = "Monday";
			newAutoTabInput.append(mondayLabel);
			newAutoTabInput.append(" ");
			let tuesdayInput = document.createElement("input");
			tuesdayInput.id = "tuesday" + result.autoTabs[i].id;
			tuesdayInput.type = "checkBox";
			if (result.autoTabs[i].tuesday) {
				tuesdayInput.className = "clickyChecked";
				tuesdayInput.checked = true;
			} else {
				tuesdayInput.className = "clicky";
				tuesdayInput.checked = false;
			}
			tuesdayInput.onclick = function() {
				if(tuesdayInput.checked) {
					tuesdayInput.className = "clickyChecked";
				} else {
					tuesdayInput.className = "clicky";
				}
			};
			newAutoTabInput.append(tuesdayInput);
			let tuesdayLabel = document.createElement("label");
			tuesdayLabel.id = "tuesdayLabel" + result.autoTabs[i].id;
			tuesdayLabel.htmlFor = "tuesday" + result.autoTabs[i].id;
			tuesdayLabel.innerHTML = "Tuesday";
			newAutoTabInput.append(tuesdayLabel);
			newAutoTabInput.append(" ");
			let wednesdayInput = document.createElement("input");
			wednesdayInput.id = "wednesday" + result.autoTabs[i].id;
			wednesdayInput.type = "checkBox";
			if (result.autoTabs[i].wednesday) {
				wednesdayInput.className = "clickyChecked";
				wednesdayInput.checked = true;
			} else {
				wednesdayInput.className = "clicky";
				wednesdayInput.checked = false;
			}
			wednesdayInput.onclick = function() {
				if(wednesdayInput.checked) {
					wednesdayInput.className = "clickyChecked";
				} else {
					wednesdayInput.className = "clicky";
				}
			};
			newAutoTabInput.append(wednesdayInput);
			let wednesdayLabel = document.createElement("label");
			wednesdayLabel.id = "wednesdayLabel" + result.autoTabs[i].id;
			wednesdayLabel.htmlFor = "wednesday" + result.autoTabs[i].id;
			wednesdayLabel.innerHTML = "Wednesday";
			newAutoTabInput.append(wednesdayLabel);
			newAutoTabInput.append(" ");
			let thursdayInput = document.createElement("input");
			thursdayInput.id = "thursday" + result.autoTabs[i].id;
			thursdayInput.type = "checkBox";
			if (result.autoTabs[i].thursday) {
				thursdayInput.className = "clickyChecked";
				thursdayInput.checked = true;
			} else {
				thursdayInput.className = "clicky";
				thursdayInput.checked = false;
			}
			thursdayInput.onclick = function() {
				if(thursdayInput.checked) {
					thursdayInput.className = "clickyChecked";
				} else {
					thursdayInput.className = "clicky";
				}
			};
			newAutoTabInput.append(thursdayInput);
			let thursdayLabel = document.createElement("label");
			thursdayLabel.id = "thursdayLabel" + result.autoTabs[i].id;
			thursdayLabel.htmlFor = "thursday" + result.autoTabs[i].id;
			thursdayLabel.innerHTML = "Thursday";
			newAutoTabInput.append(thursdayLabel);
			newAutoTabInput.append(" ");
			let fridayInput = document.createElement("input");
			fridayInput.id = "friday" + result.autoTabs[i].id;
			fridayInput.type = "checkBox";
			if (result.autoTabs[i].friday) {
				fridayInput.className = "clickyChecked";
				fridayInput.checked = true;
			} else {
				fridayInput.className = "clicky";
				fridayInput.checked = false;
			}
			fridayInput.onclick = function() {
				if(fridayInput.checked) {
					fridayInput.className = "clickyChecked";
				} else {
					fridayInput.className = "clicky";
				}
			};
			newAutoTabInput.append(fridayInput);
			let fridayLabel = document.createElement("label");
			fridayLabel.id = "fridayLabel" + result.autoTabs[i].id;
			fridayLabel.htmlFor = "friday" + result.autoTabs[i].id;
			fridayLabel.innerHTML = "Friday";
			newAutoTabInput.append(fridayLabel);
			newAutoTabInput.append(" ");
			let saturdayInput = document.createElement("input");
			saturdayInput.id = "saturday" + result.autoTabs[i].id;
			saturdayInput.type = "checkBox";
			if (result.autoTabs[i].saturday) {
				saturdayInput.className = "clickyChecked";
				saturdayInput.checked = true;
			} else {
				saturdayInput.className = "clicky";
				saturdayInput.checked = false;
			}
			saturdayInput.onclick = function() {
				if(saturdayInput.checked) {
					saturdayInput.className = "clickyChecked";
				} else {
					saturdayInput.className = "clicky";
				}
			};
			newAutoTabInput.append(saturdayInput);
			let saturdayLabel = document.createElement("label");
			saturdayLabel.id = "saturdayLabel" + result.autoTabs[i].id;
			saturdayLabel.htmlFor = "saturday" + result.autoTabs[i].id;
			saturdayLabel.innerHTML = "Saturday";
			newAutoTabInput.append(saturdayLabel);

			let dateSpan = document.createElement("span");
			dateSpan.id = "dateSpan" + result.autoTabs[i].id;
			dateSpan.innerHTML = " Date: ";
			newAutoTabInput.append(dateSpan);
			let dateInput = document.createElement("input");
			dateInput.id = "date" + result.autoTabs[i].id;
			dateInput.type = "date";
			newAutoTabInput.append(dateInput);

			let deleteButton = document.createElement("button");
			deleteButton.id = "deleteButton" + result.autoTabs[i].id;
			deleteButton.innerHTML = "✕";
			deleteButton.title = "Delete";
			deleteButton.className = "deleteButton";
			newAutoTabInput.append(deleteButton);

			if (result.autoTabs[i].dateStr == null) {
				let date = new Date();
				date.setDate(date.getDate()+1);
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				let formattedDate = "2019-1-1";
				if (month < 10){
					month = "0" + month;
				}
				if (day < 10) {
					day = "0" + day;
				}
				formattedDate = year + "-" + month + "-" + day;
				dateInput.value = formattedDate;
			} else {
				dateInput.value = result.autoTabs[i].dateStr;
			}

			if (result.autoTabs[i].repeat) {
				repeatLabel.innerHTML = "On";
				repeatInput.checked = true;
				repeatInput.className = "clickyChecked";
				dateSpan.style.display = "none";
				dateInput.style.display = "none";
			} else {
				repeatLabel.innerHTML = "Off";
				repeatInput.checked = false;
				repeatInput.className = "clicky";
				daysToRepeatSpan.style.display = "none";
				sundayInput.style.display = "none";
				sundayLabel.style.display = "none";
				mondayInput.style.display = "none";
				mondayLabel.style.display = "none";
				tuesdayInput.style.display = "none";
				tuesdayLabel.style.display = "none";
				wednesdayInput.style.display = "none";
				wednesdayLabel.style.display = "none";
				thursdayInput.style.display = "none";
				thursdayLabel.style.display = "none";
				fridayInput.style.display = "none";
				fridayLabel.style.display = "none";
				saturdayInput.style.display = "none";
				saturdayLabel.style.display = "none";
			}

			autoTabHolder.append(newAutoTabInput);

			deleteButton.onclick = function(){
				deleteButton.innerHTML = "-";
				autoTabHolder.removeChild(newAutoTabInput);
				delaySaving();
			};
			repeatInput.onclick = function() {
				if (repeatInput.checked) {
					repeatInput.className = "clickyChecked";
					repeatLabel.innerHTML = "On";
					
					daysToRepeatSpan.style.display = null;
					sundayInput.style.display = null;
					sundayLabel.style.display = null;
					mondayInput.style.display = null;
					mondayLabel.style.display = null;
					tuesdayInput.style.display = null;
					tuesdayLabel.style.display = null;
					wednesdayInput.style.display = null;
					wednesdayLabel.style.display = null;
					thursdayInput.style.display = null;
					thursdayLabel.style.display = null;
					fridayInput.style.display = null;
					fridayLabel.style.display = null;
					saturdayInput.style.display = null;
					saturdayLabel.style.display = null;
					dateSpan.style.display = "none";
					dateInput.style.display = "none";
					
				} else {
					repeatInput.className = "clicky";
					repeatLabel.innerHTML = "Off";
					
					daysToRepeatSpan.style.display = "none";
					sundayInput.style.display = "none";
					sundayLabel.style.display = "none";
					mondayInput.style.display = "none";
					mondayLabel.style.display = "none";
					tuesdayInput.style.display = "none";
					tuesdayLabel.style.display = "none";
					wednesdayInput.style.display = "none";
					wednesdayLabel.style.display = "none";
					thursdayInput.style.display = "none";
					thursdayLabel.style.display = "none";
					fridayInput.style.display = "none";
					fridayLabel.style.display = "none";
					saturdayInput.style.display = "none";
					saturdayLabel.style.display = "none";
					dateSpan.style.display = null;
					dateInput.style.display = null;
				}
			};
		}

	}
});


addAutoTabButton.onclick = function() {createAutoTab();};

function createAutoTab(){
	//get and format the current date and time
	let date = new Date();
	date.setDate(date.getDate()+1);
	date.setHours(date.getHours()+1);
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let formattedTime = "00:00";
	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	formattedTime = hours + ":" + minutes;
	let formattedDate = "2019-1-1";
	if (month < 10){
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	formattedDate = year + "-" + month + "-" + day;

	//add ui elements
	let newAutoTabInput = document.createElement("div");
	if (count%2 == 0) {
		//newAutoTabInput.style.backgroundColor = "#ccffcc";
	}
	newAutoTabInput.id = count;
	newAutoTabInput.className = "autoTabInput";
	newAutoTabInput.append("URL: ");
	let urlInput = document.createElement("input");
	urlInput.id = "url" + count;
	urlInput.type = "url";
	newAutoTabInput.append(urlInput);
	newAutoTabInput.append(" Time to Open: ");
	let timeInput = document.createElement("input");
	timeInput.id = "time" + count;
	timeInput.type = "time";
	timeInput.value = formattedTime;
	newAutoTabInput.append(timeInput);

	newAutoTabInput.append(" Repeat: ");
	let repeatInput = document.createElement("input");
	repeatInput.id = "repeat" + count;
	repeatInput.type = "checkbox";
	repeatInput.checked = true;
	repeatInput.className = "clickyChecked";
	newAutoTabInput.append(repeatInput);
	repeatInput.oninput = function() {
	};
	let repeatLabel = document.createElement("label");
	repeatLabel.id = "repeatLabel" + count;
	repeatLabel.htmlFor = "repeat" + count;
	repeatLabel.innerHTML = "On";
	newAutoTabInput.append(repeatLabel);

	let daysToRepeatSpan = document.createElement("span");
	daysToRepeatSpan.innerHTML = " Days to Repeat: ";
	daysToRepeatSpan.id = "daysToRepeatSpan" + count;
	newAutoTabInput.append(daysToRepeatSpan);

	let sundayInput = document.createElement("input");
	sundayInput.id = "sunday" + count;
	sundayInput.type = "checkBox";
	sundayInput.checked = true;
	sundayInput.className = "clickyChecked";
	sundayInput.onclick = function() {
		if(sundayInput.checked) {
			sundayInput.className = "clickyChecked";
		} else {
			sundayInput.className = "clicky";
		}
	};
	let sundayLabel = document.createElement("label");
	sundayLabel.id = "sundayLabel" + count;
	sundayLabel.htmlFor = "sunday" + count;
	sundayLabel.innerHTML = "Sunday";
	let mondayInput = document.createElement("input");
	mondayInput.id = "monday" + count;
	mondayInput.type = "checkBox";
	mondayInput.checked = true;
	mondayInput.className = "clickyChecked";
	mondayInput.onclick = function() {
		if(mondayInput.checked) {
			mondayInput.className = "clickyChecked";
		} else {
			mondayInput.className = "clicky";
		}
	};
	let mondayLabel = document.createElement("label");
	mondayLabel.id = "mondayLabel" + count;
	mondayLabel.htmlFor = "monday" + count;
	mondayLabel.innerHTML = "Monday";
	let tuesdayInput = document.createElement("input");
	tuesdayInput.id = "tuesday" + count;
	tuesdayInput.type = "checkBox";
	tuesdayInput.checked = true;
	tuesdayInput.className = "clickyChecked";
	tuesdayInput.onclick = function() {
		if(tuesdayInput.checked) {
			tuesdayInput.className = "clickyChecked";
		} else {
			tuesdayInput.className = "clicky";
		}
	};
	let tuesdayLabel = document.createElement("label");
	tuesdayLabel.id = "tuesdayLabel" + count;
	tuesdayLabel.htmlFor = "tuesday" + count;
	tuesdayLabel.innerHTML = "Tuesday";
	let wednesdayInput = document.createElement("input");
	wednesdayInput.id = "wednesday" + count;
	wednesdayInput.type = "checkBox";
	wednesdayInput.checked = true;
	wednesdayInput.className = "clickyChecked";
	wednesdayInput.onclick = function() {
		if(wednesdayInput.checked) {
			wednesdayInput.className = "clickyChecked";
		} else {
			wednesdayInput.className = "clicky";
		}
	};
	let wednesdayLabel = document.createElement("label");
	wednesdayLabel.id = "wednesdayLabel" + count;
	wednesdayLabel.htmlFor = "wednesday" + count;
	wednesdayLabel.innerHTML = "Wednesday";
	let thursdayInput = document.createElement("input");
	thursdayInput.id = "thursday" + count;
	thursdayInput.type = "checkBox";
	thursdayInput.checked = true;
	thursdayInput.className = "clickyChecked";
	thursdayInput.onclick = function() {
		if(thursdayInput.checked) {
			thursdayInput.className = "clickyChecked";
		} else {
			thursdayInput.className = "clicky";
		}
	};
	let thursdayLabel = document.createElement("label");
	thursdayLabel.id = "thursdayLabel" + count;
	thursdayLabel.htmlFor = "thursday" + count;
	thursdayLabel.innerHTML = "Thursday";
	let fridayInput = document.createElement("input");
	fridayInput.id = "friday" + count;
	fridayInput.type = "checkBox";
	fridayInput.checked = true;
	fridayInput.className = "clickyChecked";
	fridayInput.onclick = function() {
		if(fridayInput.checked) {
			fridayInput.className = "clickyChecked";
		} else {
			fridayInput.className = "clicky";
		}
	};
	let fridayLabel = document.createElement("label");
	fridayLabel.id = "fridayLabel" + count;
	fridayLabel.htmlFor = "friday" + count;
	fridayLabel.innerHTML = "Friday";
	
	let saturdayInput = document.createElement("input");
	saturdayInput.id = "saturday" + count;
	saturdayInput.type = "checkBox";
	saturdayInput.checked = true;
	saturdayInput.className = "clickyChecked";
	saturdayInput.onclick = function() {
		if(saturdayInput.checked) {
			saturdayInput.className = "clickyChecked";
		} else {
			saturdayInput.className = "clicky";
		}
	};
	let saturdayLabel = document.createElement("label");
	saturdayLabel.id = "saturdayLabel" + count;
	saturdayLabel.htmlFor = "saturday" + count;
	saturdayLabel.innerHTML = "Saturday";

	let days = document.createElement("span");
	newAutoTabInput.append(sundayInput);
	newAutoTabInput.append(sundayLabel);
	newAutoTabInput.append(" ");
	newAutoTabInput.append(mondayInput);
	newAutoTabInput.append(mondayLabel);
	newAutoTabInput.append(" ");
	newAutoTabInput.append(tuesdayInput);
	newAutoTabInput.append(tuesdayLabel);
	newAutoTabInput.append(" ");
	newAutoTabInput.append(wednesdayInput);
	newAutoTabInput.append(wednesdayLabel);
	newAutoTabInput.append(" ");
	newAutoTabInput.append(thursdayInput);
	newAutoTabInput.append(thursdayLabel);
	newAutoTabInput.append(" ");
	newAutoTabInput.append(fridayInput);
	newAutoTabInput.append(fridayLabel);
	newAutoTabInput.append(" ");
	newAutoTabInput.append(saturdayInput);
	newAutoTabInput.append(saturdayLabel);
	newAutoTabInput.append(days);

	let dateSpan = document.createElement("span");
	dateSpan.id = "dateSpan" + count;
	dateSpan.innerHTML = " Date: ";
	dateSpan.style.display = "none";
	newAutoTabInput.append(dateSpan);
	let dateInput = document.createElement("input");
	dateInput.id = "date" + count;
	dateInput.type = "date";
	dateInput.value = formattedDate;
	dateInput.style.display = "none";
	newAutoTabInput.append(dateInput);
	autoTabHolder.append(newAutoTabInput);

	let deleteButton = document.createElement("button");
	deleteButton.id = "deleteButton" + count;
	deleteButton.innerHTML = "✕";
	deleteButton.title = "Delete";
	newAutoTabInput.append(deleteButton);
	deleteButton.onclick = function(){
		deleteButton.innerHTML = "-";
		autoTabHolder.removeChild(newAutoTabInput);
		delaySaving();
	};
	repeatInput.onclick = function() {
		if (repeatInput.checked) {
			repeatInput.className = "clickyChecked";
			repeatLabel.innerHTML = "On";
			
			daysToRepeatSpan.style.display = null;
			sundayInput.style.display = null;
			sundayLabel.style.display = null;
			mondayInput.style.display = null;
			mondayLabel.style.display = null;
			tuesdayInput.style.display = null;
			tuesdayLabel.style.display = null;
			wednesdayInput.style.display = null;
			wednesdayLabel.style.display = null;
			thursdayInput.style.display = null;
			thursdayLabel.style.display = null;
			fridayInput.style.display = null;
			fridayLabel.style.display = null;
			saturdayInput.style.display = null;
			saturdayLabel.style.display = null;
			dateSpan.style.display = "none";
			dateInput.style.display = "none";
			
		} else {
			repeatInput.className = "clicky";
			repeatLabel.innerHTML = "Off";
			
			daysToRepeatSpan.style.display = "none";
			sundayInput.style.display = "none";
			sundayLabel.style.display = "none";
			mondayInput.style.display = "none";
			mondayLabel.style.display = "none";
			tuesdayInput.style.display = "none";
			tuesdayLabel.style.display = "none";
			wednesdayInput.style.display = "none";
			wednesdayLabel.style.display = "none";
			thursdayInput.style.display = "none";
			thursdayLabel.style.display = "none";
			fridayInput.style.display = "none";
			fridayLabel.style.display = "none";
			saturdayInput.style.display = "none";
			saturdayLabel.style.display = "none";
			dateSpan.style.display = null;
			dateInput.style.display = null;
		}
	};
	count = count + 1;
}

autoTabHolder.oninput = function(){	
	delaySaving();
};

function delaySaving() {
	optionsSavedText.innerHTML = "Options not saved.";
	if (!waitingToSave) {
		waitingToSave = true;
		setTimeout(function(){saveOptions();}, 1000);
	}
}
function saveOptions() {
	let autoTabs = [];
	waitingToSave = false;
	for (let i = 0; i < autoTabHolder.childNodes.length; i++) {
		if(autoTabHolder.childNodes[i].id != null) {
			let autoTab = {};
			autoTab.id = autoTabHolder.childNodes[i].id;
			autoTab.url = document.getElementById("url" + autoTab.id).value;
			autoTab.opened = false;
			autoTab.timeStr = document.getElementById("time" + autoTab.id).value;
			if (document.getElementById("repeat" + autoTab.id).checked == false) {
				autoTab.repeat = false;
				autoTab.dateStr = document.getElementById("date" + autoTab.id).value;
			} else { 
				autoTab.repeat = true;
				autoTab.sunday = document.getElementById("sunday" + autoTab.id).checked;
				autoTab.monday = document.getElementById("monday" + autoTab.id).checked;
				autoTab.tuesday = document.getElementById("tuesday" + autoTab.id).checked;
				autoTab.wednesday = document.getElementById("wednesday" + autoTab.id).checked;
				autoTab.thursday = document.getElementById("thursday" + autoTab.id).checked;
				autoTab.friday = document.getElementById("friday" + autoTab.id).checked;
				autoTab.saturday = document.getElementById("saturday" + autoTab.id).checked;
			}
			autoTabs.push(autoTab);
		}
	}
	chrome.storage.sync.set({count:count}, function(){
		chrome.storage.sync.set({autoTabs:autoTabs}, function(){
			chrome.runtime.sendMessage({optionsChanged:true}, function(response) {
				optionsSavedText.innerHTML = "Options saved.";
			});
		});
	});
	
}

