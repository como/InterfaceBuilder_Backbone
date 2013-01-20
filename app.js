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
		this.$el.html(_.template($(this.template).html(), this.options));
	},
	remove: function(){
		this.$el.remove();
		this.$el.unbind();
	}
});

var RowView = Backbone.View.extend({
	initialize: function(attrs){
		this.template = '#row-template';
		this.options = attrs;
	    // _.bindAll(this, "render");
	    // this.model.bind('change', this.render);
		this.render();		
	},
	render: function(){
		this.$el.html(_.template($(this.template).html(), {
			uuid: this.options.viewOptions.uuid, 
			containerUUID: this.options.viewOptions.containerUUID,
			columns: _.toArray(this.model.get('columns'))
			})
		);
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


IB.PageController = function(page) {
	that = this;
	that.page = page;	
	that.views = {};
	that.build = function(data){
		that.page.set('containers', new Containers());		
		_.each(data.containers, function(container){
			that.addContainer({uuid:container.uuid});
			_.each(container.rows, function(row){
				that.addRow({containerUUID: container.uuid, uuid: row.uuid});
				_.each(row.columns, function(column){
					that.addColumn({containerUUID: container.uuid, rowUUID: row.uuid, uuid: column.uuid, colspan: column.colspan});
				});
			});		
		});
	}
	that.addContainer = function(options){
		var containerUUID = options.uuid || UUID.generate();
		var newContainer = new Container({uuid: containerUUID});
		newContainer.set('rows', new Rows());
		that.page.get('containers').add(newContainer);
		containerEl = $('<div id="'+containerUUID+'" class="container-fluid container_outline" />').appendTo('#page');
		that.views[containerUUID] = new ContainerView({model:newContainer, el:containerEl, options:{uuid:containerUUID}});		
	}
	that.addRow = function(options){
		
		var rowUUID = options.uuid || UUID.generate();
		var newRow = new Row({uuid: rowUUID, columns: options.columns});
		newRow.set('columns', new Columns());
		that.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containerUUID;
		})
		.get('rows')
		.add(newRow);
		
		rowEl = $('<div id="'+rowUUID+'" class="row-fluid row_outline" />').appendTo('#'+options.containerUUID);
		
		that.views[rowUUID] = new RowView({model:newRow, el:rowEl, viewOptions:{uuid:rowUUID, containerUUID:options.containerUUID}});
		return that;		
	}
	that.removeRow = function(options){
		console.log(options);
		containerRows = that.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containerUUID;
		}).get('rows');
		
		containerRows.remove(containerRows.find(function(row){
				return row.get('uuid') == options.uuid;
			}));
		
		that.views[options.uuid].remove();
		
	}
	that.addColumn = function(options){
		
		var columnUUID = options.uuid || UUID.generate();
		var newColumn = new Column({uuid: columnUUID, blocks: null});
				
		rowColumns = that.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containerUUID;
		})
		.get('rows')
		.find(function(row){
			return row.get('uuid') == options.rowUUID;
		})
		.get('columns');
		
		var spanNumber = function(colNum){
			if(colNum <= 4) return (12/colNum);
			else if (colNum <= 6) return 2;
			return 1;
		}
		
		newColumn.colspan = 'span'+spanNumber((_.size(rowColumns)+1));
		_.each(rowColumns.models, function(rowColumn){
			
			columnEl = $('#'+rowColumn.get('uuid'));
			$(columnEl).removeClass (function (index, css) {
				    return (css.match (/\bspan\S+/g) || []).join(' ');
				});
				
			$(columnEl).addClass(newColumn.colspan);
			// that.views[$(rowColumn).attr('uuid')].render();
		});
		
		rowColumns.add(newColumn);

		colEl = $('<div id="'+columnUUID+'" class="column column_outline '+newColumn.colspan+'" />').appendTo('#'+options.rowUUID);		
		that.views[columnUUID] = new ColumnView({model:newColumn, el:colEl, rowUUID: options.rowUUID, containerUUID:options.containerUUID});
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
	        			order: {},
				        columns: {
					        column1: {
								uuid: 'column1',
						        colspan: 'span6',
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
// PageController.addRow({
// 	containeruuid: 'container1',
// 	columns: ['span8','span4']
// 	});



});