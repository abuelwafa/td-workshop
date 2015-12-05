import $ from '../bower_components/jquery/dist/jquery.min.js';
import { fnParseSearchParameters } from './scraper/search-script.js';


$('.js-scrape-form').on('submit', (event) => {
    event.preventDefault();

    const scrapeForm = $('.js-scrape-form');

    let urlVal = $.trim(scrapeForm.find('input#scrapeurl').val());
    if(urlVal === ''){ return ; }

    let formDataObj = new FormData();

    // formDataObj.append('action', 'search');
    // formDataObj.append('page', 'used-cars');
    formDataObj.append('params', JSON.stringify(fnParseSearchParameters(urlVal, 1)));

    // add the csrf value to as well
    let csrfInput = scrapeForm.find('input[type="hidden"]');
    formDataObj.append(csrfInput.attr('name'), csrfInput.attr('value'));

    let ajaxOptions = {
        async: true,
        crossDomain: true,
        url: '/scrape',
        method: 'POST',
        headers: {
            "cache-control": "no-cache",
        },
        processData: false,
        contentType: false,
        data: formDataObj,
        mimeType: "multipart/form-data",
        cache: false,
        dataType: "html"
    };

    $.ajax(ajaxOptions).done((data) => {
        $('div.results-holder').html(data);
    });

    return ;
});

function sortResults(direction){
    $.post('/sort', {
        order: direction
    }).done((data) => {
        $('div.results-holder').html(data);
    });
}

$('.sorting-buttons button.sort-asc').on('click', event => {
    event.preventDefault();
    sortResults('asc');
    return false;
});

$('.sorting-buttons button.sort-desc').on('click', event => {
    event.preventDefault();
    sortResults('desc');
    return false;
});


