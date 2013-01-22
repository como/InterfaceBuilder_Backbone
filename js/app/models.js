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
		rows = attrs.rows || {};
		this.set('uuid', uuid);
		this.set('rows', new Rows(rows));
	}
});

var Row = Backbone.Model.extend({
	initialize: function(attrs){
		uuid 		= attrs.uuid || UUID.generate();
		columns = attrs.columns || {};
		this.set('uuid', uuid);
		this.set('columns', new Columns(columns));
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

var Containers = Backbone.Collection.extend({model: Container});
var Rows = Backbone.Collection.extend({model: Row});
var Columns = Backbone.Collection.extend({model: Column});
var Blocks = Backbone.Collection.extend({model: Block});