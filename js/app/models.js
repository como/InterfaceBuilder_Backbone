var IB = IB || {};

// Base Models and Collections
IB.Collection = Backbone.Collection.extend({
	makePlace: function(position){
		console.log('forcing', position);
		_(this.models).each(function(model){
			if(model.get('order') >= position) 
			{
				model.pushDown();
			}
		});
		return this;
	},
  comparator: function( model ) {
       return model.get('order');
   },
 	updateOrder: function(orderedList){
		console.log('updating order');
 		_(this.models).each(function(model){
 			model.set('order', orderedList.indexOf(model.get('uuid')));
 		});
 	}
});

IB.Model = Backbone.Model.extend({
	pushDown: function(){
		var currentOrder = this.get('order');
		this.set('order', currentOrder+1);
	}
});

// Models

var Page = IB.Model.extend({
	initialize: function(){
		this.set('containers', new Containers());
	},
	urlRoot : '/server/index.php/page',
	parse: function (response){
		this.set('containers', new Containers(response.containers));
	}
});

var Container = IB.Model.extend({
	initialize: function(attrs){
		uuid = attrs.uuid || UUID.generate();
		order   = attrs.order || 0;
		rows = attrs.rows || {};
		this.set('uuid', uuid);
		this.set('order', order);
		this.set('rows', new Rows(rows));
	}
});

var Row = IB.Model.extend({
	initialize: function(attrs){
		uuid 		= attrs.uuid || UUID.generate();
		order   = attrs.order || 0;
		columns = attrs.columns || {};
		this.set('uuid', uuid);
		this.set('order', order);
		this.set('columns', new Columns(columns));
	}
});

var Column = IB.Model.extend({
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

var Block = IB.Model.extend({
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
	}
});


// Collections

var Containers =	IB.Collection.extend({
	model: Container
});

var Rows = IB.Collection.extend({
	model: Row
});

var Columns = Backbone.Collection.extend({model: Column});

var Blocks = IB.Collection.extend({
	model: Block
});