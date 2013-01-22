/**
To do:
// 1. Blocks
// 2. UI
3. Routing
4. Offsets
5. Full persistence
*/

var IB = IB || {};

IB.PageController = function(page) {
	
	this.page = page;	
	this.view = new PageView({model:page, el:'#page'});
	
	IB.initUI();
	
	
	this.addContainer = function(options){		
		this.page.get('containers').makePlace(options.order).add(new Container(options));
		IB.setState('editing');
	}
	this.removeContainer = function(options){

		var container = this.page.get('containers').find(function(container){
			 return container.get('uuid') == options.uuid;
		});	
		
		this.page.get('containers').remove(container);
		IB.setState('editing');
	}
	this.addRow = function(options){
		this.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containerUUID;
		}).get('rows').makePlace(options.order).add(new Row({order:options.order})).sort();
		IB.setState('editing');
	}
	this.removeRow = function(options){

		var containerRows = this.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containerUUID;
		}).get('rows');
		
		
		containerRows.remove(containerRows.find(function(row){
				return row.get('uuid') == options.uuid;
			}));		
			IB.setState('editing');
		
	}
	this.addColumn = function(options){
						
		var rowColumns = this.page.get('containers').find(function(container){
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

		var colspan = spanNumber((_.size(rowColumns)+1));
		
		_.each(rowColumns.models, function(rowColumn){
			
			columnEl = $('#'+rowColumn.get('uuid'));
			$(columnEl).removeClass (function (index, css) {
				    return (css.match (/\bspan\S+/g) || []).join(' ');
				});
			$(columnEl).addClass('span'+colspan);
			
			rowColumn.set('colspan',colspan);
			
		});
		
		rowColumns.add(new Column({colspan:colspan}));
		IB.setState('editing');

	}
	
	this.addBlock = function(options){
						
		var columnBlocks = this.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containerUUID;
		})
		.get('rows')
		.find(function(row){
			return row.get('uuid') == options.rowUUID;
		})
		.get('columns')
		.find(function(column){
			return column.get('uuid') == options.columnUUID;
		})
		.get('blocks')
		.makePlace(options.order)
		.add(new Block({template: options.template, order: options.order}));
		
		IB.setState('editing');
		
		
	}
	
	this.removeBlock = function(options){
		var columnBlocks = this.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containerUUID;
		})
		.get('rows')
		.find(function(row){
			return row.get('uuid') == options.rowUUID;
		})
		.get('columns')
		.find(function(column){
			return column.get('uuid') == options.columnUUID;
		})
		.get('blocks');
		
		columnBlocks.remove(columnBlocks.find(function(block){
			return block.get('uuid') == options.uuid;
		}));
		IB.setState('editing');
	}
	
	this.updateColspan = function(options)
	{
		this.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containerUUID;
		})
		.get('rows')
		.find(function(row){
			return row.get('uuid') == options.rowUUID;
		})
		.get('columns')
		.find(function(column){
			return column.get('uuid') == options.columnUUID;
		})
		.set('colspan', options.colspan.replace('span',''));
		IB.setState('editing');
		
	}

}
