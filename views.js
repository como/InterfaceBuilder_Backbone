var IB = IB || {};

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
		var cv = new ContainerView({model:container, id:container.get('uuid')});
		this._containerViews.push(cv);
		
    if (this._rendered) {
      $(this.el).append(cv.render().el);
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

var ContainerView = Backbone.View.extend({
	tagName: 'div',
	className: 'container-fluid container_outline',
	initialize: function(attrs){

		this._rowViews = [];
		
		_(this).bindAll('addRow', 'removeRow');		
		this.model.get('rows').each(this.addRow);		
    this.model.get('rows').bind('add', this.addRow);
    this.model.get('rows').bind('remove', this.removeRow);
	},
	addRow: function(row){
		var rv = new RowView({model:row, containerUUID: this.model.get('uuid')});
		this._rowViews.push(rv);
		
    if (this._rendered) {
      $(this.el).append(rv.render().el);
    }
		
	},
	removeRow: function(row){
		    var viewToRemove = _(this._rowViews).select(function(cv) { return cv.model === row; })[0];
		    this._rowViews = _(this._rowViews).without(viewToRemove);
		    if (this._rendered) $(viewToRemove.el).remove();		
				// Unbind everything here.. 
	},
	render: function(){
		
    this._rendered = true;
 
    $(this.el).empty();
		
		var that = this;
		
		this.compile();
 
    _(this._rowViews).each(function(rv) {		
     that.$('.rows').append(rv.render().el);
    });
 
    return this;	
	},
	compile: function(){
		if(this.compiled) return;
		
		this.$el.html(_.template($('#container-template').html(), {uuid: this.model.get('uuid')}));
		this.compiled = true;
	}
});

var RowView = Backbone.View.extend({
	tagName: 'div',
	className: 'row-fluid row_outline',
	initialize: function(attrs){
		this._columnViews = [];
		_(this).bindAll('update','addColumn', 'removeColumn');
		this.model.bind('change', this.update);
		this.model.get('columns').each(this.addColumn);		
    this.model.get('columns').bind('add', this.addColumn);
    this.model.get('columns').bind('remove', this.removeColumn);		
	},
	addColumn: function(column){
		var cmv = new ColumnView({model:column, id: column.get('uuid'),rowUUID: this.model.get('uuid'), containerUUID: this.options.containerUUID, className:'column column_outline span'+column.get('colspan')});
		this._columnViews.push(cmv);		
    if (this._rendered) {
      $(this.el).append(cmv.render().el);
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
		
    this._rendered = true;
 
    $(this.el).empty();
		
		var that = this;
		
		this.$el.html(_.template($('#row-template').html(), {uuid: this.model.get('uuid'), content:this.model.get('uuid'), options:this.options}));
		
    _(this._columnViews).each(function(cmv) {
      that.$('.columns').append(cmv.render().el);
    });
		
		
		return this;
	}
});

var ColumnView = Backbone.View.extend({
	tagName: 'div',
	initialize: function(){
		this.template = '#column-template';
	},
	events: {
		'dblclick': 'addOne',
	},
	addOne: function(){
		//console.log(this.options);
		PageController.addColumn({containerUUID:this.options.containerUUID, rowUUID:this.options.rowUUID});
	},
	render: function(){
		
		this.$el.html(_.template($(this.template).html(), {}));
		return this;
	}
});

var BlockView = Backbone.View.extend({});
