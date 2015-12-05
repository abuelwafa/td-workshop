/* jshint maxdepth: 8, curly: false, undef: false, unused: false, maxparams: 6, latedef: false, sub: true, maxstatements: 300, varstmt: false, singleGroups: false, shadow: true, eqeqeq: false */

// this script is horrible. and a complete mess.
// not authored by Abuelwafa

/********** BEGIN: NEW SCRIPTS **********/
/****************************************/
import $ from '../../bower_components/jquery/dist/jquery.min.js';

/* Globals */
var search_page_size = 9;

/* Create the search parameters
 - if URL parameters are missing, then create them from the page attributes
 - if URL parameters exist and "Search" clicked, then MODIFY them from the page attributes
 */
function fnCreateSearchParameters(page_index, page_size) {
    var search_params = "";
    var search_attributes_ids = [];
    var attributes_spearator = ",";
    var from_value = "";
    var from_value_text = "";
    var to_value = "";
    var to_value_text = "";
    var temp_value;

    //Extract attributes values from the page attributes
    $(".search_attributes").each(function () {
        var attribute_type = $(this).attr("attribute_type");
        var search_type = $(this).attr("search_type");
        var search_attribute_id = $(this).attr("search_attribute_id");
        var search_value = ($(this).val() !== "" ? $(this).val() : $(this).attr("value"));
        var search_value_text = $.trim($(this).attr("value_text"));

        if (search_attributes_ids.indexOf(search_attribute_id) < 0) {
            switch (attribute_type) {
                case "text":
                    switch (search_type) {
                        case "is_range_currency_from":
                            from_value = search_value;
                            temp_value = $(".search_attributes[search_attribute_id=" + search_attribute_id + "][search_type=is_range_currency_to]");
                            to_value = ($(temp_value).val() !== "" ? $(temp_value).val() : $(temp_value).attr("value"));
                            search_params += search_attribute_id + ":" + from_value + "-" + to_value + "^" + attributes_spearator;
                            break;
                        case "is_range_number_from":
                            from_value = search_value;
                            temp_value = $(".search_attributes[search_attribute_id=" + search_attribute_id + "][search_type=is_range_number_to]");
                            to_value = ($(temp_value).val() !== "" ? $(temp_value).val() : $(temp_value).attr("value"));
                            search_params += search_attribute_id + ":" + from_value + "-" + to_value + attributes_spearator;
                            break;
                        case "is_range_currency_to":
                            temp_value = $(".search_attributes[search_attribute_id=" + search_attribute_id + "][search_type=is_range_currency_from]");
                            from_value = ($(temp_value).val() !== "" ? $(temp_value).val() : $(temp_value).attr("value"));
                            to_value = search_value;
                            search_params += search_attribute_id + ":" + from_value + "-" + to_value + "^" + attributes_spearator;
                            break;
                        case "is_range_number_to":
                            temp_value = $(".search_attributes[search_attribute_id=" + search_attribute_id + "][search_type=is_range_number_from]");
                            from_value = ($(temp_value).val() !== "" ? $(temp_value).val() : $(temp_value).attr("value"));
                            to_value = search_value;
                            search_params += search_attribute_id + ":" + from_value + "-" + to_value + attributes_spearator;
                            break;
                        case "is_value":
                            search_params += search_attribute_id + ":" + search_value + attributes_spearator;
                            break;
                    }
                    break;
                case "multiselect":
                    switch (search_type) {
                        case "is_range_number_from":
                            from_value = search_value;
                            temp_value = $(".search_attributes[search_attribute_id=" + search_attribute_id + "][search_type=is_range_number_to]");
                            to_value = ($(temp_value).val() !== "" ? $(temp_value).val() : $(temp_value).attr("value"));
                            to_value_text = $.trim($(temp_value).attr("value_text"));
                            search_params += search_attribute_id + ":" + from_value + "^" + search_value_text + "_" + to_value + "^" + to_value_text + attributes_spearator;
                            break;
                        case "is_range_number_to":
                            temp_value = $(".search_attributes[search_attribute_id=" + search_attribute_id + "][search_type=is_range_number_from]");
                            from_value = ($(temp_value).val() !== "" ? $(temp_value).val() : $(temp_value).attr("value"));
                            from_value_text = $.trim($(temp_value).attr("value_text"));
                            to_value = search_value;
                            search_params += search_attribute_id + ":" + from_value + "^" + from_value_text + "_" + to_value + "^" + search_value_text + attributes_spearator;
                            break;
                        case "is_value":
                            search_params += search_attribute_id + ":" + search_value + "^" + search_value_text + attributes_spearator;
                            break;
                    }
                    break;
                case "checkbox":
                    switch (search_type) {
                        case "is_value":
                            search_params += search_attribute_id + ":" + search_value + ";" + search_value_text + attributes_spearator;
                            break;
                    }
                    break;
            }
            search_attributes_ids.push(search_attribute_id);
        }
    });
    search_params = search_params.substring(0, search_params.length - 1);

    /* Paging */
    page_index = (typeof page_index != "undefined" ? page_index : "");
    page_size = (typeof page_size != "undefined" ? page_size : search_page_size);
    search_params += "|page:" + page_index + "-" + page_size;
    search_params = encodeURIComponent(search_params);
    return search_params;
}

/* Parse the search parameters from the URL */
export function fnParseSearchParameters(scrapeURL, paging_page_index) {
    //Declarations
    var current_location = scrapeURL;
    var search_params = "";
    var search_array = [];
    var attributes_array = [];
    var paging_object = {page_index: paging_page_index, page_size: search_page_size};

    //Search Params
    var search_parts = current_location.split("/");
    if (search_parts.length >= 2) {
        //Valid search parts
        search_params = ($.trim(search_parts[search_parts.length - 1]) !== "" ? search_parts[search_parts.length - 1] : search_parts[search_parts.length - 2]);
        /* search_params = "86:2231^Alfa Romeo,87:2650^Giulietta,85:2227^Sedan,82:100000-200000,83:2010-2015,96:4390^1600_4394^2000,81:20000-50000|page:-"; */
        search_params = decodeURIComponent(search_params);
        search_params = search_params.toLowerCase();

        //Search Parts
        var search_paging = [];
        var search_paging_parts = [];
        var search_attributes = [];
        var search_attribute_parts = [];
        var search_value_parts = [];
        var search_value_text_parts = [];
        var search_parts = search_params.split("|");
        if (search_parts.length >= 1) {
            if (search_parts.length > 1) {
                //Paging Object
                search_paging = search_parts[1].split(":");
                if (search_paging[0] == "page") {
                    search_paging_parts = search_paging[1].split("-");
                    if (search_paging_parts.length == 2) {
                        var page_index = (typeof search_paging_parts[0] != "undefined" ? search_paging_parts[0] : 1);
                        var page_size = (typeof search_paging_parts[1] != "undefined" ? search_paging_parts[1] : search_page_size);
                        var paging_object = {page_index: page_index, page_size: page_size};
                    }
                }
            }
            //Search Object
            search_attributes = search_parts[0].split(",");
            for (var i = 0; i < search_attributes.length; i++) {
                search_attribute_parts = search_attributes[i].split(":");
                if (search_attribute_parts.length == 2) {
                    //Check the attribute type
                    if (search_attribute_parts[1].indexOf("-") >= 0) {
                        if (search_attribute_parts[1].indexOf("^") >= 0) {
                            search_value_text_parts = search_attribute_parts[1].split("^");
                            if (search_value_text_parts.length == 2) {
                                search_value_parts = search_value_text_parts[0].split("-");
                                if (search_value_parts.length == 2) {
                                    var attribute_object = {};
                                    attribute_object["attribute_id"] = search_attribute_parts[0];
                                    attribute_object["attribute_type"] = "text";
                                    attribute_object["search_type"] = "is_range_currency_from";
                                    attribute_object["value"] = search_value_parts[0];
                                    attribute_object["value_text"] = "";
                                    attributes_array.push(attribute_object);

                                    var attribute_object = {};
                                    attribute_object["attribute_id"] = search_attribute_parts[0];
                                    attribute_object["attribute_type"] = "text";
                                    attribute_object["search_type"] = "is_range_currency_to";
                                    attribute_object["value"] = search_value_parts[1];
                                    attribute_object["value_text"] = "";
                                    attributes_array.push(attribute_object);
                                }
                                /* search_value_text_parts[1] is reserved for future Currency use*/
                            }
                        } else {
                            search_value_parts = search_attribute_parts[1].split("-");
                            if (search_value_parts.length == 2) {
                                var attribute_object = {};
                                attribute_object["attribute_id"] = search_attribute_parts[0];
                                attribute_object["attribute_type"] = "text";
                                attribute_object["search_type"] = "is_range_number_from";
                                attribute_object["value"] = search_value_parts[0];
                                attribute_object["value_text"] = "";
                                attributes_array.push(attribute_object);

                                var attribute_object = {};
                                attribute_object["attribute_id"] = search_attribute_parts[0];
                                attribute_object["attribute_type"] = "text";
                                attribute_object["search_type"] = "is_range_number_to";
                                attribute_object["value"] = search_value_parts[1];
                                attribute_object["value_text"] = "";
                                attributes_array.push(attribute_object);
                            }
                        }
                    } else if (search_attribute_parts[1].indexOf("_") >= 0) {
                        search_value_parts = search_attribute_parts[1].split("_");
                        if (search_value_parts.length == 2) {
                            search_value_text_parts = search_value_parts[0].split("^");
                            if (search_value_text_parts.length == 2) {
                                var attribute_object = {};
                                attribute_object["attribute_id"] = search_attribute_parts[0];
                                attribute_object["attribute_type"] = "multiselect";
                                attribute_object["search_type"] = "is_range_number_from";
                                attribute_object["value"] = search_value_text_parts[0];
                                attribute_object["value_text"] = search_value_text_parts[1];
                                attributes_array.push(attribute_object);
                            }
                            search_value_text_parts = search_value_parts[1].split("^");
                            if (search_value_text_parts.length == 2) {
                                var attribute_object = {};
                                attribute_object["attribute_id"] = search_attribute_parts[0];
                                attribute_object["attribute_type"] = "multiselect";
                                attribute_object["search_type"] = "is_range_number_to";
                                attribute_object["value"] = search_value_text_parts[0];
                                attribute_object["value_text"] = search_value_text_parts[1];
                                attributes_array.push(attribute_object);
                            }
                        }

                    } else if (search_attribute_parts[1].indexOf("^") >= 0) {
                        search_value_text_parts = search_attribute_parts[1].split("^");
                        if (search_value_text_parts.length == 2) {
                            var attribute_object = {};
                            attribute_object["attribute_id"] = search_attribute_parts[0];
                            attribute_object["attribute_type"] = "multiselect";
                            attribute_object["search_type"] = "is_value";
                            attribute_object["value"] = search_value_text_parts[0];
                            attribute_object["value_text"] = search_value_text_parts[1];
                            attributes_array.push(attribute_object);
                        }

                    } else if (search_attribute_parts[1].indexOf(";") >= 0) {
                        search_value_text_parts = search_attribute_parts[1].split(";");
                        if (search_value_text_parts.length == 2) {
                            var attribute_object = {};
                            attribute_object["attribute_id"] = search_attribute_parts[0];
                            attribute_object["attribute_type"] = "checkbox";
                            attribute_object["search_type"] = "is_value";
                            attribute_object["value"] = search_value_text_parts[0];
                            attribute_object["value_text"] = search_value_text_parts[1];
                            attributes_array.push(attribute_object);
                        }

                    } else {
                        var attribute_object = {};
                        attribute_object["attribute_id"] = search_attribute_parts[0];
                        attribute_object["attribute_type"] = "text";
                        attribute_object["search_type"] = "is_value";
                        attribute_object["value"] = search_attribute_parts[1];
                        attribute_object["value_text"] = "";
                        attributes_array.push(attribute_object);

                    }
                }
            }
        }
    }

    search_array.push(attributes_array);
    search_array.push(paging_object);
    return search_array;
}

/* Fill the page attributes with the URL parameters */
function fnBindPageAttributes(paging_page_index) {
    //Get the search attributes array
    var current_page_index = 1;
    var current_page_size = search_page_size;
    var search_array = fnParseSearchParameters(paging_page_index);

    //Bind all page attributes
    if (search_array.length >= 2) {
        var attributes_array = search_array[0];
        var paging_object = search_array[1];
        current_page_index = paging_object["page_index"];
        current_page_size = paging_object["page_index"];
        for (var i = 0; i < attributes_array.length; i++) {
            var attribute_object = attributes_array[i];
            var search_control = $(".search_attributes[search_attribute_id=" + attribute_object["attribute_id"] + "][search_type=" + attribute_object["search_type"] + "][attribute_type=" + attribute_object["attribute_type"] + "]");
            $(search_control).val(attribute_object["value"]);
            $(search_control).attr("value", attribute_object["value"]);
            $(search_control).attr("value_text", attribute_object["value_text"]);

            //Multi select text
            //console.log(attribute_object);
            let select_value_text = "";
            if (attribute_object["value"].indexOf("!") >= 0) {
                select_value_text = $(".hdn_text_several").val();
            } else if (attribute_object["value"] !== "") {
                select_value_text = $(search_control).parents(".list-dropdowns").find("ul li a[search_value_id=" + attribute_object["value"] + "]").text();
                if (attribute_object["attribute_id"] == 86) {
                    $('.search_value_parent_id_' + attribute_object["value"]).parent().show();
                }
            } else {
                select_value_text = $(search_control).parents(".list-dropdowns").find("ul li a.search_all").text();
            }
            $(search_control).parents(".list-dropdowns").find(".dropdown-main-button").text(select_value_text);
        }
    }

    return current_page_index;
}

/* Search function execute */
export function fnSearch(search_page, paging_page_index, init_pagination, is_first_load) {
    /* Create the search parameters */
    $('.lbl_results_counts').html('0');
    $('.lbl_total_count').html('0');
    $('#remaining_count').html('0');
    $('.action_load_more').addClass('disabled');
    $('.loader_img').show();
    if (is_first_load) {
        if (paging_page_index > 1) {
            //Use this if you wish to load all previous results
            //search_page_size = search_page_size * paging_page_index;
            paging_page_index = 1;
        }
    }

    if (paging_page_index <= 1) {
        $('.results_container').html('');
        $('.remaining_count').html(0);
        $('#btn_load_more').val(1);
    }

    var search_params = fnCreateSearchParameters(paging_page_index);
    /* Re-Create the search URL and push it to the address bar */
    var search_url = fnGetSearchURL();
    search_url += search_params + (is_first_load ? fnGetURLExtras() : "");
    window.history.pushState({path: search_url}, '', search_url);
    var lang_id = '/ar/';
    if (window.location.href.indexOf("/en/") > -1) {
        lang_id = '/en/';
    }
    var ajax_url = lang_id + "ajax-bridge/";
    //Send the search request
    var search_array = fnParseSearchParameters();
    var search_array_string = JSON.stringify(search_array);
    $.ajax({
        url: ajax_url,
        type: "POST",
        data: {
            action: "search",
            params: search_array_string,
            page: search_page
        }
    }).done(function (data) {
        if (typeof(_gaq) !== 'undefined') {
            _gaq.push(['_trackPageview']);
        }
        if (data.trim() !== '' && data.indexOf('col-lg-4') > 1) {
            $('.action_load_more').removeClass('disabled');
            $('.loader_img').hide();
            /* Data */
            /* Loadmore change */
            //$('.results_container').html(data);
            //$(window).scrollTop($('.results_container').offset().top);
            //var new_index_class = 'goto_index_' + search_array[1]["page_index"];
            /*$(window).scrollTop($('.'+new_index_class).offset().top);*/
            /*
             var first_element = $('.hdn_total_count', data).first();
             $('html,body').animate({
             scrollTop: $(first_element).offset().top
             },
             'slow');
             */
            $('.results_container').append('<div class="paging_page_index_' + paging_page_index + '">' + data + '</div>');
            //var height = $('.paging_page_index_' + paging_page_index).offset().top;

            if (!is_first_load) {
                var height = $('.paging_page_index_' + paging_page_index + ' .col-lg-4:first').offset().top;
                if (height <= 350)
                    height = $('.results_container').offset().top;
                $('html,body').animate({
                        scrollTop: height
                    },
                    'slow');
            }
            /* End Loadmore Change */
            $(".lbl_total_count").val($(".hdn_total_count").val());
            $(".lbl_total_count").text($(".hdn_total_count").val());
            $(".lbl_total_count").html($(".hdn_total_count").val());

            /* Counts and pagination */
            var i_page_size = search_array[1]["page_size"];
            i_page_size = (i_page_size !== "" && i_page_size > 0 ? i_page_size : search_page_size);

            var i_page_index = search_array[1]["page_index"];
            i_page_index = (i_page_index !== "" && i_page_index > 0 ? i_page_index : 1);

            pages_count = Math.ceil($(".hdn_total_count").val() / i_page_size);
            i_page_index = (i_page_index < 1) ? 1 : i_page_index;
            i_page_index = (i_page_index > pages_count) ? pages_count : i_page_index;

            /* Create the search parameters */
            var search_params = fnCreateSearchParameters(i_page_index);
            /* Re-Create the search URL and push it to the address bar */
            var search_url = fnGetSearchURL();
            search_url += search_params + (is_first_load ? fnGetURLExtras() : "");
            window.history.pushState({path: search_url}, '', search_url);

            /*
             //Load More Change
             var i_results = (((i_page_index - 1) * i_page_size) + 1).toString() + " - " + ((i_page_index * i_page_size) > $(".hdn_total_count").val() ? $(".hdn_total_count").val() : (i_page_index * i_page_size)).toString();
             $(".lbl_results_counts").val(i_results);
             $(".lbl_results_counts").text(i_results);
             $(".lbl_results_counts").html(i_results);

             fnSetPagination($(".hdn_total_count").val(), i_page_index, i_page_size, init_pagination);
             */
            var numItems = $('.results_container .item-block-holder').length;

            $(".lbl_results_counts").val(numItems);
            $(".lbl_results_counts").text(numItems);
            $(".lbl_results_counts").html(numItems);
            fnSetPaginationNew($(".hdn_total_count").val(), i_page_index, i_page_size, init_pagination, numItems);
            console.log("Success");
        }
        else {
            $("#remaining_count").html('0');
            $('.results_container').append(data);
            $('.action_load_more').addClass('disabled');
            $('.loader_img').hide();
            console.log("Fail");
        }
    });
}

/* Get the current search URL */
function fnGetMainURL() {
    var current_location = window.location.href;
    var search_parts = current_location.split("/");
    var search_url = "";
    for (var i = 0; i < 4; i++) {
        search_url += search_parts[i] + "/";
    }
    return search_url;
}

function fnGetSearchURL() {
    var current_location = window.location.href;
    var search_parts = current_location.split("/");
    var search_url = "";
    for (var i = 0; i < 5; i++) {
        search_url += search_parts[i] + "/";
    }
    return search_url;
}

/* Get current search page */
function fnGetSearchPage() {
    var current_location = window.location.href;
    var search_parts = current_location.split("/");
    var search_page = "new-cars";
    if (search_parts.length >= 5) {
        search_page = search_parts[4];
    }

    return search_page;
}

/* Get URL extras */
function fnGetURLExtras() {
    var url_extras = "";
    var current_location = window.location.href;
    var url_parts = current_location.split("?");
    if (url_parts.length > 1) {
        url_extras = "?" + url_parts[1];
    } else {
        url_parts = current_location.split("#");
        if (url_parts.length > 1) {
            url_extras = "#" + url_parts[1];
        }
    }

    return url_extras;
}

/* Pagination */
function fnSetPaginationNew(items_total_count, paging_page_index, paging_page_size, init_pagination, numItems) {
    $('#btn_load_more').val(parseInt($('#btn_load_more').val()) + 1);

    var remaining_count = parseInt(items_total_count) - parseInt(numItems);

    if (remaining_count < 1) {
        $('.action_load_more').hide();
        $('.action_load_more').removeClass('inline');
    }
    else {
        $('.action_load_more').show();
        $('.action_load_more').addClass('inline');
        $('#remaining_count').html(remaining_count);
    }
}

function fnPaginationCallbackNew() {
    if ($('.action_load_more').hasClass('disabled'))
        return;
    var pageNumber = $('#btn_load_more').val();
    if (fnGetSearchPage() == "used-cars") {
        //Used Cars
        fnSearch("used-cars", pageNumber, false, false);
    } else {
        //New Cars
        fnSearch("new-cars", pageNumber, false, false);
    }
}

function fnSetPagination(items_total_count, paging_page_index, paging_page_size, init_pagination) {
    if (init_pagination) {
        $(".pagination").empty();
        $(".pagination").pagination({
            items: items_total_count,
            itemsOnPage: paging_page_size,
            currentPage: paging_page_index,
            prevText: $(".hdn_text_prev").val(),
            nextText: $(".hdn_text_next").val(),
            onPageClick: fnPaginationCallback
        });
    }
}
function fnPaginationCallback(pageNumber, event) {
    if (fnGetSearchPage() == "used-cars") {
        //Used Cars
        fnSearch("used-cars", pageNumber, false, false);
    } else {
        //New Cars
        fnSearch("new-cars", pageNumber, false, false);
    }
}
/**************************************/
/********** END: NEW SCRIPTS **********/
