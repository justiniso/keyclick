
//var active = false;
var presses = 0;
var searchText = "";
var inputElements = document.getElementsByTagName('input');
var linkElements = document.getElementsByTagName('a');
var matchingElements = [];
var targetCounter = 0;
var targetElement;
var targetLeft = 0;
var targetTop = 0;
var tagText = "";
var activationKeycode = 192;	// tilda (192)


var helper = document.createElement('span');
var helperBar = document.createElement('div');
var highlight = document.createElement('div');


var keyclick = {

	active: false,
	activationKeyPresses: 0,
	searchText: '',
	matchingElements: [],
	targetElement: {
		node: null,
		index: 0,		// target element's index in matchingElements array
	},



	activate: function(){
		// Functionality
		this.active = true;

		// UI
		this.showUI();
	},

	deactivate: function(){
		// Functionality
		this.active = false;

		// Retain between sessions
		this.searchText = this.searchText;
		this.matchingElements = this.matchingElements;
		this.targetElement = this.targetElement;

		// UI
		this.hideUI();
	},

	listenForActivationKey: function() {
		if(this.activationKeyPresses!=0){	// activation key pressed already
			if(this.active){
				this.deactivate();	
			} else {
				this.activate();	
			}
		} else {
			this.activationKeyPresses = 1;
			setTimeout('this.activationKeyPresses=0;', 300);
		}
	},

	showUI: function(){
		helper.style.visibility = 'visible';
		helperBar.style.visibility = 'visible';
		highlight.style.visibility = 'visible';
	},

	hideUI: function(){
		helper.style.visibility = 'hidden';
		helperBar.style.visibility = 'hidden';
		highlight.style.visibility = 'hidden';
	},

	resetHighlight: function() {
		highlight.style.top = '0px';
		highlight.style.left = '0px';
		highlight.style.width = '0px';
		highlight.style.height = '0px';
		highlight.style.visibility = '0px';
	},

	resetSearchText: function(){
		this.searchText = '';
		this.matchingElements = '';

		// UI
		helper.innerHTML = '';
		highlight.style.visibility = 'hidden';
	},

	resetAll: function(){
		this.resetSearchText();
		this.resetHighlight();
		this.deactivate();
	},

	updateSearchText: function(keycode) {
		this.searchText += String.fromCharCode(keycode);
		this.searchText = this.searchText.toLowerCase();
	},

	updateMatchingElements: function() {
		var pattern = new RegExp(this.searchText, 'i');	// case insensitive search pattern

		this.matchingElements = [];	// reset matching elements

		// Add all elements with matching text to matching elements array
		for(el in linkElements){
			var testElement = linkElements[el];
			var testText = testElement.innerHTML || '';

			// Push the element to matching array if it matches
			if(pattern.test(testText)){
				this.matchingElements.push(testElement);
			}
		}
	},

	// set target element to the index in matchingElements array
	updateTargetElement: function() {
		var i = this.targetElement.index;

		this.resetHighlight();

		// Set target element to first matching element, if any
		if(this.matchingElements.length > 0) {
			this.targetElement.node = this.matchingElements[i]; 
			this.shiftHighlightTo(this.targetElement.node);
			highlight.style.visibility = 'visible';
		} else {
			this.targetElement.node = null;
			highlight.style.visibility = 'hidden';
		}

		helper.innerHTML = this.searchText;
	},

	clickCurrentTarget: function(){
		this.resetSearchText();
		this.resetHighlight();

		if(this.targetElement.node){
			this.targetElement.node.click();
		} else {
			alert('No elements found');
		}
	},

	goToNextMatch: function(){
		var i = this.targetElement.index;

		if(i >= keyclick.matchingElements.length-1){
			i = 0;
		} else {
			i++;
		}

		this.targetElement.index = i;
		this.targetElement.node = this.matchingElements[i];
		this.shiftHighlightTo(this.targetElement.node);
	},

	goToPreviousMatch: function(){
		var i = this.targetElement.index;

		if(i > 0){
			i--; 
		} else {
			this.matchingElements.length-1;
		}

		this.targetElement.index = i;
		this.targetElement.node = this.matchingElements[i];
		this.shiftHighlightTo(this.targetElement.node);
	},

	findPositionOf: function(node){
		var curtop = 0;
		var curleft = 0;
		var curtopscroll = 0;
		var curleftscroll = 0;
		var pos = {
			'top': 0,
			'left': 0
		};
		if(node && node.offsetParent){
			do {
				curtop += node.offsetTop;
				curleft += node.offsetLeft;
			} while (node = node.offsetParent);

			pos.top = curtop-curtopscroll;
			pos.left = curleft-curleftscroll;
		}
		return pos;
	},

	shiftHighlightTo: function(target){
		if(target){
			var elPos = this.findPositionOf(target);
			var elTop = elPos['top'].toString()+'px';
			var elLeft = elPos['left'].toString()+'px';

			highlight.style.top = elTop;
			highlight.style.left = elLeft;
			highlight.style.width = target.offsetWidth.toString()+'px';
			highlight.style.height = target.offsetHeight.toString()+'px';
			highlight.style.visibility = 'visible';

			// scroll window to that element
			window.scrollTo(parseInt(elLeft)-100, parseInt(elTop)-100);
		} else {
			highlight.style.visibility = 'hidden';
		}
	},

	initElements: function() {
		document.body.appendChild(highlight);
		highlight.style.width = '10px';
		highlight.style.height = '10px';
		highlight.style.position = 'absolute';
		highlight.style.backgroundColor = 'yellow';
		highlight.style.border = '3px solid orange';
		highlight.style.borderRadius = '5px';
		highlight.style.MozBorderRadius = '5px';
		highlight.style.opacity = '0.6';
		highlight.style.MozOpacity = '0.6';
		highlight.style.zIndex = '2147483647';

		document.body.appendChild(helper);
		helper.style.position = 'fixed';
		helper.style.height = '15px';
		helper.style.left = '10px';
		helper.style.top = '5px';
		helper.style.border = '1px solid #d5d5d5';
		helper.style.backgroundColor = '#ffffff';
		helper.style.fontFamily = 'Arial';
		helper.style.fontSize = '16px';
		helper.style.zIndex = '2147483647';

		document.body.appendChild(helperBar);
		helperBar.style.width = '100%';
		helperBar.style.height = '25px';
		helperBar.style.top = '0px';
		helperBar.style.position = 'fixed';
		helperBar.style.border = '1px solid #c5c5c5';
		helperBar.style.backgroundColor = 'rgb(225, 200, 135)';
		helperBar.style.opacity = '0.6';
		helperBar.style.MozOpacity = '0.6';
		helperBar.style.zIndex = '2147483646'; // one less than highlight and helper

	}
};

keyclick.initElements();
keyclick.resetAll();

function resetAll() {
	searchText = '';
	tagText = '';
	matchingElements = [];
	targetElement = null;
	targetCounter = 0;
	highlight.style.visibility = 'hidden';
	helperBar.style.visibility = 'hidden';
	helper.innerHTML = '';
}

function shiftHighlight(target) {
	if(target){
		var elPos = findPosition(target);
		var elTop = elPos['top'].toString()+'px';
		var elLeft = elPos['left'].toString()+'px';

		highlight.style.top = elTop;
		highlight.style.left = elLeft;
		highlight.style.width = target.offsetWidth.toString()+'px';
		highlight.style.height = target.offsetHeight.toString()+'px';

		// scroll window to that element
		window.scrollTo(parseInt(elLeft)-100, parseInt(elTop)-100);
	}
	
}

//	Loop up the document until final position in document is found	*/
function findPosition(node){
	var curtop = 0;
	var curleft = 0;
	var curtopscroll = 0;
	var curleftscroll = 0;
	var pos = {
		'top': 0,
		'left': 0
	};
	if(node && node.offsetParent){
		do {
			curtop += node.offsetTop;
			curleft += node.offsetLeft;
		} while (node = node.offsetParent);

		pos.top = curtop-curtopscroll;
		pos.left = curleft-curleftscroll;
	}
	return pos;
}


document.onkeydown= function(e) {
	
	// activation keycode double-tapped
	if(e.keyCode==activationKeycode){
		keyclick.listenForActivationKey();
		return false;
	}

	// escape or backspace
	else if((e.keyCode==27 || e.keyCode==8) && keyclick.active){
		keyclick.resetSearchText();
		return false;
	}

	// enter
	else if(e.keyCode==13 && keyclick.active){
		keyclick.clickCurrentTarget();
		keyclick.resetSearchText();
		return false;
	}

	// arrow right or arrow down
	else if((e.keyCode==39 || e.keyCode==40) && keyclick.active) {
		keyclick.goToNextMatch();
		return false;
	}

	// arrow left or arrow up
	else if((e.keyCode==37 || e.keyCode==38) && keyclick.active) {
		keyclick.goToPreviousMatch();
		return false;
	}

	// Non-activation character pressed; match element to search text
	else if(e.keyCode!=activationKeycode && keyclick.active) {	
		keyclick.updateSearchText(e.keyCode);
		keyclick.updateMatchingElements();
		keyclick.updateTargetElement();
		return false; /* overrides brower's default behavior for these keys */
	}
};

