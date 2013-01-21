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
	},
	render: function(){
		console.log('rendering page');
    this._rendered = true;
 
    $(this.el).empty();
		
		that = this;
 
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
	},
	render: function(){
		console.log('rendering container');
    this._rendered = true;
 
    $(this.el).empty();
		
		that = this;
		
		this.$el.html(_.template($('#container-template').html(), {uuid: this.model.get('uuid')}));
 
    _(this._rowViews).each(function(rv) {
      that.$('.rows').append(rv.render().el);
    });
 
    return this;	
	},
	remove: function(){
		this.$el.remove();
		this.$el.unbind();
	}
});

var RowView = Backbone.View.extend({
	tagName: 'div',
	className: 'row-fluid row_outline',
	initialize: function(attrs){
		
		_(this).bindAll('update');
		this.model.bind('change', this.update);
	},
	update: function(){
		console.log(this.render().el);
	},
	render: function(){
		console.log('rendering ' + this.model.get('uuid'));
		this.$el.html(_.template($('#row-template').html(), {uuid: this.model.get('uuid'), content:this.model.get('uuid'), options:this.options}));
		return this;
	},
	remove: function(){
		this.$el.remove();
		this.$el.unbind();
	}
});

var ColumnView = Backbone.View.extend({
	initialize: function(){
		this.template = '#column-template';
		this.render();	
	},
	events: {
		'dblclick': 'addOne',
	},
	addOne: function(){
		PageController.addColumn({containerUUID:this.options.containerUUID, rowUUID:this.options.rowUUID});
	},
	render: function(){
		this.$el.html(_.template($(this.template).html(), {}));
	}
});

var BlockView = Backbone.View.extend({});
