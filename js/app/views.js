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
		console.log('building ' + attrs.collectionType);
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
		console.log(this.collection);
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
			console.log('rendering ' + rv.model.get('order'));
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
				that.collection.makePlace(that.tmpOrder).add({parentUUID:$(this).data('uuid'), order:that.tmpOrder, status:'new'})
				// that.model.get('rows').add({containerUUID:$(this).data('uuid'), order:that.tmpOrder});
			},
			update: function( event, ui ) {
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
		var cmv = new ColumnView({
			model:column, 
			id: column.get('uuid'),
			rowUUID: this.model.get('uuid'), 
			containerUUID: this.options.parentUUID, 
			className:'ib-column column-outline span'+column.get('colspan')
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

var ColumnView = Backbone.View.extend({
	tagName: 'div',
	initialize: function(){
		this._blockViews = [];
		this.template = '#column-template';
		_(this).bindAll('update','addBlock','removeBlock');
		this.model.bind('change', this.update);
		this.model.get('blocks').each(this.addBlock);		
    this.model.get('blocks').bind('add', this.addBlock);
    this.model.get('blocks').bind('remove', this.removeBlock);		
	},
	events: {
		'dblclick .handle': 'addOne',
	},
	addBlock: function(block){
		var bv = new BlockView({
			model:block, 
			id: block.get('uuid'), 
			columnUUID: this.model.get('uuid'), 
			rowUUID: this.options.rowUUID, 
			containerUUID: this.options.containerUUID
		});
		
		var numBlocks = _.size(this.model.get('blocks'));
		
		this._blockViews.push(bv);		
    if (this._rendered) {
			if(numBlocks > 0 && block.get('order') < (numBlocks-1)) $(this._blockViews[block.get('order')].el).before(bv.render().el);
			else this.$('.blocks').append(bv.render().el);
    }
	},
	removeBlock: function(block){
    var viewToRemove = _(this._blockViews).select(function(bv) { return bv.model === block; })[0];
    this._blockViews = _(this._blockViews).without(viewToRemove);
    if (this._rendered) $(viewToRemove.el).remove();		
		// Unbind everything here.. 
	},
	addOne: function(){
		IB.PageControllerInstance.addColumn({containerUUID:this.options.containerUUID, rowUUID:this.options.rowUUID});
	},
	update: function(){
		//this.render();
	},
	render: function(){				
    this._rendered = true;
 
    $(this.el).empty();
		
		var that = this;
		
		this.compile();
		
		IB.droppableColumn(this.$el, this.options.rowUUID, this.options.containerUUID, this.model.get('colspan'), true);
		
    _(this._blockViews).each(function(cmv) {
			
      that.$('.blocks').append(cmv.render().el);
    });
		
		return this;
	},
	compile: function(){
		if(this.compiled) return;
		
		this.$el.html(_.template($(this.template).html(), {uuid: this.model.get('uuid'), options:this.options}));
		
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
			columnUUID: this.options.columnUUID, 
			rowUUID: this.options.rowUUID,
			containerUUID: this.options.containerUUID,
			content: this.model.get('content')
		}));		
		return this;
	}	
});
