var IB = IB || {};

IB.cssSandbox = function (){
	//$('#css-sandbox-span1').width()
	this._columnWidths = [];
	var that = this;
	
	$.each($('#css-sandbox-row').children(), function(index, child){
		that._columnWidths.push([$(child).attr('class'),$(child).width()]);
	});
	
	
	this.findColumnClassByWidth = function (width) {
		var className = '';
		$.each(this._columnWidths, function(index, record){
			if(record[1] == width) className = record[0];
		});
		return className;
	}
	
	this.findWidthByColumnClass = function (className) {
		var width = 0;
		$.each(this._columnWidths, function(index, record){
			if(record[0] == className) width = record[1];
		});
		return width;
	}
	
	this.getColspanDiff = function(){
		return this._columnWidths[1][1]- this._columnWidths[0][1];
	}
	
}

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

IB.droppableColumn = function(el, rowUUID, containerUUID, colspan, resizable){
	if(resizable){
		el.resizable({
				containment: '#'+rowUUID,
				minWidth: IB.cssSandboxInstance.getColspanDiff(),
	      grid: IB.cssSandboxInstance.getColspanDiff(),
				resize: function( event, ui ) {
					activeColumnClass = IB.cssSandboxInstance.findColumnClassByWidth(ui.size.width);				
					IB.PageControllerInstance.updateColspan({columnUUID: el.attr('id'), rowUUID: rowUUID, containerUUID: containerUUID, colspan: activeColumnClass});
				}
	    });
	}
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
	$( ".ui-resizable-handle" ).hide();
	
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
				$('.blocks').addClass('blocks-outline');
				$('#page').css('margin-left', '200px');
				$( ".ui-resizable-handle" ).show();
	    }
	    else {
		    $('.handle').fadeOut();								
				$('.ib-control').fadeOut(); 
	    	$('.ib-column').removeClass('column-outline'); 
				$('.ib-row').removeClass('row-outline');
				$('.ib-container').removeClass('container-outline');
				$('.blocks').removeClass('blocks-outline');
				$('#page').css('margin-left', '0px');
				$( ".ui-resizable-handle" ).hide();
	    }
    });
    $('#sidebarbtn').toggle('slide', { direction: 'left' }, 500);   
}