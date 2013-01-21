var IB = IB || {};

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
		columns = attrs.columns;
		this.set('uuid', uuid);
		this.set('columns', new Columns(columns));
	}
});

var Column = Backbone.Model.extend({});
var Block = Backbone.Model.extend({});

var Containers = Backbone.Collection.extend({model: Container});
var Rows = Backbone.Collection.extend({model: Row});
var Columns = Backbone.Collection.extend({model: Column});
var Blocks = Backbone.Collection.extend({model: Block});