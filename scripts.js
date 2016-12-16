function loaded() {

	console.log('loaded');

	var experienceListContainer = document.getElementById('experience-list-container');
	experienceListContainer.addEventListener('scroll', experienceListScrollChanged);

	setupExperienceListScroll();

}


function setupExperienceListScroll() {
	var experienceListContainer = document.getElementById('experience-list-container');

	var scrollArrowTop = document.getElementById('experience-list-scroll-arrow-top');
	var scrollArrowBottom = document.getElementById('experience-list-scroll-arrow-bottom');

	if (experienceListContainer.scrollTop === 0) {
		scrollArrowTop.classList.add('hidden');
	}
	if (experienceListContainer.scrollTop + experienceListContainer.getBoundingClientRect().height + 1 >= experienceListContainer.scrollHeight) {
		scrollArrowBottom.classList.add('hidden');
	}

	var listItemHeight = experienceListContainer.firstElementChild.firstElementChild.firstElementChild.getBoundingClientRect().height;

	var visibleListHeight = experienceListContainer.getBoundingClientRect().height;
	var numListItems = visibleListHeight/listItemHeight;


	scrollArrowTop.addEventListener('mouseup', function() {
		var scrolledPos = experienceListContainer.scrollTop;
		var incompleteListItem = scrolledPos%listItemHeight;

		var toScroll = incompleteListItem < 1 ? listItemHeight + incompleteListItem : incompleteListItem;

		interpolateProperty(function(val) {
								experienceListContainer.scrollTop = val
							},
							experienceListContainer.scrollTop,
							experienceListContainer.scrollTop - toScroll,
							400);
	});



	scrollArrowBottom.addEventListener('mouseup', function() {
		debugger
		var scrolledPos = experienceListContainer.scrollTop;
		var topIncompleteListItemHeight = listItemHeight - scrolledPos%listItemHeight;

		// this value is:
		// the height of n full list items
		// plus the height of the top incomplete list item
		// so includes the out-of-view portion of the last item
		// which is exactly the value we want
		var visibleListItemsHeight = topIncompleteListItemHeight +
									 Math.floor(numListItems-1)*listItemHeight;
		
		var incompleteListItem = listItemHeight + visibleListItemsHeight - visibleListHeight;

		var toScroll = incompleteListItem < 1 ? listItemHeight + incompleteListItem : incompleteListItem;

		// really hacky scroll, cross browser
		interpolateProperty(function(val) {
								experienceListContainer.scrollTop = val
							},
							experienceListContainer.scrollTop,
							experienceListContainer.scrollTop + toScroll,
							400);
	});

}


function experienceListScrollChanged() {
	// 'this' refers to the div
	var experienceListContainer = this;
	var scrollArrowTop = document.getElementById('experience-list-scroll-arrow-top');
	var scrollArrowBottom = document.getElementById('experience-list-scroll-arrow-bottom');


	scrollArrowTop.classList.remove('hidden');
	scrollArrowBottom.classList.remove('hidden');

	if (experienceListContainer.scrollTop === 0) {
		scrollArrowTop.classList.add('hidden');
	}
	if (experienceListContainer.scrollTop + experienceListContainer.getBoundingClientRect().height + 1 >= experienceListContainer.scrollHeight) {
		scrollArrowBottom.classList.add('hidden');
	}
}


function interpolateProperty(setter, from, to, ms) {
	var dist = to - from;
	var updateFrequency = 20; //ms
	var steps = ms/updateFrequency;
	var distPerStep = dist/steps;

	function stepper(n, total) {
		if (n === total) {
			setter(to);	// in case of rounding or other maths errors
			return;
		}
		setter(from + n*distPerStep);
		setTimeout(function() {
			stepper(n+1, total);
		}, updateFrequency);
	}

	stepper(0, steps);
}














