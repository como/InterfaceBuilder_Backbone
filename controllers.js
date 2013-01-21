var IB = IB || {};

IB.PageController = function(page) {
	this.page = page;	
	this.view = new PageView({model:page, el:'#page'});
	this.addContainer = function(options){		
		this.page.get('containers').add(new Container(options));
	}
	this.removeContainer = function(options){

		var container = this.page.get('containers').find(function(container){
			 return container.get('uuid') == options.uuid;
		});	
		
		this.page.get('containers').remove(container);
		
	}
	this.addRow = function(options){
		this.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containerUUID;
		}).get('rows').add(new Row({}));
	}
	this.removeRow = function(options){

		var containerRows = this.page.get('containers').find(function(container){
			 return container.get('uuid') == options.containerUUID;
		}).get('rows');
		
		
		containerRows.remove(containerRows.find(function(row){
				return row.get('uuid') == options.uuid;
			}));		
		
	}
	this.addColumn = function(options){
		
		var columnUUID = options.uuid || UUID.generate();
		var newColumn = new Column({uuid: columnUUID, blocks: null});
				
		rowColumns = this.page.get('containers').find(function(container){
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
		this.views[columnUUID] = new ColumnView({model:newColumn, el:colEl, rowUUID: options.rowUUID, containerUUID:options.containerUUID});
	}

}
