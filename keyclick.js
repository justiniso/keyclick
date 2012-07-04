
var active = true;
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
var pattern;
var highlight = document.createElement('div');
var helper = document.createElement('span');

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
highlight.style.visibility = 'hidden';

document.body.appendChild(helper);
helper.style.position = 'fixed';
helper.style.height = '15px';
helper.style.left = '10px';
helper.style.top = '5px';
helper.style.border = '1px solid #d5d5d5';
helper.style.backgroundColor = '#ffffff';
helper.style.fontSize = '16px';
helper.style.zIndex = '2147483647';

function resetAll() {
	searchText = '';
	tagText = '';
	matchingElements = [];
	targetElement = null;
	targetCounter = 0;
	highlight.style.visibility = 'hidden';
	helper.innerHTML = '';
}

function shiftHighlight(target) {
	if(target){
		var elPos = findPosition(target);
		var elTop = elPos['top'].toString()+'px';
		var elLeft = elPos['left'].toString()+'px';

		highlight.style.top = elTop;
		highlight.style.left = elLeft;
		//highlight.style.left = target.offsetLeft.toString()+'px';
		//highlight.style.top = target.offsetTop.toString()+'px';
		highlight.style.width = target.offsetWidth.toString()+'px';
		highlight.style.height = target.offsetHeight.toString()+'px';

		/* scroll window to that element */
		/* NOTE: findPosition returns position as string "0px" */
		window.scrollTo(parseInt(elLeft)-100, parseInt(elTop)-100);
	}
	
}

/*	Loop up the document until final position in document is found	*/
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
			// curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
			// curleftscroll += node.offSetParent ? node.offsetParent.scrollLeft : 0;
		} while (node = node.offsetParent);

		pos['top'] = curtop-curtopscroll;
		pos['left'] = curleft-curleftscroll;
	}
	return pos;
}


document.onkeydown= function(e) {
	/* tilda key double pressed to activate */
	if(e.keyCode==192){
		if(presses!=0){
			/*	deactivate if activated	*/
			if(active){
				resetAll();
				active = false;
			}
			/*	activate if deactivated	*/
			else {
				active = true;
			}
		}
		else {
			presses = 1;
			presses = setTimeout('presses=0;', 300);
		}
	}

	/* escape or backspace */
	else if(e.keyCode==27 || e.keyCode==8){
		resetAll();
	}
	/* arrow right */
	else if(e.keyCode==39 && active){
		if(targetCounter>matchingElements.length+1){
			targetCounter=0;
		}
		else {
			targetCounter++;
		}
		targetElement = matchingElements[targetCounter];
	}
	/* arrow left */
	else if(e.keyCode==37 && active){
		if(targetCounter>1){
			targetCounter--;
		}
		else {
			targetCounter = matchingElements.length-1;
		}
		targetElement = matchingElements[targetCounter];
	}

	try {
		targetElement = matchingElements[targetCounter];
		shiftHighlight(targetElement);
	}
	catch(err){
		alert(err.message);
	}
}

document.onkeypress= function(e) {
	/* Enter is pressed */
	if(e.charCode==13 && active){

		if(targetElement){
			targetElement.click();
		}
		else {
			alert('no links found');
		}

		resetAll();
	}

	/* Non-tilda character pressed */
	else if(e.charCode!=96 && active) {		/* NOTE: tilda registers charCode 96, keyCode 192	*/
		matchingElements = [];
		searchText = searchText+String.fromCharCode(e.charCode);
		pattern = new RegExp(searchText, 'i');

		helper.innerHTML = searchText;
		highlight.style.visibility = 'visible';

		/* Add all elements with matching text to matchingText array */
		for(el in linkElements){
			tagText = linkElements[el].innerHTML ? linkElements[el].innerHTML.toLowerCase() : '';

			/* Push the element to matching array if it matches */
			if(pattern.test(tagText)){
				matchingElements.push(linkElements[el]);
			}
		}

		/* Set target element to first matching element, if any */
		if(matchingElements.length>0) { /* at least one element matches */
			targetElement = matchingElements[targetCounter]; /* TODO: add in check for this*/
			shiftHighlight(targetElement);
		}
		else {
			targetElement = null;
			highlight.style.visibility = 'hidden';
		}



	}
}
