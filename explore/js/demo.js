$(document).ready(function() {

	// Fix back [ button ] reload of animated Items off screen
	$(window).bind("pageshow", function(event) {
	    if (event.originalEvent.persisted) {
	        window.location.reload() 
	    }
	});
	// Add ProTip tool tips
	$(window).load(function(){
		$.protip();
	});
	
	// Click a Use Case - Aninmate and Redirect to URL source
	$(".iconContent").click(function(){
		var url = $(this).attr('href');
		$(".icons, .headingSection, .finalHeader").addClass("animated bounceOutRight");
		$(".icons, .headingSection").show();
		setTimeout(function() {
		  location.href = url;
		}, 1000);
		return false;
	});

	$("#final_contact").click(function(){
		$("#stickyContact").foundation('open');
	});

	// Only Allow js on Single Section Page
	if ($('body.singleSection').length > 0)
    {

    	// Show Loading Icon On Page Load
    	setTimeout(function() {
			$(".loadingIcon").fadeIn(1000);
		}, 500);
        
        // Hide Loading Icon After a Few Secs
		setTimeout(function() {
			$("#loadingWrapper").fadeOut(800);
		}, 2000);

		// Get Section Main BG Image
		var src = use_case_bg_main;
		setTimeout(function() {
			$(".afterContainer").css('background-image', 'url('+src+')').fadeIn(1000);
		}, 2500);

		// Bring in the Nav and Start Box
		setTimeout(function() {
			$("#navBarRow").fadeIn();
		}, 2700);
		setTimeout(function() {
			$(".overlayStartBox").fadeIn();
		}, 2700);

		$('.startButton').click( function() {
			$(".overlayStartBox").fadeOut();
			$(".afterContainer").css('background-image', 'url('+src+')').fadeOut(1000);
		});

    }

    // Only Allow js on Single Stepped Page
	if ($('body.stepsPage').length > 0)
    {
    	var windowWidth = $( window ).width();
    	if (windowWidth > 640 ){      

    		$(window).load(function(){
				$('.dot-container').fadeIn();
			});
			
			var windowHeight = $( window ).height();

			if (windowHeight < 675 ) {
				var halfHeight = parseInt(windowHeight) / 2;
			}
			if (windowHeight > 675 || windowWidth < 400) {
				var halfHeight = '100%';
			}	

			$('.contentWell').height(halfHeight);

			$("#navBarRow").show();

			$('.contentWell').each(
			function()
				{
					$(this).jScrollPane(
						{
							showArrows: $(this).is('.arrow')
						}
					);
					var api = $(this).data('jsp');
					var throttleTimeout;
					$(window).bind(
						'resize',
						function()
						{
							if (!throttleTimeout) {
								throttleTimeout = setTimeout(
									function()
									{
										api.reinitialise();
										throttleTimeout = null;
									},
									50
								);
							}
						}
					);
				}
			)
		}
	}
    // Fade In Image Pane on Step Page
    // $('#imagePane').hide().fadeIn(1000);
	
	// Match Heights in Other Panel since Equalize dont work here for sum reason. Yo no se!
	$('#other-use-cases .iconContent .meta').matchHeight({byRow: false});

	// Other Use Cases Menu Actions
	$('.all_use_cases, .overlayContainer').click(function(event) {
       	$('#navBarRowLinks').toggle();
		$('#navBarRowViewAll').toggle();
		$('.overlayContainer').toggle();			
	});

	// Toggle Other Use Cases Menu Panels
	$(".prev-arrow, .next-arrow").click(function(event) {
		$('.first-set-use-cases').toggle();
		$('.second-set-use-cases').toggle();
	});

	// We can't give away the entire cookie, just a sample
	// if(window.localStorage) {
	// 	var hasSeenUseCase = localStorage.ucf; // first view of use case main
	// 	var firstUseCaseNum = localStorage.ucfn; // first use case main number
	// 	var secondUseCase = localStorage.ucs; // first view of use case main
	// 	var watchUseCase = localStorage.ucw; // proceed to step one of first use case set a watcher
	// 	var dfs = localStorage.dfs; // youuu know...

	// 	if (dfs != '1'){ // dfs yet?
	// 		// If we are on the first page of a use case
	// 		if ($('body.mainPage').length > 0) {
	// 			// Set first view item if not set
	// 			if (hasSeenUseCase != '' && hasSeenUseCase != '1') {
	// 				localStorage.setItem('ucf', '1');
	// 				localStorage.setItem('ucfn', use_case_id);
	// 			}
	// 			// Secondary Gate Trigger if viewing another use case main - not the same first viewed (prevents refresh use case on first)
	// 			if (hasSeenUseCase == '1') {
	// 				if (firstUseCaseNum != use_case_id) {
	// 					localStorage.setItem('ucs', '1');
	// 				}
	// 			}
	// 		}
	// 		// On Step Pages
	// 		if ($('body.stepsPage').length > 0)
 //    		{
 //    			// Has a user started to view a Use Case set a watcher
	// 			if (hasSeenUseCase == '1') {

	// 				// On Small Use Cases with 5 (4 really, last step is step wrap-up) steps set watcher on step 2
	// 				if (use_case_total_steps == '5' && current_step_val == '2') {
	// 					localStorage.setItem('ucw', '1');
	// 				}
	// 				// On Other Use Cases with more than 5 (4 really, last step is step wrap-up) steps set watcher on step 3
	// 				if (use_case_total_steps > '5' && current_step_val == '3') {
	// 					localStorage.setItem('ucw', '1');
	// 				}
	// 			}
	// 		}
	// 		// If watcher was set prior lets show the pearly gate
	// 		if (watchUseCase == '1'){
	// 			$('.gate_cover').show();
	// 			$('#gate_box').show();
	// 		}
	// 		// If second use case starter was set prior lets show the pearly gate
	// 		if (secondUseCase == '1' && watchUseCase != '1') {
	// 			$('.gate_cover').show();
	// 			$('#gate_box').show();
	// 		}
	// 	}
	// }
	
	// Set LS based on Use Case
	var ls_val = $('#ls').text();
	if (ls_val != '') {
		$.cookie("LS", ls_val);
	}
	
	if ($('#gate_box.mktoForm').length > 0) {
		input
		$('#State').prepend()
	}
	
});