var RowView = Backbone.View.extend({
	tagName: 'div',
	className: 'ib-row ' + IB.rowClass,
	initialize: function(attrs){
		console.log(this.model.get(attrs.collectionType));
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