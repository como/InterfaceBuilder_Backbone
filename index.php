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
	
	<script id="container-template" type="text/template">
	<div class="row">
		<div class="span12 handle container-handle "><a href="#" class="ib-control pull-right" onclick="IB.PageControllerInstance.removeContainer({uuid: '<%= uuid %>'})"><span class="label label-inverse">container</span> <i class="icon-remove"></i></a></div>
	</div>
	<div class="rows" data-uuid="<%= uuid %>">
	</div>
	</script>
	
	<script id="row-template" type="text/template">
	<div class="span12 handle row-handle">
		<a href="#" class="ib-control pull-right" onclick="IB.PageControllerInstance.removeRow({uuid:'<%= uuid %>', containerUUID: '<%= options.containerUUID %>'})"><span class="label label-inverse">row</span> <i class="icon-remove"></i></a>
	</div>
	<div class="columns" data-uuid="<%= uuid %>" data-container="<%= options.containerUUID %>">
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
	
	Rich Text <%= content %> 

	</script>
	
	<script id="video-block-template" type="text/template">
	<div class="handle block-handle">
	<div class="input-append pull-left">
	  <input class="span5" id="appendedInputButton" type="text" value="<%= content %>" data-model-uuid="<%= uuid %>">
	  <button class="btn" type="button" onclick="IB.editors.updateVideo({uuid:'<%= uuid %>', columnUUID:'<%= columnUUID %>', rowUUID:'<%= rowUUID %>', containerUUID: '<%= containerUUID %>'})">Update</button>
	</div>
	<a href="#"  class="ib-control pull-right" onclick="IB.PageControllerInstance.removeBlock({uuid:'<%= uuid %>', columnUUID:'<%= columnUUID %>', rowUUID:'<%= rowUUID %>', containerUUID: '<%= containerUUID %>'})"><i class="icon-remove"></i></a></div>
	<iframe width="560" height="315" src="<%= content %>" frameborder="0" allowfullscreen></iframe>

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
	
	<script id="nav-block-template" type="text/template">
	<div class="handle block-handle"><a href="#"  class="ib-control pull-right" onclick="IB.PageControllerInstance.removeBlock({uuid:'<%= uuid %>', columnUUID:'<%= columnUUID %>', rowUUID:'<%= rowUUID %>', containerUUID: '<%= containerUUID %>'})"><i class="icon-remove"></i></a></div>
	
	<div class="navbar navbar-static-top">
        <div class="navbar-inner">
          <div class="container">
            <div class="row-fluid">
              <ul class="nav">
                <li class="active"><a href="#">Home</a></li>
                <li><a href="#experiences">Experiences</a></li>
                <li><a href="#foodwine">Food + Wine</a></li>
                <li><a href="#foodwine">Visitor Information</a></li>
                <li><a href="#events">Events</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li class="search visible-phone"><a href="#search" class="btn btn-search" data-toggle="collapse" data-target=".nav-collapse">Search</a></li>
                <li class="wishlist"><a href="#wishlist" class="btn btn-primary">My Wishlist</a></li>
              </ul>
            </div>
            
          </div>
        </div>
	</div>
		
	</script>
	
	<script id="video-block-template" type="text/template">
	<div class="handle block-handle"><a href="#"  class="ib-control pull-right" onclick="IB.PageControllerInstance.removeBlock({uuid:'<%= uuid %>', columnUUID:'<%= columnUUID %>', rowUUID:'<%= rowUUID %>', containerUUID: '<%= containerUUID %>'})"><i class="icon-remove"></i></a></div>
	
		Video <%= content %> 
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
		<a id="newbtn" class="btn btn-inverse"><i class="icon-plus icon-white"></i></a>
		<a id="savebtn" class="btn btn-inverse"><i class="icon-refresh icon-white"></i></a>
		</div>
		<div class="pull-right">
		<a class="btn btn-inverse" onclick="IB.toggleSidebar()"><i class="icon-remove icon-white"></i></a>
		</div>
		<br/>
		<br/>
		<ul class="nav nav-list">
			<li class="nav-header">Templates</li>
			<li><a href="/#/page/1"><div class="draggable_scaffold" data-template="scaffold_col1row">Home Template</div></a></li>
			<li><a href="#"><div class="draggable_scaffold" data-template="scaffold_col1row">About Template</div></a></li>
			
			<li class="nav-header">Scaffolding</li>
			<li><a href="#"><div class="sidebar_container" data-template="container-template">Container</div></a></li>
			<li><a href="#"><div class="sidebar_row" data-template="row-template">Row</div></a>

		  <li class="nav-header">Blocks</li>
			<li><a href="#"><div class="sidebar_block" data-template="nav-block-template">Nav</div></a></li>	
		  <li><a href="#"><div class="sidebar_block" data-template="text-block-template">Rich Text</div></a></li>			
			<li><a href="#"><div class="sidebar_block" data-template="video-block-template">Video</div></a></li>
		  <li><a href="#"><div class="sidebar_block" data-template="news-block-template">News</div></a></li>			
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
	<script src="vendor/bootstrap.min.js"></script>
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
	});
	</script>
</body>
</html>