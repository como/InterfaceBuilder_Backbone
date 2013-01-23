<?php

require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class JsonPagePersister
{
    private $basePath;

    public function __construct($basePath)
    {
        $this->basePath = $basePath;
    }

    public function save($data)
    {
        $filename = $this->basePath.'/page.json';
        file_put_contents($filename, $data, LOCK_EX);
    }
		
    public function fetch()
    {
        $filename = $this->basePath.'/page.json';
        return file_get_contents($filename);
    }
}

$app = new Silex\Application();


$app->register(new Silex\Provider\SessionServiceProvider());

// Page persistence
$app->get('/page/{id}', function (Request $request) use ($app)  {
	$page = new JsonPagePersister(realpath(__DIR__).'/data');
  return new Response($page->fetch(), 201);
});

$app->put('/page/{id}', function (Request $request) use ($app)  {
	$page = new JsonPagePersister(realpath(__DIR__).'/data');
	$page->save($request->getContent());	
  return new Response('Saved', 201);
});

$app->post('/page', function (Request $request) use ($app) {
	$page = new JsonPagePersister(realpath(__DIR__).'/data');
	$page->persist($request->getContent());
  return new Response('Saved', 201);
});

$app->run();



?>