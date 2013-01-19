var IB = IB || {};

var Page = Backbone.Model.extend({
	parse: function(response){
		IB.PageController.build(response, this);
	}
});

var Container = Backbone.Model.extend({});
var Row = Backbone.Model.extend({});
var Column = Backbone.Model.extend({});
var Block = Backbone.Model.extend({});
var Containers = Backbone.Collection.extend({model: Container});
var Rows = Backbone.Collection.extend({model: Row});
var Columns = Backbone.Collection.extend({model: Column});
var Blocks = Backbone.Collection.extend({model: Block});

var ContainerView = Backbone.View.extend({
	initialize: function(){
		this.template = '#container-template';
	    _.bindAll(this, "render");
	    this.model.bind('change', this.render);
		this.render();
	},
	render: function(){
		console.log(this);
		this.$el.html(_.template($(this.template).html(), this.options));
	}
});

var RowView = Backbone.View.extend({
	initialize: function(){
		this.template = '#row-template';
	    // _.bindAll(this, "render");
	    // this.model.bind('change', this.render);
		this.render();
	},
	render: function(){
		console.log(this);
		this.$el.html(_.template($(this.template).html(), this.options));
	}
});

var ColumnView = Backbone.View.extend({});
var BlockView = Backbone.View.extend({});


IB.PageController = function(page) {
	that = this;
	that.page = page;	
	that.views = {};
	that.build = function(data){
		that.page.set('containers', new Containers());
		
		_.each(data.containers, function(container){
			//that.page.get('containers').add(new Container({uuid: container.uuid}))
			that.addContainer({uuid:container.uuid});
			_.each(container.rows, function(row){
				that.addRow({containerUUID: container.uuid, uuid: row.uuid});
			});		
		});
	}
	that.addContainer = function(options){
		var containerUUID = options.uuid || UUID.generate();
		var newContainer = new Container({uuid: containerUUID});
		newContainer.set('rows', new Rows());
		that.page.get('containers').add(newContainer);
		containerEl = $('<div id="'+containerUUID+'" class="container" />').appendTo('#page');
		that.views[containerUUID] = new ContainerView({model:newContainer, el:containerEl, options:{uuid:containerUUID}});		
	}
	that.addRow = function(options){
		
		// var rowColumns = new Columns();
		// 
		// _.each(options.columns, function(colspan){
		// 	rowColumns.add(new Column({colspan: colspan}));
		// });
		
		var rowUUID = options.uuid || UUID.generate();
		var newRow = new Row({uuid: rowUUID, columns: null});
				
		that.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containerUUID;
		})
		.get('rows')
		.add(newRow);
		
		rowEl = $('<div id="'+rowUUID+'" class="row" />').appendTo('#'+options.containerUUID);
		
		that.views[rowUUID] = new RowView({model:newRow, el:rowEl, options:{uuid:rowUUID}});
	}
	
	that.removeRow = function(options){
		
		containerRows = that.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containerUUID;
		}).get('rows');
		
		// containerRows.remove(containerRows.find(function(row){
		// 		return row.get('uuid') == options.rowUUID;
		// 	}));
		
		console.log(options.rowUUID);
		

		that.views[options.containerUUID].render();
	}
	
	that.addBlock = function(options){
	}
	
	that.render = function(){
		_.each(that.page.get('containers').models, function(container){			
			
		});
		
		return true;
	}
}


$(document).ready(function(){
	var data = {
	    containers: {
	        container1: {
				uuid: 'container1',
	            template: {},
	            rows: {
	            	row1: {
						uuid: 'row1',
			            template: {},
	        			order: {}// ,
	        			// 				        columns: {
	        			// 					        column1: {
	        			// 								uuid: 'column1',
	        			// 						        template: {},
	        			// 							    blocks: {
	        			// 								    block1: {
	        			// 										uuid: 'block1',
	        			// 									    template: {},
	        			// 									    order: {},
	        			// 									    data: {}
	        			// 									}
	        			// 								}
	        			// 	    					}
	    				//}
	        		}
	        	}
	        }
	    }
	}

PageController = new IB.PageController(new Page());
PageController.build(data);
// PageController.addRow({
// 	containeruuid: 'container1',
// 	columns: ['span8','span4']
// 	});
	
});