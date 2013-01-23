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
	// urlRoot : '/server/index.php/block',
	defaults: {
		'template':'text-block-template'
	},
	initialize: function(attrs){
		uuid 		= attrs.uuid || UUID.generate();
		order   = attrs.order || 0;
		if(!attrs.content)
		{
			this.set('content', this.contentTypeDefault());
		}
		this.set('uuid', uuid);
		this.set('order', order);
		// if(!this.isNew())
		// {
		// 	this.set('id', uuid);
		// 	this.fetch();
		// }
	},
	contentTypeDefault: function(){
		switch(this.get('template')){
			case 'nav-block-template':
				return {items:[]};
			break;
			case 'video-block-template':
				return {url:'http://www.youtube.com/embed/qpa0qKgCaRE'};
			break;
			default:
				return 'Edit Me';
			break;
		}
	},
	parse: function(response){
		console.log(response);
	},
	pushDown: function(){
		var currentOrder = this.get('order');
		this.set('order', currentOrder+1);
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
var Blocks = Backbone.Collection.extend({
	model: Block,
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
  comparator: function( block ) {
       return block.get('order');
   }
});