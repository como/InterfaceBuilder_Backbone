var IB = IB || {};

function toggleSidebar() {
    $('#sidebar').toggle('slide', { direction: 'left' }, 500, function () {
	    if($("#sidebar").is(":visible"))
	    {
		    $('.handle').fadeIn();		
		   	$('.ib-control').fadeIn(); 			
	    	$('.ib-column').addClass('column-outline'); 
				$('.ib-row').addClass('row-outline');
				$('.ib-container').addClass('container-outline');
	    }
	    else {
		    $('.handle').fadeOut();								
				$('.ib-control').fadeOut(); 
	    	$('.ib-column').removeClass('column-outline'); 
				$('.ib-row').removeClass('row-outline');
				$('.ib-container').removeClass('container-outline');
	    }
    });
    $('#sidebarbtn').toggle('slide', { direction: 'left' }, 500);   
}