<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Goutte\Client;

use App\CarItem;
use App\ItemTraversal;

class FrontController extends Controller {

    public function viewHome() {
        return view('front.index');
    }

    public function startScrape(Request $request) {

        // dd($request->all());

        if($request->has('params')){
            $paramsString = $request->input('params');

            $client = new Client();

            $postParams = [
                'action' => 'search',
                'page' => 'used-cars',
                'params' => $paramsString
            ];

            $crawler = $client->request('POST', 'http://www.egyptcarshop.com/en/ajax-bridge/', $postParams);

            // parse the html here...
            $crawler->filter('div.col-lg-4 div.item-block-holder')->each(function($node){
                $traversalInstance = new ItemTraversal($node);
                $traversalInstance->extractValues();
                $traversalInstance->save();
            });

            return $crawler->html();
        }

        return redirect()->route('home');
    }

    public function viewData() {
        return view('front.results', [
            'cars' => CarItem::all()
        ]);
    }

    public function viewSorted(Request $request) {
        $orderDir = $request->input('order', 'asc');
        $orderDir = $orderDir != 'asc' && $orderDir != 'desc' ? 'asc' : $orderDir;
        return view('front.sorted-results', [
            'cars' => CarItem::orderBy('model', $orderDir)->get()
        ]);
    }

}

