<?php

require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$app = new Silex\Application();

$app->register(new Silex\Provider\SessionServiceProvider());

// $app->before(function (Request $request) {
//     if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
//         $data = json_decode($request->getContent(), true);
//         $request->request->replace(is_array($data) ? $data : array());
//     }
// });

$app->get('/page/{id}', function (Request $request) use ($app)  {
  return new Response($app['session']->get('content'), 201);
});

$app->put('/page/{id}', function (Request $request) use ($app)  {
	$app['session']->set('content', $request->getContent());	
  return new Response('Saved', 201);
});

$app->post('/page', function (Request $request) use ($app) {
	$app['session']->set('content', $request->getContent());
  return new Response('Saved', 201);
});

$app->run();

?>