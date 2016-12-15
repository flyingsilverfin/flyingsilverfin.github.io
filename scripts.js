function loaded() {

	console.log('loaded');

	var experienceListContainer = document.getElementById('experience-list-container');
	experienceListContainer.addEventListener('scroll', experienceListScrollChanged);

	//initial setup
	experienceListScrollChanged();
}


function experienceListScrollChanged() {
	// 'this' refers to the div
	var experienceListContainer = this;
	var scrollarrowTop = document.getElementById('experience-list-scroll-arrow-top');
	var scrollarrowBottom = document.getElementById('experience-list-scroll-arrow-bottom');


	scrollarrowTop.classList.remove('hidden');
	scrollarrowBottom.classList.remove('hidden');

	if (experienceListContainer.scrollTop === 0) {
		scrollarrowTop.classList.add('hidden');
	}
	if (experienceListContainer.scrollTop === experienceListContainer.scrollTopMax) {
		scrollarrowBottom.classList.add('hidden');
	}
}
