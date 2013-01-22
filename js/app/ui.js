var IB = IB || {};

IB.initUI = function(){
	$('.handle').hide();
	$('.ib-column').removeClass('column-outline'); 
	
	$( ".sidebar_container" ).draggable({
		scope: "containers",
	    connectToSortable: "#page",
	    helper: "clone",
	    revert: "invalid"
	});

	
	$( ".sidebar_row" ).draggable({
		scope: "rows",
	    connectToSortable: ".container",
	    helper: "clone",
	    revert: "invalid"
	});
		
	$( ".sidebar_block" ).draggable({
		scope: "columns",
	    connectToSortable: ".column",
	    helper: "clone",
	    revert: "invalid"
	});
		
	$("#page").droppable({
			scope: "containers",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				if(ui.draggable.hasClass("ib-container")){
					console.log(this);
				}
			}
		}).sortable({
			handle: ".container-handle",
			connectWith: "#page",
			update: function( event, ui ) {
				console.log('update');
			}
		});
		
	$(".ib-container").droppable({
			scope: "rows",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				if(ui.draggable.hasClass("ib-row")){
					console.log(this);
				}
			}
		}).sortable({
			handle: ".row-handle",
			connectWith: ".ib-container",
			update: function( event, ui ) {
				console.log('update');
			}
		});		
			
	$(".ib-column").droppable({
			scope: "blocks",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				if(ui.draggable.hasClass("ib-block")){
					console.log(this);
				}
			}
		}).sortable({
			handle: ".block-handle",
			connectWith: ".ib-column",
			update: function( event, ui ) {
				console.log('update');
			}
		});					
			
			//IB.toggleSidebar();
}

IB.toggleSidebar = function () {
    $('#sidebar').toggle('slide', { direction: 'left' }, 500, function () {
	    if($("#sidebar").is(":visible"))
	    {
		    $('.handle').fadeIn();		
		   	$('.ib-control').fadeIn(); 			
	    	$('.ib-column').addClass('column-outline'); 
				$('.ib-row').addClass('row-outline');
				$('.ib-container').addClass('container-outline');
				$('.ib-column').css('min-height','50px');
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