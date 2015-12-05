<?php

namespace App;

use Symfony\Component\DomCrawler\Crawler;

class ItemTraversal {

    private $crawler;

    protected $make;
    protected $price;
    protected $year;
    protected $condition;
    protected $model;
    protected $url;
    protected $image_url;
    protected $original_id;

    public function __construct(Crawler $node){
        $this->crawler = $node;
    }

    public function extractValues(){
        $this->make = trim($this->crawler->filter('div.caption h2 a')->text());
        $this->price = trim($this->crawler->filter('p.price')->text());
        $this->model = trim($this->crawler->filter('h3 span.year-cc a')->text());
        $this->year = (int) trim(str_replace($this->model, '', trim($this->crawler->filter('h3 span.year-cc')->text())));
        $this->condition = preg_replace('/[\s]+/', ' ', trim($this->crawler->filter('span.condition')->text()));
        $this->url = trim($this->crawler->filter('div.caption h2 a')->attr('href'));
        $this->image_url = trim($this->crawler->filter('div.thumbnail-item img.img-responsive')->attr('src'));
        $this->image_url = $this->image_url == 'http://www.egyptcarshop.com/wp-content/themes/ecs-theme/assets/img/NA/2/NA_image-526x400.jpg' ? '' : $this->image_url;
        $this->original_id = (int) trim($this->crawler->filter('div.item-block-holder')->attr('item-id'));
    }

    public function save(){

        $alreadyExists = CarItem::where('original_id', $this->original_id)->first();

        if($alreadyExists){ return ; }

        $newModel = new CarItem();

        $newModel->make = $this->make;
        $newModel->price = $this->price;
        $newModel->year = $this->year;
        $newModel->model = $this->model;
        $newModel->condition = $this->condition;
        $newModel->url = $this->url;
        $newModel->image_url = $this->image_url;
        $newModel->original_id = $this->original_id;

        $newModel->save();

    }

}
