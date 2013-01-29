/**
1. Implement unbinding
2. Test for Zombies
3. Clean up container/row/block insertion logic
*/

var IB = IB || {};

IB.containerClass = 'container';
IB.rowClass = 'row';

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
			subViewOptions: {parentUUID: container.get('uuid')},
			tagName: 'div',
			className: 'ib-container ' + IB.containerClass,
			template: '#container-template',
			droppable: true,
			resizable: false,
			resizeableContainment: false			
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
		
		this.subViewOptions = attrs.subViewOptions;
		
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
			className:'ib-column column-outline span'+column.get('colspan'),
			collectionType: 'blocks',
			collectionSelector: '.blocks',
			subViewConstructor: BlockView,
			subViewOptions: {parentUUID: column.get('uuid'), rowUUID: this.model.get('uuid'), containerUUID: this.subViewOptions.parentUUID},			
			tagName: 'div',
			template: '#column-template',
			droppable: true,
			resizeable: true,
			resizeableContainment: this.model.get('uuid')
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
	addOne: function(){
		IB.PageControllerInstance.addColumn({containerUUID:this.subViewOptions.containerUUID, rowUUID:this.subViewOptions.rowUUID});
	}
});

// Delegate block specific events to block editor services
// Fix contentEditables bindings

var BlockView = Backbone.View.extend({
	tagName: 'div',
	className: 'ib-block',
	initialize: function(attrs){
		this.subViewOptions = attrs.subViewOptions;
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
			subViewOptions: this.subViewOptions,
			content: this.model.get('content')
		}));		
		return this;
	}	
});
