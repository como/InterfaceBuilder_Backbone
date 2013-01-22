var IB = IB || {};

// Models

var Page = Backbone.Model.extend({
	initialize: function(){
		this.set('containers', new Containers());
	},
	urlRoot : '/server/index.php/page',
	parse: function (response){
		this.set('containers', new Containers(response.containers));
	}
});

var Container = Backbone.Model.extend({
	initialize: function(attrs){
		uuid = attrs.uuid || UUID.generate();
		order   = attrs.order || 0;
		rows = attrs.rows || {};
		this.set('uuid', uuid);
		this.set('order', order);
		this.set('rows', new Rows(rows));
	},
	pushDown: function(){
		var currentOrder = this.get('order');
		this.set('order', currentOrder+1);
	}
});

var Row = Backbone.Model.extend({
	initialize: function(attrs){
		uuid 		= attrs.uuid || UUID.generate();
		order   = attrs.order || 0;
		columns = attrs.columns || {};
		this.set('uuid', uuid);
		this.set('order', order);
		this.set('columns', new Columns(columns));
	},
	pushDown: function(){
		var currentOrder = this.get('order');
		this.set('order', currentOrder+1);
	}
});

var Column = Backbone.Model.extend({
	defaults: {
		'colspan': 12
	},
	initialize: function(attrs){
		uuid 	 = attrs.uuid || UUID.generate();
		this.set('uuid', uuid);
		if(attrs.blocks) this.set('blocks', new Blocks(attrs.blocks));
		else this.set('blocks', new Blocks());
	}
});

var Block = Backbone.Model.extend({
	defaults: {
		'template':'text-block-template',
		'content':'Test Content'
	},
	initialize: function(attrs){
		uuid 		= attrs.uuid || UUID.generate();
		this.set('uuid', uuid);
	}
});


// Collections

var Containers = Backbone.Collection.extend({
	model: Container,
	makePlace: function(position){
		console.log('forcing', position);
		$.each(this.models, function(index,model){
			if(model.get('order') >= position) 
			{
				model.pushDown();
			}
		});
		return this;
	},
  comparator: function( container ) {
       return container.get('order');
   }
});
var Rows = Backbone.Collection.extend({
	model: Row,
	makePlace: function(position){
		console.log('forcing', position);
		$.each(this.models, function(index,model){
			if(model.get('order') >= position) 
			{
				model.pushDown();
			}
		});
		return this;
	},
  comparator: function( row ) {
       return row.get('order');
   }
});
var Columns = Backbone.Collection.extend({model: Column});
var Blocks = Backbone.Collection.extend({model: Block});