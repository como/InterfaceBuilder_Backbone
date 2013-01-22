var IB = IB || {};

IB.droppableContainer = function(el){
	el.children('.rows').droppable({
			scope: "rows",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				IB.PageControllerInstance.addRow({containerUUID:$(this).data('uuid')});
				ui.draggable.remove();
				
			}
		}).sortable({
			handle: ".row-handle",
			connectWith: ".rows",
			update: function( event, ui ) {
				//console.log('update');
			}
		});
		//$( ".sidebar_row" ).draggable('options','connectToSortable','.rows');
}

IB.droppableColumn = function(el){
	el.children('.blocks').droppable({
			scope: "blocks",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				IB.PageControllerInstance.addBlock({
					columnUUID: $(this).data('uuid'), 
					rowUUID:$(this).data('row'), 
					containerUUID:$(this).data('container'),
					template: $(ui.draggable).data('template')
				});
				ui.draggable.remove();
			}
		}).sortable({
				handle: ".block-handle",
				connectWith: ".blocks",
				update: function( event, ui ) {
					//console.log('update');
				}
			});
		//$( ".sidebar_block" ).draggable('options','connectToSortable','.blocks');
}

IB.initUI = function(){

	$('.handle').hide();
	$('.ib-column').removeClass('column-outline'); 
	
	$( ".sidebar_container" ).draggable({
		scope: "containers",
	    connectToSortable: "#page",
	    helper: "clone",
	    revert: "invalid",
			cursorAt: { top: 0, left: 0 }
	});

	
	$( ".sidebar_row" ).draggable({
		scope: "rows",
	    connectToSortable: ".rows",
	    helper: "clone",
	    revert: "invalid",
			cursorAt: { top: 0, left: 0 }
	});
		
	$( ".sidebar_block" ).draggable({
		scope: "blocks",
	    connectToSortable: ".blocks",
	    helper: "clone",
	    revert: "invalid",
			cursorAt: { top: 0, left: 0 }
	});
		
	$("#page").droppable({
			scope: "containers",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				IB.PageControllerInstance.addContainer({});
				ui.draggable.remove();
			}
		}).sortable({
			handle: ".container-handle",
			update: function( event, ui ) {
			//	console.log('update');
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