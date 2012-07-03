
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
		highlight.style.left = target.offsetLeft.toString()+'px';
		highlight.style.top = target.offsetTop.toString()+'px';
		highlight.style.width = target.offsetWidth.toString()+'px';
		highlight.style.height = target.offsetHeight.toString()+'px';

		/* scroll window to that element */
		window.scroll(target.offsetLeft-100, target.offsetTop-target.scrollTop-100);
	}
	
}



document.onkeydown= function(e) {
	/* escape or backspace */
	if(e.keyCode==27 || e.keyCode==8){
		resetAll();
	}
	/* arrow down */
	else if(e.keyCode==39){
		if(targetCounter>matchingElements.length+1){
			targetCounter=0;
		}
		else {
			targetCounter++;
		}
		targetElement = matchingElements[targetCounter];
	}
	/* arrow up */
	else if(e.keyCode==37){
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
	if(e.charCode==13){

		if(targetElement){
			targetElement.click();
		}
		else {
			alert('no links found');
		}

		resetAll();
	}

	/* Character pressed */
	else {
		matchingElements = [];
		searchText = searchText+String.fromCharCode(e.charCode);
		pattern = new RegExp(searchText, 'i');

		helper.innerHTML = searchText;
		highlight.style.visibility = 'visible';

		/* Add all elements with matching text to matchingText array */
		for(el in linkElements){
			tagText = linkElements[el].innerHTML;
			if(tagText){ tagText.toLowerCase(); }
			
			/* If search string is in tag string */
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
