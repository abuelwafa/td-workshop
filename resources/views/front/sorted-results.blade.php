@forelse ($cars as $car)
    <div class="col-md-6">
        <p>price: <strong>{{ $car->price }}</strong></p>
        <p>condition: <strong>{{ $car->condition }}</strong></p>
        <p>model: <strong>{{ $car->model }}</strong></p>
        <p>link: <a href="http://www.egyptcarshop.com{{ $car->url }}" target="_blank">{{ $car->url }}</a></p>
        <p>make: <strong>{{ $car->make }}</strong></p>
        <p>year: <strong>{{ $car->year }}</strong></p>
        <p>id: <strong>{{ $car->original_id }}</strong></p>
        <p>first scraped at: <strong>{{ $car->created_at }}</strong></p>
        @if(!empty($car->image_url))
            <img src="{{ $car->image_url }}" alt="" />
        @else
            <img src="http://www.egyptcarshop.com/wp-content/themes/ecs-theme/assets/img/NA/2/NA_image-526x400.jpg" />
        @endif
        <hr />
    </div>
@empty
    <p>No items Scraped.</p>
@endforelse
