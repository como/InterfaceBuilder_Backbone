var IB = IB || {};

IB.SortableCollectionView = Backbone.View.extend({
	initialize: function(attrs){
		// console.log(attrs);
		this.subViews = [];		
		this.collection	= attrs.collection;
		this.subViewConstructor = attrs.subViewConstructor;
		this.collectionSelector = attrs.collectionSelector;
		this.template	= attrs.template;
		this.collectionType	= attrs.collectionType;		
		this.subViewOptions	= attrs.subViewOptions;
		this.resizeable	= attrs.resizeable;
		this.resizeableContainment = attrs.resizeableContainment;
		this.droppable = attrs.droppable;
		
		_(this).bindAll('addView', 'removeView');
		this.collection.each(this.addView);		
    this.collection.bind('add', this.addView);
    this.collection.bind('remove', this.removeView);
	},
	addView: function(subviewModel){
		this.subViewOptions.uuid = subviewModel.get('uuid');
		var rv = new this.subViewConstructor({
			model:subviewModel, 
			id:this.subViewOptions.uuid,
			subViewOptions: this.subViewOptions
		});
		
		this.subViews.push(rv.render());
		
		if(subviewModel.get('status') == 'new')
		{			
			this.subViews = _.sortBy(this.subViews, function(subView){ return subView.model.get('order'); });
			this.render();
			this.collection.sort();
		}	
	},
	removeView: function(subviewModel){
	    var viewToRemove = _(this.subViews).select(function(subView) { return subView.model === subviewModel; })[0];
	    this.subViews = _(this.subViews).without(viewToRemove);
			$(viewToRemove.el).remove();		
	},
	render: function(){		
		var that = this;
		this.compile();
    _(this.subViews).each(function(rv) {	
     that.$(that.collectionSelector).append(rv.el);
    });		
    return this;	
	},
	compile: function(){
		
		if(this.compiled) return;		
		
		this.$el.html(_.template($(this.template).html(), {subViewOptions: this.subViewOptions}));
		
		var that = this;		
		
		if(this.resizeable) {
			// Model must support attribute colspan
			this.$el.resizable({
					containment: '#'+that.resizeableContainment,
					minWidth: IB.cssSandboxInstance.getColspanDiff(),
		      grid: IB.cssSandboxInstance.getColspanDiff(),
					resize: function( event, ui ) {			
						that.model.set('colspan', IB.cssSandboxInstance.findColumnClassByWidth(ui.size.width).replace('span',''));
					}
		    });
		}
		
		if(this.droppable) {
			// console.log('droppable');
			this.$(this.collectionSelector).droppable({
				scope: that.collectionType,
				activeClass: "ui-state-hover",
				hoverClass: "ui-state-active",
				drop: function( event, ui ) {				
					ui.draggable.remove();				
				}
			}).sortable({
				handle: that.collectionSelector+"-handle",
				connectWith: that.collectionSelector,
				beforeStop: function( event, ui ) {
					that.tmpOrder = ui.placeholder.index();
				},
				receive: function( event, ui ) {		
					IB.setState('editing');					
					
					if(ui.sender.hasClass('sidebar_item'))
					{
						
						var newItem = new that.collection.model(_.extend(
								{rowUUID:$(this).data('row'), containerUUID:$(this).data('container'), template: $(ui.sender).data('template')},
								{parentUUID:$(this).data('uuid'), order:that.tmpOrder, status:'new'}								
							));
							console.log(that.collection);
						that.collection.makePlace(that.tmpOrder).add(newItem);
					}
					else if(ui.sender.hasClass('blocks')){
						IB.PageControllerInstance.moveBlock({
							from: {
									uuid: $(ui.item).attr('id'), // Update this and othe direct element ID references to UUID
									parentUUID:$(ui.sender).data('uuid'), 
									rowUUID:$(ui.sender).data('row'), 
									containerUUID:$(ui.sender).data('container')
								},
							to: {
									uuid: $(ui.item).attr('id'),
									parentUUID:$(this).data('uuid'), 
									rowUUID:$(this).data('row'), 
									containerUUID:$(this).data('container'), 
									order:that.tmpOrder,
								}
							});
					}
					else {
						console.log('block dropped from unknown parent');
					}
					
				},
				update: function( event, ui ) {
					IB.setState('editing');
					that.collection.updateOrder($(this).sortable('toArray'));
				}
			});		
		}

		this.compiled = true;
	}
});
