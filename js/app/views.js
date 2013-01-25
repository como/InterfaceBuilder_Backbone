/**
1. Implement unbinding
2. Test for Zombies
3. Clean up container/row/block insertion logic
*/

var IB = IB || {};

IB.containerClass = 'container';
IB.rowClass = 'row';

// BaseViews
IB.SortableCollectionView = Backbone.View.extend({
	initialize: function(attrs){
		this.subViews 					= [];		
		this.collection					= attrs.collection;
		this.subViewConstructor = attrs.subViewConstructor;
		this.collectionSelector = attrs.collectionSelector;
		this.template						= attrs.template;
		this.collectionType			= attrs.collectionType;		
		
		_(this).bindAll('addView', 'removeView');
		this.collection.each(this.addView);		
    this.collection.bind('add', this.addView);
    this.collection.bind('remove', this.removeView);
	},
	addView: function(subviewModel){
		var rv = new this.subViewConstructor({
			model:subviewModel, 
			id:subviewModel.get('uuid'),
			parentUUID: this.model.get('uuid')
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
		that = this;
		this.$el.html(_.template($(this.template).html(), {uuid: this.model.get('uuid')}));
		this.$(this.collectionSelector).droppable({
			scope: that.collectionType,
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {				
				ui.draggable.remove();				
			}
		}).sortable({
			// handle: that.collectionSelector+"-handle",
			handle: ".row-handle",
			connectWith: that.collectionSelector,
			beforeStop: function( event, ui ) {
				that.tmpOrder = ui.placeholder.index();
			},
			receive: function( event, ui ) {		
				IB.setState('editing');
				that.collection.makePlace(that.tmpOrder).add({parentUUID:$(this).data('uuid'), order:that.tmpOrder, status:'new'})
				// that.model.get('rows').add({containerUUID:$(this).data('uuid'), order:that.tmpOrder});
			},
			update: function( event, ui ) {
				IB.setState('editing');
				that.collection.updateOrder($(this).sortable('toArray'));
			}
		});
		this.compiled = true;
	}
});

var PageView = Backbone.View.extend({
	initialize: function(attrs){
		_(this).bindAll('addContainer','removeContainer');
		this._containerViews = [];
		this.model.get('containers').each(this.addContainer);
		this.model.get('containers').bind('add', this.addContainer);
		this.model.get('containers').bind('remove', this.removeContainer);
		this.render();
	},
	addContainer: function(container){
		var cv = new ContainerView({			
			model:container,
			id:container.get('uuid'), 
			collection:container.get('rows'),
			collectionType: 'rows',
			collectionSelector: '.rows',
			subViewConstructor: RowView,
			tagName: 'div',
			className: 'ib-container ' + IB.containerClass,
			template: '#container-template'
		});
		this._containerViews.push(cv);
		
    if (this._rendered) {
			if(this._containerViews.length>1) $(this._containerViews[container.get('order')].el).before(cv.render().el);
			else $(this.el).append(cv.render().el);			
    }
	},
	removeContainer: function(container){
    var viewToRemove = _(this._containerViews).select(function(cv) { return cv.model === container; })[0];
    this._containerViews = _(this._containerViews).without(viewToRemove);
    if (this._rendered) $(viewToRemove.el).remove();		
		// Unbind everything here.. 
	},
	render: function(){
    this._rendered = true;
    $(this.el).empty();
		var that = this;
    _(this._containerViews).each(function(cv) {
      that.$el.append(cv.render().el);
    });
	}
});

var ContainerView = IB.SortableCollectionView.extend({});

var RowView = Backbone.View.extend({
	tagName: 'div',
	className: 'ib-row ' + IB.rowClass,
	initialize: function(attrs){
		this._columnViews = [];
		_(this).bindAll('update','addColumn', 'removeColumn');
		this.model.bind('change', this.update);
		this.model.get('columns').each(this.addColumn);		
    this.model.get('columns').bind('add', this.addColumn);
    this.model.get('columns').bind('remove', this.removeColumn);		
	},
	addColumn: function(column){
		// console.log(column);
		var cmv = new ColumnView({
			model:column, 
			id: column.get('uuid'),
			collection: column.get('blocks'),
			rowUUID: this.model.get('uuid'), 
			containerUUID: this.options.parentUUID, 
			className:'ib-column column-outline span'+column.get('colspan'),
			collectionType: 'blocks',
			collectionSelector: '.blocks',
			subViewConstructor: BlockView,
			tagName: 'div',
			template: '#column-template'
		});
		this._columnViews.push(cmv);		
    if (this._rendered) {
      this.$('.columns').append(cmv.render().el);
    }		
	},
	removeColumn: function(column){
    var viewToRemove = _(this._columnViews).select(function(cv) { return cv.model === column; })[0];
    this._columnViews = _(this._columnViews).without(viewToRemove);
    if (this._rendered) $(viewToRemove.el).remove();		
		// Unbind everything here.. 
	},
	update: function(){
		this.render();
	},
	render: function(){
		//Investigate this line
		if(_.size(this.model.changed)==1 && this.model.changed.hasOwnProperty('order')) return this;
		
    this._rendered = true;
 
    $(this.el).empty();
		
		var that = this;
		
		this.compile();
				
    _(this._columnViews).each(function(cmv) {
      that.$('.columns').append(cmv.render().el);
    });	
		
		return this;
	},
	compile: function(){
		if(this.compiled) return;
		
		this.$el.html(_.template($('#row-template').html(), {uuid: this.model.get('uuid'), content:'Content Here', options:this.options}));		
		
		this.compiled = true;
	}
});

var ColumnView = IB.SortableCollectionView.extend({
	events: {
		'dblclick .handle': 'addOne',
	},
	addView: function(subviewModel){
		var bv = new this.subViewConstructor({
			model:subviewModel, 
			id: subviewModel.get('uuid'), 
			parentUUID: this.model.get('uuid'), 
			rowUUID: this.options.rowUUID, 
			containerUUID: this.options.containerUUID
		});	
		this.subViews.push(bv.render());		
			
		if(subviewModel.get('status') == 'new')
		{			
			this.subViews = _.sortBy(this.subViews, function(subView){ return subView.model.get('order'); });
			this.render();
			this.collection.sort();
		}	
	},
	addOne: function(){
		IB.PageControllerInstance.addColumn({containerUUID:this.options.containerUUID, rowUUID:this.options.rowUUID});
	},
	compile: function(){
		if(this.compiled) return;
		this.$el.html(_.template($(this.template).html(), {uuid: this.model.get('uuid'), options:this.options}));
		var that = this;		
		this.$el.resizable({
				containment: '#'+that.options.rowUUID,
				minWidth: IB.cssSandboxInstance.getColspanDiff(),
	      grid: IB.cssSandboxInstance.getColspanDiff(),
				resize: function( event, ui ) {			
					that.model.set('colspan', IB.cssSandboxInstance.findColumnClassByWidth(ui.size.width).replace('span',''));
				}
	    });
			
			this.$('.blocks').droppable({
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
							IB.setState('editing');
							if(ui.sender.hasClass('sidebar_block'))
							{
								that.collection.makePlace(that.tmpOrder).add({parentUUID:$(this).data('uuid'), rowUUID:$(this).data('row'), containerUUID:$(this).data('container'), template: $(ui.sender).data('template'), order:that.tmpOrder, status:'new'});
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
		
		this.compiled = true;
	}
});

// Delegate block specific events to block editor services
// Fix contentEditables bindings

var BlockView = Backbone.View.extend({
	tagName: 'div',
	className: 'ib-block',
	initialize: function(){
		_(this).bindAll('update');
		this.model.bind('change', this.update);
		this.template = '#'+this.model.get('template');
	},
	events: {
		'click #add-nav-item':'showEditForm',
		'click #addNavItem':'addNavItem',
		'focusout .richText':'saveRichText',
		'click #updateVideoBtn':'updateVideo'
	},
	updateVideo: function(){
		this.model.set('content', {url: $('#videoUrl').val()});
		this.render();
	},
	saveRichText: function() {
		this.model.set('content', this.$el.children('.richText').html());
		IB.setState('editing');
	},
	showEditForm: function(){
		$('.dropdown-menu').click(function(event){
		     event.stopPropagation();
		 });
	},
	addNavItem: function(){
		console.log('adding menu item');
		var menu = this.model.get('content');
		menu.items.push({name:$('#nav-item-name').val(), link: $('#nav-item-link').val(), classAttr: $('#nav-item-class').val()});
		this.model.set('content', menu);
		// this.model.save();
		this.render();
		IB.setState('editing');
	},	
	update: function(){
		//this.render();
	},
	render: function(){
		this.$el.html(_.template($(this.template).html(), {
			uuid: this.model.get('uuid'), 
			columnUUID: this.options.parentUUID, 
			rowUUID: this.options.rowUUID,
			containerUUID: this.options.containerUUID,
			content: this.model.get('content')
		}));		
		return this;
	}	
});
