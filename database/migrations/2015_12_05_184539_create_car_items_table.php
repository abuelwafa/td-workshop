<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCarItemsTable extends Migration {

    public function up() {
        Schema::create('car_items', function (Blueprint $table) {
            $table->increments('id');
            $table->string('price')->nullable(); // out of laziness to extract price to just the number number an integer // p.price
            $table->string('make')->nullable(); // div.caption h2 a
            $table->integer('year')->nullable()->unsigned(); // h3 span.year-cc
            $table->string('model')->nullable(); // h3 span.year-cc a
            $table->string('condition')->nullable(); // span.condition
            $table->integer('original_id')->unsigned(); // div.item-block-holder[item-id]
            $table->string('image_url')->nullable(); // div.thumbnail-item img.img-responsive[src]
            $table->string('url')->nullable(); // div.caption h2 a[href]
            $table->timestamps();
        });
    }

    public function down() {
        Schema::drop('car_items');
    }

}
