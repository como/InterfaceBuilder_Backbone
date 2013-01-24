<?php header('X-Frame-Options: GOFORIT'); ?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Canvas</title>
<link href="vendor/smoothness/jquery-ui-1.10.0.custom.min.css" rel="stylesheet">
<link href="vendor/bootstrap.css" rel="stylesheet">
<link href="vendor/bootstrap-responsive.css" rel="stylesheet">
<link href="css/canvas.css" rel="stylesheet">
	
<!-- Site CSS -->
<link href="css/site/theme.css" rel="stylesheet">
<link href="css/site/flexslider.css" rel="stylesheet">
</head>

<body>
	
	<!-- Start scaffolding Templates -->
	<script id="page-template" type="text/template">
	</script>
	
	<script id="container-template" type="text/template">
	<div class="row">
		<div class="span12 handle container-handle "><a href="#" class="ib-control pull-right" onclick="IB.PageControllerInstance.removeContainer({uuid: '<%= uuid %>'})"><span class="label label-inverse">container</span> <i class="icon-remove"></i></a></div>
	</div>
	<div class="rows" data-uuid="<%= uuid %>">
	</div>
	</script>
	
	<script id="row-template" type="text/template">
	<div class="span12 handle row-handle">
		<a href="#" class="ib-control pull-right" onclick="IB.PageControllerInstance.removeRow({uuid:'<%= uuid %>', containerUUID: '<%= options.parentUUID %>'})"><span class="label label-inverse">row</span> <i class="icon-remove"></i></a>
	</div>
	<div class="columns" data-uuid="<%= uuid %>" data-container="<%= options.parentUUID %>">
	</div>
	</script>
	
	<script id="column-template" type="text/template">
	<div class="handle column-handle"></div>
	<div class="blocks blocks-outline" data-uuid="<%= uuid %>" data-row="<%= options.rowUUID %>" data-container="<%= options.containerUUID %>">
	</div>

	</script>
	
	<!-- End scaffolding Templates -->
	
	<!-- Start block Templates -->
	
	<script id="text-block-template" type="text/template">
	<div class="handle block-handle"><a href="#"  class="ib-control pull-right" onclick="IB.PageControllerInstance.removeBlock({uuid:'<%= uuid %>', columnUUID:'<%= columnUUID %>', rowUUID:'<%= rowUUID %>', containerUUID: '<%= containerUUID %>'})"><i class="icon-remove"></i></a></div>
	<div class="richText" contentEditable="true">
	<%= content %> 
	</div>
	</script>
	
	<script id="video-block-template" type="text/template">
	<div class="handle block-handle">
	<div class="input-append pull-left">
	  <input id="videoUrl" class="span5" id="appendedInputButton" type="text" value="<%= content.url %>" data-model-uuid="<%= uuid %>">
	  <button id="updateVideoBtn" class="btn" type="button" >Update</button>
	</div>
	<a href="#"  class="ib-control pull-right" onclick="IB.PageControllerInstance.removeBlock({uuid:'<%= uuid %>', columnUUID:'<%= columnUUID %>', rowUUID:'<%= rowUUID %>', containerUUID: '<%= containerUUID %>'})"><i class="icon-remove"></i></a></div>
	<iframe width="560" height="315" src="<%= content.url %>" frameborder="0" allowfullscreen></iframe>

	</script>
	
	<script id="news-block-template" type="text/template">
	<div class="handle block-handle"><a href="#"  class="ib-control pull-right" onclick="IB.PageControllerInstance.removeBlock({uuid:'<%= uuid %>', columnUUID:'<%= columnUUID %>', rowUUID:'<%= rowUUID %>', containerUUID: '<%= containerUUID %>'})"><i class="icon-remove"></i></a></div>
	
  <div class="block block-2">
	<div class="portlet-content clearfix">
      	<h2>News</h2>
          <ul class="news wrap">
            <li>
              <img class="thumbnail pull-left" src="http://placehold.it/95x95" />
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p>
            </li>
            <li>
              <img class="thumbnail pull-left" src="http://placehold.it/95x95" />
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p>
            </li>
            <li>
              <img class="thumbnail pull-left" src="http://placehold.it/95x95" />
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p>
            </li>
            <li>
              <img class="thumbnail pull-left" src="http://placehold.it/95x95" />
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p>
            </li>
          </ul>
	</div>
	</div>
	</script>
	
	<script id="events-block-template" type="text/template">
	<div class="handle block-handle"><a href="#"  class="ib-control pull-right" onclick="IB.PageControllerInstance.removeBlock({uuid:'<%= uuid %>', columnUUID:'<%= columnUUID %>', rowUUID:'<%= rowUUID %>', containerUUID: '<%= containerUUID %>'})"><i class="icon-remove"></i></a></div>
	<div class="block block-3">
    	<div class="portlet-content clearfix">
        	<h2>Events</h2>
            <div class="eventslider">
            	<ul class="slides">
                  <li>
                    <img class="" src="http://placehold.it/220x326" />
                    <div class="carousel-caption">
                      <h4>Food + Wine</h4>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
                      <button class="btn btn-more">More...</button>
                    </div>
                  </li>
                  <li>
                    <img class="" src="http://placehold.it/220x326" />
                    <div class="carousel-caption">
                      <h4>Outdoor Adventure</h4>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
                      <button class="btn btn-more">More...</button>
                    </div>
                  </li>
                   <li>
                    <img class="" src="http://placehold.it/220x326" />
                    <div class="carousel-caption">
                      <h4>Operator</h4>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
                      <button class="btn btn-more">More...</button>
                    </div>
                  </li>
                  <li>
                    <img class="" src="http://placehold.it/220x326" />
                    <div class="carousel-caption">
                      <h4>Accommodation</h4>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
                      <button class="btn btn-more">More...</button>
                    </div>
                  </li>
                  <li>
                    <img class="" src="http://placehold.it/220x326" />
                    <div class="carousel-caption">
                      <h4>Tours</h4>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
                      <button class="btn btn-more">More...</button>
                    </div>
                  </li>
                  <li>
                    <img class="" src="http://placehold.it/220x326" />
                    <div class="carousel-caption">
                      <h4>Gallery</h4>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
                      <button class="btn btn-more">More...</button>
                    </div>
                  </li>
                  <li>
                    <img class="" src="http://placehold.it/220x326" />
                    <div class="carousel-caption">
                      <h4>Inspiration</h4>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
                      <button class="btn btn-more">More...</button>
                    </div>
                  </li>
                </ul>
        	</div>
        </div>

		
	</script>
	
	<script id="nav-block-template" type="text/template">
	<div class="handle block-handle">
	
	<div class="pull-right">
	<a href="#"  class="ib-control" onclick="IB.PageControllerInstance.removeBlock({uuid:'<%= uuid %>', columnUUID:'<%= columnUUID %>', rowUUID:'<%= rowUUID %>', containerUUID: '<%= containerUUID %>'})"><i class="icon-remove"></i></a>
	</div>

	
	</div>
	
	<div class="navbar navbar-static-top">
        <div class="navbar-inner">
          <div class="container">
            <div class="row-fluid">
              <ul class="nav">
                <li class="active"><a href="#">Home</a></li>
								<% _.each(content.items, function(item) { %>
	                <li><a class="<%= item.classAttr %>" href="<%= item.link %>"><%= item.name %></a></li>								
									<% }); %>
									<li>
									<div class="btn-group nav-controls">
										<a href="#" id="add-nav-item" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-plus"></i> New Page </a>
										<a id="addNavItem"></a>
									  <div id="nav-manager" class="dropdown-menu" style="padding: 15px;">
											<input id="nav-item-name" class="input-medium" type="text" placeholder="Name"><br/>
											<input id="nav-item-link" class="input-medium" type="text" placeholder="Link"  data-provide="typeahead" data-source='["/#/news", "/#/about"]'><br/>
											<input id="nav-item-class" class="input-medium" type="text" placeholder="Item Class"  data-provide="typeahead" data-source='["active", "btn btn-primary"]'><br/>										
											<a id="save-nav-item" href="#" class="btn btn-primary pull-right" onclick="javascript:$('#addNavItem').trigger('click')">Add</a>		
									  </div>
									</div>
									</li>
                <li class="search visible-phone"><a href="#search" class="btn btn-search" data-toggle="collapse" data-target=".nav-collapse">Search</a></li>
                <li class="wishlist"><a href="#wishlist" class="btn btn-primary">My Wishlist</a></li>
              </ul>
            </div>
            
          </div>
        </div>
	</div>
	</script>
	
	
	<!-- End block Templates -->
	
	<!-- Begin CSS Sandbox -->
	<div id="css-sandbox">
		<div id="css-sandbox-container" class="container">
			<div id="css-sandbox-row" class="row">
				<div id="css-sandbox-span1" class="span1">
				</div>
				<div id="css-sandbox-span2" class="span2">
				</div>
				<div id="css-sandbox-span3" class="span3">
				</div>
				<div id="css-sandbox-span4" class="span4">
				</div>
				<div id="css-sandbox-span5" class="span5">
				</div>
				<div id="css-sandbox-span6" class="span6">
				</div>
				<div id="css-sandbox-span7" class="span7">
				</div>
				<div id="css-sandbox-span8" class="span8">
				</div>
				<div id="css-sandbox-span9" class="span9">
				</div>
				<div id="css-sandbox-span10" class="span10">
				</div>
				<div id="css-sandbox-span11" class="span11">
				</div>
				<div id="css-sandbox-span12" class="span12">
				</div>				
			</div>
		</div>
		<div id="css-sandbox-container-fluid" class="container-fluid">
			<div id="css-sandbox-row-fluid" class="row-fluid">
				<div id="css-sandbox-span1" class="span1">
				</div>
				<div id="css-sandbox-span2" class="span2">
				</div>
				<div id="css-sandbox-span3" class="span3">
				</div>
				<div id="css-sandbox-span4" class="span4">
				</div>
				<div id="css-sandbox-span5" class="span5">
				</div>
				<div id="css-sandbox-span6" class="span6">
				</div>
				<div id="css-sandbox-span7" class="span7">
				</div>
				<div id="css-sandbox-span8" class="span8">
				</div>
				<div id="css-sandbox-span9" class="span9">
				</div>
				<div id="css-sandbox-span10" class="span10">
				</div>
				<div id="css-sandbox-span11" class="span11">
				</div>
				<div id="css-sandbox-span12" class="span12">
				</div>				
			</div>
		</div>		
	</div>
	<!-- End CSS Sandbox -->
	
	<!-- Begin Sidebar -->
	<div id="sidebarbtn" onclick="IB.toggleSidebar()">
		<a href="#"><i class="icon-th-list icon-white"></i></a>
	</div>
	
	<div id="sidebar">
		<div class="pull-left">
		<a id="newbtn" class="btn btn-inverse" onclick="IB.toggleNewPage()"><i class="icon-plus icon-white"></i></a>
		<a id="editbtn" class="btn btn-inverse" onclick="IB.toggleEditPage()"><i class="icon-pencil icon-white"></i></a>
		<a id="savebtn" class="btn btn-inverse"><i class="icon-refresh icon-white"></i></a>
		</div>
		<div class="pull-right">
		<a class="btn btn-inverse" onclick="IB.toggleSidebar()"><i class="icon-remove icon-white"></i></a>
		</div>
		<br/>
		<br/>
	  <div id="ib-messages">
	  </div>
	  <div id="new-page-form" style="padding: 15px; display:none">
			<span class="label label-inverse">New Page</span>
			<input id="nav-page-name" class="input-medium" type="text" placeholder="Name"><br/>
			<input id="nav-page-title" class="input-medium" type="text" placeholder="Title"><br/>
			<a id="save-new-page" href="#" class="btn btn-success" onclick="">Create</a>		
			<a id="cancel-new-page" href="#" class="btn btn-danger" onclick="">Cancel</a>		
	  </div>
	  <div id="edit-page-form" style="padding: 15px; display:none">
			<span class="label label-inverse">Edit Page</span>			
			<input id="nav-page-name" class="input-medium" type="text" placeholder="Name"><br/>
			<input id="nav-page-title" class="input-medium" type="text" placeholder="Title"><br/>
			<a id="save-edit-page" href="#" class="btn btn-success" onclick="">Save</a>		
			<a id="cancel-edit-page" href="#" class="btn btn-danger" onclick="">Cancel</a>
	  </div>
		<br/>		
		<ul class="nav nav-list">			
			<li class="nav-header">Scaffolding</li>
			<li><a href="#"><div class="sidebar_container" data-template="container-template">Container</div></a></li>
			<li><a href="#"><div class="sidebar_row" data-template="row-template">Row</div></a>

		  <li class="nav-header">Blocks</li>
			<li><a href="#"><div class="sidebar_block" data-template="nav-block-template">Nav</div></a></li>	
		  <li><a href="#"><div class="sidebar_block" data-template="text-block-template">Rich Text</div></a></li>			
			<li><a href="#"><div class="sidebar_block" data-template="video-block-template">Video</div></a></li>
		  <li><a href="#"><div class="sidebar_block" data-template="news-block-template">News</div></a></li>	
			<li><a href="#"><div class="sidebar_block" data-template="events-block-template">Events</div></a></li>		
		</ul>
	</div>
	<!-- End Sidebar -->

	<div id="page">
	</div>	
	
	<script src="vendor/uuid.core.js"></script>
	<script src="vendor/jquery-1.9.0.js"></script>
	<script src="vendor/jquery-ui-1.10.0.custom.min.js"></script>
	<script src="vendor/underscore-min.js"></script>
	<script src="vendor/backbone-min.js"></script>
	<script src="js/app/ui.js"></script>
	<script src="js/app/models.js"></script>
	<script src="js/app/views.js"></script>
	<script src="js/app/controllers.js"></script>
	<script>

	$(document).ready(function(){
	IB.cssSandboxInstance = new IB.cssSandbox();
	IB.currentPage = new Page({id:1});
	IB.currentPage.fetch({
		    success: function () {
					IB.PageControllerInstance = new IB.PageController(IB.currentPage);
		    },
				error: function () {
					IB.PageControllerInstance = new IB.PageController(new Page());
				}
		});
		
		// This code is generally not necessary, but it is here to demonstrate
		// how to customize specific editor instances on the fly. This fits well
		// this demo because we have editable elements (like headers) that
		// require less features.

		// The "instanceCreated" event is fired for every editor instance created.
		
		// CKEDITOR.on( 'instanceCreated', function( event ) {
		// 	console.log('instance created');
		// 	var editor = event.editor,
		// 		element = editor.element;
		// 
		// 	// Customize editors for headers and tag list.
		// 	// These editors don't need features like smileys, templates, iframes etc.
		// 	if ( element.is( 'h1', 'h2', 'h3' ) || element.getAttribute( 'id' ) == 'taglist' ) {
		// 		// Customize the editor configurations on "configLoaded" event,
		// 		// which is fired after the configuration file loading and
		// 		// execution. This makes it possible to change the
		// 		// configurations before the editor initialization takes place.
		// 		editor.on( 'configLoaded', function() {
		// 
		// 			// Remove unnecessary plugins to make the editor simpler.
		// 			editor.config.removePlugins = 'colorbutton,find,flash,font,' +
		// 				'forms,iframe,image,newpage,removeformat,' +
		// 				'smiley,specialchar,stylescombo,templates';
		// 
		// 			// Rearrange the layout of the toolbar.
		// 			editor.config.toolbarGroups = [
		// 				{ name: 'editing',		groups: [ 'basicstyles', 'links' ] },
		// 				{ name: 'undo' },
		// 				{ name: 'clipboard',	groups: [ 'selection', 'clipboard' ] },
		// 				{ name: 'about' }
		// 			];
		// 		});
		// 	}
		// });
		
	});
	</script>
</body>
</html>