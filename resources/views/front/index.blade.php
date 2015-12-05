@extends('front.master')

@section('content')

    <div class="jumbotron">
        <div class="container">
            <form action="/scrape" method="post" class="scrape-form js-scrape-form">
                {{ csrf_field() }}
                <div class="form-group">
                    <label class="sr-only" for="scrapeurl">Scrape URL</label>
                    <input class="form-control" type="url" name="scrapeurl" id="scrapeurl">
                </div>
                <p><button class="btn btn-primary" type="submit">Start Scraping</button></p>
            </form>

        </div>
    </div><!-- end of .jumbotron -->

    <div class="container results-holder"></div>

@endsection
