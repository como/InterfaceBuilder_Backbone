/**
Todo:

1. Implement fluid layout resizing
2. Moving
3. Sorting - Multiple containers

*/
var IB = IB || {};

IB.cssSandbox = function (){
	//$('#css-sandbox-span1').width()
	this._columnWidths = [];
	var that = this;
	
	$.each($('#css-sandbox-'+IB.rowClass).children(), function(index, child){
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
	var that = this;
	el.children('.rows').droppable({
			scope: "rows",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {				
				ui.draggable.remove();				
			}
		}).sortable({
			handle: ".row-handle",
			connectWith: ".rows",
			beforeStop: function( event, ui ) {
				that.tmpOrder = ui.placeholder.index();
			},
			receive: function( event, ui ) {		
				IB.PageControllerInstance.addRow({containerUUID:$(this).data('uuid'), order:that.tmpOrder});
			},
			update: function( event, ui ) {
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
	var that = this;
	
	el.children('.blocks').droppable({
			scope: "blocks",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				ui.draggable.remove();
			}
		}).sortable({
				handle: ".block-handle",
				connectWith: ".blocks",
				beforeStop: function( event, ui ) {
					that.tmpOrder = ui.placeholder.index();
				},
				receive: function( event, ui ) {
					IB.PageControllerInstance.addBlock({
						columnUUID: $(this).data('uuid'), 
						rowUUID:$(this).data('row'), 
						containerUUID:$(this).data('container'),
						template: $(ui.sender).data('template'),
						order: that.tmpOrder
					});
				},
				update: function( event, ui ) {
				}
			});
		//$( ".sidebar_block" ).draggable('options','connectToSortable','.blocks');
}

IB.initUI = function(){
	
	$('.handle').hide();
	$('.blocks').removeClass('blocks-outline');
	$('.ib-column').removeClass('column-outline');
	$( ".ui-resizable-handle" ).hide();
	$( ".nav-controls" ).hide();
	
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
	
	var that = this;
	
	$("#page").droppable({
			scope: "containers",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				
				ui.draggable.remove();
			}
		}).sortable({
			handle: ".container-handle",
			beforeStop: function( event, ui ) {
				that.tmpOrder = ui.placeholder.index();
			},
			receive: function( event, ui ) {		
				IB.PageControllerInstance.addContainer({order:that.tmpOrder});
			},
			update: function( event, ui ) {
				// console.log($(this).sortable('toArray'));
			}
		});
			
		$('#savebtn').click(function(){
			IB.PageControllerInstance.page.save();
			IB.setState('saved');
			$('#ib-messages').html('<div class="progress progress-striped active"><div class="bar" style="width: 90%;"></div></div>')
			.fadeIn(500)
			.delay(1000)
			.append($('<div class="alert alert-success">Changes saved</div>').fadeIn(500))
			.fadeOut(500);
		});
		
		$('<script src="vendor/bootstrap.min.js"></script>').appendTo('head');
		$('<script src="vendor/ckeditor/ckeditor.js"></script>').appendTo('head');
		
}

IB.setState = function(state){
	switch(state){
		case 'editing':
			$('#savebtn').removeClass('btn-inverse').addClass('btn-primary');
		break;
		default:
			$('#savebtn').removeClass('btn-primary').addClass('btn-inverse');
	}
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
				// $('#page').css('margin-left', '200px');
				$( ".nav-controls" ).show();
				$( ".ui-resizable-handle" ).show();
	    }
	    else {
		    $('.handle').fadeOut();								
				$('.ib-control').fadeOut(); 
	    	$('.ib-column').removeClass('column-outline'); 
				$('.ib-row').removeClass('row-outline');
				$('.ib-container').removeClass('container-outline');
				$('.blocks').removeClass('blocks-outline');
				// $('#page').css('margin-left', '0px');
				$( ".nav-controls" ).hide();
				$( ".ui-resizable-handle" ).hide();
	    }
    });
    $('#sidebarbtn').toggle('slide', { direction: 'left' }, 500);   
}

IB.toggleNewPage = function () {
		$('#edit-page-form').hide();
    $('.newbtn').toggleClass('.btn-primary');
		$('#new-page-form').toggle('fade', { direction: 'face' }, 500);
		
}

IB.toggleEditPage = function () {
		$('#new-page-form').hide();
		$('.editbtn').toggleClass('.btn-primary');
    $('#edit-page-form').toggle('fade', { direction: 'left' }, 500);   
}

IB.editors = {
	updateVideo: function(options){
		var input = $('input[data-model-uuid='+options.uuid+']').val();
		
		IB.PageControllerInstance.page.get('containers').find(function(container){
					 return container.get('uuid') == options.containerUUID;
				})
				.get('rows')
				.find(function(row){
					return row.get('uuid') == options.rowUUID;
				})
				.get('columns')
				.find(function(column){
					return column.get('uuid') == options.columnUUID;
				})
				.get('blocks')
				.find(function(block){
							return block.get('uuid') == options.uuid;
				})
				.set('content', {url: input});
				
		IB.setState('editing');
	}
}