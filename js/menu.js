function loadApp() {

 	$('#canvas').fadeIn(1000);

 	var flipbook = $('.magazine');

 	
	
	if (flipbook.width()==0 || flipbook.height()==0) {
		setTimeout(loadApp, 10);
		return;
	}
	


	flipbook.turn({
			
			

			width: 922,

		

			height: 600,

		

			duration: 1000,

			

			acceleration: !isChrome(),

	

			gradients: true,
			
			

			autoCenter: true,

			

			elevation: 50,

			

			pages: 12,

			

			when: {
				turning: function(event, page, view) {
					
					var book = $(this),
					currentPage = book.turn('page'),
					pages = book.turn('pages');
			
					

					Hash.go('page/' + page).update();

					

					disableControls(page);
					

					$('.thumbnails .page-'+currentPage).
						parent().
						removeClass('current');

					$('.thumbnails .page-'+page).
						parent().
						addClass('current');



				},

				turned: function(event, page, view) {

					disableControls(page);

					$(this).turn('center');

					if (page==1) { 
						$(this).turn('peel', 'br');
					}

				},

				missing: function (event, pages) {

					

					for (var i = 0; i < pages.length; i++)
						addPage(pages[i], $(this));

				}
			}

	});



	$('.magazine-viewport').zoom({
		flipbook: $('.magazine'),

		max: function() { 
			
			return largeMagazineWidth()/$('.magazine').width();

		}, 

		when: {

			swipeLeft: function() {

				$(this).zoom('flipbook').turn('next');

			},

			swipeRight: function() {
				
				$(this).zoom('flipbook').turn('previous');

			},

			resize: function(event, scale, page, pageElement) {

				if (scale==1)
					loadSmallPage(page, pageElement);
				else
					loadLargePage(page, pageElement);

			},

			zoomIn: function () {

				$('.thumbnails').hide();
				$('.made').hide();
				$('.magazine').removeClass('animated').addClass('zoom-in');
				$('.zoom-icon').removeClass('zoom-icon-in').addClass('zoom-icon-out');
				
				if (!window.escTip && !$.isTouch) {
					escTip = true;

					$('<div />', {'class': 'exit-message'}).
						html('<div>Press ESC to exit</div>').
							appendTo($('body')).
							delay(2000).
							animate({opacity:0}, 500, function() {
								$(this).remove();
							});
				}
			},

			zoomOut: function () {

				$('.exit-message').hide();
				$('.thumbnails').fadeIn();
				$('.made').fadeIn();
				$('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in');

				setTimeout(function(){
					$('.magazine').addClass('animated').removeClass('zoom-in');
					resizeViewport();
				}, 0);

			}
		}
	});



	if ($.isTouch)
		$('.magazine-viewport').bind('zoom.doubleTap', zoomTo);
	else
		$('.magazine-viewport').bind('zoom.tap', zoomTo);




	$(document).keydown(function(e){

		var previous = 37, next = 39, esc = 27;

		switch (e.keyCode) {
			case previous:

				
				$('.magazine').turn('previous');
				e.preventDefault();

			break;
			case next:

				
				$('.magazine').turn('next');
				e.preventDefault();

			break;
			case esc:
				
				$('.magazine-viewport').zoom('zoomOut');	
				e.preventDefault();

			break;
		}
	});

	

	Hash.on('^page\/([0-9]*)$', {
		yep: function(path, parts) {
			var page = parts[1];

			if (page!==undefined) {
				if ($('.magazine').turn('is'))
					$('.magazine').turn('page', page);
			}

		},
		nop: function(path) {

			if ($('.magazine').turn('is'))
				$('.magazine').turn('page', 1);
		}
	});


	$(window).resize(function() {
		resizeViewport();
	}).bind('orientationchange', function() {
		resizeViewport();
	});

	

	$('.thumbnails').click(function(event) {
		
		var page;

		if (event.target && (page=/page-([0-9]+)/.exec($(event.target).attr('class'))) ) {
		
			$('.magazine').turn('page', page[1]);
		}
	});

	$('.thumbnails li').
		bind($.mouseEvents.over, function() {
			
			$(this).addClass('thumb-hover');

		}).bind($.mouseEvents.out, function() {
			
			$(this).removeClass('thumb-hover');

		});

	if ($.isTouch) {
	
		$('.thumbnails').
			addClass('thumbanils-touch').
			bind($.mouseEvents.move, function(event) {
				event.preventDefault();
			});

	} else {

		$('.thumbnails ul').mouseover(function() {

			$('.thumbnails').addClass('thumbnails-hover');

		}).mousedown(function() {

			return false;

		}).mouseout(function() {

			$('.thumbnails').removeClass('thumbnails-hover');

		});

	}


	

	if ($.isTouch) {
		$('.magazine').bind('touchstart', regionClick);
	} else {
		$('.magazine').click(regionClick);
	}

	

	$('.next-button').bind($.mouseEvents.over, function() {
		
		$(this).addClass('next-button-hover');

	}).bind($.mouseEvents.out, function() {
		
		$(this).removeClass('next-button-hover');

	}).bind($.mouseEvents.down, function() {
		
		$(this).addClass('next-button-down');

	}).bind($.mouseEvents.up, function() {
		
		$(this).removeClass('next-button-down');

	}).click(function() {
		
		$('.magazine').turn('next');

	});


	
	$('.previous-button').bind($.mouseEvents.over, function() {
		
		$(this).addClass('previous-button-hover');

	}).bind($.mouseEvents.out, function() {
		
		$(this).removeClass('previous-button-hover');

	}).bind($.mouseEvents.down, function() {
		
		$(this).addClass('previous-button-down');

	}).bind($.mouseEvents.up, function() {
		
		$(this).removeClass('previous-button-down');

	}).click(function() {
		
		$('.magazine').turn('previous');

	});


	resizeViewport();

	$('.magazine').addClass('animated');

}



 $('.zoom-icon').bind('mouseover', function() { 
 	
 	if ($(this).hasClass('zoom-icon-in'))
 		$(this).addClass('zoom-icon-in-hover');

 	if ($(this).hasClass('zoom-icon-out'))
 		$(this).addClass('zoom-icon-out-hover');
 
 }).bind('mouseout', function() { 
 	
 	 if ($(this).hasClass('zoom-icon-in'))
 		$(this).removeClass('zoom-icon-in-hover');
 	
 	if ($(this).hasClass('zoom-icon-out'))
 		$(this).removeClass('zoom-icon-out-hover');

 }).bind('click', function() {

 	if ($(this).hasClass('zoom-icon-in'))
 		$('.magazine-viewport').zoom('zoomIn');
 	else if ($(this).hasClass('zoom-icon-out'))	
		$('.magazine-viewport').zoom('zoomOut');

 });

 $('#canvas').hide();




yepnope({
	test : Modernizr.csstransforms,
	yep: ['js/turn.min.js'],
	nope: ['js/turn.html4.min.js'],
	both: ['js/zoom.min.js', 'js/magazine.js', 'css/magazine.css'],
	complete: loadApp
});