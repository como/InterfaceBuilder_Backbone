<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta charset="UTF-8"><title>Interface Builder</title>
<link rel="stylesheet" href="css/workspace.css">
<link href="vendor/smoothness/jquery-ui-1.10.0.custom.min.css" rel="stylesheet">
</head>
<body style="min-height:768px;min-width:1024px;font-family:arial">
<header>
<div class="close">
<a href="#">×</a>
</div>
<div id="size" style="min-width: 0px;">1024x768</div>
<div class="keyboard"><a href="#" class="">I</a></div>
<div class="cssrefresh"><a href="#" class="active">I</a></div>
<div id="devices">
<a href="#" class="tablet-portrait active"><span>Tablet Portrait</span></a>
<a href="#" class="tablet-landscape"><span>Tablet Landscape</span></a>
<a href="#" class="smartphone-landscape"><span>iPhone Landscape</span></a>
<a href="#" class="smartphone-portrait"><span>iPhone Portrait</span></a>
<a href="#" class="auto"><span>Auto</span></a>
</div>

</header>
<section>
	<div id="wrapper" style="width:1024px;height:768px;margin-top:20px;" data-device="tabletPortrait" class="">
	<iframe id="canvas" src="canvas.php" onload="resbook.changeUrl(this.contentWindow.location,this.contentDocument.title);"></iframe>
	<span class="keyboard-bg"></span>
	</div>
</section>
<script src="vendor/jquery-1.9.0.js"></script>
<script src="vendor/jquery-ui-1.10.0.custom.min.js"></script>
<script src="js/app/workspace.js"></script>
</body>
</html>