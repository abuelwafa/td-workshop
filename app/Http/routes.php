<?php

Route::get('/', ['as' => 'home', 'uses' => 'FrontController@viewHome']);
Route::post('/scrape', ['as' => 'scrapesubmit', 'uses' => 'FrontController@startScrape']);
Route::get('/results', ['as' => 'viewresults', 'uses' => 'FrontController@viewData']);
Route::post('/sort', ['as' => 'sortresults', 'uses' => 'FrontController@viewSorted']);

