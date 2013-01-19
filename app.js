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
	},
	render: function(){
		this.$el.html(_.template($(this.template).html(), this.options));
	}
});

var RowView = Backbone.View.extend({
	initialize: function(){
		this.template = '#row-template';
	    _.bindAll(this, "render");
	    this.model.bind('change', this.render);
	},
	render: function(){
		console.log(this.$el);
		this.$el.html(_.template($(this.template).html(), this.options));
	}
});

var ColumnView = Backbone.View.extend({});
var BlockView = Backbone.View.extend({});


IB.PageController = function(page) {
	that = this;
	that.page = page;
	that.views = {
		containerViews: {},
		rowViews: {},
		columnViews: {},
		blockViews: {}
	};
	that.build = function(data){
		var pageContainers = new Containers();
		_.each(data.containers, function(container){
			
			var newContainer = new Container({template: container.template, uuid: container.uuid});						
			
			that.views.containerViews[container.uuid] = new ContainerView({model:newContainer, el:'#page', options:{uuid:container.uuid}});
					
			var containerRows = new Rows();
			_.each(container.rows, function(row){
				var newRow = new Row({template: row.template, uuid: row.uuid});
				var rowColumns = new Columns();
				_.each(row.columns, function(column){
					var newColumn = new Column({template: column.template, uuid: column.uuid});
					rowColumns.add(newColumn);
				});
				newRow.set('columns', rowColumns);
				

				that.views.rowViews[row.uuid] = new RowView({model:newRow, el:'#'+container.uuid, options:{uuid:row.uuid}});
				
				containerRows.add(newRow);
			});
			newContainer.set('rows', containerRows);
			pageContainers.add(newContainer);			
		});
		that.page.set('containers', pageContainers);
	}
	that.addRow = function(options){
		
		var rowColumns = new Columns();
		
		_.each(options.columns, function(colspan){
			rowColumns.add(new Column({colspan: colspan}));
		});
		
		var newRowUUID = UUID.generate();
		var newRow = new Row({uuid: newRowUUID, columns: rowColumns});
		//that.views.rowViews[newRowUUID] = new RowView({model:newRow, el:'#'+options.containeruuid, options:{uuid:newRowUUID}});
		
		that.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containeruuid;
		})
		.get('rows')
		.add(newRow);
		
	}
	
	that.removeRow = function(options){
		
		containerRows = that.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containeruuid;
		})
		.get('rows');
		
		containerRows.remove(containerRows.find(function(row){
				return row.get('uuid') == options.rowuuid;
			}));
		
		console.log("removed"+options.rowuuid);
	}
	
	that.addBlock = function(options){
	}
	
	that.render = function(){
		_.each(that.page.get('containers').models, function(container){			
			that.views.containerViews[container.get('uuid')].render();
			_.each(container.get('rows').models, function(row){
				console.log(row);
				that.views.rowViews[row.get('uuid')].render();
			});
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
	        			order: {},
				        columns: {
					        column1: {
								uuid: 'column1',
						        template: {},
							    blocks: {
								    block1: {
										uuid: 'block1',
									    template: {},
									    order: {},
									    data: {}
									}
								}
	    					}
	    				}
	        		}
	        	}
	        }
	    }
	}

PageController = new IB.PageController(new Page());
PageController.build(data);
PageController.addRow({
	containeruuid: 'container1',
	columns: ['span8','span4']
	});
	
});